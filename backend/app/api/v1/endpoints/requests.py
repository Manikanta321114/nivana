"""Booking and Callback Requests API router."""
from fastapi import APIRouter, Depends
from app.schemas.request import BookingRequestCreate
from app.api.deps import AuthenticatedUser, get_current_user

router = APIRouter()


@router.post("/", summary="Submit tenant booking/callback request")
async def create_booking_request(
    payload: BookingRequestCreate,
    current_user: AuthenticatedUser = Depends(get_current_user),
):
    """Receive tenant booking or callback request (requires verified tenant session)."""
    return {
        "status": "received",
        "request_ref": "REQ-PREVIEW-001",
        "user_id": current_user.id,
        "customer_name": payload.customer_name,
        "message": "Booking request authenticated and ready for database integration",
    }
