import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const FilterControls = ({ 
  searchTerm, 
  onSearchChange, 
  selectedType, 
  onTypeChange, 
  selectedStatus, 
  onStatusChange,
  onRefresh,
  isRefreshing 
}) => {
  const agentTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'Automation Platform', label: 'Automation Platform' },
    { value: 'Verification Agent', label: 'Verification Agent' },
    { value: 'Support Agent', label: 'Support Agent' },
    { value: 'Escalation Agent', label: 'Escalation Agent' },
    { value: 'Human Expert', label: 'Human Expert' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'idle', label: 'Idle' },
    { value: 'offline', label: 'Offline' },
    { value: 'maintenance', label: 'Maintenance' }
  ];

  return (
    <div className="bg-surface rounded-lg border border-border p-4 shadow-elevation-1">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
        {/* Search */}
        <div className="flex-1 lg:max-w-md">
          <div className="relative">
            <Icon 
              name="Search" 
              size={20} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" 
            />
            <Input
              type="search"
              placeholder="Search agents..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          {/* Agent Type Filter */}
          <div className="relative">
            <select
              value={selectedType}
              onChange={(e) => onTypeChange(e.target.value)}
              className="appearance-none bg-surface border border-border rounded-lg px-4 py-2 pr-8 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {agentTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            <Icon 
              name="ChevronDown" 
              size={16} 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-text-muted pointer-events-none" 
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => onStatusChange(e.target.value)}
              className="appearance-none bg-surface border border-border rounded-lg px-4 py-2 pr-8 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {statusOptions.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
            <Icon 
              name="ChevronDown" 
              size={16} 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-text-muted pointer-events-none" 
            />
          </div>

          {/* Refresh Button */}
          <Button
            variant="ghost"
            size="md"
            iconName="RefreshCw"
            onClick={onRefresh}
            disabled={isRefreshing}
            className={isRefreshing ? 'animate-spin' : ''}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Active Filters Display */}
      <div className="flex flex-wrap items-center gap-2 mt-4">
        {searchTerm && (
          <div className="flex items-center space-x-2 bg-primary-50 text-primary px-3 py-1 rounded-full text-sm">
            <span>Search: "{searchTerm}"</span>
            <button
              onClick={() => onSearchChange('')}
              className="hover:text-primary-700 transition-smooth"
            >
              <Icon name="X" size={14} />
            </button>
          </div>
        )}
        
        {selectedType !== 'all' && (
          <div className="flex items-center space-x-2 bg-secondary-50 text-secondary px-3 py-1 rounded-full text-sm">
            <span>Type: {selectedType}</span>
            <button
              onClick={() => onTypeChange('all')}
              className="hover:text-secondary-700 transition-smooth"
            >
              <Icon name="X" size={14} />
            </button>
          </div>
        )}
        
        {selectedStatus !== 'all' && (
          <div className="flex items-center space-x-2 bg-accent-50 text-accent px-3 py-1 rounded-full text-sm">
            <span>Status: {selectedStatus}</span>
            <button
              onClick={() => onStatusChange('all')}
              className="hover:text-accent-700 transition-smooth"
            >
              <Icon name="X" size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterControls;