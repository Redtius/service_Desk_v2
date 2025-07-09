import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const JiraConfig = () => {
  const [config, setConfig] = useState({
    serverUrl: '',
    username: '',
    apiToken: '',
    projectKey: '',
    webhookUrl: '',
    issueTypes: ['Bug', 'Task', 'Story'],
    fieldMappings: {
      priority: 'priority',
      assignee: 'assignee',
      description: 'description',
      summary: 'summary'
    }
  });

  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [webhookEvents, setWebhookEvents] = useState({
    issueCreated: true,
    issueUpdated: true,
    issueDeleted: false,
    commentAdded: true
  });

  const handleInputChange = (field, value) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFieldMappingChange = (field, value) => {
    setConfig(prev => ({
      ...prev,
      fieldMappings: {
        ...prev.fieldMappings,
        [field]: value
      }
    }));
  };

  const handleWebhookEventChange = (event, value) => {
    setWebhookEvents(prev => ({
      ...prev,
      [event]: value
    }));
  };

  const testConnection = async () => {
    setIsTestingConnection(true);
    // Simulate API call
    setTimeout(() => {
      setConnectionStatus('connected');
      setIsTestingConnection(false);
    }, 2000);
  };

  const saveConfiguration = () => {
    console.log('Saving Jira configuration:', { config, webhookEvents });
  };

  const resetToDefaults = () => {
    setConfig({
      serverUrl: '',
      username: '',
      apiToken: '',
      projectKey: '',
      webhookUrl: '',
      issueTypes: ['Bug', 'Task', 'Story'],
      fieldMappings: {
        priority: 'priority',
        assignee: 'assignee',
        description: 'description',
        summary: 'summary'
      }
    });
    setWebhookEvents({
      issueCreated: true,
      issueUpdated: true,
      issueDeleted: false,
      commentAdded: true
    });
    setConnectionStatus('disconnected');
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'text-success';
      case 'error': return 'text-error';
      default: return 'text-text-muted';
    }
  };

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected': return 'CheckCircle';
      case 'error': return 'XCircle';
      default: return 'Circle';
    }
  };

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <div className="bg-surface-secondary rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Icon name={getStatusIcon()} size={20} className={getStatusColor()} />
            <div>
              <h3 className="font-medium text-text-primary">Jira Connection Status</h3>
              <p className="text-sm text-text-secondary capitalize">{connectionStatus}</p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={testConnection}
            loading={isTestingConnection}
            iconName="RefreshCw"
            iconPosition="left"
          >
            Test Connection
          </Button>
        </div>
      </div>

      {/* Server Configuration */}
      <div className="bg-surface rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Server Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-text-primary mb-2">
              Jira Server URL
            </label>
            <Input
              type="url"
              placeholder="https://your-domain.atlassian.net"
              value={config.serverUrl}
              onChange={(e) => handleInputChange('serverUrl', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Username/Email
            </label>
            <Input
              type="email"
              placeholder="user@company.com"
              value={config.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              API Token
            </label>
            <Input
              type="password"
              placeholder="Enter Jira API Token"
              value={config.apiToken}
              onChange={(e) => handleInputChange('apiToken', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Project Key
            </label>
            <Input
              type="text"
              placeholder="PROJ"
              value={config.projectKey}
              onChange={(e) => handleInputChange('projectKey', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Webhook Configuration */}
      <div className="bg-surface rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Webhook Configuration</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Webhook URL
            </label>
            <Input
              type="url"
              placeholder="https://your-app.com/webhooks/jira"
              value={config.webhookUrl}
              onChange={(e) => handleInputChange('webhookUrl', e.target.value)}
            />
          </div>
          
          <div>
            <h4 className="font-medium text-text-primary mb-3">Webhook Events</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center justify-between">
                <label className="text-sm text-text-secondary">Issue Created</label>
                <Input
                  type="checkbox"
                  checked={webhookEvents.issueCreated}
                  onChange={(e) => handleWebhookEventChange('issueCreated', e.target.checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm text-text-secondary">Issue Updated</label>
                <Input
                  type="checkbox"
                  checked={webhookEvents.issueUpdated}
                  onChange={(e) => handleWebhookEventChange('issueUpdated', e.target.checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm text-text-secondary">Issue Deleted</label>
                <Input
                  type="checkbox"
                  checked={webhookEvents.issueDeleted}
                  onChange={(e) => handleWebhookEventChange('issueDeleted', e.target.checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm text-text-secondary">Comment Added</label>
                <Input
                  type="checkbox"
                  checked={webhookEvents.commentAdded}
                  onChange={(e) => handleWebhookEventChange('commentAdded', e.target.checked)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Field Mapping */}
      <div className="bg-surface rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Field Mapping</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Priority Field
            </label>
            <Input
              type="text"
              placeholder="priority"
              value={config.fieldMappings.priority}
              onChange={(e) => handleFieldMappingChange('priority', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Assignee Field
            </label>
            <Input
              type="text"
              placeholder="assignee"
              value={config.fieldMappings.assignee}
              onChange={(e) => handleFieldMappingChange('assignee', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Description Field
            </label>
            <Input
              type="text"
              placeholder="description"
              value={config.fieldMappings.description}
              onChange={(e) => handleFieldMappingChange('description', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Summary Field
            </label>
            <Input
              type="text"
              placeholder="summary"
              value={config.fieldMappings.summary}
              onChange={(e) => handleFieldMappingChange('summary', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
        <Button variant="outline" onClick={resetToDefaults}>
          Reset to Defaults
        </Button>
        <Button variant="primary" onClick={saveConfiguration} iconName="Save" iconPosition="left">
          Save Configuration
        </Button>
      </div>
    </div>
  );
};

export default JiraConfig;