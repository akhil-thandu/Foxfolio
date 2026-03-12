from fastapi import APIRouter

router = APIRouter()

@router.post("/login")
def login():
    return {"message": "login endpoint - coming soon"}

@router.post("/refresh")
def refresh():
    return {"message": "refresh endpoint - coming soon"}

@router.post("/logout")
def logout():
    return {"message": "logout endpoint - coming soon"}
