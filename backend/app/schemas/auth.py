"""Schemas for the admin auth endpoints."""
from pydantic import BaseModel, EmailStr
from typing import Optional

class LoginRequest(BaseModel):
    """Payload for POST /auth/login."""
    email: str
    password: str

class TokenResponse(BaseModel):
    """Successful login response carrying the JWT and basic admin info."""
    access_token: str
    token_type: str = "bearer"
    admin_name: str
    admin_email: str
