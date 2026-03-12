import redis
from app.config import settings

redis_client = redis.from_url(settings.redis_url, decode_responses=True)

def get_cached_price(ticker: str):
    return redis_client.get(f"price:{ticker}")

def set_cached_price(ticker: str, price: float, expiry: int = 300):
    redis_client.setex(f"price:{ticker}", expiry, price)

def get_cached_exchange_rate(pair: str):
    return redis_client.get(f"rate:{pair}")

def set_cached_exchange_rate(pair: str, rate: float, expiry: int = 3600):
    redis_client.setex(f"rate:{pair}", expiry, rate)
