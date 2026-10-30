"""Booking and Callback Requests API router."""
from fastapi import APIRouter
from app.schemas.request import BookingRequestCreate

router = APIRouter()


@router.post("/", summary="Submit tenant booking/callback request")
async def create_booking_request(payload: BookingRequestCreate):
    """Receive tenant booking or callback request."""
    return {
        "status": "received",
        "request_ref": "REQ-PREVIEW-001",
        "message": "Booking request endpoint ready for database integration",
    }
