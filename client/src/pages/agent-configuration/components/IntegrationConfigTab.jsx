import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const IntegrationConfigTab = ({ agent, onSave, onCancel, isLoading }) => {
  const [integrations, setIntegrations] = useState(agent?.integrations || {});
  const [activeIntegration, setActiveIntegration] = useState('teams');
  const [testResults, setTestResults] = useState({});

  const availableIntegrations = [
    {
      id: 'teams',
      name: 'Microsoft Teams',
      icon: 'MessageSquare',
      description: 'Connect to Microsoft Teams channels for notifications and collaboration',
      status: integrations.teams?.enabled ? 'connected' : 'disconnected',
      fields: [
        { key: 'webhookUrl', label: 'Webhook URL', type: 'url', required: true },
        { key: 'channelId', label: 'Channel ID', type: 'text', required: true },
        { key: 'tenantId', label: 'Tenant ID', type: 'text', required: false }
      ]
    },
    {
      id: 'jira',
      name: 'Jira Service Management',
      icon: 'ExternalLink',
      description: 'Integrate with Jira for ticket management and workflow automation',
      status: integrations.jira?.enabled ? 'connected' : 'disconnected',
      fields: [
        { key: 'baseUrl', label: 'Jira Base URL', type: 'url', required: true },
        { key: 'username', label: 'Username', type: 'text', required: true },
        { key: 'apiToken', label: 'API Token', type: 'password', required: true },
        { key: 'projectKey', label: 'Project Key', type: 'text', required: true }
      ]
    },
    {
      id: 'database',
      name: 'Problems Database',
      icon: 'Database',
      description: 'Connect to existing problems database for historical data access',
      status: integrations.database?.enabled ? 'connected' : 'disconnected',
      fields: [
        { key: 'connectionString', label: 'Connection String', type: 'password', required: true },
        { key: 'tableName', label: 'Table Name', type: 'text', required: true },
        { key: 'queryTimeout', label: 'Query Timeout (seconds)', type: 'number', required: false }
      ]
    },
    {
      id: 'sla',
      name: 'SLA Configuration',
      icon: 'Clock',
      description: 'Configure SLA monitoring and compliance tracking',
      status: integrations.sla?.enabled ? 'connected' : 'disconnected',
      fields: [
        { key: 'slaFile', label: 'SLA Configuration File', type: 'file', required: true },
        { key: 'escalationThreshold', label: 'Escalation Threshold (%)', type: 'number', required: true },
        { key: 'notificationEmail', label: 'Notification Email', type: 'email', required: false }
      ]
    },
    {
      id: 'webhook',
      name: 'Custom Webhooks',
      icon: 'Webhook',
      description: 'Configure custom webhook endpoints for external system integration',
      status: integrations.webhook?.enabled ? 'connected' : 'disconnected',
      fields: [
        { key: 'endpoints', label: 'Webhook Endpoints', type: 'textarea', required: true },
        { key: 'authToken', label: 'Authentication Token', type: 'password', required: false },
        { key: 'retryAttempts', label: 'Retry Attempts', type: 'number', required: false }
      ]
    }
  ];

  const handleIntegrationChange = (integrationId, field, value) => {
    setIntegrations(prev => ({
      ...prev,
      [integrationId]: {
        ...prev[integrationId],
        [field]: value
      }
    }));
  };

  const handleToggleIntegration = (integrationId) => {
    setIntegrations(prev => ({
      ...prev,
      [integrationId]: {
        ...prev[integrationId],
        enabled: !prev[integrationId]?.enabled
      }
    }));
  };

  const handleTestConnection = async (integrationId) => {
    setTestResults(prev => ({
      ...prev,
      [integrationId]: { status: 'testing', message: 'Testing connection...' }
    }));

    // Simulate API call
    setTimeout(() => {
      const success = Math.random() > 0.3; // 70% success rate for demo
      setTestResults(prev => ({
        ...prev,
        [integrationId]: {
          status: success ? 'success' : 'error',
          message: success 
            ? 'Connection successful! Integration is working properly.' :'Connection failed. Please check your configuration settings.'
        }
      }));
    }, 2000);
  };

  const handleSave = () => {
    onSave({ integrations });
  };

  const activeIntegrationData = availableIntegrations.find(i => i.id === activeIntegration);

  return (
    <div className="space-y-6">
      {/* Integration Navigation */}
      <div className="bg-surface border border-border rounded-lg p-4">
        <div className="flex flex-wrap gap-2">
          {availableIntegrations.map(integration => (
            <button
              key={integration.id}
              onClick={() => setActiveIntegration(integration.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-smooth ${
                activeIntegration === integration.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-secondary'
              }`}
            >
              <Icon name={integration.icon} size={16} />
              <span>{integration.name}</span>
              <div className={`w-2 h-2 rounded-full ${
                integration.status === 'connected' ? 'bg-success' : 'bg-error'
              }`}></div>
            </button>
          ))}
        </div>
      </div>

      {/* Integration Configuration */}
      {activeIntegrationData && (
        <div className="bg-surface border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-primary-100 rounded-lg">
                <Icon name={activeIntegrationData.icon} size={24} className="text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-heading font-semibold text-text-primary">
                  {activeIntegrationData.name}
                </h3>
                <p className="text-sm text-text-muted">{activeIntegrationData.description}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
                activeIntegrationData.status === 'connected' ?'bg-success-50 text-success-700' :'bg-error-50 text-error-700'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  activeIntegrationData.status === 'connected' ? 'bg-success' : 'bg-error'
                }`}></div>
                <span className="capitalize">{activeIntegrationData.status}</span>
              </div>
              
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={integrations[activeIntegration]?.enabled || false}
                  onChange={() => handleToggleIntegration(activeIntegration)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>

          {/* Configuration Fields */}
          <div className="space-y-4">
            {activeIntegrationData.fields.map(field => (
              <div key={field.key}>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  {field.label} {field.required && <span className="text-error">*</span>}
                </label>
                
                {field.type === 'textarea' ? (
                  <textarea
                    value={integrations[activeIntegration]?.[field.key] || ''}
                    onChange={(e) => handleIntegrationChange(activeIntegration, field.key, e.target.value)}
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                    rows={4}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    disabled={!integrations[activeIntegration]?.enabled}
                  />
                ) : field.type === 'file' ? (
                  <div className="space-y-2">
                    <Input
                      type="file"
                      accept=".md,.txt,.json"
                      onChange={(e) => handleIntegrationChange(activeIntegration, field.key, e.target.files[0])}
                      disabled={!integrations[activeIntegration]?.enabled}
                    />
                    <p className="text-xs text-text-muted">
                      Supported formats: .md, .txt, .json
                    </p>
                  </div>
                ) : (
                  <Input
                    type={field.type}
                    value={integrations[activeIntegration]?.[field.key] || ''}
                    onChange={(e) => handleIntegrationChange(activeIntegration, field.key, e.target.value)}
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                    disabled={!integrations[activeIntegration]?.enabled}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Test Connection */}
          <div className="mt-6 p-4 bg-surface-secondary rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-text-primary">Test Connection</h4>
              <Button
                variant="outline"
                onClick={() => handleTestConnection(activeIntegration)}
                iconName="TestTube"
                disabled={!integrations[activeIntegration]?.enabled}
                loading={testResults[activeIntegration]?.status === 'testing'}
              >
                Test Connection
              </Button>
            </div>
            
            {testResults[activeIntegration] && (
              <div className={`flex items-center space-x-2 p-3 rounded-lg ${
                testResults[activeIntegration].status === 'success' ?'bg-success-50 text-success-700'
                  : testResults[activeIntegration].status === 'error' ?'bg-error-50 text-error-700' :'bg-primary-50 text-primary-700'
              }`}>
                <Icon 
                  name={
                    testResults[activeIntegration].status === 'success' ? 'CheckCircle' :
                    testResults[activeIntegration].status === 'error' ? 'XCircle' : 'Loader'
                  } 
                  size={16}
                  className={testResults[activeIntegration].status === 'testing' ? 'animate-spin' : ''}
                />
                <span className="text-sm">{testResults[activeIntegration].message}</span>
              </div>
            )}
          </div>

          {/* Integration-specific Help */}
          <div className="mt-6 p-4 bg-primary-50 rounded-lg">
            <h4 className="font-medium text-primary mb-2 flex items-center">
              <Icon name="Info" size={16} className="mr-2" />
              Configuration Help
            </h4>
            <div className="text-sm text-primary-700 space-y-2">
              {activeIntegration === 'teams' && (
                <>
                  <p>• Create a webhook in your Teams channel: Channel Settings → Connectors → Incoming Webhook</p>
                  <p>• Copy the webhook URL and paste it in the Webhook URL field</p>
                  <p>• Channel ID can be found in the Teams channel URL</p>
                </>
              )}
              {activeIntegration === 'jira' && (
                <>
                  <p>• Generate an API token from your Atlassian account settings</p>
                  <p>• Use your email address as the username</p>
                  <p>• Project key is the short identifier for your Jira project</p>
                </>
              )}
              {activeIntegration === 'database' && (
                <>
                  <p>• Use standard database connection string format</p>
                  <p>• Ensure the database user has read permissions</p>
                  <p>• Test the connection before saving</p>
                </>
              )}
              {activeIntegration === 'sla' && (
                <>
                  <p>• Upload your SLA configuration file in Markdown format</p>
                  <p>• Escalation threshold determines when to escalate based on SLA breach risk</p>
                  <p>• Notification email will receive SLA breach alerts</p>
                </>
              )}
              {activeIntegration === 'webhook' && (
                <>
                  <p>• Enter one webhook URL per line</p>
                  <p>• Authentication token will be sent in the Authorization header</p>
                  <p>• Configure retry attempts for failed webhook calls</p>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Integration Summary */}
      <div className="bg-surface border border-border rounded-lg p-6">
        <h3 className="text-lg font-heading font-semibold text-text-primary mb-4 flex items-center">
          <Icon name="Activity" size={20} className="mr-2" />
          Integration Summary
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableIntegrations.map(integration => (
            <div key={integration.id} className="p-4 border border-border rounded-lg">
              <div className="flex items-center space-x-3 mb-2">
                <Icon name={integration.icon} size={20} className="text-text-muted" />
                <h4 className="font-medium text-text-primary">{integration.name}</h4>
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-sm ${
                  integrations[integration.id]?.enabled ? 'text-success' : 'text-text-muted'
                }`}>
                  {integrations[integration.id]?.enabled ? 'Enabled' : 'Disabled'}
                </span>
                <div className={`w-2 h-2 rounded-full ${
                  integration.status === 'connected' ? 'bg-success' : 'bg-error'
                }`}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end space-x-4 pt-6 border-t border-border">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave} loading={isLoading} iconName="Save">
          Save Integration Settings
        </Button>
      </div>
    </div>
  );
};

export default IntegrationConfigTab;