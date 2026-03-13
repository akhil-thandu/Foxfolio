import httpx
from app.cache.redis import get_cached_exchange_rate, set_cached_exchange_rate

FRANKFURTER_BASE = "https://api.frankfurter.app"

async def get_usd_to_inr() -> float | None:
    cached = get_cached_exchange_rate("USD_INR")
    if cached:
        return float(cached)

    try:
        async with httpx.AsyncClient(timeout=10) as client:
            response = await client.get(
                f"{FRANKFURTER_BASE}/latest",
                params={"from": "USD", "to": "INR"}
            )
            data = response.json()
            rate = data.get("rates", {}).get("INR")
            if rate:
                set_cached_exchange_rate("USD_INR", rate)
                return float(rate)
            return None
    except Exception:
        return None

async def convert_inr_to_usd(inr_amount: float) -> float | None:
    rate = await get_usd_to_inr()
    if rate is None:
        return None
    return round(inr_amount / rate, 2)

async def convert_usd_to_inr(usd_amount: float) -> float | None:
    rate = await get_usd_to_inr()
    if rate is None:
        return None
    return round(usd_amount * rate, 2)
