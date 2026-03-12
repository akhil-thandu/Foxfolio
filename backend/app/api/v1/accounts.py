from fastapi import APIRouter

router = APIRouter()

@router.get("")
def get_accounts():
    return {"message": "accounts list - coming soon"}

@router.get("/{account_id}")
def get_account(account_id: str):
    return {"message": f"account {account_id} - coming soon"}
