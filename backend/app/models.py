import uuid
from sqlalchemy import Column, String, Text, Boolean, DateTime, ForeignKey, Float
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from .database import Base

class CV(Base):
    __tablename__ = "cvs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String, nullable=False)
    content_text = Column(Text, nullable=False)
    is_master = Column(Boolean, default=False)
    file_path = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Hunt(Base):
    __tablename__ = "hunts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    category = Column(String, nullable=False)
    region = Column(String, default="Colombo, Sri Lanka")
    job_type = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Listing(Base):
    __tablename__ = "listings"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    hunt_id = Column(UUID(as_uuid=True), ForeignKey("hunts.id"), nullable=False)
    title = Column(String, nullable=False)
    company = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    url = Column(String, nullable=False)
    match_score = Column(Float, nullable=True)
    applied_status = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
