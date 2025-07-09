from pprint import pprint
from dotenv import load_dotenv
from workflow import WorkflowManager

load_dotenv()

def define_sla_verification_workflow():
    """
    Defines a workflow where an agent verifies a support ticket against an SLA document.
    """
    return {
      "nodes": [
        { "id": "input-ticket", "type": "inputNode", "data": { "label": "Support Ticket" } },
        { 
          "id": "agent-verifier", "type": "automationAgent", "role": "SLA Verification Specialist", 
          "goal": "Analyze a support ticket against the official SLA document and decide if it's in scope. Provide a clear reason for the decision.",
          "backstory": "You are a meticulous AI assistant. Your sole purpose is to enforce the Service Level Agreement without deviation. You always read the 'SLA.md' file to make your decision.",
          "tools": ["file_read_tool"]
        },
        { 
          "id": "action-verify", "type": "actionBlock", "agent_id": "agent-verifier", 
          "description": "Read the document at 'SLA.md'. Analyze the user issue: '{issue_description}'",
          "expected_output": """A JSON object with "decision" ('accept'/'reject') and "reason" (a sentence)."""
        },
        
        # CORRECTED AND SIMPLIFIED
        { 
          "id": "decision-is-accepted", "type": "decisionPoint", 
          "condition": "context['output_action-verify']['decision'] == 'accept'"
        },
        
        # CORRECTED AND SIMPLIFIED
        { 
          "id": "output-accepted", "type": "outputNode", "data": { "label": "Ticket Accepted" }, 
          "outputs": [
            {"name": "status", "value": "Accepted"},
            {"name": "justification", "value": "{output_action-verify[reason]}"}
          ]
        },
        # CORRECTED AND SIMPLIFIED
        { 
          "id": "output-rejected", "type": "outputNode", "data": { "label": "Ticket Rejected" }, 
          "outputs": [
            {"name": "status", "value": "Rejected"},
            {"name": "justification", "value": "{output_action-verify[reason]}"}
          ]
        }
      ],
      "edges": [
        { "id": "e-input-action", "source": "input-ticket", "target": "action-verify" },
        { "id": "e-action-decision", "source": "action-verify", "target": "decision-is-accepted" },
        { "id": "e-decision-true", "source": "decision-is-accepted", "target": "output-accepted", "sourceHandle": "true" },
        { "id": "e-decision-false", "source": "decision-is-accepted", "target": "output-rejected", "sourceHandle": "false" }
      ],
      "inputs": {
        "issue_description": "I can't log in to my account, I think I need my password reset."
      }
    }


if __name__ == "__main__":
    print("--- Defining SLA Verification Workflow ---")
    sample_workflow = define_sla_verification_workflow()
    print("Workflow defined for issue:", sample_workflow["inputs"]["issue_description"])
    print("-" * 25)

    try:
        print("\n--- Initializing Workflow Manager ---")
        manager = WorkflowManager(
            nodes_data=sample_workflow["nodes"],
            edges_data=sample_workflow["edges"]
        )
        print("Workflow Manager initialized successfully.")
        print("-" * 25)

        print("\n--- Running Workflow ---")
        final_result = manager.run(initial_inputs=sample_workflow["inputs"])
        print("-" * 25)

        print("\n--- Workflow Execution Finished ---")
        print("Final Result:")
        pprint(final_result)

    except Exception as e:
        print(f"\n--- An Error Occurred ---")
        import traceback
        traceback.print_exc()