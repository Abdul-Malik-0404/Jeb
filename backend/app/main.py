from fastapi import FastAPI, Depends, HTTPException, BackgroundTasks, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
from .database import get_db
from . import models, schemas, worker
from .pdf_engine import PDFEngine

app = FastAPI(title="Jeb API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to Jeb API - Autonomous Job Scout & Resume Tailor"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

# --- Hunts & Listings ---

@app.post("/hunts", response_model=schemas.HuntResponse)
def create_hunt(hunt: schemas.HuntCreate, db: Session = Depends(get_db)):
    db_hunt = models.Hunt(**hunt.dict())
    db.add(db_hunt)
    db.commit()
    db.refresh(db_hunt)
    
    # Trigger scraping task in background via Celery
    worker.scrape_jobs_task.delay(str(db_hunt.id), db_hunt.category)
    
    return db_hunt

@app.get("/hunts", response_model=List[schemas.HuntResponse])
def list_hunts(db: Session = Depends(get_db)):
    return db.query(models.Hunt).all()

@app.get("/listings", response_model=List[schemas.ListingResponse])
def list_listings(hunt_id: str = None, db: Session = Depends(get_db)):
    query = db.query(models.Listing)
    if hunt_id:
        query = query.filter(models.Listing.hunt_id == hunt_id)
    return query.all()

# --- CV Management ---

@app.post("/cvs", response_model=schemas.CVResponse)
async def upload_cv(
    title: str = Form(...),
    is_master: bool = Form(False),
    content_text: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
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
        is_master=is_master
    )
    db.add(db_cv)
    db.commit()
    db.refresh(db_cv)
    return db_cv

@app.get("/cvs", response_model=List[schemas.CVResponse])
def list_cvs(db: Session = Depends(get_db)):
    return db.query(models.CV).all()

# --- Tailoring Engine ---

@app.post("/tailor/{listing_id}")
def tailor_resume(listing_id: str, cv_id: Optional[str] = None, db: Session = Depends(get_db)):
    # If no cv_id provided, use the master CV
    if not cv_id:
        master_cv = db.query(models.CV).filter(models.CV.is_master == True).first()
        if not master_cv:
            raise HTTPException(status_code=404, detail="No Master CV found. Please upload one or provide a cv_id.")
        cv_id = str(master_cv.id)

    # Trigger tailoring task
    task = worker.tailor_cv_task.delay(listing_id, cv_id)
    return {"task_id": task.id, "message": "Tailoring task started"}
