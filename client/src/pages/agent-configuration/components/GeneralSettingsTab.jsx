import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const GeneralSettingsTab = ({ agent, onSave, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    name: agent?.name || '',
    description: agent?.description || '',
    type: agent?.type || 'standard',
    priority: agent?.priority || 'medium',
    maxConcurrentTasks: agent?.maxConcurrentTasks || 5,
    timeout: agent?.timeout || 30,
    retryAttempts: agent?.retryAttempts || 3,
    tags: agent?.tags || [],
    isEnabled: agent?.isEnabled !== false,
    autoStart: agent?.autoStart || false,
    logLevel: agent?.logLevel || 'info'
  });

  const [errors, setErrors] = useState({});
  const [newTag, setNewTag] = useState('');

  const agentTypes = [
    { value: 'standard', label: 'Standard Agent', description: 'General purpose automation agent' },
    { value: 'specialized', label: 'Specialized Agent', description: 'Task-specific agent with custom capabilities' },
    { value: 'coordinator', label: 'Coordinator Agent', description: 'Manages and coordinates other agents' },
    { value: 'monitor', label: 'Monitor Agent', description: 'Monitors system status and performance' }
  ];

  const priorityLevels = [
    { value: 'low', label: 'Low', color: 'text-text-muted' },
    { value: 'medium', label: 'Medium', color: 'text-accent' },
    { value: 'high', label: 'High', color: 'text-warning' },
    { value: 'critical', label: 'Critical', color: 'text-error' }
  ];

  const logLevels = [
    { value: 'debug', label: 'Debug' },
    { value: 'info', label: 'Info' },
    { value: 'warn', label: 'Warning' },
    { value: 'error', label: 'Error' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Agent name is required';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Agent name must be at least 3 characters';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }
    
    if (formData.maxConcurrentTasks < 1 || formData.maxConcurrentTasks > 100) {
      newErrors.maxConcurrentTasks = 'Must be between 1 and 100';
    }
    
    if (formData.timeout < 5 || formData.timeout > 300) {
      newErrors.timeout = 'Must be between 5 and 300 seconds';
    }
    
    if (formData.retryAttempts < 0 || formData.retryAttempts > 10) {
      newErrors.retryAttempts = 'Must be between 0 and 10';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(formData);
    }
  };

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="bg-surface border border-border rounded-lg p-6">
        <h3 className="text-lg font-heading font-semibold text-text-primary mb-4 flex items-center">
          <Icon name="Info" size={20} className="mr-2" />
          Basic Information
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Agent Name *
              </label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter agent name"
                className={errors.name ? 'border-error' : ''}
              />
              {errors.name && (
                <p className="text-sm text-error mt-1 flex items-center">
                  <Icon name="AlertCircle" size={14} className="mr-1" />
                  {errors.name}
                </p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Agent Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {agentTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              <p className="text-sm text-text-muted mt-1">
                {agentTypes.find(t => t.value === formData.type)?.description}
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Priority Level
              </label>
              <select
                value={formData.priority}
                onChange={(e) => handleInputChange('priority', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {priorityLevels.map(level => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe the agent's purpose and functionality"
                rows={4}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none ${
                  errors.description ? 'border-error' : 'border-border'
                }`}
              />
              {errors.description && (
                <p className="text-sm text-error mt-1 flex items-center">
                  <Icon name="AlertCircle" size={14} className="mr-1" />
                  {errors.description}
                </p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Tags
              </label>
              <div className="flex space-x-2 mb-2">
                <Input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add tag"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                />
                <Button variant="outline" onClick={handleAddTag} iconName="Plus" />
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 bg-primary-50 text-primary text-sm rounded-full"
                  >
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-2 hover:text-primary-700"
                    >
                      <Icon name="X" size={12} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Settings */}
      <div className="bg-surface border border-border rounded-lg p-6">
        <h3 className="text-lg font-heading font-semibold text-text-primary mb-4 flex items-center">
          <Icon name="Gauge" size={20} className="mr-2" />
          Performance Settings
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Max Concurrent Tasks
            </label>
            <Input
              type="number"
              value={formData.maxConcurrentTasks}
              onChange={(e) => handleInputChange('maxConcurrentTasks', parseInt(e.target.value))}
              min="1"
              max="100"
              className={errors.maxConcurrentTasks ? 'border-error' : ''}
            />
            {errors.maxConcurrentTasks && (
              <p className="text-sm text-error mt-1">{errors.maxConcurrentTasks}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Timeout (seconds)
            </label>
            <Input
              type="number"
              value={formData.timeout}
              onChange={(e) => handleInputChange('timeout', parseInt(e.target.value))}
              min="5"
              max="300"
              className={errors.timeout ? 'border-error' : ''}
            />
            {errors.timeout && (
              <p className="text-sm text-error mt-1">{errors.timeout}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Retry Attempts
            </label>
            <Input
              type="number"
              value={formData.retryAttempts}
              onChange={(e) => handleInputChange('retryAttempts', parseInt(e.target.value))}
              min="0"
              max="10"
              className={errors.retryAttempts ? 'border-error' : ''}
            />
            {errors.retryAttempts && (
              <p className="text-sm text-error mt-1">{errors.retryAttempts}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Log Level
            </label>
            <select
              value={formData.logLevel}
              onChange={(e) => handleInputChange('logLevel', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {logLevels.map(level => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Agent Status */}
      <div className="bg-surface border border-border rounded-lg p-6">
        <h3 className="text-lg font-heading font-semibold text-text-primary mb-4 flex items-center">
          <Icon name="Settings" size={20} className="mr-2" />
          Agent Status & Behavior
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-surface-secondary rounded-lg">
            <div>
              <h4 className="font-medium text-text-primary">Enable Agent</h4>
              <p className="text-sm text-text-muted">Allow this agent to process tasks</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isEnabled}
                onChange={(e) => handleInputChange('isEnabled', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-surface-secondary rounded-lg">
            <div>
              <h4 className="font-medium text-text-primary">Auto Start</h4>
              <p className="text-sm text-text-muted">Automatically start agent when system boots</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.autoStart}
                onChange={(e) => handleInputChange('autoStart', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end space-x-4 pt-6 border-t border-border">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="secondary" onClick={handleSave} iconName="TestTube">
          Save & Test
        </Button>
        <Button variant="primary" onClick={handleSave} loading={isLoading} iconName="Save">
          Save Configuration
        </Button>
      </div>
    </div>
  );
};

export default GeneralSettingsTab;