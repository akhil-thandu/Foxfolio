from fastapi import APIRouter, HTTPException, Query
from app.services.price_service import get_price

router = APIRouter()

@router.get("/{ticker}")
async def get_ticker_price(ticker: str, asset_type: str = Query(default="stock")):
    valid_types = {"stock", "etf", "crypto"}
    if asset_type not in valid_types:
        raise HTTPException(status_code=400, detail=f"asset_type must be one of: {sorted(valid_types)}")

    result = await get_price(ticker.upper(), asset_type)

    if result["price"] is None:
        raise HTTPException(status_code=503, detail=f"Price unavailable for {ticker}")

    return {
        "success": True,
        "data": result
    }
