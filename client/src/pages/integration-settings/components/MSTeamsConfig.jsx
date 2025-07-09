import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const MSTeamsConfig = () => {
  const [config, setConfig] = useState({
    tenantId: '',
    clientId: '',
    clientSecret: '',
    channelId: '',
    botName: 'CrewAI Service Bot',
    enableNotifications: true,
    notificationTypes: {
      ticketCreated: true,
      ticketUpdated: false,
      escalations: true,
      slaBreaches: true
    }
  });

  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [isTestingConnection, setIsTestingConnection] = useState(false);

  const handleInputChange = (field, value) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNotificationTypeChange = (type, value) => {
    setConfig(prev => ({
      ...prev,
      notificationTypes: {
        ...prev.notificationTypes,
        [type]: value
      }
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
    // Save configuration logic
    console.log('Saving MS Teams configuration:', config);
  };

  const resetToDefaults = () => {
    setConfig({
      tenantId: '',
      clientId: '',
      clientSecret: '',
      channelId: '',
      botName: 'CrewAI Service Bot',
      enableNotifications: true,
      notificationTypes: {
        ticketCreated: true,
        ticketUpdated: false,
        escalations: true,
        slaBreaches: true
      }
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
              <h3 className="font-medium text-text-primary">Connection Status</h3>
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

      {/* Authentication Settings */}
      <div className="bg-surface rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Authentication Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Tenant ID
            </label>
            <Input
              type="text"
              placeholder="Enter Azure AD Tenant ID"
              value={config.tenantId}
              onChange={(e) => handleInputChange('tenantId', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Client ID
            </label>
            <Input
              type="text"
              placeholder="Enter Application Client ID"
              value={config.clientId}
              onChange={(e) => handleInputChange('clientId', e.target.value)}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-text-primary mb-2">
              Client Secret
            </label>
            <Input
              type="password"
              placeholder="Enter Application Client Secret"
              value={config.clientSecret}
              onChange={(e) => handleInputChange('clientSecret', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Channel Configuration */}
      <div className="bg-surface rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Channel Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Channel ID
            </label>
            <Input
              type="text"
              placeholder="Enter MS Teams Channel ID"
              value={config.channelId}
              onChange={(e) => handleInputChange('channelId', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Bot Name
            </label>
            <Input
              type="text"
              placeholder="Enter Bot Display Name"
              value={config.botName}
              onChange={(e) => handleInputChange('botName', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-surface rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Notification Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-text-primary">
              Enable Notifications
            </label>
            <Input
              type="checkbox"
              checked={config.enableNotifications}
              onChange={(e) => handleInputChange('enableNotifications', e.target.checked)}
            />
          </div>
          
          {config.enableNotifications && (
            <div className="pl-4 space-y-3 border-l-2 border-primary-200">
              <div className="flex items-center justify-between">
                <label className="text-sm text-text-secondary">Ticket Created</label>
                <Input
                  type="checkbox"
                  checked={config.notificationTypes.ticketCreated}
                  onChange={(e) => handleNotificationTypeChange('ticketCreated', e.target.checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm text-text-secondary">Ticket Updated</label>
                <Input
                  type="checkbox"
                  checked={config.notificationTypes.ticketUpdated}
                  onChange={(e) => handleNotificationTypeChange('ticketUpdated', e.target.checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm text-text-secondary">Escalations</label>
                <Input
                  type="checkbox"
                  checked={config.notificationTypes.escalations}
                  onChange={(e) => handleNotificationTypeChange('escalations', e.target.checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm text-text-secondary">SLA Breaches</label>
                <Input
                  type="checkbox"
                  checked={config.notificationTypes.slaBreaches}
                  onChange={(e) => handleNotificationTypeChange('slaBreaches', e.target.checked)}
                />
              </div>
            </div>
          )}
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

export default MSTeamsConfig;