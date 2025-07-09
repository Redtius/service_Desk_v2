import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const AgentSidebar = ({ agents, selectedAgent, onAgentSelect, onCreateAgent, isCollapsed, onToggleCollapse }) => {
  const [expandedGroups, setExpandedGroups] = useState({
    automation: true,
    verification: true,
    support: true,
    escalation: true,
    human: true
  });

  const toggleGroup = (groupKey) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupKey]: !prev[groupKey]
    }));
  };

  const groupedAgents = {
    automation: agents.filter(agent => agent.role === 'Automation Platform'),
    verification: agents.filter(agent => agent.role === 'Verification Agent'),
    support: agents.filter(agent => agent.role === 'Support Agent'),
    escalation: agents.filter(agent => agent.role === 'Escalation Agent'),
    human: agents.filter(agent => agent.role === 'Human Expert')
  };

  const groupConfig = {
    automation: { name: 'Automation Platform', icon: 'Bot', color: 'text-primary' },
    verification: { name: 'Verification Agents', icon: 'CheckCircle', color: 'text-secondary' },
    support: { name: 'Support Agents', icon: 'Headphones', color: 'text-accent' },
    escalation: { name: 'Escalation Agents', icon: 'AlertTriangle', color: 'text-warning' },
    human: { name: 'Human Experts', icon: 'User', color: 'text-success' }
  };

  if (isCollapsed) {
    return (
      <div className="w-16 bg-surface border-r border-border flex flex-col items-center py-4 space-y-4">
        <button
          onClick={onToggleCollapse}
          className="p-2 rounded-lg hover:bg-surface-secondary transition-smooth"
        >
          <Icon name="ChevronRight" size={20} />
        </button>
        
        <div className="w-8 h-px bg-border"></div>
        
        {Object.entries(groupConfig).map(([key, config]) => (
          <div key={key} className="relative group">
            <div className={`p-2 rounded-lg ${config.color}`}>
              <Icon name={config.icon} size={18} />
            </div>
            <div className="absolute left-full ml-2 top-0 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
              {config.name}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-80 bg-surface border-r border-border flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-heading font-semibold text-text-primary">Agents</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={onCreateAgent}
              className="p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary-600 transition-smooth"
              title="Create New Agent"
            >
              <Icon name="Plus" size={16} />
            </button>
            <button
              onClick={onToggleCollapse}
              className="p-2 rounded-lg hover:bg-surface-secondary transition-smooth"
            >
              <Icon name="ChevronLeft" size={16} />
            </button>
          </div>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Icon name="Search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search agents..."
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      {/* Agent Groups */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {Object.entries(groupedAgents).map(([groupKey, groupAgents]) => {
          const config = groupConfig[groupKey];
          const isExpanded = expandedGroups[groupKey];
          
          return (
            <div key={groupKey} className="space-y-2">
              <button
                onClick={() => toggleGroup(groupKey)}
                className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-surface-secondary transition-smooth"
              >
                <div className="flex items-center space-x-2">
                  <Icon name={config.icon} size={16} className={config.color} />
                  <span className="text-sm font-medium text-text-primary">{config.name}</span>
                  <span className="text-xs text-text-muted bg-surface-secondary px-2 py-1 rounded-full">
                    {groupAgents.length}
                  </span>
                </div>
                <Icon 
                  name="ChevronDown" 
                  size={14} 
                  className={`text-text-muted transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                />
              </button>
              
              {isExpanded && (
                <div className="ml-6 space-y-1">
                  {groupAgents.map((agent) => (
                    <button
                      key={agent.id}
                      onClick={() => onAgentSelect(agent)}
                      className={`flex items-center justify-between w-full p-3 rounded-lg text-left transition-smooth ${
                        selectedAgent?.id === agent.id
                          ? 'bg-primary-50 border border-primary text-primary' :'hover:bg-surface-secondary'
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${
                            agent.status === 'active' ? 'bg-success' : 
                            agent.status === 'inactive' ? 'bg-error' : 'bg-warning'
                          }`}></div>
                          <span className="text-sm font-medium truncate">{agent.name}</span>
                        </div>
                        <div className="text-xs text-text-muted mt-1 truncate">{agent.description}</div>
                      </div>
                      <div className="flex items-center space-x-1 ml-2">
                        {agent.hasErrors && (
                          <Icon name="AlertCircle" size={14} className="text-error" />
                        )}
                        <Icon name="ChevronRight" size={12} className="text-text-muted" />
                      </div>
                    </button>
                  ))}
                  
                  {groupAgents.length === 0 && (
                    <div className="p-3 text-center text-text-muted">
                      <Icon name="Inbox" size={24} className="mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No agents in this group</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Stats */}
      <div className="p-4 border-t border-border bg-surface-secondary">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-text-primary">{agents.length}</div>
            <div className="text-xs text-text-muted">Total Agents</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-success">
              {agents.filter(a => a.status === 'active').length}
            </div>
            <div className="text-xs text-text-muted">Active</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentSidebar;