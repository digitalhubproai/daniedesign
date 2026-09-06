"""Admin authentication router: login and current-profile endpoints."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.admin import AdminUser
from app.schemas.auth import LoginRequest, TokenResponse
from app.auth import verify_password, create_access_token, get_current_admin
from app.config import settings

router = APIRouter(prefix="/auth", tags=["Admin Auth"])

@router.post("/login", response_model=TokenResponse, summary="Admin Login")
def login_admin(credentials: LoginRequest, db: Session = Depends(get_db)):
    """POST /auth/login — public endpoint that verifies admin credentials
    and returns a JWT access token.

    Returns 401 for unknown emails and wrong passwords alike so the
    response never reveals whether an account exists.
    """
    admin = db.query(AdminUser).filter(AdminUser.email == credentials.email).first()
    if not admin or not verify_password(credentials.password, admin.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    
    # embed email and role in the JWT payload so downstream deps can read them
    token = create_access_token({"sub": admin.email, "role": admin.role})
    return TokenResponse(
        access_token=token,
        admin_name=admin.name,
        admin_email=admin.email
    )

@router.get("/me", summary="Get Current Admin Profile")
def get_admin_profile(current_admin: AdminUser = Depends(get_current_admin)):
    """GET /auth/me — admin-protected endpoint returning the profile
    decoded from the bearer token."""
    return {
        "id": current_admin.id,
        "name": current_admin.name,
        "email": current_admin.email,
        "role": current_admin.role
    }
