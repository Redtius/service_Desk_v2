import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { getRoles } from '../../../api/roles';

const UserFilters = ({
  searchTerm,
  onSearchChange,
  selectedRole,
  onRoleChange,
  selectedDepartment,
  onDepartmentChange,
  selectedStatus,
  onStatusChange,
  onClearFilters
}) => {
  const [roles, setRoles] = useState([]);
  const departments = [
    { value: '', label: 'All Departments' },
    { value: 'IT Operations', label: 'IT Operations' },
    { value: 'Customer Support', label: 'Customer Support' },
    { value: 'Business Analysis', label: 'Business Analysis' },
    { value: 'System Administration', label: 'System Administration' },
    { value: 'Quality Assurance', label: 'Quality Assurance' }
  ];
  const statuses = [
    { value: '', label: 'All Statuses' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'pending', label: 'Pending' },
    { value: 'suspended', label: 'Suspended' }
  ];

  useEffect(() => {
    getRoles()
      .then(data => setRoles(data))
      .catch(err => console.error('Failed to fetch roles:', err));
  }, []);

  const roleOptions = [
    { value: '', label: 'All Roles' },
    ...roles.map(role => ({ value: role.id, label: role.name }))
  ];

  const hasActiveFilters = searchTerm || selectedRole || selectedDepartment || selectedStatus;

  return (
    <div className="bg-surface rounded-lg shadow-elevation-1 border border-border p-4 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
        {/* Search Input */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Icon
              name="Search"
              size={16}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted"
            />
            <Input
              type="search"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          {/* Role Filter */}
          <div className="relative">
            <select
              value={selectedRole}
              onChange={(e) => onRoleChange(e.target.value)}
              className="appearance-none bg-surface border border-border rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            >
              {roleOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <Icon
              name="ChevronDown"
              size={16}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-text-muted pointer-events-none"
            />
          </div>

          {/* Department Filter */}
          <div className="relative">
            <select
              value={selectedDepartment}
              onChange={(e) => onDepartmentChange(e.target.value)}
              className="appearance-none bg-surface border border-border rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            >
              {departments.map((dept) => (
                <option key={dept.value} value={dept.value}>
                  {dept.label}
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
              className="appearance-none bg-surface border border-border rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            >
              {statuses.map((status) => (
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

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              iconName="X"
              onClick={onClearFilters}
              className="text-text-secondary hover:text-error"
            >
              Clear
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserFilters;
