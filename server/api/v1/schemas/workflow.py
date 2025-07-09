from typing import Optional
from datetime import datetime
from sqlmodel import SQLModel, Field

class WorkflowDefinitionBase(SQLModel):
    name: str
    graph_json: str

class WorkflowDefinitionCreate(WorkflowDefinitionBase):
    pass

class WorkflowDefinitionRead(WorkflowDefinitionBase):
    id: int
    created_at: datetime
    updated_at: datetime

class WorkflowDefinitionUpdate(SQLModel):
    name: Optional[str] = None
    graph_json: Optional[str] = None

# Runtime schemas for executing workflows
from typing import List, Dict, Any, Optional
from pydantic import BaseModel

class WorkflowNodeSchema(BaseModel):
    id: str
    type: str
    data: Dict[str, Any]

class WorkflowEdgeSchema(BaseModel):
    source: str
    target: str
    sourceHandle: Optional[str] = None

class WorkflowRunRequest(BaseModel):
    nodes: List[WorkflowNodeSchema]
    edges: List[WorkflowEdgeSchema]
    initial_inputs: Optional[Dict[str, Any]] = {}