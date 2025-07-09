import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const CommunicationSettingsTab = ({ agent, onSave, onCancel, isLoading }) => {
  const [settings, setSettings] = useState({
    channels: agent?.communicationSettings?.channels || [],
    responseTemplates: agent?.communicationSettings?.responseTemplates || [],
    notificationSettings: agent?.communicationSettings?.notificationSettings || {},
    escalationSettings: agent?.communicationSettings?.escalationSettings || {},
    languageSettings: agent?.communicationSettings?.languageSettings || {}
  });

  const [activeSection, setActiveSection] = useState('channels');
  const [newTemplate, setNewTemplate] = useState({ name: '', subject: '', content: '', type: 'standard' });
  const [showTemplateForm, setShowTemplateForm] = useState(false);

  const availableChannels = [
    { id: 'email', name: 'Email', icon: 'Mail', description: 'Email communication with customers' },
    { id: 'teams', name: 'Microsoft Teams', icon: 'MessageSquare', description: 'Teams channel integration' },
    { id: 'slack', name: 'Slack', icon: 'Hash', description: 'Slack workspace integration' },
    { id: 'webhook', name: 'Webhook', icon: 'Webhook', description: 'Custom webhook notifications' },
    { id: 'sms', name: 'SMS', icon: 'Phone', description: 'SMS notifications for urgent issues' },
    { id: 'portal', name: 'Customer Portal', icon: 'Globe', description: 'Web portal notifications' }
  ];

  const templateTypes = [
    { value: 'standard', label: 'Standard Response' },
    { value: 'acknowledgment', label: 'Acknowledgment' },
    { value: 'resolution', label: 'Resolution' },
    { value: 'escalation', label: 'Escalation' },
    { value: 'followup', label: 'Follow-up' }
  ];

  const handleChannelToggle = (channelId) => {
    setSettings(prev => ({
      ...prev,
      channels: prev.channels.includes(channelId)
        ? prev.channels.filter(id => id !== channelId)
        : [...prev.channels, channelId]
    }));
  };

  const handleAddTemplate = () => {
    if (newTemplate.name && newTemplate.content) {
      setSettings(prev => ({
        ...prev,
        responseTemplates: [...prev.responseTemplates, { ...newTemplate, id: Date.now() }]
      }));
      setNewTemplate({ name: '', subject: '', content: '', type: 'standard' });
      setShowTemplateForm(false);
    }
  };

  const handleRemoveTemplate = (templateId) => {
    setSettings(prev => ({
      ...prev,
      responseTemplates: prev.responseTemplates.filter(t => t.id !== templateId)
    }));
  };

  const handleNotificationSettingChange = (setting, value) => {
    setSettings(prev => ({
      ...prev,
      notificationSettings: {
        ...prev.notificationSettings,
        [setting]: value
      }
    }));
  };

  const handleEscalationSettingChange = (setting, value) => {
    setSettings(prev => ({
      ...prev,
      escalationSettings: {
        ...prev.escalationSettings,
        [setting]: value
      }
    }));
  };

  const handleLanguageSettingChange = (setting, value) => {
    setSettings(prev => ({
      ...prev,
      languageSettings: {
        ...prev.languageSettings,
        [setting]: value
      }
    }));
  };

  const handleSave = () => {
    onSave({ communicationSettings: settings });
  };

  const sections = [
    { id: 'channels', name: 'Communication Channels', icon: 'MessageCircle' },
    { id: 'templates', name: 'Response Templates', icon: 'FileText' },
    { id: 'notifications', name: 'Notifications', icon: 'Bell' },
    { id: 'escalation', name: 'Escalation', icon: 'AlertTriangle' },
    { id: 'language', name: 'Language & Localization', icon: 'Globe' }
  ];

  return (
    <div className="space-y-6">
      {/* Section Navigation */}
      <div className="bg-surface border border-border rounded-lg p-4">
        <div className="flex flex-wrap gap-2">
          {sections.map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-smooth ${
                activeSection === section.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-secondary'
              }`}
            >
              <Icon name={section.icon} size={16} />
              <span>{section.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Communication Channels */}
      {activeSection === 'channels' && (
        <div className="bg-surface border border-border rounded-lg p-6">
          <h3 className="text-lg font-heading font-semibold text-text-primary mb-4 flex items-center">
            <Icon name="MessageCircle" size={20} className="mr-2" />
            Communication Channels
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableChannels.map(channel => (
              <div
                key={channel.id}
                className={`p-4 border-2 rounded-lg transition-all ${
                  settings.channels.includes(channel.id)
                    ? 'border-primary bg-primary-50' :'border-border hover:border-border-focus'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      settings.channels.includes(channel.id) ? 'bg-primary-100' : 'bg-surface-secondary'
                    }`}>
                      <Icon name={channel.icon} size={20} className={
                        settings.channels.includes(channel.id) ? 'text-primary' : 'text-text-muted'
                      } />
                    </div>
                    <div>
                      <h4 className="font-medium text-text-primary">{channel.name}</h4>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.channels.includes(channel.id)}
                      onChange={() => handleChannelToggle(channel.id)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
                <p className="text-sm text-text-muted">{channel.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Response Templates */}
      {activeSection === 'templates' && (
        <div className="bg-surface border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-heading font-semibold text-text-primary flex items-center">
              <Icon name="FileText" size={20} className="mr-2" />
              Response Templates
            </h3>
            <Button
              variant="primary"
              onClick={() => setShowTemplateForm(true)}
              iconName="Plus"
            >
              Add Template
            </Button>
          </div>

          {showTemplateForm && (
            <div className="mb-6 p-4 border border-border rounded-lg bg-surface-secondary">
              <h4 className="font-medium text-text-primary mb-4">Create New Template</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Input
                  type="text"
                  placeholder="Template name"
                  value={newTemplate.name}
                  onChange={(e) => setNewTemplate(prev => ({ ...prev, name: e.target.value }))}
                />
                <select
                  value={newTemplate.type}
                  onChange={(e) => setNewTemplate(prev => ({ ...prev, type: e.target.value }))}
                  className="px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  {templateTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
              <Input
                type="text"
                placeholder="Email subject (optional)"
                value={newTemplate.subject}
                onChange={(e) => setNewTemplate(prev => ({ ...prev, subject: e.target.value }))}
                className="mb-4"
              />
              <textarea
                placeholder="Template content"
                value={newTemplate.content}
                onChange={(e) => setNewTemplate(prev => ({ ...prev, content: e.target.value }))}
                rows={4}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none mb-4"
              />
              <div className="flex space-x-2">
                <Button variant="primary" onClick={handleAddTemplate}>Save Template</Button>
                <Button variant="outline" onClick={() => setShowTemplateForm(false)}>Cancel</Button>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {settings.responseTemplates.map(template => (
              <div key={template.id} className="p-4 border border-border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium text-text-primary">{template.name}</h4>
                    <span className="px-2 py-1 bg-primary-100 text-primary text-xs rounded-full">
                      {templateTypes.find(t => t.value === template.type)?.label}
                    </span>
                  </div>
                  <button
                    onClick={() => handleRemoveTemplate(template.id)}
                    className="text-error hover:text-error-600"
                  >
                    <Icon name="Trash2" size={16} />
                  </button>
                </div>
                {template.subject && (
                  <p className="text-sm text-text-muted mb-2">Subject: {template.subject}</p>
                )}
                <p className="text-sm text-text-secondary">{template.content}</p>
              </div>
            ))}
            
            {settings.responseTemplates.length === 0 && (
              <div className="text-center py-8 text-text-muted">
                <Icon name="FileText" size={48} className="mx-auto mb-4 opacity-50" />
                <p>No response templates configured</p>
                <p className="text-sm">Add templates to standardize agent responses</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Notification Settings */}
      {activeSection === 'notifications' && (
        <div className="bg-surface border border-border rounded-lg p-6">
          <h3 className="text-lg font-heading font-semibold text-text-primary mb-4 flex items-center">
            <Icon name="Bell" size={20} className="mr-2" />
            Notification Settings
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-surface-secondary rounded-lg">
              <div>
                <h4 className="font-medium text-text-primary">Real-time Notifications</h4>
                <p className="text-sm text-text-muted">Send immediate notifications for urgent issues</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notificationSettings.realTime || false}
                  onChange={(e) => handleNotificationSettingChange('realTime', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-surface-secondary rounded-lg">
              <div>
                <h4 className="font-medium text-text-primary">Daily Digest</h4>
                <p className="text-sm text-text-muted">Send daily summary of agent activities</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notificationSettings.dailyDigest || false}
                  onChange={(e) => handleNotificationSettingChange('dailyDigest', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-surface-secondary rounded-lg">
              <div>
                <h4 className="font-medium text-text-primary">Error Notifications</h4>
                <p className="text-sm text-text-muted">Notify when agent encounters errors</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notificationSettings.errorNotifications || false}
                  onChange={(e) => handleNotificationSettingChange('errorNotifications', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Escalation Settings */}
      {activeSection === 'escalation' && (
        <div className="bg-surface border border-border rounded-lg p-6">
          <h3 className="text-lg font-heading font-semibold text-text-primary mb-4 flex items-center">
            <Icon name="AlertTriangle" size={20} className="mr-2" />
            Escalation Settings
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Escalation Timeout (minutes)
              </label>
              <Input
                type="number"
                value={settings.escalationSettings.timeout || 30}
                onChange={(e) => handleEscalationSettingChange('timeout', parseInt(e.target.value))}
                min="5"
                max="1440"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Max Escalation Level
              </label>
              <select
                value={settings.escalationSettings.maxLevel || 3}
                onChange={(e) => handleEscalationSettingChange('maxLevel', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value={1}>Level 1 Only</option>
                <option value={2}>Up to Level 2</option>
                <option value={3}>Up to Level 3</option>
                <option value={4}>Up to Level 4</option>
              </select>
            </div>
          </div>
          
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between p-4 bg-surface-secondary rounded-lg">
              <div>
                <h4 className="font-medium text-text-primary">Auto-escalate Critical Issues</h4>
                <p className="text-sm text-text-muted">Automatically escalate high-priority tickets</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.escalationSettings.autoEscalateCritical || false}
                  onChange={(e) => handleEscalationSettingChange('autoEscalateCritical', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Language Settings */}
      {activeSection === 'language' && (
        <div className="bg-surface border border-border rounded-lg p-6">
          <h3 className="text-lg font-heading font-semibold text-text-primary mb-4 flex items-center">
            <Icon name="Globe" size={20} className="mr-2" />
            Language & Localization
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Primary Language
              </label>
              <select
                value={settings.languageSettings.primary || 'en'}
                onChange={(e) => handleLanguageSettingChange('primary', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="en">English</option>
                <option value="fr">Français</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Fallback Language
              </label>
              <select
                value={settings.languageSettings.fallback || 'en'}
                onChange={(e) => handleLanguageSettingChange('fallback', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="en">English</option>
                <option value="fr">Français</option>
              </select>
            </div>
          </div>
          
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between p-4 bg-surface-secondary rounded-lg">
              <div>
                <h4 className="font-medium text-text-primary">Auto-detect Language</h4>
                <p className="text-sm text-text-muted">Automatically detect customer language from messages</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.languageSettings.autoDetect || false}
                  onChange={(e) => handleLanguageSettingChange('autoDetect', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-end space-x-4 pt-6 border-t border-border">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave} loading={isLoading} iconName="Save">
          Save Communication Settings
        </Button>
      </div>
    </div>
  );
};

export default CommunicationSettingsTab;