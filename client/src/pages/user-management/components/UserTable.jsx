import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const UserTable = ({ users, onEditUser, onDeactivateUser, onDeleteUser, onResetPassword, selectedUsers, onSelectUser, onSelectAll }) => {
  const [sortField, setSortField] = useState('full_name');
  const [sortDirection, setSortDirection] = useState('asc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedUsers = [...users].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (sortDirection === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  const formatLastLogin = (date) => {
    if (!date) return 'Never logged in';
    const now = new Date();
    const loginDate = new Date(date);
    const diffInHours = Math.floor((now - loginDate) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return loginDate.toLocaleDateString();
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'bg-success-100 text-success-700', text: 'Active' },
      inactive: { color: 'bg-error-100 text-error-700', text: 'Inactive' },
      pending: { color: 'bg-warning-100 text-warning-700', text: 'Pending' },
      suspended: { color: 'bg-error-100 text-error-700', text: 'Suspended' }
    };
    
    const config = statusConfig[status] || statusConfig.active;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const getRoleBadge = (role) => {
    // This will need to be dynamic based on your roles from the backend
    return (
      <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
        {role}
      </span>
    );
  };

  return (
    <div className="bg-surface rounded-lg shadow-elevation-1 border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-surface-secondary border-b border-border">
            <tr>
              <th className="w-12 px-4 py-3">
                <input
                  type="checkbox"
                  checked={selectedUsers.length === users.length && users.length > 0}
                  onChange={onSelectAll}
                  className="rounded border-border focus:ring-primary focus:border-primary"
                />
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('full_name')}
                  className="flex items-center space-x-1 text-sm font-medium text-text-primary hover:text-primary transition-smooth"
                >
                  <span>Name</span>
                  <Icon 
                    name={sortField === 'full_name' && sortDirection === 'desc' ? 'ChevronDown' : 'ChevronUp'} 
                    size={14} 
                  />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('email')}
                  className="flex items-center space-x-1 text-sm font-medium text-text-primary hover:text-primary transition-smooth"
                >
                  <span>Email</span>
                  <Icon 
                    name={sortField === 'email' && sortDirection === 'desc' ? 'ChevronDown' : 'ChevronUp'} 
                    size={14} 
                  />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('role_id')}
                  className="flex items-center space-x-1 text-sm font-medium text-text-primary hover:text-primary transition-smooth"
                >
                  <span>Role</span>
                  <Icon 
                    name={sortField === 'role_id' && sortDirection === 'desc' ? 'ChevronDown' : 'ChevronUp'} 
                    size={14} 
                  />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('department')}
                  className="flex items-center space-x-1 text-sm font-medium text-text-primary hover:text-primary transition-smooth"
                >
                  <span>Department</span>
                  <Icon 
                    name={sortField === 'department' && sortDirection === 'desc' ? 'ChevronDown' : 'ChevronUp'} 
                    size={14} 
                  />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('last_login')}
                  className="flex items-center space-x-1 text-sm font-medium text-text-primary hover:text-primary transition-smooth"
                >
                  <span>Last Login</span>
                  <Icon 
                    name={sortField === 'last_login' && sortDirection === 'desc' ? 'ChevronDown' : 'ChevronUp'} 
                    size={14} 
                  />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <span className="text-sm font-medium text-text-primary">Status</span>
              </th>
              <th className="px-4 py-3 text-right">
                <span className="text-sm font-medium text-text-primary">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sortedUsers.map((user) => (
              <tr key={user.id} className="hover:bg-surface-secondary transition-smooth">
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => onSelectUser(user.id)}
                    className="rounded border-border focus:ring-primary focus:border-primary"
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">
                        {user.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-text-primary">{user.full_name}</div>
                      <div className="text-xs text-text-secondary">{user.position}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm text-text-primary">{user.email}</div>
                </td>
                <td className="px-4 py-3">
                  {getRoleBadge(user.role_id)} {/* Assuming role_id is used for display */}
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm text-text-primary">{user.department}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm text-text-secondary">{formatLastLogin(user.last_login)}</div>
                </td>
                <td className="px-4 py-3">
                  {getStatusBadge(user.status)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Edit"
                      onClick={() => onEditUser(user)}
                      className="text-text-secondary hover:text-primary"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Key"
                      onClick={() => onResetPassword(user)}
                      className="text-text-secondary hover:text-warning"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName={user.status === 'active' ? 'UserX' : 'UserCheck'}
                      onClick={() => onDeactivateUser(user)}
                      className={`text-text-secondary ${user.status === 'active' ? 'hover:text-error' : 'hover:text-success'}`}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Trash"
                      onClick={() => onDeleteUser(user.id)}
                      className="text-text-secondary hover:text-error"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTable;