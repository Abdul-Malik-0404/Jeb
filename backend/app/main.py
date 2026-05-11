from fastapi import FastAPI
from .database import engine, Base

app = FastAPI(title="Jeb API")

@app.get("/")
def read_root():
    return {"message": "Welcome to Jeb API - Autonomous Job Scout & Resume Tailor"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}
