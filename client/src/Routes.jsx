import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route, Navigate } from "react-router-dom";
import ScrollToTop from 'components/ScrollToTop';
import ErrorBoundary from './components/ErrorBoundary';
import { useAuth } from "./context/AuthContext";

// Add your imports here
import Login from "./pages/login";
import WorkflowDesigner from "./pages/workflow-designer";
import AgentDashboard from "./pages/agent-dashboard";
import IntegrationSettings from "./pages/integration-settings";
import UserManagement from "./pages/user-management";
import AgentConfiguration from "./pages/agent-configuration";
import SupportChatInterface from "./pages/support-chat-interface";
import NotFound from "./pages/NotFound";

const PrivateRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/agent-dashboard" replace />; // Redirect non-admins from admin routes
  }

  return children;
};

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />

        {/* Protected routes */}
        <Route path="/" element={<PrivateRoute><AgentDashboard /></PrivateRoute>} />
        <Route path="/workflow-designer" element={<PrivateRoute><WorkflowDesigner /></PrivateRoute>} />
        <Route path="/agent-dashboard" element={<PrivateRoute><AgentDashboard /></PrivateRoute>} />
        <Route path="/integration-settings" element={<PrivateRoute ><IntegrationSettings /></PrivateRoute>} />
        <Route path="/support-chat-interface" element={<PrivateRoute><SupportChatInterface /></PrivateRoute>} />

        {/* Admin-only routes */}
        <Route path="/user-management" element={<PrivateRoute><UserManagement /></PrivateRoute>} />
        <Route path="/agent-configuration" element={<PrivateRoute><AgentConfiguration /></PrivateRoute>} />

        {/* Catch all other routes */}
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;