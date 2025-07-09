import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SystemNotifications = ({ notifications, onDismiss, onMarkAllRead }) => {
  const [filter, setFilter] = useState('all');

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'info': return 'Info';
      case 'warning': return 'AlertTriangle';
      case 'error': return 'AlertCircle';
      case 'success': return 'CheckCircle';
      default: return 'Bell';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'info': return 'text-primary';
      case 'warning': return 'text-warning';
      case 'error': return 'text-error';
      case 'success': return 'text-success';
      default: return 'text-text-muted';
    }
  };

  const getNotificationBg = (type) => {
    switch (type) {
      case 'info': return 'bg-primary-50';
      case 'warning': return 'bg-warning-50';
      case 'error': return 'bg-error-50';
      case 'success': return 'bg-success-50';
      default: return 'bg-surface-secondary';
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
    return notification.type === filter;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const notif = new Date(timestamp);
    const diffInMinutes = Math.floor((now - notif) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="bg-surface rounded-lg border border-border shadow-elevation-1">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name="Bell" size={20} className="text-primary" />
            <h3 className="text-lg font-semibold text-text-primary">System Notifications</h3>
            {unreadCount > 0 && (
              <span className="bg-error text-white text-xs px-2 py-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onMarkAllRead}
            >
              Mark all read
            </Button>
          )}
        </div>
        
        {/* Filter Tabs */}
        <div className="flex space-x-1 mt-4">
          {['all', 'unread', 'error', 'warning', 'info'].map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`px-3 py-1 text-sm rounded-md font-medium transition-smooth capitalize ${
                filter === filterType
                  ? 'bg-primary text-white' :'text-text-secondary hover:text-text-primary hover:bg-surface-secondary'
              }`}
            >
              {filterType}
            </button>
          ))}
        </div>
      </div>
      
      <div className="max-h-96 overflow-y-auto">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="BellOff" size={48} className="text-text-muted mx-auto mb-3" />
            <p className="text-text-muted">No notifications</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 hover:bg-surface-secondary transition-smooth ${
                  !notification.read ? 'border-l-4 border-l-primary' : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-full ${getNotificationBg(notification.type)}`}>
                    <Icon 
                      name={getNotificationIcon(notification.type)} 
                      size={16} 
                      className={getNotificationColor(notification.type)}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className={`text-sm font-medium truncate ${
                        !notification.read ? 'text-text-primary' : 'text-text-secondary'
                      }`}>
                        {notification.title}
                      </p>
                      <div className="flex items-center space-x-2 ml-2">
                        <span className="text-xs text-text-muted whitespace-nowrap">
                          {formatTimestamp(notification.timestamp)}
                        </span>
                        <button
                          onClick={() => onDismiss(notification.id)}
                          className="text-text-muted hover:text-text-primary transition-smooth"
                        >
                          <Icon name="X" size={14} />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-text-secondary mt-1">
                      {notification.message}
                    </p>
                    {notification.action && (
                      <button className="text-xs text-primary hover:text-primary-600 font-medium mt-2 transition-smooth">
                        {notification.action}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemNotifications;