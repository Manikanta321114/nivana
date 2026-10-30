"""Authentication and Session inspection endpoints."""
from fastapi import APIRouter, Depends
from app.api.deps import AuthenticatedUser, get_current_user, get_current_admin

router = APIRouter()


@router.get("/me", summary="Get current authenticated tenant user")
async def get_my_profile(
    current_user: AuthenticatedUser = Depends(get_current_user),
):
    """Retrieve profile and token claims for the currently authenticated tenant."""
    return {
        "status": "authenticated",
        "user_id": current_user.id,
        "email": current_user.email,
        "is_admin": current_user.is_admin,
        "app_metadata": current_user.app_metadata,
        "user_metadata": current_user.user_metadata,
    }


@router.get("/admin-check", summary="Verify administrator privileges")
async def verify_admin_access(
    admin_user: AuthenticatedUser = Depends(get_current_admin),
):
    """Verify administrator authorization. Returns 200 for admins, 403 for non-admins."""
    return {
        "status": "authorized",
        "admin_id": admin_user.id,
        "email": admin_user.email,
        "role": admin_user.app_metadata.get("role"),
        "message": "Administrator privileges successfully verified via trusted app_metadata",
    }
