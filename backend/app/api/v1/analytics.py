from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.services.analytics_service import get_allocation

router = APIRouter()

@router.get("/allocation")
async def allocation(db: Session = Depends(get_db)):
    result = await get_allocation(db)
    return {
        "success": True,
        "data": result
    }

@router.get("/exposure")
async def exposure():
    return {
        "success": True,
        "data": {
            "message": "Effective exposure coming in next iteration",
            "direct_holdings": [],
            "etf_exposure": []
        }
    }
