import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BulkActions = ({ selectedUsers, onBulkAction, totalUsers }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const bulkActions = [
    { id: 'activate', label: 'Activate Users', icon: 'UserCheck', color: 'text-success' },
    { id: 'deactivate', label: 'Deactivate Users', icon: 'UserX', color: 'text-error' },
    { id: 'reset_password', label: 'Reset Passwords', icon: 'Key', color: 'text-warning' },
  ];

  const handleBulkAction = (actionId) => {
    onBulkAction(actionId, selectedUsers);
    setIsDropdownOpen(false);
  };

  if (selectedUsers.length === 0) {
    return null;
  }

  return (
    <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Icon name="CheckSquare" size={20} className="text-primary" />
          <span className="text-sm font-medium text-primary">
            {selectedUsers.length} user{selectedUsers.length > 1 ? 's' : ''} selected
          </span>
          <span className="text-xs text-primary-600">
            out of {totalUsers} total
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {/* Quick Actions */}
          <Button
            variant="ghost"
            size="sm"
            iconName="UserCheck"
            onClick={() => handleBulkAction('activate')}
            className="text-success hover:bg-success-50"
          >
            Activate
          </Button>

          <Button
            variant="ghost"
            size="sm"
            iconName="UserX"
            onClick={() => handleBulkAction('deactivate')}
            className="text-error hover:bg-error-50"
          >
            Deactivate
          </Button>

          {/* More Actions Dropdown */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              iconName="MoreHorizontal"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="text-primary hover:bg-primary-50"
            >
              More Actions
            </Button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-surface rounded-lg shadow-elevation-2 border border-border z-10">
                <div className="py-2">
                  {bulkActions.map((action) => (
                    <button
                      key={action.id}
                      onClick={() => handleBulkAction(action.id)}
                      className={`flex items-center space-x-3 w-full px-4 py-2 text-sm hover:bg-surface-secondary transition-smooth ${action.color}`}
                    >
                      <Icon name={action.icon} size={16} />
                      <span>{action.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Clear Selection */}
          <Button
            variant="ghost"
            size="sm"
            iconName="X"
            onClick={() => onBulkAction('clear_selection', [])}
            className="text-text-muted hover:text-text-primary"
          >
            Clear
          </Button>
        </div>
      </div>

      {/* Selection Summary */}
      <div className="mt-3 pt-3 border-t border-primary-200">
        <div className="flex items-center space-x-6 text-xs text-primary-600">
          <span>Available actions for current selection:</span>
          <div className="flex items-center space-x-4">
            <span>• Activate/Deactivate</span>
            <span>• Reset Password</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkActions;