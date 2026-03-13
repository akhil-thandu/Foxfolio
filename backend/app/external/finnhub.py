import httpx
from app.config import settings

FINNHUB_BASE = "https://finnhub.io/api/v1"

async def fetch_price_finnhub(ticker: str) -> float | None:
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            response = await client.get(
                f"{FINNHUB_BASE}/quote",
                params={"symbol": ticker, "token": settings.finnhub_api_key}
            )
            data = response.json()
            price = data.get("c")
            if price and price > 0:
                return float(price)
            return None
    except Exception:
        return None
