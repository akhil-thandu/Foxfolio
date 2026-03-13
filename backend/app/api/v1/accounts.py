from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import Account

router = APIRouter()

@router.get("")
def get_accounts(db: Session = Depends(get_db)):
    accounts = db.query(Account).all()
    return {
        "success": True,
        "data": [
            {
                "id": str(a.id),
                "name": a.name,
                "account_type": a.account_type,
                "currency": a.currency,
                "created_at": a.created_at.isoformat() if a.created_at else None
            }
            for a in accounts
        ]
    }

@router.get("/{account_id}")
def get_account(account_id: str, db: Session = Depends(get_db)):
    account = db.query(Account).filter(Account.id == account_id).first()
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
    return {
        "success": True,
        "data": {
            "id": str(account.id),
            "name": account.name,
            "account_type": account.account_type,
            "currency": account.currency,
            "created_at": account.created_at.isoformat() if account.created_at else None
        }
    }
