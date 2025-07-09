import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import KPICard from './components/KPICard';
import AgentTable from './components/AgentTable';
import ActivityFeed from './components/ActivityFeed';
import SystemNotifications from './components/SystemNotifications';
import FilterControls from './components/FilterControls';

const AgentDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock data for agents
  const [agents] = useState([
    {
      id: 'AGT-001',
      name: 'Primary Automation Agent',
      type: 'Automation Platform',
      status: 'active',
      lastActivity: new Date(Date.now() - 300000),
      performance: 94
    },
    {
      id: 'AGT-002',
      name: 'Ticket Verification Bot',
      type: 'Verification Agent',
      status: 'active',
      lastActivity: new Date(Date.now() - 120000),
      performance: 87
    },
    {
      id: 'AGT-003',
      name: 'Customer Support Assistant',
      type: 'Support Agent',
      status: 'idle',
      lastActivity: new Date(Date.now() - 900000),
      performance: 91
    },
    {
      id: 'AGT-004',
      name: 'Escalation Handler',
      type: 'Escalation Agent',
      status: 'active',
      lastActivity: new Date(Date.now() - 600000),
      performance: 89
    },
    {
      id: 'AGT-005',
      name: 'Technical Expert Bridge',
      type: 'Human Expert',
      status: 'offline',
      lastActivity: new Date(Date.now() - 3600000),
      performance: 96
    },
    {
      id: 'AGT-006',
      name: 'Quality Assurance Bot',
      type: 'Verification Agent',
      status: 'maintenance',
      lastActivity: new Date(Date.now() - 1800000),
      performance: 85
    }
  ]);

  // Mock data for activities
  const [activities] = useState([
    {
      id: 1,
      type: 'ticket_processed',
      title: 'Ticket #TKT-2024-001 processed successfully',
      description: 'Customer inquiry about password reset resolved automatically',
      agent: 'Primary Automation Agent',
      timestamp: new Date(Date.now() - 180000)
    },
    {
      id: 2,
      type: 'escalation',
      title: 'Ticket escalated to human expert',
      description: 'Complex technical issue requires specialist attention',
      agent: 'Escalation Handler',
      timestamp: new Date(Date.now() - 420000)
    },
    {
      id: 3,
      type: 'agent_started',
      title: 'Agent successfully started',
      description: 'Quality Assurance Bot resumed operations after maintenance',
      agent: 'Quality Assurance Bot',
      timestamp: new Date(Date.now() - 600000)
    },
    {
      id: 4,
      type: 'configuration_changed',
      title: 'Agent configuration updated',
      description: 'Response templates updated for better customer experience',
      agent: 'Customer Support Assistant',
      timestamp: new Date(Date.now() - 1200000)
    },
    {
      id: 5,
      type: 'error_occurred',
      title: 'Connection timeout detected',
      description: 'Temporary connectivity issue with external service resolved',
      agent: 'Ticket Verification Bot',
      timestamp: new Date(Date.now() - 1800000)
    }
  ]);

  // Mock data for notifications
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'warning',
      title: 'High ticket volume detected',
      message: 'Current ticket volume is 40% above normal. Consider activating additional agents.',
      timestamp: new Date(Date.now() - 300000),
      read: false,
      action: 'View Details'
    },
    {
      id: 2,
      type: 'info',
      title: 'Scheduled maintenance completed',
      message: 'Quality Assurance Bot maintenance completed successfully. All systems operational.',
      timestamp: new Date(Date.now() - 900000),
      read: false,
      action: 'View Report'
    },
    {
      id: 3,
      type: 'success',
      title: 'Performance milestone reached',
      message: 'Primary Automation Agent achieved 95% success rate this week.',
      timestamp: new Date(Date.now() - 1800000),
      read: true,
      action: 'View Analytics'
    },
    {
      id: 4,
      type: 'error',
      title: 'Integration service disruption',
      message: 'Temporary connectivity issues with Jira Service. Monitoring situation.',
      timestamp: new Date(Date.now() - 3600000),
      read: false,
      action: 'Check Status'
    }
  ]);

  // Filter agents based on search and filters
  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || agent.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || agent.status === selectedStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  // Calculate KPIs
  const activeAgents = agents.filter(agent => agent.status === 'active').length;
  const totalTicketsProcessed = 1247;
  const averageSuccessRate = Math.round(agents.reduce((sum, agent) => sum + agent.performance, 0) / agents.length);
  const systemHealth = 98;

  const handleAgentAction = (agentId, action) => {
    console.log(`Performing ${action} on agent ${agentId}`);
    // In a real application, this would make API calls to control agents
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const handleDismissNotification = (notificationId) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Breadcrumb />
          </div>

          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-text-primary mb-2">Agent Dashboard</h1>
            <p className="text-text-secondary">
              Monitor and manage your CrewAI agents in real-time
            </p>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <KPICard
              title="Active Agents"
              value={activeAgents}
              subtitle={`of ${agents.length} total agents`}
              icon="Bot"
              trend="up"
              trendValue="+2"
              color="success"
            />
            <KPICard
              title="Tickets Processed"
              value={totalTicketsProcessed.toLocaleString()}
              subtitle="Last 24 hours"
              icon="CheckCircle"
              trend="up"
              trendValue="+12%"
              color="primary"
            />
            <KPICard
              title="Success Rate"
              value={`${averageSuccessRate}%`}
              subtitle="Average across all agents"
              icon="TrendingUp"
              trend="up"
              trendValue="+3%"
              color="success"
            />
            <KPICard
              title="System Health"
              value={`${systemHealth}%`}
              subtitle="All systems operational"
              icon="Shield"
              trend="up"
              trendValue="+1%"
              color="success"
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            {/* Left Column - Agent Management */}
            <div className="xl:col-span-3 space-y-6">
              {/* Filter Controls */}
              <FilterControls
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                selectedType={selectedType}
                onTypeChange={setSelectedType}
                selectedStatus={selectedStatus}
                onStatusChange={setSelectedStatus}
                onRefresh={handleRefresh}
                isRefreshing={isRefreshing}
              />

              {/* Agents Table */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-text-primary">
                    Agents ({filteredAgents.length})
                  </h2>
                </div>
                <AgentTable
                  agents={filteredAgents}
                  onAgentAction={handleAgentAction}
                />
              </div>
            </div>

            {/* Right Column - Activity & Notifications */}
            <div className="xl:col-span-1 space-y-6">
              {/* System Notifications */}
              <SystemNotifications
                notifications={notifications}
                onDismiss={handleDismissNotification}
                onMarkAllRead={handleMarkAllRead}
              />

              {/* Activity Feed */}
              <ActivityFeed activities={activities} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AgentDashboard;