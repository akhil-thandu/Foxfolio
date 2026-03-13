from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
import uuid
from app.db.database import get_db
from app.db.models import Account, Holding

router = APIRouter()

class CreateHoldingRequest(BaseModel):
    ticker: str
    name: str
    asset_type: str
    quantity: float
    avg_buy_price: float
    currency: str

class UpdateHoldingRequest(BaseModel):
    quantity: Optional[float] = None
    avg_buy_price: Optional[float] = None

def holding_to_dict(h: Holding) -> dict:
    return {
        "id": str(h.id),
        "account_id": str(h.account_id),
        "ticker": h.ticker,
        "name": h.name,
        "asset_type": h.asset_type,
        "quantity": float(h.quantity),
        "avg_buy_price": float(h.avg_buy_price),
        "currency": h.currency,
        "created_at": h.created_at.isoformat() if h.created_at else None,
        "updated_at": h.updated_at.isoformat() if h.updated_at else None
    }

@router.get("/{account_id}/holdings")
def get_holdings(account_id: str, db: Session = Depends(get_db)):
    account = db.query(Account).filter(Account.id == account_id).first()
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
    holdings = db.query(Holding).filter(Holding.account_id == account_id).all()
    return {
        "success": True,
        "data": [holding_to_dict(h) for h in holdings]
    }

@router.post("/{account_id}/holdings")
def create_holding(account_id: str, body: CreateHoldingRequest, db: Session = Depends(get_db)):
    account = db.query(Account).filter(Account.id == account_id).first()
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")

    valid_asset_types = ["stock", "etf", "crypto"]
    if body.asset_type not in valid_asset_types:
        raise HTTPException(status_code=400, detail=f"asset_type must be one of: {valid_asset_types}")

    holding = Holding(
        id=uuid.uuid4(),
        account_id=account_id,
        ticker=body.ticker.upper(),
        name=body.name,
        asset_type=body.asset_type,
        quantity=body.quantity,
        avg_buy_price=body.avg_buy_price,
        currency=body.currency.upper()
    )
    db.add(holding)
    db.commit()
    db.refresh(holding)
    return {
        "success": True,
        "data": holding_to_dict(holding)
    }

@router.patch("/{account_id}/holdings/{holding_id}")
def update_holding(account_id: str, holding_id: str, body: UpdateHoldingRequest, db: Session = Depends(get_db)):
    holding = db.query(Holding).filter(
        Holding.id == holding_id,
        Holding.account_id == account_id
    ).first()
    if not holding:
        raise HTTPException(status_code=404, detail="Holding not found")

    if body.quantity is not None:
        holding.quantity = body.quantity
    if body.avg_buy_price is not None:
        holding.avg_buy_price = body.avg_buy_price

    db.commit()
    db.refresh(holding)
    return {
        "success": True,
        "data": holding_to_dict(holding)
    }

@router.delete("/{account_id}/holdings/{holding_id}")
def delete_holding(account_id: str, holding_id: str, db: Session = Depends(get_db)):
    holding = db.query(Holding).filter(
        Holding.id == holding_id,
        Holding.account_id == account_id
    ).first()
    if not holding:
        raise HTTPException(status_code=404, detail="Holding not found")

    db.delete(holding)
    db.commit()
    return {
        "success": True,
        "data": {"message": "Holding deleted successfully"}
    }
