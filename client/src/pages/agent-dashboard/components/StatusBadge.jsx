import React from 'react';

const StatusBadge = ({ status, size = 'md' }) => {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': case'online': case'running':
        return {
          bg: 'bg-success-100',
          text: 'text-success-700',
          dot: 'bg-success'
        };
      case 'idle': case'waiting':
        return {
          bg: 'bg-warning-100',
          text: 'text-warning-700',
          dot: 'bg-warning'
        };
      case 'offline': case'stopped': case'error':
        return {
          bg: 'bg-error-100',
          text: 'text-error-700',
          dot: 'bg-error'
        };
      case 'maintenance':
        return {
          bg: 'bg-secondary-100',
          text: 'text-secondary-700',
          dot: 'bg-secondary'
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-700',
          dot: 'bg-gray-400'
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span className={`inline-flex items-center space-x-2 rounded-full font-medium ${sizeClasses[size]} ${config.bg} ${config.text}`}>
      <div className={`w-2 h-2 rounded-full ${config.dot}`}></div>
      <span className="capitalize">{status}</span>
    </span>
  );
};

export default StatusBadge;