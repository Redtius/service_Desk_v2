import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const UserSidebar = ({ userStats, onExportUsers, onImportUsers }) => {
  return (
    <div className="space-y-6">
      {/* User Statistics */}
      <div className="bg-surface rounded-lg shadow-elevation-1 border border-border p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="BarChart3" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-text-primary">User Statistics</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-success rounded-full"></div>
              <span className="text-sm text-text-secondary">Active Users</span>
            </div>
            <span className="text-lg font-semibold text-text-primary">{userStats.active}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-error rounded-full"></div>
              <span className="text-sm text-text-secondary">Inactive Users</span>
            </div>
            <span className="text-lg font-semibold text-text-primary">{userStats.inactive}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-warning rounded-full"></div>
              <span className="text-sm text-text-secondary">Pending</span>
            </div>
            <span className="text-lg font-semibold text-text-primary">{userStats.pending}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-primary rounded-full"></div>
              <span className="text-sm text-text-secondary">Total</span>
            </div>
            <span className="text-lg font-semibold text-text-primary">{userStats.total}</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-surface rounded-lg shadow-elevation-1 border border-border p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="Zap" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-text-primary">Quick Actions</h3>
        </div>
        
        <div className="space-y-3">
          <Button
            variant="outline"
            fullWidth
            iconName="Download"
            onClick={onExportUsers}
          >
            Export Users
          </Button>
          
          <Button
            variant="outline"
            fullWidth
            iconName="Upload"
            onClick={onImportUsers}
          >
            Import Users
          </Button>
          
          <Button
            variant="outline"
            fullWidth
            iconName="Shield"
          >
            Permission Templates
          </Button>
          
          <Button
            variant="outline"
            fullWidth
            iconName="FileText"
          >
            Audit Log
          </Button>
        </div>
      </div>

      {/* Permission Templates */}
      <div className="bg-surface rounded-lg shadow-elevation-1 border border-border p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="Shield" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-text-primary">Permission Templates</h3>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between p-2 rounded hover:bg-surface-secondary transition-smooth">
            <span className="text-sm text-text-primary">Read Only</span>
            <Icon name="Eye" size={14} className="text-text-muted" />
          </div>
          
          <div className="flex items-center justify-between p-2 rounded hover:bg-surface-secondary transition-smooth">
            <span className="text-sm text-text-primary">Editor</span>
            <Icon name="Edit" size={14} className="text-text-muted" />
          </div>
          
          <div className="flex items-center justify-between p-2 rounded hover:bg-surface-secondary transition-smooth">
            <span className="text-sm text-text-primary">Administrator</span>
            <Icon name="Settings" size={14} className="text-text-muted" />
          </div>
          
          <div className="flex items-center justify-between p-2 rounded hover:bg-surface-secondary transition-smooth">
            <span className="text-sm text-text-primary">Super Admin</span>
            <Icon name="Crown" size={14} className="text-text-muted" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSidebar;