"""API v1 router aggregator."""
from fastapi import APIRouter
from app.api.v1.endpoints import properties, requests

api_router = APIRouter()

api_router.include_router(properties.router, prefix="/properties", tags=["Properties"])
api_router.include_router(requests.router, prefix="/requests", tags=["Requests"])
