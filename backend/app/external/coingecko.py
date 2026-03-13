import httpx

COINGECKO_BASE = "https://api.coingecko.com/api/v3"

CRYPTO_ID_MAP = {
    "BTC": "bitcoin",
    "ETH": "ethereum",
    "SOL": "solana",
}

async def fetch_price_coingecko(ticker: str) -> float | None:
    coin_id = CRYPTO_ID_MAP.get(ticker.upper())
    if not coin_id:
        return None
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            response = await client.get(
                f"{COINGECKO_BASE}/simple/price",
                params={"ids": coin_id, "vs_currencies": "usd"},
                headers={"x-cg-demo-api-key": "CG-NYtaor3mj4ydKJoXCtGZNWfk"}
            )
            data = response.json()
            price = data.get(coin_id, {}).get("usd")
            if price:
                return float(price)
            return None
    except Exception:
        return None
