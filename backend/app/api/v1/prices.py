from fastapi import APIRouter

router = APIRouter()

@router.get("/{ticker}")
def get_price(ticker: str):
    return {"message": f"price for {ticker} - coming soon"}

@router.get("/refresh")
def refresh_prices():
    return {"message": "price refresh - coming soon"}
