from typing import Any, Dict, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from db.session import get_session
from db.models import Ticket, Message, User
from core.dependencies import get_current_active_user
router = APIRouter()

# AgentConfig CRUD endpoints
from db.models import AgentConfig
from api.v1.schemas.agent_config import AgentConfigCreate, AgentConfigRead, AgentConfigUpdate
from core.dependencies import get_current_active_admin

@router.post("/configs", response_model=AgentConfigRead, status_code=status.HTTP_201_CREATED)
def create_agent_config(
    cfg_in: AgentConfigCreate,
    session: Session = Depends(get_session),
    _: None = Depends(get_current_active_admin),
):
    cfg = AgentConfig(**cfg_in.dict())
    session.add(cfg)
    session.commit()
    session.refresh(cfg)
    return cfg

@router.get("/configs", response_model=List[AgentConfigRead])
def read_agent_configs(
    session: Session = Depends(get_session),
    _: None = Depends(get_current_active_admin),
):
    configs = session.exec(select(AgentConfig)).all()
    return configs

@router.get("/configs/{config_id}", response_model=AgentConfigRead)
def read_agent_config(
    config_id: int,
    session: Session = Depends(get_session),
    _: None = Depends(get_current_active_admin),
):
    cfg = session.get(AgentConfig, config_id)
    if not cfg:
        raise HTTPException(status_code=404, detail="AgentConfig not found")
    return cfg

@router.put("/configs/{config_id}", response_model=AgentConfigRead)
def update_agent_config(
    config_id: int,
    cfg_update: AgentConfigUpdate,
    session: Session = Depends(get_session),
    _: None = Depends(get_current_active_admin),
):
    cfg = session.get(AgentConfig, config_id)
    if not cfg:
        raise HTTPException(status_code=404, detail="AgentConfig not found")
    data = cfg_update.dict(exclude_unset=True)
    for key, val in data.items():
        setattr(cfg, key, val)
    session.add(cfg)
    session.commit()
    session.refresh(cfg)
    return cfg

@router.delete("/configs/{config_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_agent_config(
    config_id: int,
    session: Session = Depends(get_session),
    _: None = Depends(get_current_active_admin),
):
    cfg = session.get(AgentConfig, config_id)
    if not cfg:
        raise HTTPException(status_code=404, detail="AgentConfig not found")
    session.delete(cfg)
    session.commit()
    return None
