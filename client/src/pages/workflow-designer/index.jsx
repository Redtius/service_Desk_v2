import React, { useState } from 'react';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import ToolboxPanel from './components/ToolboxPanel';
import WorkflowCanvas from './components/WorkflowCanvas';
import PropertiesPanel from './components/PropertiesPanel';
import WorkflowToolbar from './components/WorkflowToolbar';
import ValidationPanel from './components/ValidationPanel';
import { createWorkflow, executeWorkflow } from '../../api/workflows';

const WorkflowDesigner = () => {
  const [selectedElement, setSelectedElement] = useState(null);
  const [workflowElements, setWorkflowElements] = useState([]);
  const [isValidationVisible, setIsValidationVisible] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const handleElementSelect = (element) => {
    setSelectedElement(element);
  };

  const handleElementAdd = (element) => {
    setWorkflowElements(prev => [...prev, element]);
  };

  const handleElementUpdate = (updatedElement) => {
    setWorkflowElements(prev => 
      prev.map(el => el.id === updatedElement.id ? updatedElement : el)
    );
    setSelectedElement(updatedElement);
  };

  const handleSaveWorkflow = async () => {
    console.log('Saving workflow...', workflowElements);
    try {
      await createWorkflow({ name: 'Untitled Workflow', graph_json: JSON.stringify({ nodes: workflowElements }) });
      // Optionally notify user of success
    } catch (error) {
      console.error('Error saving workflow:', error);
    }
  };

  const handleTestWorkflow = async () => {
    console.log('Testing workflow...', workflowElements);
    try {
      const payload = { graph_json: JSON.stringify({ nodes: workflowElements }) };
      const response = await executeWorkflow(payload);
      setTestResult(response.data);
    } catch (error) {
      console.error('Error executing workflow:', error);
      setTestResult({ error: error.toString() });
    }
    setIsValidationVisible(true);
  };

  const handleExportWorkflow = () => {
    const workflowData = {
      elements: workflowElements,
      metadata: {
        name: 'Untitled Workflow',
        version: '1.0.0',
        created: new Date().toISOString()
      }
    };
    
    const blob = new Blob([JSON.stringify(workflowData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'workflow.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportWorkflow = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const workflowData = JSON.parse(e.target.result);
            setWorkflowElements(workflowData.elements || []);
            setSelectedElement(null);
          } catch (error) {
            console.error('Error importing workflow:', error);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleClearCanvas = () => {
    if (window.confirm('Are you sure you want to clear the canvas? This action cannot be undone.')) {
      setWorkflowElements([]);
      setSelectedElement(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-15">
        {/* Page Header */}
        <div className="bg-surface border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <Breadcrumb />
              <h1 className="text-2xl font-heading font-semibold text-text-primary mt-2">
                Workflow Designer
              </h1>
              <p className="text-text-secondary mt-1">
                Create and configure agent interaction flows with visual drag-and-drop interface
              </p>
            </div>
          </div>
        </div>

        {/* Workflow Toolbar */}
        <WorkflowToolbar
          onSave={handleSaveWorkflow}
          onTest={handleTestWorkflow}
          onExport={handleExportWorkflow}
          onImport={handleImportWorkflow}
          onClear={handleClearCanvas}
        />

        {/* Main Workspace */}
        <div className="flex h-[calc(100vh-180px)]">
          {/* Left Panel - Toolbox */}
          <div className="w-80 flex-shrink-0">
            <ToolboxPanel />
          </div>

          {/* Center Panel - Canvas */}
          <div className="flex-1">
            <WorkflowCanvas
              selectedElement={selectedElement}
              onElementSelect={handleElementSelect}
              onElementAdd={handleElementAdd}
            />
          </div>

          {/* Right Panel - Properties */}
          <div className="w-80 flex-shrink-0">
            <PropertiesPanel
              selectedElement={selectedElement}
              onElementUpdate={handleElementUpdate}
            />
          </div>
        </div>

        {/* Validation Modal */}
        <ValidationPanel
          workflowElements={workflowElements}
          testResult={testResult}
          isVisible={isValidationVisible}
          onClose={() => setIsValidationVisible(false)}
        />
      </div>
    </div>
  );
};

export default WorkflowDesigner;