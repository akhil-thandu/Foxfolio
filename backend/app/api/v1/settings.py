from fastapi import APIRouter

router = APIRouter()

@router.get("")
def get_settings():
    return {"message": "settings - coming soon"}

@router.patch("")
def update_settings():
    return {"message": "update settings - coming soon"}
