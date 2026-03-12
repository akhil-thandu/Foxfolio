from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.api.v1 import auth, portfolio, accounts, holdings, transactions, prices, analytics, settings as settings_router

app = FastAPI(
    title="Foxfolio API",
    description="Personal Portfolio Manager API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.cors_origin],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(portfolio.router, prefix="/api/v1/portfolio", tags=["portfolio"])
app.include_router(accounts.router, prefix="/api/v1/accounts", tags=["accounts"])
app.include_router(holdings.router, prefix="/api/v1/accounts", tags=["holdings"])
app.include_router(transactions.router, prefix="/api/v1/accounts", tags=["transactions"])
app.include_router(prices.router, prefix="/api/v1/prices", tags=["prices"])
app.include_router(analytics.router, prefix="/api/v1/analytics", tags=["analytics"])
app.include_router(settings_router.router, prefix="/api/v1/settings", tags=["settings"])

@app.get("/")
def root():
    return {"message": "🦊 Foxfolio API is running", "version": "1.0.0"}

@app.get("/health")
def health():
    return {"status": "ok"}
