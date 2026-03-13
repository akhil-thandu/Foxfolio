from sqlalchemy.orm import Session
from app.db.models import Account, Holding
from app.services.price_service import get_price
from app.services.currency_service import convert_inr_to_usd

async def get_allocation(db: Session) -> dict:
    holdings = db.query(Holding).all()
    accounts = db.query(Account).all()
    account_map = {str(a.id): a for a in accounts}

    by_asset_type = {}
    by_account = {}
    by_currency = {}
    total_usd = 0.0

    holding_values = []
    for h in holdings:
        price_data = await get_price(h.ticker, h.asset_type)
        price = price_data["price"] or 0
        value = price * float(h.quantity)

        if h.currency == "INR":
            value_usd = await convert_inr_to_usd(value) or 0
        else:
            value_usd = value

        holding_values.append({
            "holding": h,
            "value_usd": value_usd
        })
        total_usd += value_usd

    for hv in holding_values:
        h = hv["holding"]
        value_usd = hv["value_usd"]
        pct = round((value_usd / total_usd * 100), 2) if total_usd > 0 else 0

        asset_type = h.asset_type
        if asset_type not in by_asset_type:
            by_asset_type[asset_type] = {"value_usd": 0.0, "percent": 0.0}
        by_asset_type[asset_type]["value_usd"] += round(value_usd, 2)

        account = account_map.get(str(h.account_id))
        account_name = account.name if account else "Unknown"
        if account_name not in by_account:
            by_account[account_name] = {"value_usd": 0.0, "percent": 0.0}
        by_account[account_name]["value_usd"] += round(value_usd, 2)

        currency = h.currency
        if currency not in by_currency:
            by_currency[currency] = {"value_usd": 0.0, "percent": 0.0}
        by_currency[currency]["value_usd"] += round(value_usd, 2)

    for group in [by_asset_type, by_account, by_currency]:
        for key in group:
            group[key]["percent"] = round((group[key]["value_usd"] / total_usd * 100), 2) if total_usd > 0 else 0

    return {
        "total_value_usd": round(total_usd, 2),
        "by_asset_type": by_asset_type,
        "by_account": by_account,
        "by_currency": by_currency
    }
