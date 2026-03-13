from app.external.finnhub import fetch_price_finnhub
from app.external.twelve_data import fetch_price_twelve_data
from app.external.yfinance_client import fetch_price_yfinance
from app.external.coingecko import fetch_price_coingecko
from app.cache.redis import get_cached_price, set_cached_price

async def get_price(ticker: str, asset_type: str) -> dict:
    cached = get_cached_price(ticker)
    if cached:
        return {
            "ticker": ticker,
            "price": float(cached),
            "currency": "INR" if asset_type == "stock" and ticker.endswith(".NS") else "USD",
            "fresh": True,
            "source": "cache"
        }

    price = None
    source = None

    if asset_type == "crypto":
        price = await fetch_price_coingecko(ticker)
        source = "coingecko"
    else:
        price = await fetch_price_finnhub(ticker)
        source = "finnhub"

        if price is None:
            price = await fetch_price_twelve_data(ticker)
            source = "twelve_data"

        if price is None:
            price = await run_in_executor(fetch_price_yfinance, ticker)
            source = "yfinance"

    if price:
        set_cached_price(ticker, price)
        return {
            "ticker": ticker,
            "price": price,
            "currency": "INR" if asset_type == "stock" and ticker.endswith(".NS") else "USD",
            "fresh": True,
            "source": source
        }

    last_cached = get_cached_price(ticker)
    if last_cached:
        return {
            "ticker": ticker,
            "price": float(last_cached),
            "currency": "INR" if asset_type == "stock" and ticker.endswith(".NS") else "USD",
            "fresh": False,
            "source": "cache_stale"
        }

    return {
        "ticker": ticker,
        "price": None,
        "currency": "USD",
        "fresh": False,
        "source": "unavailable"
    }

async def run_in_executor(func, *args):
    import asyncio
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(None, func, *args)
