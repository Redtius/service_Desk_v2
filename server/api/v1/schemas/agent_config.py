from typing import Optional, List
from datetime import datetime
from sqlmodel import SQLModel, Field

class AgentConfigBase(SQLModel):
    name: str
    agent_type: str
    tools: List[str] = Field(default_factory=list)
    prompt_template: Optional[str] = None
    memory_settings: dict = Field(default_factory=dict)

class AgentConfigCreate(AgentConfigBase):
    pass

class AgentConfigRead(AgentConfigBase):
    id: int
    created_at: datetime
    updated_at: datetime

class AgentConfigUpdate(SQLModel):
    name: Optional[str] = None
    agent_type: Optional[str] = None
    tools: Optional[List[str]] = None
    prompt_template: Optional[str] = None
    memory_settings: Optional[dict] = None