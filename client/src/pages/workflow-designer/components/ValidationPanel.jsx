import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ValidationPanel = ({ workflowElements, isVisible, onClose }) => {
  const [validationResults, setValidationResults] = useState([]);
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      validateWorkflow();
    }
  }, [isVisible, workflowElements]);

  const validateWorkflow = async () => {
    setIsValidating(true);
    
    // Simulate validation process
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const results = [];
    
    // Check for start node
    const hasStartNode = workflowElements.some(el => el.type === 'start');
    if (!hasStartNode) {
      results.push({
        id: 'no-start',
        type: 'error',
        message: 'Workflow must have a start node',
        suggestion: 'Add a start node from the toolbox'
      });
    }
    
    // Check for end node
    const hasEndNode = workflowElements.some(el => el.type === 'end');
    if (!hasEndNode) {
      results.push({
        id: 'no-end',
        type: 'warning',
        message: 'Workflow should have an end node',
        suggestion: 'Add an end node to properly terminate the workflow'
      });
    }
    
    // Check for orphaned elements
    const orphanedElements = workflowElements.filter(el => 
      el.type !== 'start' && el.type !== 'end' && workflowElements.length > 1
    );
    
    if (orphanedElements.length > 0) {
      results.push({
        id: 'orphaned-elements',
        type: 'warning',
        message: `${orphanedElements.length} elements may not be connected`,
        suggestion: 'Ensure all elements are properly connected in the workflow'
      });
    }
    
    // Check for decision points without conditions
    const unconfiguredDecisions = workflowElements.filter(el => 
      el.type === 'decision' && !el.conditionValue
    );
    
    if (unconfiguredDecisions.length > 0) {
      results.push({
        id: 'unconfigured-decisions',
        type: 'error',
        message: `${unconfiguredDecisions.length} decision points need configuration`,
        suggestion: 'Configure conditions for all decision points'
      });
    }
    
    // Add success message if no issues
    if (results.length === 0) {
      results.push({
        id: 'valid',
        type: 'success',
        message: 'Workflow validation passed successfully',
        suggestion: 'Your workflow is ready for testing and deployment'
      });
    }
    
    setValidationResults(results);
    setIsValidating(false);
  };

  const getValidationIcon = (type) => {
    switch (type) {
      case 'error':
        return { name: 'AlertCircle', color: 'text-error' };
      case 'warning':
        return { name: 'AlertTriangle', color: 'text-warning' };
      case 'success':
        return { name: 'CheckCircle', color: 'text-success' };
      default:
        return { name: 'Info', color: 'text-primary' };
    }
  };

  const getValidationBg = (type) => {
    switch (type) {
      case 'error':
        return 'bg-error-50 border-error-200';
      case 'warning':
        return 'bg-warning-50 border-warning-200';
      case 'success':
        return 'bg-success-50 border-success-200';
      default:
        return 'bg-primary-50 border-primary-200';
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-surface rounded-lg shadow-elevation-3 border border-border w-full max-w-2xl max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center space-x-2">
            <Icon name="CheckCircle" size={20} className="text-primary" />
            <h3 className="font-heading font-semibold text-text-primary">
              Workflow Validation
            </h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            iconName="X"
            onClick={onClose}
          />
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-96">
          {isValidating ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-text-secondary">Validating workflow...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {validationResults.map((result) => {
                const icon = getValidationIcon(result.type);
                const bgClass = getValidationBg(result.type);
                
                return (
                  <div
                    key={result.id}
                    className={`p-4 rounded-lg border ${bgClass}`}
                  >
                    <div className="flex items-start space-x-3">
                      <Icon name={icon.name} size={20} className={icon.color} />
                      <div className="flex-1">
                        <div className="font-medium text-text-primary mb-1">
                          {result.message}
                        </div>
                        <div className="text-sm text-text-secondary">
                          {result.suggestion}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-border">
          <div className="text-sm text-text-secondary">
            {validationResults.length > 0 && !isValidating && (
              <span>
                Found {validationResults.filter(r => r.type === 'error').length} errors, {' '}
                {validationResults.filter(r => r.type === 'warning').length} warnings
              </span>
            )}
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={validateWorkflow}
              iconName="RefreshCw"
              loading={isValidating}
            >
              Re-validate
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={onClose}
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ValidationPanel;