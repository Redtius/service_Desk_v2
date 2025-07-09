import logging
import json # <-- Make sure json is imported at the top
from typing import Any, Dict, List
from crewai import Crew, Process, Task
from nodes import (
    # Make sure your imports match the nodes you are using
    NODE_REGISTRY, BaseNode, InputNode, OutputNode, ActionBlockNode,
    AutomationAgentNode, DecisionPointNode, RoomCreationNode, EscalationTriggerNode,
    DocumentVerificationNode
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

class WorkflowManager:
    def __init__(self, nodes_data: List[Dict], edges_data: List[Dict]):
        self.nodes: Dict[str, BaseNode] = self._load_nodes(nodes_data)
        self.context: Dict[str, Any] = {}

        # The 'edges' are the core of the workflow's structure.
        self.edges: Dict[str, List[Dict]] = self._build_edge_map(edges_data)
        
        # CORRECTED: The workflow now starts with an 'inputNode'.
        self.input_node_id = self._find_node_by_type("inputNode")
        
        self.agents = {
            node.id: node.to_crewai_agent()
            for node in self.nodes.values() if isinstance(node, AutomationAgentNode)
        }

    def _load_nodes(self, nodes_data: List[Dict]) -> Dict[str, BaseNode]:
        loaded_nodes = {}
        for node_data in nodes_data:
            node_type = node_data.get("type")
            node_class = NODE_REGISTRY.get(node_type)
            if not node_class: raise ValueError(f"Unknown node type: {node_type}")
            combined_data = {**node_data, **node_data.get('data', {})}
            loaded_nodes[node_data['id']] = node_class(**combined_data)
        return loaded_nodes

    def _build_edge_map(self, edges_data: List[Dict]) -> Dict[str, List[Dict]]:
        edge_map = {}
        for edge in edges_data:
            source_id = edge['source']
            if source_id not in edge_map:
                edge_map[source_id] = []
            edge_map[source_id].append(edge)
        return edge_map

    def _find_node_by_type(self, node_type: str) -> str:
        for node_id, node in self.nodes.items():
            if node.type == node_type: return node_id
        raise ValueError(f"Workflow is missing a '{node_type}'")

    def _find_next_node_id(self, source_node_id: str, source_handle: str = None) -> str | None:
        connections = self.edges.get(source_node_id, [])
        if not connections:
            return None
        
        if source_handle:
            for edge in connections:
                if edge.get('sourceHandle') == source_handle:
                    return edge['target']
            return None
        else:
            return connections[0]['target']

    def run(self, initial_inputs: Dict[str, Any] = None) -> Dict[str, Any]:
        """Executes the workflow by traversing the graph from the InputNode."""
        if not self.input_node_id:
            return {"status": "error", "message": "Input node not found."}

        self.context = initial_inputs or {}
        current_node_id = self.input_node_id
        
        # CORRECTED: The loop now correctly terminates when it reaches an OutputNode.
        while current_node_id and not isinstance(self.nodes.get(current_node_id), OutputNode):
            node = self.nodes.get(current_node_id)
            logging.info(f"Executing node: {node.id} (Type: {node.type})")
            
            next_node_id = self._find_next_node_id(current_node_id)

            # --- NODE EXECUTION LOGIC ---
            if isinstance(node, InputNode):
                pass

                        # =================== THIS IS THE UPDATED SECTION ===================
            elif isinstance(node, ActionBlockNode):
                agent = self.agents.get(node.agent_id)
                if not agent: raise ValueError(f"Agent '{node.agent_id}' not found")
                
                task = Task(description=node.description.format(**self.context),
                            expected_output=node.expected_output.format(**self.context),
                            agent=agent)
                crew = Crew(agents=[agent], tasks=[task], process=Process.sequential)
                result = crew.kickoff()
                
                # Try to parse the output as JSON. If it fails, use the raw string.
                try:
                    parsed_output = json.loads(result.raw)
                    self.context[f"output_{node.id}"] = parsed_output
                    logging.info(f"Action result for '{node.id}' (JSON) stored in context.")
                except json.JSONDecodeError:
                    self.context[f"output_{node.id}"] = result.raw
                    logging.info(f"Action result for '{node.id}' (Raw Text) stored in context.")
            # ===================================================================
            
            elif isinstance(node, DecisionPointNode):
                try:
                    # CORRECTED: Pass the 'json' module to eval's context
                    result = eval(node.condition, {"json": json}, {"context": self.context})
                    logging.info(f"Decision '{node.condition}' evaluated to: {result}")
                except Exception as e:
                    logging.error(f"Error evaluating condition '{node.condition}': {e}")
                    result = False
                
                handle_id = 'true' if result else 'false'
                next_node_id = self._find_next_node_id(current_node_id, handle_id)

            elif isinstance(node, DocumentVerificationNode):
                doc_path = node.document_path.format(**self.context)
                prompt = node.verification_prompt
                logging.info(f"SIMULATING verification for '{doc_path}' with prompt: '{prompt}'")
                result = 'signature' in prompt.lower()
                self.context[f"output_{node.id}"] = {"verified": result, "document": doc_path}
                handle_id = 'true' if result else 'false'
                next_node_id = self._find_next_node_id(current_node_id, handle_id)

            elif isinstance(node, RoomCreationNode):
                room_name = node.room_name.format(**self.context)
                self.context[f"output_{node.id}"] = {"status": "created", "room_name": room_name}

            elif isinstance(node, EscalationTriggerNode):
                reason = node.reason.format(**self.context)
                self.context['escalation_reason'] = reason

            current_node_id = next_node_id
            if not current_node_id:
                logging.warning("Workflow path terminated unexpectedly.")
                break
        
        if current_node_id and isinstance(self.nodes.get(current_node_id), OutputNode):
            final_output_node = self.nodes.get(current_node_id)
            logging.info(f"Reached Output Node: {final_output_node.id}")
            final_data = {}
            for output_def in final_output_node.outputs:
                output_name = output_def.get("name")
                value_template = output_def.get("value")
                if output_name and value_template:
                    try:
                        # CORRECTED: No need for json here anymore.
                        final_data[output_name] = value_template.format(**self.context)
                    except KeyError as e:
                        final_data[output_name] = None
            
            return {"status": "completed", "output": final_data}
        else:
            return {"status": "terminated", "final_context": self.context}