"""Supabase JWT verification using JWKS (ES256 key rotation support)."""
import logging
from typing import Any, Dict
import jwt
from jwt import PyJWKClient, PyJWKClientError, PyJWTError
from fastapi import HTTPException, status
from app.core.config import settings

logger = logging.getLogger(__name__)

# Initialize JWKS client pointing to project's public key endpoint
# PyJWKClient maintains an internal cache and automatically refetches on key rotation
jwks_client = PyJWKClient(
    uri=settings.SUPABASE_JWKS_URL,
    cache_keys=True,
    max_cached_keys=10,
    cache_jwk_set=True,
    lifespan=3600,  # Cache JWKS for 1 hour
)


def verify_supabase_jwt(token: str) -> Dict[str, Any]:
    """Verify incoming Supabase Auth Bearer JWT token against project JWKS.

    Validates:
    - Signature using the project's public key matched by token header 'kid' (ES256)
    - Issuer ('iss') matches Supabase project Auth URL
    - Audience ('aud') matches 'authenticated'
    - Expiration ('exp') is strictly in the future
    """
    if not token or not isinstance(token, str):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid authentication token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    try:
        # Retrieve signing key matching token's kid header from cached JWKS
        signing_key = jwks_client.get_signing_key_from_jwt(token)

        # Decode and rigorously validate claims
        payload = jwt.decode(
            token,
            signing_key.key,
            algorithms=settings.SUPABASE_JWT_ALGORITHMS,
            audience=settings.SUPABASE_JWT_AUDIENCE,
            issuer=settings.SUPABASE_JWT_ISSUER,
            options={
                "verify_signature": True,
                "verify_aud": True,
                "verify_iss": True,
                "verify_exp": True,
                "require": ["exp", "iss", "aud", "sub"],
            },
            leeway=10,  # 10 seconds leeway for minor clock skew
        )

        return payload

    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired. Please sign in again.",
            headers={"WWW-Authenticate": "Bearer error=\"invalid_token\", error_description=\"Token expired\""},
        )
    except jwt.InvalidAudienceError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token audience. Expected 'authenticated'.",
            headers={"WWW-Authenticate": "Bearer error=\"invalid_token\""},
        )
    except jwt.InvalidIssuerError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token issuer.",
            headers={"WWW-Authenticate": "Bearer error=\"invalid_token\""},
        )
    except (PyJWKClientError, jwt.InvalidSignatureError, jwt.DecodeError) as e:
        logger.warning(f"JWT signature verification failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token signature or unrecognized key ID.",
            headers={"WWW-Authenticate": "Bearer error=\"invalid_token\""},
        )
    except PyJWTError as e:
        logger.warning(f"JWT decoding error: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials.",
            headers={"WWW-Authenticate": "Bearer"},
        )
