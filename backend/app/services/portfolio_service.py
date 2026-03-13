from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date, timedelta
from app.db.models import Account, Holding, Transaction, PortfolioSnapshot, IntradaySnapshot
from app.services.price_service import get_price
from app.services.currency_service import convert_inr_to_usd, convert_usd_to_inr

async def get_holding_value(holding: Holding) -> dict:
    price_data = await get_price(holding.ticker, holding.asset_type)
    current_price = price_data["price"] or 0
    quantity = float(holding.quantity)
    avg_buy_price = float(holding.avg_buy_price)
    total_value = current_price * quantity
    cost_basis = avg_buy_price * quantity
    pnl = total_value - cost_basis
    pnl_percent = (pnl / cost_basis * 100) if cost_basis > 0 else 0

    return {
        "id": str(holding.id),
        "account_id": str(holding.account_id),
        "ticker": holding.ticker,
        "name": holding.name,
        "asset_type": holding.asset_type,
        "quantity": quantity,
        "avg_buy_price": avg_buy_price,
        "current_price": current_price,
        "currency": holding.currency,
        "total_value": round(total_value, 2),
        "cost_basis": round(cost_basis, 2),
        "pnl": round(pnl, 2),
        "pnl_percent": round(pnl_percent, 2),
        "price_fresh": price_data["fresh"],
        "price_source": price_data["source"]
    }

async def get_portfolio_summary(db: Session) -> dict:
    accounts = db.query(Account).all()
    holdings = db.query(Holding).all()

    holding_values = []
    for h in holdings:
        hv = await get_holding_value(h)
        holding_values.append(hv)

    account_totals = {}
    for account in accounts:
        account_totals[str(account.id)] = {
            "id": str(account.id),
            "name": account.name,
            "account_type": account.account_type,
            "currency": account.currency,
            "total_value_usd": 0.0,
            "total_value_inr": 0.0
        }

    total_value_usd = 0.0
    for hv in holding_values:
        account_id = hv["account_id"]
        value = hv["total_value"]
        currency = hv["currency"]

        if currency == "USD":
            value_usd = value
            value_inr = await convert_usd_to_inr(value) or 0
        else:
            value_usd = await convert_inr_to_usd(value) or 0
            value_inr = value

        total_value_usd += value_usd
        if account_id in account_totals:
            account_totals[account_id]["total_value_usd"] += round(value_usd, 2)
            account_totals[account_id]["total_value_inr"] += round(value_inr, 2)

    total_value_inr = await convert_usd_to_inr(total_value_usd) or 0

    yesterday = date.today() - timedelta(days=1)
    yesterday_snapshot = db.query(PortfolioSnapshot).filter(
        PortfolioSnapshot.snapshot_date == yesterday
    ).first()

    if yesterday_snapshot:
        daily_change_usd = round(total_value_usd - float(yesterday_snapshot.total_value_usd), 2)
        daily_change_percent = round(
            (daily_change_usd / float(yesterday_snapshot.total_value_usd) * 100)
            if yesterday_snapshot.total_value_usd > 0 else 0, 2
        )
    else:
        daily_change_usd = None
        daily_change_percent = None

    return {
        "total_value_usd": round(total_value_usd, 2),
        "total_value_inr": round(total_value_inr, 2),
        "daily_change_usd": daily_change_usd,
        "daily_change_percent": daily_change_percent,
        "accounts": list(account_totals.values()),
        "holdings": holding_values
    }

async def get_portfolio_history(db: Session, range: str) -> list:
    if range == "1H":
        rows = db.query(IntradaySnapshot).order_by(
            IntradaySnapshot.captured_at.asc()
        ).limit(60).all()
        return [
            {"timestamp": r.captured_at.isoformat(), "value_usd": float(r.total_value_usd), "value_inr": float(r.total_value_inr)}
            for r in rows
        ]
    elif range == "1D":
        rows = db.query(IntradaySnapshot).order_by(
            IntradaySnapshot.captured_at.asc()
        ).all()
        return [
            {"timestamp": r.captured_at.isoformat(), "value_usd": float(r.total_value_usd), "value_inr": float(r.total_value_inr)}
            for r in rows
        ]
    else:
        limit_map = {
            "1W": 7,
            "1M": 30,
            "3M": 90,
            "1Y": 365,
            "ALL": None
        }
        limit = limit_map.get(range, 30)
        query = db.query(PortfolioSnapshot).order_by(PortfolioSnapshot.snapshot_date.asc())
        if limit:
            query = query.limit(limit)
        rows = query.all()
        return [
            {"date": r.snapshot_date.isoformat(), "value_usd": float(r.total_value_usd), "value_inr": float(r.total_value_inr), "twr": float(r.twr)}
            for r in rows
        ]

def calculate_twr(db: Session, current_value_usd: float) -> float:
    transactions = db.query(Transaction).order_by(Transaction.transaction_date.asc()).all()
    snapshots = db.query(PortfolioSnapshot).order_by(PortfolioSnapshot.snapshot_date.asc()).all()

    if not snapshots:
        return 0.0

    cumulative_twr = 1.0
    prev_value = float(snapshots[0].total_value_usd)

    for snapshot in snapshots[1:]:
        end_value = float(snapshot.total_value_usd)
        if prev_value > 0:
            period_return = end_value / prev_value
            cumulative_twr *= period_return
        prev_value = end_value

    if prev_value > 0:
        final_period_return = current_value_usd / prev_value
        cumulative_twr *= final_period_return

    return round(cumulative_twr - 1, 6)
