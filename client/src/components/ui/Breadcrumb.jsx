import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';

const Breadcrumb = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const routeMap = {
    '/agent-dashboard': { name: 'Dashboard', icon: 'BarChart3' },
    '/agent-configuration': { name: 'Agent Configuration', icon: 'Settings' },
    '/workflow-designer': { name: 'Workflow Designer', icon: 'GitBranch' },
    '/integration-settings': { name: 'Integration Settings', icon: 'Plug' },
    '/user-management': { name: 'User Management', icon: 'Users' },
    '/login': { name: 'Login', icon: 'LogIn' }
  };

  const generateBreadcrumbs = () => {
    const pathSegments = location.pathname.split('/').filter(segment => segment);
    const breadcrumbs = [];

    // Always start with Dashboard as home
    if (location.pathname !== '/agent-dashboard') {
      breadcrumbs.push({
        name: 'Dashboard',
        path: '/agent-dashboard',
        icon: 'BarChart3',
        isClickable: true
      });
    }

    // Add current page
    const currentRoute = routeMap[location.pathname];
    if (currentRoute && location.pathname !== '/agent-dashboard') {
      breadcrumbs.push({
        name: currentRoute.name,
        path: location.pathname,
        icon: currentRoute.icon,
        isClickable: false
      });
    }

    // If we're on dashboard, show just the dashboard
    if (location.pathname === '/agent-dashboard') {
      breadcrumbs.push({
        name: 'Dashboard',
        path: '/agent-dashboard',
        icon: 'BarChart3',
        isClickable: false
      });
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  const handleBreadcrumbClick = (path) => {
    navigate(path);
  };

  if (location.pathname === '/login') {
    return null;
  }

  return (
    <nav className="flex items-center space-x-2 text-sm" aria-label="Breadcrumb">
      <Icon name="Home" size={16} className="text-text-muted" />
      
      {breadcrumbs.map((breadcrumb, index) => (
        <React.Fragment key={breadcrumb.path}>
          {index > 0 && (
            <Icon name="ChevronRight" size={14} className="text-text-muted" />
          )}
          
          <div className="flex items-center space-x-1">
            <Icon name={breadcrumb.icon} size={14} className="text-text-muted" />
            
            {breadcrumb.isClickable ? (
              <button
                onClick={() => handleBreadcrumbClick(breadcrumb.path)}
                className="text-text-secondary hover:text-primary transition-smooth font-medium"
              >
                {breadcrumb.name}
              </button>
            ) : (
              <span className="text-text-primary font-medium">
                {breadcrumb.name}
              </span>
            )}
          </div>
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;