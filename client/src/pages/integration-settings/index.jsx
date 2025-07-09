import React, { useState } from 'react';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Icon from '../../components/AppIcon';
import MSTeamsConfig from './components/MSTeamsConfig';
import JiraConfig from './components/JiraConfig';
import DatabaseConfig from './components/DatabaseConfig';
import SLAManager from './components/SLAManager';

const IntegrationSettings = () => {
  const [activeTab, setActiveTab] = useState('teams');

  const tabs = [
    {
      id: 'teams',
      name: 'MS Teams',
      icon: 'MessageSquare',
      component: MSTeamsConfig
    },
    {
      id: 'jira',
      name: 'Jira Service',
      icon: 'Bug',
      component: JiraConfig
    },
    {
      id: 'database',
      name: 'Old Problems DB',
      icon: 'Database',
      component: DatabaseConfig
    },
    {
      id: 'sla',
      name: 'SLA Management',
      icon: 'FileText',
      component: SLAManager
    }
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <Breadcrumb />
            <div className="mt-4">
              <h1 className="text-3xl font-bold text-text-primary">Integration Settings</h1>
              <p className="text-text-secondary mt-2">
                Configure external service connections and manage system integrations
              </p>
            </div>
          </div>

          {/* Integration Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                className={`bg-surface rounded-lg border p-6 cursor-pointer transition-all ${
                  activeTab === tab.id
                    ? 'border-primary bg-primary-50 shadow-elevation-2'
                    : 'border-border hover:border-primary-200 hover:shadow-elevation-1'
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    activeTab === tab.id ? 'bg-primary text-white' : 'bg-surface-secondary'
                  }`}>
                    <Icon name={tab.icon} size={20} />
                  </div>
                  <div>
                    <h3 className={`font-semibold ${
                      activeTab === tab.id ? 'text-primary' : 'text-text-primary'
                    }`}>
                      {tab.name}
                    </h3>
                    <div className="flex items-center space-x-1 mt-1">
                      <div className="w-2 h-2 bg-success rounded-full"></div>
                      <span className="text-xs text-text-secondary">Connected</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Tab Navigation */}
          <div className="bg-surface rounded-lg border border-border mb-6">
            <div className="border-b border-border">
              <nav className="flex space-x-8 px-6" aria-label="Integration tabs">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-primary text-primary' :'border-transparent text-text-secondary hover:text-text-primary hover:border-border'
                    }`}
                  >
                    <Icon name={tab.icon} size={16} />
                    <span>{tab.name}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {ActiveComponent && <ActiveComponent />}
            </div>
          </div>

          {/* Integration Status Summary */}
          <div className="bg-surface rounded-lg border border-border p-6">
            <h2 className="text-xl font-semibold text-text-primary mb-4">Integration Status</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center space-x-3 p-4 bg-success-50 rounded-lg">
                <Icon name="CheckCircle" size={20} className="text-success" />
                <div>
                  <p className="font-medium text-success-700">MS Teams</p>
                  <p className="text-sm text-success-600">Active</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-success-50 rounded-lg">
                <Icon name="CheckCircle" size={20} className="text-success" />
                <div>
                  <p className="font-medium text-success-700">Jira Service</p>
                  <p className="text-sm text-success-600">Connected</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-warning-50 rounded-lg">
                <Icon name="AlertCircle" size={20} className="text-warning" />
                <div>
                  <p className="font-medium text-warning-700">Old Problems DB</p>
                  <p className="text-sm text-warning-600">Syncing</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-success-50 rounded-lg">
                <Icon name="CheckCircle" size={20} className="text-success" />
                <div>
                  <p className="font-medium text-success-700">SLA Manager</p>
                  <p className="text-sm text-success-600">Configured</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default IntegrationSettings;