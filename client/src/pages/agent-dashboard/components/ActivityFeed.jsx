import React from 'react';
import Icon from '../../../components/AppIcon';

const ActivityFeed = ({ activities }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'agent_started': return 'Play';
      case 'agent_stopped': return 'Square';
      case 'agent_paused': return 'Pause';
      case 'ticket_processed': return 'CheckCircle';
      case 'error_occurred': return 'AlertCircle';
      case 'escalation': return 'AlertTriangle';
      case 'configuration_changed': return 'Settings';
      default: return 'Activity';
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'agent_started': return 'text-success';
      case 'agent_stopped': return 'text-error';
      case 'agent_paused': return 'text-warning';
      case 'ticket_processed': return 'text-primary';
      case 'error_occurred': return 'text-error';
      case 'escalation': return 'text-warning';
      case 'configuration_changed': return 'text-secondary';
      default: return 'text-text-muted';
    }
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const activity = new Date(timestamp);
    const diffInMinutes = Math.floor((now - activity) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="bg-surface rounded-lg border border-border shadow-elevation-1">
      <div className="p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <Icon name="Activity" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-text-primary">Recent Activity</h3>
        </div>
      </div>
      
      <div className="p-4">
        {activities.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="Clock" size={48} className="text-text-muted mx-auto mb-3" />
            <p className="text-text-muted">No recent activity</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className={`p-2 rounded-full bg-surface-secondary ${getActivityColor(activity.type)}`}>
                  <Icon name={getActivityIcon(activity.type)} size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-text-primary truncate">
                      {activity.title}
                    </p>
                    <span className="text-xs text-text-muted whitespace-nowrap ml-2">
                      {formatTimestamp(activity.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm text-text-secondary mt-1">
                    {activity.description}
                  </p>
                  {activity.agent && (
                    <div className="flex items-center space-x-1 mt-2">
                      <Icon name="Bot" size={12} className="text-text-muted" />
                      <span className="text-xs text-text-muted">{activity.agent}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="p-4 border-t border-border">
        <button className="w-full text-sm text-primary hover:text-primary-600 font-medium transition-smooth">
          View All Activity
        </button>
      </div>
    </div>
  );
};

export default ActivityFeed;