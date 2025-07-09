import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { getRoles } from '../../../api/roles';

const UserModal = ({ isOpen, onClose, user, onSave, mode = 'create' }) => {
  const [activeTab, setActiveTab] = useState('personal');
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    position: '',
    department: '',
    role_id: '',
    phone: '',
    status: 'active',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [roles, setRoles] = useState([]);

  const departments = [
    { value: '', label: 'Select a department' },
    { value: 'IT Operations', label: 'IT Operations' },
    { value: 'Customer Support', label: 'Customer Support' },
    { value: 'Business Analysis', label: 'Business Analysis' },
    { value: 'System Administration', label: 'System Administration' },
    { value: 'Quality Assurance', label: 'Quality Assurance' }
  ];

  useEffect(() => {
    getRoles()
      .then(data => setRoles(data))
      .catch(err => console.error('Failed to fetch roles:', err));
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    if (mode === 'edit' && user) {
      setFormData({
        full_name: user.full_name || '',
        email: user.email || '',
        position: user.position || '',
        department: user.department || '',
        role_id: user.role_id || '',
        phone: user.phone || '',
        status: user.status || 'active',
        password: '',
      });
    } else {
      setFormData({
        full_name: '',
        email: '',
        position: '',
        department: '',
        role_id: '',
        phone: '',
        status: 'active',
        password: '',
      });
    }
    setErrors({});
    setActiveTab('personal');
  }, [isOpen, user, mode]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.full_name.trim()) newErrors.full_name = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!formData.email.includes('@')) newErrors.email = 'Invalid email format';
    if (!formData.role_id) newErrors.role_id = 'Role is required';
    if (!formData.department) newErrors.department = 'Department is required';
    if (mode === 'create' && !formData.password.trim()) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;
    const data = { ...formData };
    if (mode === 'edit') delete data.password;
    onSave(data);
    onClose();
  };

  if (!isOpen) return null;

  const roleOptions = [
    { value: '', label: 'Select a role' },
    ...roles.map(r => ({ value: r.id, label: r.name }))
  ];

  const tabs = [
    { id: 'personal', label: 'Personal Information', icon: 'User' },
    { id: 'role', label: 'Role Assignment', icon: 'Shield' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-lg shadow-elevation-3 w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <Icon name={mode === 'create' ? 'UserPlus' : 'UserCheck'} size={24} className="text-primary" />
            <h2 className="text-xl font-semibold text-text-primary">
              {mode === 'create' ? 'Add User' : 'Edit User'}
            </h2>
          </div>
          <Button variant="ghost" size="sm" iconName="X" onClick={onClose} />
        </div>

        {/* Tabs */}
        <div className="border-b border-border">
          <nav className="flex space-x-8 px-6">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition ${
                  activeTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-text-primary'
                }`}
              >
                <Icon name={tab.icon} size={16} />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'personal' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Full Name *</label>
                <Input
                  type="text"
                  value={formData.full_name}
                  onChange={e => handleInputChange('full_name', e.target.value)}
                  placeholder="Enter full name"
                  className={errors.full_name ? 'border-error' : ''}
                />
                {errors.full_name && <p className="text-error text-xs mt-1">{errors.full_name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Email *</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={e => handleInputChange('email', e.target.value)}
                  placeholder="name@company.com"
                  className={errors.email ? 'border-error' : ''}
                />
                {errors.email && <p className="text-error text-xs mt-1">{errors.email}</p>}
              </div>
              {mode === 'create' && (
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Password *</label>
                  <Input
                    type="password"
                    value={formData.password}
                    onChange={e => handleInputChange('password', e.target.value)}
                    placeholder="Enter password"
                    className={errors.password ? 'border-error' : ''}
                  />
                  {errors.password && <p className="text-error text-xs mt-1">{errors.password}</p>}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Position</label>
                <Input
                  type="text"
                  value={formData.position}
                  onChange={e => handleInputChange('position', e.target.value)}
                  placeholder="Job Title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Phone</label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={e => handleInputChange('phone', e.target.value)}
                  placeholder="+1 234 567 8900"
                />
              </div>
            </div>
          )}
          {activeTab === 'role' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Role *</label>
                  <select
                    value={formData.role_id}
                    onChange={e => handleInputChange('role_id', parseInt(e.target.value))}
                    className={`w-full bg-surface border rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${
                      errors.role_id ? 'border-error' : 'border-border'
                    }`}
                  >
                    {roleOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  {errors.role_id && <p className="text-error text-xs mt-1">{errors.role_id}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Department *</label>
                  <select
                    value={formData.department}
                    onChange={e => handleInputChange('department', e.target.value)}
                    className={`w-full bg-surface border rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${
                      errors.department ? 'border-error' : 'border-border'
                    }`}
                  >
                    {departments.map(dept => (
                      <option key={dept.value} value={dept.value}>{dept.label}</option>
                    ))}
                  </select>
                  {errors.department && <p className="text-error text-xs mt-1">{errors.department}</p>}
                </div>
              </div>
              {formData.role_id && (
                <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                  <h4 className="font-medium text-primary mb-2">Role Description</h4>
                  <p className="text-sm text-primary-700">
                    {roles.find(r => r.id === formData.role_id)?.description}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-border bg-surface-secondary">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleSave}>
            {mode === 'create' ? 'Create User' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserModal;
