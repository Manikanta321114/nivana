"""Authentication and Authorization dependencies for FastAPI endpoints."""
from typing import Optional, Dict, Any
from pydantic import BaseModel, Field
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.core.security import verify_supabase_jwt

# Bearer token extractor from Authorization header
oauth2_scheme = HTTPBearer(auto_error=True)
optional_oauth2_scheme = HTTPBearer(auto_error=False)


class AuthenticatedUser(BaseModel):
    """User context extracted from verified Supabase JWT."""

    id: str = Field(..., description="Supabase auth UUID (sub claim)")
    email: Optional[str] = None
    role: Optional[str] = Field(None, description="Auth role claim (usually 'authenticated')")
    app_metadata: Dict[str, Any] = Field(
        default_factory=dict,
        description="TRUSTED server-managed metadata (e.g. role='admin'). Never client-editable.",
    )
    user_metadata: Dict[str, Any] = Field(
        default_factory=dict,
        description="UNTRUSTED user profile metadata (e.g. full_name, phone). Editable by client.",
    )
    is_admin: bool = False


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(oauth2_scheme),
) -> AuthenticatedUser:
    """Validate incoming Supabase JWT token and return authenticated user context.

    Raises HTTP 401 if token is missing, expired, or invalid.
    """
    token = credentials.credentials
    payload = verify_supabase_jwt(token)

    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token subject (user ID) is missing.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Read server-managed metadata
    app_metadata = payload.get("app_metadata", {})
    user_metadata = payload.get("user_metadata", {})

    # SECURITY MANDATE:
    # Admin status MUST ONLY be derived from trusted, server-managed `app_metadata`.
    # `user_metadata` is editable by the frontend client and MUST NEVER be trusted for authorization.
    admin_role = (
        app_metadata.get("role") == "admin"
        or app_metadata.get("is_admin") is True
        or app_metadata.get("claims_admin") is True
    )

    return AuthenticatedUser(
        id=user_id,
        email=payload.get("email"),
        role=payload.get("role"),
        app_metadata=app_metadata,
        user_metadata=user_metadata,
        is_admin=bool(admin_role),
    )


async def get_current_admin(
    current_user: AuthenticatedUser = Depends(get_current_user),
) -> AuthenticatedUser:
    """Ensure the authenticated user has verified administrator privileges.

    Raises HTTP 403 Forbidden if the user lacks server-managed admin role.
    """
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Administrative privileges required. Access denied.",
        )
    return current_user


async def get_optional_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(optional_oauth2_scheme),
) -> Optional[AuthenticatedUser]:
    """Optional user dependency for public endpoints that offer enhanced views for logged-in users."""
    if not credentials:
        return None
    try:
        return await get_current_user(credentials)
    except HTTPException:
        return None
