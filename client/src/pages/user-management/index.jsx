import React, { useState, useEffect, useCallback } from 'react';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import UserTable from './components/UserTable';
import UserFilters from './components/UserFilters';
import UserSidebar from './components/UserSidebar';
import UserModal from './components/UserModal';
import BulkActions from './components/BulkActions';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { getUsers, createUser, updateUser, deleteUser } from '../../api/users';
import { useAuth } from '../../context/AuthContext';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [modalMode, setModalMode] = useState('create');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user: authUser } = useAuth();

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUsers();
      setUsers(data);
      setFilteredUsers(data);
    } catch (err) {
      setError('Failed to fetch users.');
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedRole) {
      filtered = filtered.filter(user => user.role_id === parseInt(selectedRole)); // Assuming role_id is int
    }

    if (selectedDepartment) {
      filtered = filtered.filter(user => user.department === selectedDepartment);
    }

    if (selectedStatus) {
      filtered = filtered.filter(user => user.status === selectedStatus);
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, selectedRole, selectedDepartment, selectedStatus]);

  const handleAddUser = () => {
    setCurrentUser(null);
    setModalMode('create');
    setIsUserModalOpen(true);
  };

  const handleEditUser = (user) => {
    setCurrentUser(user);
    setModalMode('edit');
    setIsUserModalOpen(true);
  };

  const handleSaveUser = async (userData) => {
    try {
      if (modalMode === 'create') {
        await createUser(userData);
      } else {
        await updateUser(currentUser.id, userData);
      }
      fetchUsers(); // Re-fetch users to update the list
      setIsUserModalOpen(false);
    } catch (err) {
      setError('Failed to save user.');
      console.error("Error saving user:", err);
    }
  };

  const handleDeactivateUser = async (user) => {
    try {
      const newStatus = user.status === 'active' ? 'inactive' : 'active';
      await updateUser(user.id, { status: newStatus });
      fetchUsers();
    } catch (err) {
      setError('Failed to change user status.');
      console.error("Error deactivating user:", err);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await deleteUser(userId);
      fetchUsers();
    } catch (err) {
      setError('Failed to delete user.');
      console.error("Error deleting user:", err);
    }
  };

  const handleResetPassword = async (user) => {
    try {
      // Assuming there's an API endpoint for resetting password
      // This would typically be a POST request to /users/{user_id}/reset-password
      // For now, we'll simulate it or use a placeholder if no direct API exists
      // await axios.post(`${API_URL}/users/${user.id}/reset-password`, {}, getAuthHeaders());
      console.log('Password reset initiated for:', user.email);
      alert(`Password reset initiated for ${user.email}.`);
    } catch (err) {
      setError('Failed to reset password.');
      console.error("Error resetting password:", err);
    }
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(user => user.id));
    }
  };

  const handleBulkAction = async (actionId, userIds) => {
    try {
      for (const userId of userIds) {
        if (actionId === 'activate') {
          await updateUser(userId, { status: 'active' });
        } else if (actionId === 'deactivate') {
          await updateUser(userId, { status: 'inactive' });
        } else if (actionId === 'reset_password') {
          // Call reset password API for each user
          // await axios.post(`${API_URL}/users/${userId}/reset-password`, {}, getAuthHeaders());
          console.log('Bulk password reset initiated for:', userId);
        }
      }
      fetchUsers();
      setSelectedUsers([]);
    } catch (err) {
      setError('Bulk action failed.');
      console.error("Error performing bulk action:", err);
    }
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedRole('');
    setSelectedDepartment('');
    setSelectedStatus('');
  };

  const handleExportUsers = () => {
    console.log('Exporting users...');
    // Implement export logic here
  };

  const handleImportUsers = () => {
    console.log('Importing users...');
    // Implement import logic here
  };

  const userStats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    inactive: users.filter(u => u.status === 'inactive').length,
    pending: users.filter(u => u.status === 'pending').length
  };

  const recentActivity = [
    // This would typically come from an activity log API
    { id: 1, type: 'user_created', description: 'User created', timestamp: new Date() },
  ];

  if (loading) {
    return <div>Loading users...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <Breadcrumb />
            <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-text-primary">Gestion des Utilisateurs</h1>
                <p className="mt-2 text-text-secondary">
                  Gérez les comptes utilisateurs et les permissions d'accès au système CrewAI
                </p>
              </div>
              <div className="mt-4 sm:mt-0">
                <Button
                  variant="primary"
                  iconName="UserPlus"
                  onClick={handleAddUser}
                >
                  Ajouter un Utilisateur
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              {/* Filters */}
              <UserFilters
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                selectedRole={selectedRole}
                onRoleChange={setSelectedRole}
                selectedDepartment={selectedDepartment}
                onDepartmentChange={setSelectedDepartment}
                selectedStatus={selectedStatus}
                onStatusChange={setSelectedStatus}
                onClearFilters={handleClearFilters}
              />

              {/* Bulk Actions */}
              <BulkActions
                selectedUsers={selectedUsers}
                onBulkAction={handleBulkAction}
                totalUsers={filteredUsers.length}
              />

              {/* Users Table */}
              <UserTable
                users={filteredUsers}
                onEditUser={handleEditUser}
                onDeactivateUser={handleDeactivateUser}
                onDeleteUser={handleDeleteUser} // Add delete handler
                onResetPassword={handleResetPassword}
                selectedUsers={selectedUsers}
                onSelectUser={handleSelectUser}
                onSelectAll={handleSelectAll}
              />

              {/* Results Summary */}
              <div className="flex items-center justify-between text-sm text-text-secondary">
                <span>
                  Affichage de {filteredUsers.length} utilisateur{filteredUsers.length > 1 ? 's' : ''} 
                  {filteredUsers.length !== users.length && ` sur ${users.length} au total`}
                </span>
                <div className="flex items-center space-x-2">
                  <Icon name="Users" size={16} />
                  <span>{filteredUsers.length} résultat{filteredUsers.length > 1 ? 's' : ''}</span>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <UserSidebar
                userStats={userStats}
                recentActivity={recentActivity}
                onExportUsers={handleExportUsers}
                onImportUsers={handleImportUsers}
              />
            </div>
          </div>
        </div>
      </main>

      {/* User Modal */}
      <UserModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        user={currentUser}
        onSave={handleSaveUser}
        mode={modalMode}
      />
    </div>
  );
};

export default UserManagement;
