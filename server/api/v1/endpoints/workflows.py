from typing import List, Any, Dict
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from db.session import get_session
from db.models import WorkflowDefinition,User
from api.v1.schemas.workflow import (
    WorkflowDefinitionCreate,
    WorkflowDefinitionRead,
    WorkflowDefinitionUpdate,
)
from core.dependencies import get_current_active_user, get_current_active_admin
from crewai import Crew, Task
from node_factory import NodeFactory
from api.v1.schemas.workflow import WorkflowRunRequest
from services.workflow.workflow import WorkflowManager

router = APIRouter()

@router.post("/", response_model=WorkflowDefinitionRead, status_code=status.HTTP_201_CREATED)
def create_workflow(
    wf_in: WorkflowDefinitionCreate,
    session: Session = Depends(get_session),
    _: None = Depends(get_current_active_admin),
):
    wf = WorkflowDefinition(name=wf_in.name, graph_json=wf_in.graph_json)
    session.add(wf)
    session.commit()
    session.refresh(wf)
    return wf

@router.get("/", response_model=List[WorkflowDefinitionRead])
def read_workflows(
    session: Session = Depends(get_session),
    _: None = Depends(get_current_active_admin),
):
    workflows = session.exec(select(WorkflowDefinition)).all()
    return workflows

@router.get("/{workflow_id}", response_model=WorkflowDefinitionRead)
def read_workflow(
    workflow_id: int,
    session: Session = Depends(get_session),
    _: None = Depends(get_current_active_admin),
):
    wf = session.get(WorkflowDefinition, workflow_id)
    if not wf:
        raise HTTPException(status_code=404, detail="Workflow not found")
    return wf

@router.put("/{workflow_id}", response_model=WorkflowDefinitionRead)
def update_workflow(
    workflow_id: int,
    wf_update: WorkflowDefinitionUpdate,
    session: Session = Depends(get_session),
    _: None = Depends(get_current_active_admin),
):
    wf = session.get(WorkflowDefinition, workflow_id)
    if not wf:
        raise HTTPException(status_code=404, detail="Workflow not found")
    data = wf_update.dict(exclude_unset=True)
    for key, val in data.items():
        setattr(wf, key, val)
    session.add(wf)
    session.commit()
    session.refresh(wf)
    return wf

@router.delete("/{workflow_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_workflow(
    workflow_id: int,
    session: Session = Depends(get_session),
    _: None = Depends(get_current_active_admin),
):
    wf = session.get(WorkflowDefinition, workflow_id)
    if not wf:
        raise HTTPException(status_code=404, detail="Workflow not found")
    session.delete(wf)
    session.commit()
    return None

@router.post("/execute", response_model=dict[str, Any], status_code=status.HTTP_200_OK)
def execute_workflow(
    payload: dict[str, Any],
    current_user: User = Depends(get_current_active_user),
):
    """
    Execute a workflow definition provided in request body via CrewAI orchestration.
    Expects JSON: { "graph_json": "<workflow graph JSON string>" }
    """
    import json
    graph_json = payload.get("graph_json")
    if not graph_json:
        raise HTTPException(status_code=400, detail="graph_json is required")
    data = json.loads(graph_json)
    # Parse nodes and flows
    elements = data.get("nodes", [])
    flows = data.get("flows", [])
    # Separate nodes by type
    start_elem = next((e for e in elements if e.get("type") == "start"), None)
    end_elem = next((e for e in elements if e.get("type") == "end"), None)
    if not start_elem or not end_elem:
        raise HTTPException(status_code=400, detail="Workflow must include start and end nodes")
    start_node = NodeFactory.from_json(start_elem)
    end_node = NodeFactory.from_json(end_elem)
    agent_elems = [e for e in elements if e.get("type") == "agent"]
    task_elems = [e for e in elements if e.get("type") == "task"]
    agent_nodes = [NodeFactory.from_json(e) for e in agent_elems]
    task_nodes = [NodeFactory.from_json(e) for e in task_elems]
    # Build and run workflow
    from services.workflow.workflow import CrewWorkflow
    workflow = CrewWorkflow(
        start_node=start_node,
        end_node=end_node,
        agent_nodes=agent_nodes,
        task_nodes=task_nodes
    )
    # Initialize inputs with user_id and additional payload data
    inputs = {"user_id": current_user.id}
    for k, v in payload.items():
        if k != "graph_json":
            inputs[k] = v
    result = workflow.run(inputs, flows)
    return {"result": result, "flows": flows}

# Ad-hoc workflow execution without persistence
@router.post("/run", response_model=Dict[str, Any], status_code=status.HTTP_200_OK)
def run_workflow(
    run_in: WorkflowRunRequest,
):
    """
    Execute an ad-hoc workflow from nodes/edges without persisting definition.
    """
    wm = WorkflowManager(
        nodes_data=[node.dict() for node in run_in.nodes],
        edges_data=[edge.dict() for edge in run_in.edges],
    )
    result = wm.run(initial_inputs=run_in.initial_inputs)
    return result