import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const AgentToolbar = ({ currentAgent, agents, onAgentStatusChange }) => {
  const [showAgentList, setShowAgentList] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'bg-success text-success-600';
      case 'busy': return 'bg-warning text-warning-600';
      case 'away': return 'bg-slate-400 text-slate-600';
      case 'offline': return 'bg-error text-error-600';
      default: return 'bg-slate-400 text-slate-600';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'online': return 'Circle';
      case 'busy': return 'Clock';
      case 'away': return 'Moon';
      case 'offline': return 'X';
      default: return 'Circle';
    }
  };

  const handleStatusChange = (newStatus) => {
    onAgentStatusChange(newStatus);
  };

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?';
  };

  return (
    <div className="flex items-center space-x-4">
      {/* Agent Status */}
      <div className="flex items-center space-x-2">
        <div className={`w-3 h-3 rounded-full ${getStatusColor(currentAgent?.status)}`}></div>
        <span className="text-sm font-medium text-text-primary">
          {currentAgent?.status?.charAt(0).toUpperCase() + currentAgent?.status?.slice(1)}
        </span>
      </div>

      {/* Active Chats Counter */}
      <div className="flex items-center space-x-2 px-3 py-1 bg-primary-100 rounded-full">
        <Icon name="MessageCircle" size={14} className="text-primary" />
        <span className="text-sm font-medium text-primary">
          {currentAgent?.activeChats || 0} active
        </span>
      </div>

      {/* Status Change Dropdown */}
      <div className="relative">
        <button
          onClick={() => setShowAgentList(!showAgentList)}
          className="flex items-center space-x-2 px-3 py-2 bg-surface-secondary rounded-lg hover:bg-surface border border-border transition-smooth"
        >
          <Icon name={getStatusIcon(currentAgent?.status)} size={16} />
          <span className="text-sm font-medium text-text-primary">Change Status</span>
          <Icon name="ChevronDown" size={14} className="text-text-muted" />
        </button>

        {showAgentList && (
          <div className="absolute right-0 mt-2 w-48 bg-surface rounded-lg shadow-elevation-2 border border-border z-10">
            <div className="p-2">
              <div className="text-xs font-medium text-text-secondary mb-2 px-2">Set Status</div>
              {[
                { status: 'online', label: 'Online', icon: 'Circle' },
                { status: 'busy', label: 'Busy', icon: 'Clock' },
                { status: 'away', label: 'Away', icon: 'Moon' },
                { status: 'offline', label: 'Offline', icon: 'X' }
              ].map(({ status, label, icon }) => (
                <button
                  key={status}
                  onClick={() => {
                    handleStatusChange(status);
                    setShowAgentList(false);
                  }}
                  className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg transition-smooth ${
                    currentAgent?.status === status 
                      ? 'bg-primary-100 text-primary' :'hover:bg-surface-secondary text-text-secondary'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(status)}`}></div>
                  <Icon name={icon} size={14} />
                  <span className="text-sm">{label}</span>
                </button>
              ))}
            </div>
            
            <div className="border-t border-border p-2">
              <div className="text-xs font-medium text-text-secondary mb-2 px-2">Team Status</div>
              {agents?.map(agent => (
                <div key={agent.id} className="flex items-center space-x-2 px-3 py-2">
                  <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-primary">
                      {getInitials(agent.name)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-text-primary">{agent.name}</div>
                    <div className="flex items-center space-x-1">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(agent.status)}`}></div>
                      <span className="text-xs text-text-secondary">{agent.status}</span>
                      <span className="text-xs text-text-muted">• {agent.activeChats} chats</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="flex items-center space-x-2">
        <button
          className="p-2 hover:bg-surface-secondary rounded-lg transition-smooth"
          title="Knowledge Base"
        >
          <Icon name="BookOpen" size={16} />
        </button>
        <button
          className="p-2 hover:bg-surface-secondary rounded-lg transition-smooth"
          title="Escalation Queue"
        >
          <Icon name="AlertTriangle" size={16} />
        </button>
        <button
          className="p-2 hover:bg-surface-secondary rounded-lg transition-smooth"
          title="Settings"
        >
          <Icon name="Settings" size={16} />
        </button>
      </div>
    </div>
  );
};

export default AgentToolbar;