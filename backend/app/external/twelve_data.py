import httpx
from app.config import settings

TWELVE_BASE = "https://api.twelvedata.com"

async def fetch_price_twelve_data(ticker: str) -> float | None:
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            response = await client.get(
                f"{TWELVE_BASE}/price",
                params={"symbol": ticker, "apikey": settings.twelve_data_api_key}
            )
            data = response.json()
            price = data.get("price")
            if price:
                return float(price)
            return None
    except Exception:
        return None
