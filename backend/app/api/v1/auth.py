from fastapi import APIRouter, HTTPException, Response, Request, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import User
from app.core.security import verify_password, create_access_token, create_refresh_token, decode_token
from pydantic import BaseModel

router = APIRouter()

class LoginRequest(BaseModel):
    password: str

@router.post("/login")
def login(body: LoginRequest, response: Response, db: Session = Depends(get_db)):
    user = db.query(User).first()
    if not user or not verify_password(body.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid password")

    access_token = create_access_token({"sub": str(user.id), "username": user.username})
    refresh_token = create_refresh_token({"sub": str(user.id), "username": user.username})

    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=True,
        samesite="none",
        max_age=7 * 24 * 60 * 60
    )

    return {
        "success": True,
        "data": {
            "access_token": access_token,
            "token_type": "bearer",
            "username": user.username
        }
    }

@router.post("/refresh")
def refresh(request: Request, response: Response):
    token = request.cookies.get("refresh_token")
    if not token:
        raise HTTPException(status_code=401, detail="No refresh token")

    try:
        payload = decode_token(token)
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Invalid token type")
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired refresh token")

    access_token = create_access_token({"sub": payload["sub"], "username": payload["username"]})

    return {
        "success": True,
        "data": {
            "access_token": access_token,
            "token_type": "bearer"
        }
    }

@router.post("/logout")
def logout(response: Response):
    response.delete_cookie(key="refresh_token")
    return {"success": True, "data": {"message": "Logged out successfully"}}
