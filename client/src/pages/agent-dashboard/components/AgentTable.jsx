import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import StatusBadge from './StatusBadge';

const AgentTable = ({ agents, onAgentAction }) => {
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedAgents = [...agents].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];
    
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }
    
    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const getAgentTypeIcon = (type) => {
    switch (type) {
      case 'Automation Platform': return 'Bot';
      case 'Verification Agent': return 'CheckCircle';
      case 'Support Agent': return 'Headphones';
      case 'Escalation Agent': return 'AlertTriangle';
      case 'Human Expert': return 'User';
      default: return 'Settings';
    }
  };

  const formatLastActivity = (timestamp) => {
    const now = new Date();
    const activity = new Date(timestamp);
    const diffInMinutes = Math.floor((now - activity) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <Icon name="ArrowUpDown" size={14} className="text-text-muted" />;
    return (
      <Icon 
        name={sortDirection === 'asc' ? 'ArrowUp' : 'ArrowDown'} 
        size={14} 
        className="text-primary" 
      />
    );
  };

  return (
    <div className="bg-surface rounded-lg border border-border shadow-elevation-1 overflow-hidden">
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-surface-secondary border-b border-border">
            <tr>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => handleSort('name')}
                  className="flex items-center space-x-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-smooth"
                >
                  <span>Agent Name</span>
                  <SortIcon field="name" />
                </button>
              </th>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => handleSort('type')}
                  className="flex items-center space-x-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-smooth"
                >
                  <span>Type</span>
                  <SortIcon field="type" />
                </button>
              </th>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => handleSort('status')}
                  className="flex items-center space-x-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-smooth"
                >
                  <span>Status</span>
                  <SortIcon field="status" />
                </button>
              </th>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => handleSort('lastActivity')}
                  className="flex items-center space-x-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-smooth"
                >
                  <span>Last Activity</span>
                  <SortIcon field="lastActivity" />
                </button>
              </th>
              <th className="px-6 py-4 text-left">
                <span className="text-sm font-medium text-text-secondary">Performance</span>
              </th>
              <th className="px-6 py-4 text-right">
                <span className="text-sm font-medium text-text-secondary">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sortedAgents.map((agent) => (
              <tr key={agent.id} className="hover:bg-surface-secondary transition-smooth">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                      <Icon name={getAgentTypeIcon(agent.type)} size={20} className="text-primary" />
                    </div>
                    <div>
                      <div className="font-medium text-text-primary">{agent.name}</div>
                      <div className="text-sm text-text-muted">ID: {agent.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-text-primary">{agent.type}</div>
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={agent.status} />
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-text-secondary">
                    {formatLastActivity(agent.lastActivity)}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-success h-2 rounded-full" 
                        style={{ width: `${agent.performance}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-text-secondary">{agent.performance}%</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    {agent.status === 'active' ? (
                      <>
                        <Button
                          variant="warning"
                          size="sm"
                          iconName="Pause"
                          onClick={() => onAgentAction(agent.id, 'pause')}
                        >
                          Pause
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          iconName="Square"
                          onClick={() => onAgentAction(agent.id, 'stop')}
                        >
                          Stop
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="success"
                        size="sm"
                        iconName="Play"
                        onClick={() => onAgentAction(agent.id, 'start')}
                      >
                        Start
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="MoreHorizontal"
                      onClick={() => onAgentAction(agent.id, 'menu')}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4 p-4">
        {sortedAgents.map((agent) => (
          <div key={agent.id} className="bg-surface-secondary rounded-lg p-4 border border-border">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Icon name={getAgentTypeIcon(agent.type)} size={20} className="text-primary" />
                </div>
                <div>
                  <div className="font-medium text-text-primary">{agent.name}</div>
                  <div className="text-sm text-text-muted">{agent.type}</div>
                </div>
              </div>
              <StatusBadge status={agent.status} size="sm" />
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-xs text-text-muted mb-1">Last Activity</div>
                <div className="text-sm text-text-secondary">
                  {formatLastActivity(agent.lastActivity)}
                </div>
              </div>
              <div>
                <div className="text-xs text-text-muted mb-1">Performance</div>
                <div className="flex items-center space-x-2">
                  <div className="w-12 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-success h-2 rounded-full" 
                      style={{ width: `${agent.performance}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-text-secondary">{agent.performance}%</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-end space-x-2">
              {agent.status === 'active' ? (
                <>
                  <Button
                    variant="warning"
                    size="sm"
                    iconName="Pause"
                    onClick={() => onAgentAction(agent.id, 'pause')}
                  >
                    Pause
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    iconName="Square"
                    onClick={() => onAgentAction(agent.id, 'stop')}
                  >
                    Stop
                  </Button>
                </>
              ) : (
                <Button
                  variant="success"
                  size="sm"
                  iconName="Play"
                  onClick={() => onAgentAction(agent.id, 'start')}
                >
                  Start
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgentTable;