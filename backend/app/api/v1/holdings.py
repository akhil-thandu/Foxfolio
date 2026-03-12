from fastapi import APIRouter

router = APIRouter()

@router.get("/{account_id}/holdings")
def get_holdings(account_id: str):
    return {"message": f"holdings for {account_id} - coming soon"}

@router.post("/{account_id}/holdings")
def create_holding(account_id: str):
    return {"message": "create holding - coming soon"}

@router.patch("/{account_id}/holdings/{holding_id}")
def update_holding(account_id: str, holding_id: str):
    return {"message": "update holding - coming soon"}

@router.delete("/{account_id}/holdings/{holding_id}")
def delete_holding(account_id: str, holding_id: str):
    return {"message": "delete holding - coming soon"}
