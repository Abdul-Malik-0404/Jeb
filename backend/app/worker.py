import os
import asyncio
from celery import Celery
from .database import SessionLocal
from .models import Listing, Hunt, CV
from .scraper import run_scraper
from .ai import AIEngine
from .pdf_engine import PDFEngine

CELERY_BROKER_URL = os.getenv("CELERY_BROKER_URL", "redis://redis:6379/0")
CELERY_RESULT_BACKEND = os.getenv("CELERY_RESULT_BACKEND", "redis://redis:6379/0")

celery_app = Celery(
    "worker",
    broker=CELERY_BROKER_URL,
    backend=CELERY_RESULT_BACKEND
)

celery_app.conf.update(task_track_started=True)

ai = AIEngine()

@celery_app.task(name="test_task")
def test_task():
    return "Celery is working!"

@celery_app.task(name="scrape_jobs_task")
def scrape_jobs_task(hunt_id: str, query: str):
    """
    Celery task to scrape jobs and save them to the database.
    Then triggers analysis for each listing if a master CV exists.
    """
    loop = asyncio.get_event_loop()
    job_results = loop.run_until_complete(run_scraper(query))
    
    db = SessionLocal()
    try:
        listings = []
        for job in job_results:
            listing = Listing(
                hunt_id=hunt_id,
                title=job["title"],
                company=job["company"],
                description=job["description"],
                url=job["url"]
            )
            listings.append(listing)
        
        db.add_all(listings)
        db.commit()
        
        # If a master CV exists, trigger analysis for these new listings
        master_cv = db.query(CV).filter(CV.is_master == True).first()
        if master_cv:
            for l in listings:
                celery_app.send_task("analyze_job_task", args=[str(l.id), str(master_cv.id)])

        return f"Successfully scraped and saved {len(listings)} jobs for hunt {hunt_id}"
    except Exception as e:
        db.rollback()
        return f"Error during scraping: {str(e)}"
    finally:
        db.close()

@celery_app.task(name="analyze_job_task")
def analyze_job_task(listing_id: str, cv_id: str):
    """
    Extract skills from JD and calculate match score against the CV.
    """
    db = SessionLocal()
    try:
        listing = db.query(Listing).filter(Listing.id == listing_id).first()
        cv = db.query(CV).filter(CV.id == cv_id).first()
        
        if not listing or not cv:
            return "Listing or CV not found"

        loop = asyncio.get_event_loop()
        skills = loop.run_until_complete(ai.extract_skills(listing.description))
        score = loop.run_until_complete(ai.calculate_match_score(skills, cv.content_text))
        
        listing.match_score = score
        db.commit()
        return f"Match score for {listing.title}: {score}%"
    except Exception as e:
        return f"Error analyzing job: {str(e)}"
    finally:
        db.close()

@celery_app.task(name="tailor_cv_task")
def tailor_cv_task(listing_id: str, cv_id: str):
    """
    Generate a tailored CV for a specific listing.
    """
    db = SessionLocal()
    try:
        listing = db.query(Listing).filter(Listing.id == listing_id).first()
        cv = db.query(CV).filter(CV.id == cv_id).first()
        
        if not listing or not cv:
            return "Listing or CV not found"

        loop = asyncio.get_event_loop()
        tailored_html = loop.run_until_complete(ai.tailor_resume(cv.content_text, listing.description))
        
        pdf_bytes = PDFEngine.generate_pdf(tailored_html)
        
        # For now, we save it locally or just return success.
        # In a real app, we might upload to S3 or save to a shared volume.
        save_path = f"/tmp/tailored_cv_{listing_id}.pdf"
        with open(save_path, "wb") as f:
            f.write(pdf_bytes)
            
        return f"Tailored CV generated at {save_path}"
    except Exception as e:
        return f"Error tailoring CV: {str(e)}"
    finally:
        db.close()
