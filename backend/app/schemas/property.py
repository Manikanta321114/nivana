"""Pydantic schemas for property listings."""
from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, Field


class PropertyImageSchema(BaseModel):
    id: str
    file_path: str
    display_order: int = 0
    caption: Optional[str] = None


class PropertyBase(BaseModel):
    title: str = Field(..., min_length=3, max_length=255)
    locality: str
    city: str = "Bengaluru"
    property_type: str = "APARTMENT"
    bhk: int = 1
    rent_paise: int = Field(..., gt=0)
    deposit_paise: Optional[int] = None
    amenities: List[str] = []
    description: Optional[str] = None
    availability_status: str = "AVAILABLE"
    listing_status: str = "UNPUBLISHED"
    approx_lat: Optional[float] = None
    approx_lng: Optional[float] = None


class PropertyCreate(PropertyBase):
    exact_address: Optional[str] = None
    owner_name: Optional[str] = None
    owner_phone: Optional[str] = None


class PropertyPublicResponse(PropertyBase):
    id: str
    property_ref: str
    images: List[PropertyImageSchema] = []
    created_at: datetime
    published_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class PropertyAdminResponse(PropertyPublicResponse):
    exact_address: Optional[str] = None
    owner_name: Optional[str] = None
    owner_phone: Optional[str] = None
    source: str
    submission_id: Optional[str] = None
    added_by_admin_id: Optional[str] = None
    updated_at: datetime
