from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    database_url: str
    redis_url: str
    jwt_secret: str
    jwt_access_expire_minutes: int = 15
    jwt_refresh_expire_days: int = 7
    finnhub_api_key: str = ""
    twelve_data_api_key: str = ""
    coingecko_api_key: str = ""
    environment: str = "development"
    cors_origin: str = "http://localhost:3000"

    class Config:
        env_file = ".env"

settings = Settings()
