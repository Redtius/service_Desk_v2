import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import { useAuth } from '../../context/AuthContext';
import { getRoles } from '../../api/roles';

const Header = () => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user: currentUser } = useAuth();
  const [roles, setRoles] = useState([]);

  const userMenuRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const navigationItems = [
    { name: 'Dashboard', path: '/agent-dashboard', icon: 'BarChart3' },
    { name: 'Agent Config', path: '/agent-configuration', icon: 'Settings' },
    { name: 'Workflow Designer', path: '/workflow-designer', icon: 'GitBranch' },
    { name: 'Support Chat', path: '/support-chat-interface', icon: 'MessageCircle' },
    { name: 'Integrations', path: '/integration-settings', icon: 'Plug' },
    { name: 'User Management', path: '/user-management', icon: 'Users' },
  ];

  useEffect(() => {
    getRoles()
      .then(data => setRoles(data))
      .catch(err => console.error('Failed to load roles:', err));
  }, []);

  useEffect(() => {
    const handleClickOutside = event => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavigation = path => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
    setIsUserMenuOpen(false);
  };

  const isActivePath = path => location.pathname === path;

  const getInitials = name =>
    name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : '';

  const userName = currentUser?.full_name || '';
  const userEmail = currentUser?.email || '';
  const roleObj = roles.find(r => r.id === currentUser?.role_id);
  const userRole = roleObj?.name || '';

  return (
    <header className="fixed top-0 left-0 right-0 bg-surface border-b border-border z-1000">
      <div className="px-5 h-15">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Bot" size={20} color="white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-heading font-semibold text-text-primary">
                  SD Agent Manager
                </h1>
              </div>
            </div>
          </div>

          <nav className="hidden lg:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-smooth ${
                  isActivePath(item.path)
                    ? 'bg-primary-50 text-primary border-2 border-primary' :'text-text-secondary hover:text-text-primary hover:bg-surface-secondary'
                }`}
              >
                <Icon name={item.icon} size={16} />
                <span>{item.name}</span>
              </button>
            ))}
          </nav>

          <div className="flex items-center space-x-3">
            <div className="hidden md:flex items-center space-x-2 px-3 py-1 bg-success-50 rounded-full">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse-subtle"></div>
              <span className="text-xs font-medium text-success-700">System Online</span>
            </div>

            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-surface-secondary transition-smooth"
              >
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-primary">
                    {getInitials(userName)}
                  </span>
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-sm font-medium text-text-primary">{userName}</div>
                  <div className="text-xs text-text-secondary">{userRole}</div>
                </div>
                <Icon
                  name="ChevronDown"
                  size={16}
                  className={`transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-surface rounded-lg shadow-elevation-2 border border-border">
                  <div className="p-4 border-b border-border">
                    <div className="text-sm font-medium text-text-primary">{userName}</div>
                    <div className="text-xs text-text-secondary">{userEmail}</div>
                    <div className="text-xs text-text-muted mt-1">{userRole}</div>
                  </div>
                  <div className="py-2">
                    <button
                      onClick={() => handleNavigation('/profile')}
                      className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-surface-secondary transition-smooth"
                    >
                      <Icon name="User" size={16} />
                      <span>Profile Settings</span>
                    </button>
                    <button
                      onClick={() => {}}
                      className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-surface-secondary transition-smooth"
                    >
                      <Icon name="Settings" size={16} />
                      <span>Preferences</span>
                    </button>
                    <div className="border-t border-border my-2"></div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-error hover:bg-error-50 transition-smooth"
                    >
                      <Icon name="LogOut" size={16} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-surface-secondary transition-smooth"
            >
              <Icon name={isMobileMenuOpen ? 'X' : 'Menu'} size={20} />
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden bg-surface border-t border-border shadow-elevation-2">
          <nav className="px-5 py-4 space-y-2">
            {navigationItems.map(item => (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-sm font-medium transition-smooth ${
                  isActivePath(item.path)
                    ? 'bg-primary-50 text-primary border border-primary'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-secondary'
                }`}
              >
                <Icon name={item.icon} size={18} />
                <span>{item.name}</span>
              </button>
            ))}
            <div className="flex items-center space-x-3 px-4 py-3 mt-4 bg-success-50 rounded-lg">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse-subtle"></div>
              <span className="text-sm font-medium text-success-700">System Online</span>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
