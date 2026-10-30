"""Booking and Callback Request SQLAlchemy model definitions (Future schema)."""
from datetime import datetime
from sqlalchemy import (
    Column,
    String,
    Text,
    DateTime,
    Boolean,
)
from app.models.base import Base


class BookingRequest(Base):
    """Booking / Callback Request submitted by tenants."""

    __tablename__ = "booking_requests"

    id = Column(String(36), primary_key=True, index=True)
    request_ref = Column(String(50), unique=True, index=True, nullable=False)
    property_id = Column(String(36), index=True, nullable=False)
    property_ref = Column(String(50), nullable=False)
    property_title = Column(String(255), nullable=False)
    property_locality = Column(String(100), nullable=False)

    # Customer info
    customer_name = Column(String(255), nullable=False)
    customer_phone = Column(String(50), nullable=False)
    request_type = Column(String(50), nullable=False)  # CALLBACK or VISIT
    preferred_visit_date = Column(String(50), nullable=True)
    message = Column(Text, nullable=True)
    consent_to_contact = Column(Boolean, default=True, nullable=False)

    # Admin tracking
    status = Column(String(50), default="NEW", nullable=False)
    admin_notes = Column(Text, nullable=True)
    assigned_to_admin_id = Column(String(36), nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
