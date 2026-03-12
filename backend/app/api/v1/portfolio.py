from fastapi import APIRouter

router = APIRouter()

@router.get("/summary")
def get_summary():
    return {"message": "portfolio summary - coming soon"}

@router.get("/history")
def get_history():
    return {"message": "portfolio history - coming soon"}
