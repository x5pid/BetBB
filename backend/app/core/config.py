from pydantic import AnyHttpUrl, field_validator
from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./test.db"
    SECRET_KEY: str = "your-access-token-secret"
    REFRESH_SECRET_KEY: str = "your-refresh-token-secret"
    RESET_SECRET_KEY: str = "your-password-reset-secret"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int  = 15
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    RESET_TOKEN_EXPIRE_MINUTES: int = 30
    FRONTEND_ORIGINS: List[str] = ["http://localhost:4200"]
    #FRONTEND_ORIGINS: List[str] = ["https://leafy-scone-9b40cb.netlify.app"]

    @field_validator("FRONTEND_ORIGINS", mode="before")
    @classmethod
    def assemble_origins(cls, v):
        if isinstance(v, str):
            return [i.strip() for i in v.split(",")]
        return v

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Settings()
