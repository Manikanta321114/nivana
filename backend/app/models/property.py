"""Property SQLAlchemy model definition (Future schema)."""
from datetime import datetime
from sqlalchemy import (
    Column,
    String,
    Integer,
    BigInteger,
    Float,
    DateTime,
    Boolean,
    JSON,
    Text,
)
from app.models.base import Base


class Property(Base):
    """Property model representing verified rental listings."""

    __tablename__ = "properties"

    id = Column(String(36), primary_key=True, index=True)
    property_ref = Column(String(50), unique=True, index=True, nullable=False)
    title = Column(String(255), nullable=False)
    locality = Column(String(100), index=True, nullable=False)
    city = Column(String(100), default="Bengaluru", nullable=False)
    property_type = Column(String(50), nullable=False)  # APARTMENT, HOUSE, PG, VILLA, STUDIO
    bhk = Column(Integer, default=1, nullable=False)
    rent_paise = Column(BigInteger, nullable=False)
    deposit_paise = Column(BigInteger, nullable=True)
    amenities = Column(JSON, default=list)  # list of amenity keys
    description = Column(Text, nullable=True)
    availability_status = Column(String(50), default="AVAILABLE")
    listing_status = Column(String(50), default="UNPUBLISHED")

    # Geolocation coordinates (public approximate)
    approx_lat = Column(Float, nullable=True)
    approx_lng = Column(Float, nullable=True)

    # Private fields (accessible only by admin)
    exact_address = Column(Text, nullable=True)
    owner_name = Column(String(255), nullable=True)
    owner_phone = Column(String(50), nullable=True)
    source = Column(String(50), default="ADMIN_UPLOAD")
    submission_id = Column(String(36), nullable=True)
    added_by_admin_id = Column(String(36), nullable=True)

    # Images metadata (list of image dicts or related table)
    images = Column(JSON, default=list)

    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    published_at = Column(DateTime, nullable=True)
