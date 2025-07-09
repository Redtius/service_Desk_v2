from pydantic_settings import BaseSettings
from pydantic import ConfigDict, Field

class Settings(BaseSettings):
    database_url: str = "sqlite:///./service_desk.db"
    jwt_secret: str = Field(default="SERVICEDESK")
    jwt_algo: str = "HS256"
    access_token_expire_minutes: int = 30

    model_config = ConfigDict(
        env_file=".env",
        extra="ignore"
    )

settings = Settings()
