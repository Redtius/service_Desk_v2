from typing import Optional
from sqlmodel import SQLModel, Field

class Token(SQLModel):
    access_token: str
    token_type: str = Field(default="bearer")

class TokenData(SQLModel):
    email: Optional[str] = None
