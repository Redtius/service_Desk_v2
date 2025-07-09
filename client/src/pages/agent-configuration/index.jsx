import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import AgentSidebar from './components/AgentSidebar';
import GeneralSettingsTab from './components/GeneralSettingsTab';
import RoleAssignmentTab from './components/RoleAssignmentTab';
import CommunicationSettingsTab from './components/CommunicationSettingsTab';
import IntegrationConfigTab from './components/IntegrationConfigTab';

const AgentConfiguration = () => {
  const navigate = useNavigate();
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [activeTab, setActiveTab] = useState('general');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  // Mock agents data
  const [agents, setAgents] = useState([
    {
      id: 1,
      name: "Primary Automation Agent",
      description: "Main automation platform for ticket processing and workflow orchestration",
      role: "Automation Platform",
      type: "coordinator",
      status: "active",
      priority: "high",
      maxConcurrentTasks: 10,
      timeout: 60,
      retryAttempts: 3,
      tags: ["automation", "primary", "coordinator"],
      isEnabled: true,
      autoStart: true,
      logLevel: "info",
      hasErrors: false,
      lastModified: new Date(Date.now() - 3600000),
      communicationSettings: {
        channels: ["email", "teams"],
        responseTemplates: [
          {
            id: 1,
            name: "Ticket Acknowledgment",
            type: "acknowledgment",
            subject: "Your ticket has been received",
            content: "Thank you for contacting our support team. Your ticket has been received and assigned ID: {{ticketId}}. We will respond within our standard SLA timeframe."
          }
        ],
        notificationSettings: {
          realTime: true,
          dailyDigest: true,
          errorNotifications: true
        },
        escalationSettings: {
          timeout: 30,
          maxLevel: 3,
          autoEscalateCritical: true
        },
        languageSettings: {
          primary: "en",
          fallback: "en",
          autoDetect: true
        }
      },
      integrations: {
        teams: {
          enabled: true,
          webhookUrl: "https://outlook.office.com/webhook/...",
          channelId: "19:meeting_...",
          tenantId: "tenant-123"
        },
        jira: {
          enabled: true,
          baseUrl: "https://company.atlassian.net",
          username: "automation@company.com",
          apiToken: "***hidden***",
          projectKey: "SUPPORT"
        }
      }
    },
    {
      id: 2,
      name: "Ticket Verification Agent",
      description: "Validates ticket information and verifies solutions before implementation",
      role: "Verification Agent",
      type: "specialized",
      status: "active",
      priority: "medium",
      maxConcurrentTasks: 5,
      timeout: 45,
      retryAttempts: 2,
      tags: ["verification", "quality", "validation"],
      isEnabled: true,
      autoStart: true,
      logLevel: "warn",
      hasErrors: false,
      lastModified: new Date(Date.now() - 7200000)
    },
    {
      id: 3,
      name: "Customer Support Agent",
      description: "Handles direct customer interactions and provides first-level support",
      role: "Support Agent",
      type: "standard",
      status: "active",
      priority: "high",
      maxConcurrentTasks: 8,
      timeout: 30,
      retryAttempts: 3,
      tags: ["support", "customer", "frontline"],
      isEnabled: true,
      autoStart: true,
      logLevel: "info",
      hasErrors: false,
      lastModified: new Date(Date.now() - 1800000)
    },
    {
      id: 4,
      name: "Escalation Manager Agent",
      description: "Manages complex issues requiring escalation to specialists",
      role: "Escalation Agent",
      type: "specialized",
      status: "inactive",
      priority: "critical",
      maxConcurrentTasks: 3,
      timeout: 120,
      retryAttempts: 5,
      tags: ["escalation", "complex", "specialist"],
      isEnabled: false,
      autoStart: false,
      logLevel: "debug",
      hasErrors: true,
      lastModified: new Date(Date.now() - 86400000)
    },
    {
      id: 5,
      name: "Senior Technical Expert",
      description: "Human expert for the most complex technical issues",
      role: "Human Expert",
      type: "monitor",
      status: "active",
      priority: "critical",
      maxConcurrentTasks: 2,
      timeout: 240,
      retryAttempts: 1,
      tags: ["expert", "human", "technical"],
      isEnabled: true,
      autoStart: false,
      logLevel: "error",
      hasErrors: false,
      lastModified: new Date(Date.now() - 14400000)
    }
  ]);

  const tabs = [
    { id: 'general', name: 'General Settings', icon: 'Settings' },
    { id: 'role', name: 'Role Assignment', icon: 'UserCheck' },
    { id: 'communication', name: 'Communication', icon: 'MessageCircle' },
    { id: 'integration', name: 'Integrations', icon: 'Plug' }
  ];

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Auto-select first agent if none selected
    if (agents.length > 0 && !selectedAgent) {
      setSelectedAgent(agents[0]);
    }
  }, [agents, selectedAgent]);

  const handleAgentSelect = (agent) => {
    setSelectedAgent(agent);
    setActiveTab('general');
    if (isMobile) {
      setIsSidebarCollapsed(true);
    }
  };

  const handleCreateAgent = () => {
    setShowCreateModal(true);
  };

  const handleSaveAgent = async (updatedData) => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setAgents(prev => prev.map(agent => 
        agent.id === selectedAgent.id 
          ? { ...agent, ...updatedData, lastModified: new Date() }
          : agent
      ));
      
      setSelectedAgent(prev => ({ ...prev, ...updatedData, lastModified: new Date() }));
      
      // Show success message (in real app, use toast notification)
      console.log('Agent configuration saved successfully');
      
    } catch (error) {
      console.error('Failed to save agent configuration:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form or navigate away
    console.log('Configuration cancelled');
  };

  const renderTabContent = () => {
    if (!selectedAgent) return null;

    switch (activeTab) {
      case 'general':
        return (
          <GeneralSettingsTab
            agent={selectedAgent}
            onSave={handleSaveAgent}
            onCancel={handleCancel}
            isLoading={isLoading}
          />
        );
      case 'role':
        return (
          <RoleAssignmentTab
            agent={selectedAgent}
            onSave={handleSaveAgent}
            onCancel={handleCancel}
            isLoading={isLoading}
          />
        );
      case 'communication':
        return (
          <CommunicationSettingsTab
            agent={selectedAgent}
            onSave={handleSaveAgent}
            onCancel={handleCancel}
            isLoading={isLoading}
          />
        );
      case 'integration':
        return (
          <IntegrationConfigTab
            agent={selectedAgent}
            onSave={handleSaveAgent}
            onCancel={handleCancel}
            isLoading={isLoading}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-15">
        <div className="flex h-[calc(100vh-60px)]">
          {/* Sidebar */}
          <AgentSidebar
            agents={agents}
            selectedAgent={selectedAgent}
            onAgentSelect={handleAgentSelect}
            onCreateAgent={handleCreateAgent}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          />

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Content Header */}
            <div className="bg-surface border-b border-border px-6 py-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <Breadcrumb />
                  <h1 className="text-2xl font-heading font-bold text-text-primary mt-2">
                    Agent Configuration
                  </h1>
                  {selectedAgent && (
                    <p className="text-text-muted mt-1">
                      Configuring: <span className="font-medium text-text-primary">{selectedAgent.name}</span>
                    </p>
                  )}
                </div>
                
                {selectedAgent && (
                  <div className="flex items-center space-x-3">
                    <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
                      selectedAgent.status === 'active' ?'bg-success-50 text-success-700' :'bg-error-50 text-error-700'
                    }`}>
                      <div className={`w-2 h-2 rounded-full ${
                        selectedAgent.status === 'active' ? 'bg-success' : 'bg-error'
                      }`}></div>
                      <span className="capitalize">{selectedAgent.status}</span>
                    </div>
                    
                    <Button variant="outline" iconName="Copy">
                      Clone Agent
                    </Button>
                    
                    <Button variant="outline" iconName="Download">
                      Export Config
                    </Button>
                  </div>
                )}
              </div>

              {/* Tab Navigation */}
              {selectedAgent && (
                <div className="flex space-x-1 overflow-x-auto">
                  {tabs.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-smooth ${
                        activeTab === tab.id
                          ? 'bg-primary text-primary-foreground'
                          : 'text-text-secondary hover:text-text-primary hover:bg-surface-secondary'
                      }`}
                    >
                      <Icon name={tab.icon} size={16} />
                      <span>{tab.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {selectedAgent ? (
                renderTabContent()
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <Icon name="Bot" size={64} className="mx-auto mb-4 text-text-muted opacity-50" />
                    <h3 className="text-lg font-medium text-text-primary mb-2">No Agent Selected</h3>
                    <p className="text-text-muted mb-4">Select an agent from the sidebar to configure its settings</p>
                    <Button variant="primary" onClick={handleCreateAgent} iconName="Plus">
                      Create New Agent
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Create Agent Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-surface rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-heading font-semibold text-text-primary mb-4">
              Create New Agent
            </h3>
            <p className="text-text-muted mb-6">
              This feature will be available in the next version. For now, you can configure existing agents.
            </p>
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentConfiguration;