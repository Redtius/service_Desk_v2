import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { agentPresets } from '../../../config/agentPresets';

const PropertiesPanel = ({ selectedElement, onElementUpdate }) => {
  const [elementConfig, setElementConfig] = useState(selectedElement || {});

  const handleConfigChange = (field, value) => {
    const updatedConfig = { ...elementConfig, [field]: value };
    setElementConfig(updatedConfig);
    onElementUpdate && onElementUpdate(updatedConfig);
  };

  const handleParamsChange = (paramField, value) => {
    const updatedParams = { ...(elementConfig.params || {}), [paramField]: value };
    handleConfigChange('params', updatedParams);
  };

  const renderElementProperties = () => {
    if (!selectedElement) {
      return (
        <div className="text-center py-8">
          <Icon name="MousePointer" size={32} className="text-text-muted mx-auto mb-3" />
          <h4 className="font-medium text-text-primary mb-2">No Element Selected</h4>
          <p className="text-sm text-text-secondary">
            Click on a workflow element to configure its properties
          </p>
        </div>
      );
    }

    const commonProperties = (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Element Name
          </label>
          <Input
            type="text"
            value={elementConfig.name || ''}
            onChange={(e) => handleConfigChange('name', e.target.value)}
            placeholder="Enter element name"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Description
          </label>
          <textarea
            className="w-full p-3 border border-border rounded-lg resize-none focus:ring-2 focus:ring-primary focus:border-transparent"
            rows="3"
            value={elementConfig.description || ''}
            onChange={(e) => handleConfigChange('description', e.target.value)}
            placeholder="Describe this element's purpose"
          />
        </div>
      </div>
    );

    switch (selectedElement.type) {
      case 'agent':
        return (
          <div className="space-y-6">
            {commonProperties}
            <div className="border-t border-border pt-4">
              <h5 className="font-medium text-text-primary mb-3">Agent Preset</h5>
              <select
                className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                value={elementConfig.params?.agentPresetKey || ''}
                onChange={(e) => handleParamsChange('agentPresetKey', e.target.value)}
              >
                <option value="">Select agent</option>
                {agentPresets.map(p => (
                  <option key={p.key} value={p.key}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        );
      case 'decision':
        return (
          <div className="space-y-6">
            {commonProperties}
            <div className="border-t border-border pt-4">
              <h5 className="font-medium text-text-primary mb-3">Decision Logic</h5>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Condition Type
                  </label>
                  <select
                    className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={elementConfig.conditionType || 'field-comparison'}
                    onChange={(e) => handleConfigChange('conditionType', e.target.value)}
                  >
                    <option value="field-comparison">Field Comparison</option>
                    <option value="time-based">Time Based</option>
                    <option value="priority-level">Priority Level</option>
                    <option value="custom-rule">Custom Rule</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Condition Value
                  </label>
                  <Input
                    type="text"
                    value={elementConfig.conditionValue || ''}
                    onChange={(e) => handleConfigChange('conditionValue', e.target.value)}
                    placeholder="Enter condition value"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'action':
        return (
          <div className="space-y-6">
            {commonProperties}
            <div className="border-t border-border pt-4">
              <h5 className="font-medium text-text-primary mb-3">Action Configuration</h5>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Action Type
                  </label>
                  <select
                    className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={elementConfig.actionType || 'send-notification'}
                    onChange={(e) => handleConfigChange('actionType', e.target.value)}
                  >
                    <option value="send-notification">Send Notification</option>
                    <option value="update-ticket">Update Ticket</option>
                    <option value="assign-agent">Assign Agent</option>
                    <option value="create-task">Create Task</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Target
                  </label>
                  <Input
                    type="text"
                    value={elementConfig.target || ''}
                    onChange={(e) => handleConfigChange('target', e.target.value)}
                    placeholder="Enter target (email, agent, etc.)"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'escalation':
        return (
          <div className="space-y-6">
            {commonProperties}
            <div className="border-t border-border pt-4">
              <h5 className="font-medium text-text-primary mb-3">Escalation Settings</h5>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Escalation Level
                  </label>
                  <select
                    className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={elementConfig.escalationLevel || 'level-1'}
                    onChange={(e) => handleConfigChange('escalationLevel', e.target.value)}
                  >
                    <option value="level-1">Level 1 Support</option>
                    <option value="level-2">Level 2 Support</option>
                    <option value="level-3">Level 3 Support</option>
                    <option value="manager">Manager</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Timeout (minutes)
                  </label>
                  <Input
                    type="number"
                    value={elementConfig.timeout || '30'}
                    onChange={(e) => handleConfigChange('timeout', e.target.value)}
                    placeholder="30"
                    min="1"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'delay':
        return (
          <div className="space-y-6">
            {commonProperties}
            <div className="border-t border-border pt-4">
              <h5 className="font-medium text-text-primary mb-3">Delay Configuration</h5>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Delay Duration
                  </label>
                  <div className="flex space-x-2">
                    <Input
                      type="number"
                      value={elementConfig.delayValue || '5'}
                      onChange={(e) => handleConfigChange('delayValue', e.target.value)}
                      placeholder="5"
                      min="1"
                      className="flex-1"
                    />
                    <select
                      className="px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      value={elementConfig.delayUnit || 'minutes'}
                      onChange={(e) => handleConfigChange('delayUnit', e.target.value)}
                    >
                      <option value="seconds">Seconds</option>
                      <option value="minutes">Minutes</option>
                      <option value="hours">Hours</option>
                      <option value="days">Days</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return commonProperties;
    }
  };

  return (
    <div className="w-full h-full bg-surface border-l border-border overflow-y-auto">
      <div className="p-4">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="Settings" size={20} className="text-primary" />
          <h3 className="font-heading font-semibold text-text-primary">Properties</h3>
        </div>
        
        {renderElementProperties()}
        
        {selectedElement && (
          <div className="mt-6 pt-4 border-t border-border">
            <div className="flex space-x-2">
              <Button
                variant="primary"
                size="sm"
                onClick={() => console.log('Save element config')}
                className="flex-1"
              >
                Save Changes
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => console.log('Delete element')}
                iconName="Trash2"
              />
            </div>
          </div>
        )}
        
        <div className="mt-4 p-3 bg-surface-secondary rounded-lg">
          <div className="flex items-start space-x-2">
            <Icon name="Info" size={16} className="text-primary mt-0.5" />
            <div className="text-xs text-text-secondary">
              <p className="font-medium mb-1">Configuration Tips:</p>
              <ul className="space-y-1">
                <li>• Use descriptive names for better workflow clarity</li>
                <li>• Test conditions before deploying</li>
                <li>• Set appropriate timeouts for escalations</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertiesPanel;