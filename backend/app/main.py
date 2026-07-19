from fastapi import FastAPI, Depends, HTTPException, BackgroundTasks, UploadFile, File, Form, Header
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
import jwt
from jwt import PyJWKClient
from .database import get_db
from . import models, schemas, worker
from .pdf_engine import PDFEngine
import os

app = FastAPI(title="Jeb API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Asgardeo Configuration
ASGARDEO_ISSUER = os.getenv("ASGARDEO_ISSUER", "https://api.asgardeo.io/t/myorg/oauth2/token/ep") # Replace with actual org
JWKS_URL = f"{ASGARDEO_ISSUER.replace('/oauth2/token/ep', '')}/oauth2/jwks"
jwks_client = PyJWKClient(JWKS_URL)

def get_current_user(authorization: Optional[str] = Header(None)) -> str:
    """Validate Asgardeo JWT and return the user sub (user_id)."""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid Authorization header")
    
    token = authorization.split(" ")[1]
    try:
        signing_key = jwks_client.get_signing_key_from_jwt(token)
        data = jwt.decode(
            token,
            signing_key.key,
            algorithms=["RS256"],
            options={"verify_aud": False} # Validate audience in production
        )
        return data.get("sub")
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")

@app.get("/")
def read_root():
    return {"message": "Welcome to Jeb API - Autonomous Job Scout & Resume Tailor"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

# --- Hunts & Listings ---

@app.post("/hunts", response_model=schemas.HuntResponse)
def create_hunt(hunt: schemas.HuntCreate, db: Session = Depends(get_db), user_id: str = Depends(get_current_user)):
    db_hunt = models.Hunt(**hunt.dict(), user_id=user_id)
    db.add(db_hunt)
    db.commit()
    db.refresh(db_hunt)
    
    # Trigger scraping task in background via Celery
    worker.scrape_jobs_task.delay(str(db_hunt.id), db_hunt.category)
    
    return db_hunt

@app.get("/hunts", response_model=List[schemas.HuntResponse])
def list_hunts(db: Session = Depends(get_db), user_id: str = Depends(get_current_user)):
    return db.query(models.Hunt).filter(models.Hunt.user_id == user_id).all()

@app.get("/listings", response_model=List[schemas.ListingResponse])
def list_listings(hunt_id: str = None, db: Session = Depends(get_db), user_id: str = Depends(get_current_user)):
    # Verify the hunt belongs to the user
    query = db.query(models.Listing).join(models.Hunt)
    query = query.filter(models.Hunt.user_id == user_id)
    
    if hunt_id:
        query = query.filter(models.Listing.hunt_id == hunt_id)
    return query.all()

@app.get("/stats")
def get_stats(db: Session = Depends(get_db), user_id: str = Depends(get_current_user)):
    hunts_count = db.query(models.Hunt).filter(models.Hunt.user_id == user_id).count()
    listings_count = db.query(models.Listing).join(models.Hunt).filter(models.Hunt.user_id == user_id).count()
    cvs_count = db.query(models.CV).filter(models.CV.user_id == user_id).count()
    
    # Calculate average match score for listings that have one
    avg_score = db.query(func.avg(models.Listing.match_score)).join(models.Hunt).filter(
        models.Hunt.user_id == user_id, 
        models.Listing.match_score != None
    ).scalar() or 0
    
    return {
        "hunts": hunts_count,
        "listings": listings_count,
        "cvs": cvs_count,
        "avg_match_score": round(float(avg_score), 1)
    }

# --- CV Management ---

@app.post("/cvs", response_model=schemas.CVResponse)
async def upload_cv(
    title: str = Form(...),
    is_master: bool = Form(False),
    content_text: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user)
):
    final_text = content_text or ""
    
    if file:
        if file.content_type == "application/pdf":
            pdf_bytes = await file.read()
            final_text = PDFEngine.extract_text_from_pdf(pdf_bytes)
        else:
            # Assume text file if not PDF
            content = await file.read()
            final_text = content.decode("utf-8")

    if not final_text:
        raise HTTPException(status_code=400, detail="CV content is required (either text or file)")

    db_cv = models.CV(
        title=title,
        content_text=final_text,
        is_master=is_master,
        user_id=user_id
    )
    db.add(db_cv)
    db.commit()
    db.refresh(db_cv)
    return db_cv

@app.get("/cvs", response_model=List[schemas.CVResponse])
def list_cvs(db: Session = Depends(get_db), user_id: str = Depends(get_current_user)):
    return db.query(models.CV).filter(models.CV.user_id == user_id).all()

# --- Tailoring Engine ---

@app.post("/tailor/{listing_id}")
def tailor_resume(listing_id: str, cv_id: Optional[str] = None, db: Session = Depends(get_db), user_id: str = Depends(get_current_user)):
    # Verify the listing belongs to a hunt owned by the user
    listing = db.query(models.Listing).join(models.Hunt).filter(models.Listing.id == listing_id, models.Hunt.user_id == user_id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")

    # If no cv_id provided, use the master CV
    if not cv_id:
        master_cv = db.query(models.CV).filter(models.CV.is_master == True, models.CV.user_id == user_id).first()
        if not master_cv:
            raise HTTPException(status_code=404, detail="No Master CV found. Please upload one or provide a cv_id.")
        cv_id = str(master_cv.id)
    else:
        # Verify the provided cv belongs to the user
        cv = db.query(models.CV).filter(models.CV.id == cv_id, models.CV.user_id == user_id).first()
        if not cv:
            raise HTTPException(status_code=404, detail="CV not found")

    # Trigger tailoring task
    task = worker.tailor_cv_task.delay(listing_id, cv_id)
    return {"task_id": task.id, "message": "Tailoring task started"}
