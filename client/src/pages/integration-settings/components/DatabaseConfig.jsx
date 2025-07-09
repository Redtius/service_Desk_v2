import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const DatabaseConfig = () => {
  const [config, setConfig] = useState({
    host: '',
    port: '5432',
    database: '',
    username: '',
    password: '',
    connectionString: '',
    useConnectionString: false,
    syncInterval: '30',
    maxConnections: '10',
    queryTimeout: '30'
  });

  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [syncSettings, setSyncSettings] = useState({
    enableAutoSync: true,
    syncOnStartup: true,
    syncDeletedRecords: false,
    batchSize: '100'
  });

  const handleInputChange = (field, value) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSyncSettingChange = (field, value) => {
    setSyncSettings(prev => ({
      ...prev,
      [field]: value
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
    console.log('Saving Database configuration:', { config, syncSettings });
  };

  const resetToDefaults = () => {
    setConfig({
      host: '',
      port: '5432',
      database: '',
      username: '',
      password: '',
      connectionString: '',
      useConnectionString: false,
      syncInterval: '30',
      maxConnections: '10',
      queryTimeout: '30'
    });
    setSyncSettings({
      enableAutoSync: true,
      syncOnStartup: true,
      syncDeletedRecords: false,
      batchSize: '100'
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
              <h3 className="font-medium text-text-primary">Database Connection Status</h3>
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

      {/* Connection Method Toggle */}
      <div className="bg-surface rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Connection Method</h3>
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2">
            <Input
              type="checkbox"
              checked={!config.useConnectionString}
              onChange={(e) => handleInputChange('useConnectionString', !e.target.checked)}
            />
            <span className="text-sm text-text-primary">Individual Parameters</span>
          </label>
          <label className="flex items-center space-x-2">
            <Input
              type="checkbox"
              checked={config.useConnectionString}
              onChange={(e) => handleInputChange('useConnectionString', e.target.checked)}
            />
            <span className="text-sm text-text-primary">Connection String</span>
          </label>
        </div>
      </div>

      {/* Connection Configuration */}
      <div className="bg-surface rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Database Configuration</h3>
        
        {config.useConnectionString ? (
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Connection String
            </label>
            <Input
              type="text"
              placeholder="postgresql://username:password@host:port/database"
              value={config.connectionString}
              onChange={(e) => handleInputChange('connectionString', e.target.value)}
            />
            <p className="text-xs text-text-muted mt-1">
              Format: postgresql://username:password@host:port/database
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Host
              </label>
              <Input
                type="text"
                placeholder="localhost"
                value={config.host}
                onChange={(e) => handleInputChange('host', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Port
              </label>
              <Input
                type="number"
                placeholder="5432"
                value={config.port}
                onChange={(e) => handleInputChange('port', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Database Name
              </label>
              <Input
                type="text"
                placeholder="old_problems_db"
                value={config.database}
                onChange={(e) => handleInputChange('database', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Username
              </label>
              <Input
                type="text"
                placeholder="db_user"
                value={config.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-text-primary mb-2">
                Password
              </label>
              <Input
                type="password"
                placeholder="Enter database password"
                value={config.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
              />
            </div>
          </div>
        )}
      </div>

      {/* Connection Pool Settings */}
      <div className="bg-surface rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Connection Pool Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Max Connections
            </label>
            <Input
              type="number"
              placeholder="10"
              value={config.maxConnections}
              onChange={(e) => handleInputChange('maxConnections', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Query Timeout (seconds)
            </label>
            <Input
              type="number"
              placeholder="30"
              value={config.queryTimeout}
              onChange={(e) => handleInputChange('queryTimeout', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Sync Interval (minutes)
            </label>
            <Input
              type="number"
              placeholder="30"
              value={config.syncInterval}
              onChange={(e) => handleInputChange('syncInterval', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Data Synchronization Settings */}
      <div className="bg-surface rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Data Synchronization</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-text-primary">
              Enable Auto Sync
            </label>
            <Input
              type="checkbox"
              checked={syncSettings.enableAutoSync}
              onChange={(e) => handleSyncSettingChange('enableAutoSync', e.target.checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-text-primary">
              Sync on Startup
            </label>
            <Input
              type="checkbox"
              checked={syncSettings.syncOnStartup}
              onChange={(e) => handleSyncSettingChange('syncOnStartup', e.target.checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-text-primary">
              Sync Deleted Records
            </label>
            <Input
              type="checkbox"
              checked={syncSettings.syncDeletedRecords}
              onChange={(e) => handleSyncSettingChange('syncDeletedRecords', e.target.checked)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Batch Size
            </label>
            <Input
              type="number"
              placeholder="100"
              value={syncSettings.batchSize}
              onChange={(e) => handleSyncSettingChange('batchSize', e.target.value)}
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

export default DatabaseConfig;