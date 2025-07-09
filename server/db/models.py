from typing import List, Optional
import datetime
from sqlmodel import SQLModel, Field, Relationship
from sqlalchemy import Column, JSON


class RolePermissionLink(SQLModel, table=True):
    __table_args__ = {"extend_existing": True}
    role_id: Optional[int] = Field(default=None, foreign_key="role.id", primary_key=True)
    permission_id: Optional[int] = Field(default=None, foreign_key="permission.id", primary_key=True)


class Permission(SQLModel, table=True):
    __table_args__ = {"extend_existing": True}
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True, unique=True)
    description: Optional[str] = None

    roles: List["Role"] = Relationship(
        back_populates="permissions",
        link_model=RolePermissionLink
    )


class Role(SQLModel, table=True):
    __table_args__ = {"extend_existing": True}
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True, unique=True)
    description: Optional[str] = None

    permissions: List[Permission] = Relationship(
        back_populates="roles",
        link_model=RolePermissionLink
    )
    users: List["User"] = Relationship(back_populates="role")


class User(SQLModel, table=True):
    __table_args__ = {"extend_existing": True}
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True)
    password_hash: str
    full_name: str
    position: Optional[str] = None
    department: Optional[str] = None
    phone: Optional[str] = None
    status: str = Field(default="pending")
    role_id: Optional[int] = Field(default=None, foreign_key="role.id")
    last_login: Optional[datetime.datetime] = None
    created_at: datetime.datetime = Field(default_factory=datetime.datetime.utcnow)
    updated_at: datetime.datetime = Field(default_factory=datetime.datetime.utcnow)

    role: Optional[Role] = Relationship(back_populates="users")

# Ticket, Message, Workflow and IntegrationConfig models
class Ticket(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id", index=True)
    subject: str
    description: Optional[str] = None
    status: str = Field(default="open")
    created_at: datetime.datetime = Field(default_factory=datetime.datetime.utcnow)
    updated_at: datetime.datetime = Field(default_factory=datetime.datetime.utcnow)

    messages: List["Message"] = Relationship(back_populates="ticket")


class Message(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    ticket_id: int = Field(foreign_key="ticket.id", index=True)
    sender_type: str  # "user" or "agent"
    body: str
    timestamp: datetime.datetime = Field(default_factory=datetime.datetime.utcnow)

    ticket: Ticket = Relationship(back_populates="messages")


class WorkflowDefinition(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True, unique=True)
    graph_json: str
    created_at: datetime.datetime = Field(default_factory=datetime.datetime.utcnow)
    updated_at: datetime.datetime = Field(default_factory=datetime.datetime.utcnow)


class IntegrationConfig(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    type: str = Field(index=True)
    credentials_json: str
    created_at: datetime.datetime = Field(default_factory=datetime.datetime.utcnow)
    updated_at: datetime.datetime = Field(default_factory=datetime.datetime.utcnow)

  
class AgentConfig(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True, unique=True)
    agent_type: str = Field(index=True)
    tools: List[str] = Field(sa_column=Column(JSON), default_factory=list)
    prompt_template: Optional[str] = Field(default=None)
    memory_settings: dict = Field(sa_column=Column(JSON), default_factory=dict)
    created_at: datetime.datetime = Field(default_factory=datetime.datetime.utcnow)
    updated_at: datetime.datetime = Field(default_factory=datetime.datetime.utcnow)
