from fastapi import APIRouter

router = APIRouter()

@router.get("/allocation")
def get_allocation():
    return {"message": "allocation - coming soon"}

@router.get("/exposure")
def get_exposure():
    return {"message": "exposure - coming soon"}
