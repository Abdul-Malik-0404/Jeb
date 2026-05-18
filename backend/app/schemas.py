from pydantic import BaseModel
from typing import List, Optional
from uuid import UUID
from datetime import datetime

class CVBase(BaseModel):
    title: str
    content_text: str
    is_master: bool = False

class CVCreate(CVBase):
    pass

class CVResponse(CVBase):
    id: UUID
    created_at: datetime

    class Config:
        from_attributes = True

class HuntBase(BaseModel):
    category: str
    region: str = "Colombo, Sri Lanka"
    job_type: Optional[str] = None

class HuntCreate(HuntBase):
    pass

class HuntResponse(HuntBase):
    id: UUID
    created_at: datetime

    class Config:
        from_attributes = True

class ListingResponse(BaseModel):
    id: UUID
    hunt_id: UUID
    title: str
    company: str
    description: Optional[str]
    url: str
    match_score: Optional[float]
    applied_status: bool
    created_at: datetime

    class Config:
        from_attributes = True
