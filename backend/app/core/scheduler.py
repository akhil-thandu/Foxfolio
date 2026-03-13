from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.interval import IntervalTrigger
from datetime import datetime, date, timezone
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.db.models import Holding, PortfolioSnapshot, IntradaySnapshot
from app.services.price_service import get_price
from app.services.currency_service import get_usd_to_inr, convert_usd_to_inr
from app.services.portfolio_service import get_portfolio_summary, calculate_twr
from app.cache.redis import set_cached_price
import pytz
import logging

logger = logging.getLogger(__name__)

scheduler = AsyncIOScheduler()

US_MARKET_TZ = pytz.timezone("America/New_York")

def is_us_market_open() -> bool:
    now = datetime.now(US_MARKET_TZ)
    if now.weekday() >= 5:
        return False
    market_open = now.replace(hour=9, minute=30, second=0, microsecond=0)
    market_close = now.replace(hour=16, minute=0, second=0, microsecond=0)
    return market_open <= now <= market_close

async def refresh_prices_job():
    db: Session = SessionLocal()
    try:
        holdings = db.query(Holding).all()
        if not holdings:
            return

        for holding in holdings:
            is_us = holding.asset_type in ("stock", "etf") and not holding.ticker.endswith(".NS")
            is_crypto = holding.asset_type == "crypto"
            is_indian = holding.ticker.endswith(".NS")

            if is_us and not is_us_market_open():
                continue

            price_data = await get_price(holding.ticker, holding.asset_type)
            if price_data["price"]:
                set_cached_price(holding.ticker, price_data["price"])

        logger.info(f"Price refresh completed for {len(holdings)} holdings")
    except Exception as e:
        logger.error(f"Price refresh job failed: {e}")
    finally:
        db.close()

async def write_intraday_snapshot_job():
    db: Session = SessionLocal()
    try:
        summary = await get_portfolio_summary(db)
        total_usd = summary["total_value_usd"]
        total_inr = summary["total_value_inr"]

        snapshot = IntradaySnapshot(
            captured_at=datetime.now(timezone.utc),
            total_value_usd=total_usd,
            total_value_inr=total_inr
        )
        db.add(snapshot)
        db.commit()
        logger.info(f"Intraday snapshot written: ${total_usd}")
    except Exception as e:
        logger.error(f"Intraday snapshot job failed: {e}")
        db.rollback()
    finally:
        db.close()

async def write_daily_snapshot_job():
    db: Session = SessionLocal()
    try:
        existing = db.query(PortfolioSnapshot).filter(
            PortfolioSnapshot.snapshot_date == date.today()
        ).first()
        if existing:
            logger.info("Daily snapshot already exists for today, skipping")
            return

        summary = await get_portfolio_summary(db)
        total_usd = summary["total_value_usd"]
        total_inr = summary["total_value_inr"]
        twr = calculate_twr(db, total_usd)

        snapshot = PortfolioSnapshot(
            snapshot_date=date.today(),
            total_value_usd=total_usd,
            total_value_inr=total_inr,
            twr=twr
        )
        db.add(snapshot)
        db.commit()
        logger.info(f"Daily snapshot written: ${total_usd}, TWR: {twr}")
    except Exception as e:
        logger.error(f"Daily snapshot job failed: {e}")
        db.rollback()
    finally:
        db.close()

async def refresh_exchange_rate_job():
    try:
        rate = await get_usd_to_inr()
        logger.info(f"Exchange rate refreshed: USD/INR = {rate}")
    except Exception as e:
        logger.error(f"Exchange rate refresh failed: {e}")

async def cleanup_intraday_snapshots_job():
    db: Session = SessionLocal()
    try:
        from datetime import timedelta
        cutoff = datetime.now(timezone.utc) - timedelta(hours=24)
        deleted = db.query(IntradaySnapshot).filter(
            IntradaySnapshot.captured_at < cutoff
        ).delete()
        db.commit()
        logger.info(f"Cleaned up {deleted} old intraday snapshots")
    except Exception as e:
        logger.error(f"Intraday cleanup job failed: {e}")
        db.rollback()
    finally:
        db.close()

def start_scheduler():
    scheduler.add_job(
        refresh_prices_job,
        trigger=IntervalTrigger(minutes=5),
        id="refresh_prices",
        replace_existing=True
    )
    scheduler.add_job(
        write_intraday_snapshot_job,
        trigger=IntervalTrigger(minutes=1),
        id="intraday_snapshot",
        replace_existing=True
    )
    scheduler.add_job(
        write_daily_snapshot_job,
        trigger=IntervalTrigger(hours=24),
        id="daily_snapshot",
        replace_existing=True
    )
    scheduler.add_job(
        refresh_exchange_rate_job,
        trigger=IntervalTrigger(hours=1),
        id="exchange_rate",
        replace_existing=True
    )
    scheduler.add_job(
        cleanup_intraday_snapshots_job,
        trigger=IntervalTrigger(hours=1),
        id="cleanup_intraday",
        replace_existing=True
    )
    scheduler.start()
    logger.info("Scheduler started with 5 jobs")
