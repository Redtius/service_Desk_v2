
from abc import ABC


class BaseNode(ABC):
    pass
  
class DecisionNode(BaseNode):
    """A node that evaluates a condition and directs the flow based on the result."""
    type: str = "decisionNode"
    condition: str = "context['some_key'] == 'some_value'"  # Example condition

    