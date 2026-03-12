from fastapi import APIRouter

router = APIRouter()

@router.get("/{account_id}/holdings/{holding_id}/transactions")
def get_transactions(account_id: str, holding_id: str):
    return {"message": "transactions - coming soon"}

@router.post("/{account_id}/holdings/{holding_id}/transactions")
def create_transaction(account_id: str, holding_id: str):
    return {"message": "create transaction - coming soon"}

@router.delete("/{account_id}/holdings/{holding_id}/transactions/{transaction_id}")
def delete_transaction(account_id: str, holding_id: str, transaction_id: str):
    return {"message": "delete transaction - coming soon"}
