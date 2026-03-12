import uuid
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.db.models import User, Account, Settings
from app.core.security import hash_password

def seed():
    db: Session = SessionLocal()
    try:
        # Check if already seeded
        existing_user = db.query(User).first()
        if existing_user:
            print("Database already seeded. Skipping.")
            return

        # Create user
        user = User(
            id=uuid.uuid4(),
            username="logan",
            password_hash=hash_password("logandev123")
        )
        db.add(user)
        db.flush()

        # Create 3 accounts
        accounts = [
            Account(
                id=uuid.uuid4(),
                user_id=user.id,
                name="Groww",
                account_type="indian_broker",
                currency="INR"
            ),
            Account(
                id=uuid.uuid4(),
                user_id=user.id,
                name="Robinhood",
                account_type="robinhood",
                currency="USD"
            ),
            Account(
                id=uuid.uuid4(),
                user_id=user.id,
                name="Crypto",
                account_type="crypto",
                currency="USD"
            ),
        ]
        for account in accounts:
            db.add(account)

        # Create default settings for user
        settings = Settings(
            id=uuid.uuid4(),
            user_id=user.id,
            base_currency="USD",
            price_refresh_interval=1
        )
        db.add(settings)

        db.commit()
        print("Seed complete.")
        print(f"  User: logan (id: {user.id})")
        for a in accounts:
            print(f"  Account: {a.name} ({a.account_type}, {a.currency})")

    except Exception as e:
        db.rollback()
        print(f"Seed failed: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    seed()
