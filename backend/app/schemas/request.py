"""Pydantic schemas for booking and callback requests."""
from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field


class BookingRequestCreate(BaseModel):
    property_id: str
    customer_name: str = Field(..., min_length=2)
    customer_phone: str = Field(..., pattern=r"^[6-9]\d{9}$")
    request_type: str = "CALLBACK"  # CALLBACK or VISIT
    preferred_visit_date: Optional[str] = None
    message: Optional[str] = Field(None, max_length=500)
    consent_to_contact: bool = True


class BookingRequestResponse(BaseModel):
    id: str
    request_ref: str
    property_id: str
    property_ref: str
    property_title: str
    property_locality: str
    customer_name: str
    request_type: str
    preferred_visit_date: Optional[str] = None
    status: str
    created_at: datetime

    model_config = {"from_attributes": True}
