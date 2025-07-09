# nodes.py

from typing import Any, Dict, List, Literal, Type
from pydantic import BaseModel, Field
from crewai import Agent, Task
from crewai_tools import SerperDevTool, FileReadTool

# ----------------- NODE REGISTRY AND BASE CLASSES -----------------

NODE_REGISTRY: Dict[str, Type["BaseNode"]] = {}

def register_node(cls: Type["BaseNode"]):
    """A decorator to register node classes by their type literal."""
    node_type = cls.model_fields['type'].default
    NODE_REGISTRY[node_type] = cls
    return cls

class BaseNode(BaseModel):
    """The base class for all nodes in the workflow."""
    id: str
    type: str
    data: Dict[str, Any] = Field(default_factory=dict)

# ----------------- CORE WORKFLOW NODES -----------------

@register_node
class StartNode(BaseNode):
    type: Literal["startNode"] = "startNode"
    data: Dict[str, Any] = {"label": "Start Node"}

@register_node
class EndNode(BaseNode):
    type: Literal["endNode"] = "endNode"
    data: Dict[str, Any] = {"label": "End Node"}


@register_node
class InputNode(BaseNode):
    """Defines the starting point and initial data for the workflow."""
    type: Literal["inputNode"] = "inputNode"
    inputs: List[Dict[str, str]] = Field(default_factory=list, description="Defines the schema for initial data.")

@register_node
class OutputNode(BaseNode):
    """Defines an end point and shapes the final output of the workflow."""
    type: Literal["outputNode"] = "outputNode"
    outputs: List[Dict[str, str]] = Field(default_factory=list, description="Defines which context variables to return.")

@register_node
class DecisionPointNode(BaseNode):
    """Evaluates a condition and directs the flow to a 'true' or 'false' path."""
    type: Literal["decisionPoint"] = "decisionPoint"
    condition: str = Field(description="Python expression to evaluate against the context.")

# ----------------- ACTION & AGENT NODES -----------------

@register_node
class ActionBlockNode(BaseNode):
    """A node that executes a CrewAI Task using a defined agent."""
    type: Literal["actionBlock"] = "actionBlock"
    description: str
    expected_output: str
    agent_id: str

@register_node
class AutomationAgentNode(BaseNode):
    """A node representing a configurable AI agent."""
    type: Literal["automationAgent"] = "automationAgent"
    role: str
    goal: str
    backstory: str
    
    def to_crewai_agent(self) -> Agent:
        """Converts the node data to a CrewAI Agent object."""
        return Agent(
            role=self.role,
            goal=self.goal,
            backstory=self.backstory,
            verbose=True,
            allow_delegation=False,
            tools=[SerperDevTool(), FileReadTool()],
        )

# ----------------- CUSTOM LOGIC NODES -----------------

@register_node
class RoomCreationNode(BaseNode):
    """A custom action node to create a support chat room."""
    type: Literal["roomCreation"] = "roomCreation"
    room_name: str

@register_node
class EscalationTriggerNode(BaseNode):
    """A node that signifies escalation to a human."""
    type: Literal["escalationTrigger"] = "escalationTrigger"
    reason: str

@register_node
class DocumentVerificationNode(BaseNode):
    """
    NEW: A specialized node to simulate document verification.
    This node will also have 'true' and 'false' output edges.
    """
    type: Literal["documentVerification"] = "documentVerification"
    document_path: str = Field(description="Path to the document to verify. Can use context variables like {key}.")
    verification_prompt: str = Field(description="The check to perform on the document, e.g., 'contains signature'.")