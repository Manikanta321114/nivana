"""Properties API router."""
from typing import List, Optional
from fastapi import APIRouter

router = APIRouter()


@router.get("/", summary="List verified properties")
async def list_properties(
    locality: Optional[str] = None,
    bhk: Optional[int] = None,
    min_rent: Optional[int] = None,
    max_rent: Optional[int] = None,
):
    """Retrieve public verified properties for explore and map views."""
    return {
        "items": [],
        "total": 0,
        "message": "Properties endpoint ready for database integration",
    }


@router.get("/{property_ref}", summary="Get property by reference")
async def get_property(property_ref: str):
    """Retrieve a single property details by reference identifier."""
    return {
        "property_ref": property_ref,
        "message": "Property detail endpoint ready for database integration",
    }
