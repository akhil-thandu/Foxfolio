import uuid
from sqlalchemy import Column, String, DateTime, Date, Numeric, Integer, Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from app.db.database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    username = Column(String(50), nullable=False)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime, server_default=func.now())

class Account(Base):
    __tablename__ = "accounts"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    name = Column(String(100), nullable=False)
    account_type = Column(String(50), nullable=False)
    currency = Column(String(10), nullable=False)
    created_at = Column(DateTime, server_default=func.now())

class Holding(Base):
    __tablename__ = "holdings"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    account_id = Column(UUID(as_uuid=True), ForeignKey("accounts.id"), nullable=False)
    ticker = Column(String(20), nullable=False)
    name = Column(String(100), nullable=False)
    asset_type = Column(String(20), nullable=False)
    quantity = Column(Numeric(18, 8), nullable=False)
    avg_buy_price = Column(Numeric(18, 8), nullable=False)
    currency = Column(String(10), nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

class Transaction(Base):
    __tablename__ = "transactions"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    holding_id = Column(UUID(as_uuid=True), ForeignKey("holdings.id"), nullable=False)
    transaction_type = Column(String(20), nullable=False)
    quantity = Column(Numeric(18, 8), nullable=True)
    price_per_unit = Column(Numeric(18, 8), nullable=True)
    total_value = Column(Numeric(18, 8), nullable=False)
    transaction_date = Column(Date, nullable=False)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, server_default=func.now())

class PortfolioSnapshot(Base):
    __tablename__ = "portfolio_snapshots"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    snapshot_date = Column(Date, nullable=False, unique=True)
    total_value_usd = Column(Numeric(18, 2), nullable=False)
    total_value_inr = Column(Numeric(18, 2), nullable=False)
    twr = Column(Numeric(10, 6), nullable=False)
    created_at = Column(DateTime, server_default=func.now())

class IntradaySnapshot(Base):
    __tablename__ = "intraday_snapshots"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    captured_at = Column(DateTime, nullable=False, unique=True)
    total_value_usd = Column(Numeric(18, 2), nullable=False)
    total_value_inr = Column(Numeric(18, 2), nullable=False)

class Settings(Base):
    __tablename__ = "settings"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    base_currency = Column(String(10), default="USD")
    price_refresh_interval = Column(Integer, default=1)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
