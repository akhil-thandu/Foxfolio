from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.services.portfolio_service import get_portfolio_summary, get_portfolio_history

router = APIRouter()

VALID_RANGES = {"1H", "1D", "1W", "1M", "3M", "1Y", "ALL"}

@router.get("/summary")
async def portfolio_summary(db: Session = Depends(get_db)):
    summary = await get_portfolio_summary(db)
    return {
        "success": True,
        "data": summary
    }

@router.get("/history")
async def portfolio_history(
    range: str = Query(default="1M"),
    db: Session = Depends(get_db)
):
    if range not in VALID_RANGES:
        from fastapi import HTTPException
        raise HTTPException(status_code=400, detail=f"range must be one of: {sorted(VALID_RANGES)}")

    history = await get_portfolio_history(db, range)
    return {
        "success": True,
        "data": history
    }
