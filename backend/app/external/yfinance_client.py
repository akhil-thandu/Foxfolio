import yfinance as yf

def fetch_price_yfinance(ticker: str) -> float | None:
    try:
        t = yf.Ticker(ticker)
        info = t.fast_info
        price = getattr(info, "last_price", None) or getattr(info, "regular_market_price", None)
        if price and price > 0:
            return float(price)
        return None
    except Exception:
        return None
