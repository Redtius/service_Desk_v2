import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RoleAssignmentTab = ({ agent, onSave, onCancel, isLoading }) => {
  const [selectedRole, setSelectedRole] = useState(agent?.role || '');
  const [roleConfig, setRoleConfig] = useState(agent?.roleConfig || {});

  const roles = [
    {
      id: 'automation-platform',
      name: 'Automation Platform',
      description: 'Primary automation engine that processes incoming tickets and determines appropriate actions',
      icon: 'Bot',
      color: 'primary',
      capabilities: [
        'Ticket classification and routing',
        'Automated response generation',
        'Workflow orchestration',
        'Integration with external systems',
        'Performance monitoring and reporting'
      ],
      requirements: [
        'Access to ticket management system',
        'Integration with knowledge base',
        'Workflow execution permissions'
      ],
      configOptions: {
        autoClassification: true,
        responseTemplates: true,
        escalationRules: true,
        integrationSettings: true
      }
    },
    {
      id: 'verification-agent',
      name: 'Verification Agent',
      description: 'Validates and verifies information, solutions, and system states before actions are taken',
      icon: 'CheckCircle',
      color: 'secondary',
      capabilities: [
        'Solution validation and testing',
        'System health verification',
        'Data integrity checks',
        'Compliance validation',
        'Quality assurance processes'
      ],
      requirements: [
        'Read access to system logs',
        'Testing environment access',
        'Validation rule configuration'
      ],
      configOptions: {
        validationRules: true,
        testingProtocols: true,
        complianceChecks: true,
        reportingSettings: true
      }
    },
    {
      id: 'support-agent',
      name: 'Support Agent',
      description: 'Provides direct customer support and handles routine service desk interactions',
      icon: 'Headphones',
      color: 'accent',
      capabilities: [
        'Customer interaction management',
        'Issue resolution and troubleshooting',
        'Knowledge base utilization',
        'Ticket status updates',
        'Customer satisfaction tracking'
      ],
      requirements: [
        'Customer communication channels',
        'Knowledge base access',
        'Ticket management permissions'
      ],
      configOptions: {
        communicationChannels: true,
        responseTemplates: true,
        knowledgeBase: true,
        satisfactionTracking: true
      }
    },
    {
      id: 'escalation-agent',
      name: 'Escalation Agent',
      description: 'Manages complex issues that require escalation to higher-level support or specialists',
      icon: 'AlertTriangle',
      color: 'warning',
      capabilities: [
        'Complex issue analysis',
        'Escalation path management',
        'Specialist routing',
        'Priority assessment',
        'SLA monitoring and enforcement'
      ],
      requirements: [
        'Escalation matrix configuration',
        'Specialist contact database',
        'SLA monitoring tools'
      ],
      configOptions: {
        escalationMatrix: true,
        priorityRules: true,
        slaMonitoring: true,
        specialistRouting: true
      }
    },
    {
      id: 'human-expert',
      name: 'Human Expert',
      description: 'Human specialist who handles the most complex issues requiring expert knowledge and judgment',
      icon: 'User',
      color: 'success',
      capabilities: [
        'Expert-level problem solving',
        'Complex decision making',
        'Specialized knowledge application',
        'Mentoring and training',
        'Process improvement recommendations'
      ],
      requirements: [
        'Expert-level system access',
        'Specialized tools and resources',
        'Training and certification'
      ],
      configOptions: {
        expertiseAreas: true,
        availabilitySchedule: true,
        mentorshipSettings: true,
        processImprovement: true
      }
    }
  ];

  const handleRoleSelect = (roleId) => {
    setSelectedRole(roleId);
    const role = roles.find(r => r.id === roleId);
    if (role) {
      // Initialize default config for the role
      const defaultConfig = {};
      Object.keys(role.configOptions).forEach(option => {
        defaultConfig[option] = role.configOptions[option];
      });
      setRoleConfig(defaultConfig);
    }
  };

  const handleConfigChange = (option, value) => {
    setRoleConfig(prev => ({
      ...prev,
      [option]: value
    }));
  };

  const handleSave = () => {
    const selectedRoleData = roles.find(r => r.id === selectedRole);
    onSave({
      role: selectedRoleData?.name || '',
      roleId: selectedRole,
      roleConfig: roleConfig
    });
  };

  const selectedRoleData = roles.find(r => r.id === selectedRole);

  return (
    <div className="space-y-6">
      {/* Role Selection */}
      <div className="bg-surface border border-border rounded-lg p-6">
        <h3 className="text-lg font-heading font-semibold text-text-primary mb-4 flex items-center">
          <Icon name="UserCheck" size={20} className="mr-2" />
          Select Agent Role
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {roles.map((role) => (
            <div
              key={role.id}
              className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all ${
                selectedRole === role.id
                  ? `border-${role.color} bg-${role.color}-50`
                  : 'border-border hover:border-border-focus hover:shadow-elevation-1'
              }`}
              onClick={() => handleRoleSelect(role.id)}
            >
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg bg-${role.color}-100`}>
                  <Icon name={role.icon} size={20} className={`text-${role.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-text-primary mb-1">{role.name}</h4>
                  <p className="text-sm text-text-muted mb-3">{role.description}</p>
                  
                  <div className="space-y-2">
                    <div>
                      <h5 className="text-xs font-medium text-text-primary mb-1">Key Capabilities:</h5>
                      <ul className="text-xs text-text-muted space-y-1">
                        {role.capabilities.slice(0, 3).map((capability, index) => (
                          <li key={index} className="flex items-center">
                            <Icon name="Check" size={12} className="mr-1 text-success" />
                            {capability}
                          </li>
                        ))}
                        {role.capabilities.length > 3 && (
                          <li className="text-text-muted">
                            +{role.capabilities.length - 3} more capabilities
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              
              {selectedRole === role.id && (
                <div className="absolute top-2 right-2">
                  <div className={`w-6 h-6 rounded-full bg-${role.color} flex items-center justify-center`}>
                    <Icon name="Check" size={14} color="white" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Role Configuration */}
      {selectedRoleData && (
        <div className="bg-surface border border-border rounded-lg p-6">
          <h3 className="text-lg font-heading font-semibold text-text-primary mb-4 flex items-center">
            <Icon name="Settings" size={20} className="mr-2" />
            Configure {selectedRoleData.name}
          </h3>
          
          {/* Role Details */}
          <div className="mb-6 p-4 bg-surface-secondary rounded-lg">
            <div className="flex items-start space-x-3">
              <div className={`p-3 rounded-lg bg-${selectedRoleData.color}-100`}>
                <Icon name={selectedRoleData.icon} size={24} className={`text-${selectedRoleData.color}`} />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-text-primary mb-2">{selectedRoleData.name}</h4>
                <p className="text-sm text-text-muted mb-4">{selectedRoleData.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="text-sm font-medium text-text-primary mb-2">Capabilities</h5>
                    <ul className="space-y-1">
                      {selectedRoleData.capabilities.map((capability, index) => (
                        <li key={index} className="flex items-center text-sm text-text-muted">
                          <Icon name="Check" size={14} className="mr-2 text-success" />
                          {capability}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h5 className="text-sm font-medium text-text-primary mb-2">Requirements</h5>
                    <ul className="space-y-1">
                      {selectedRoleData.requirements.map((requirement, index) => (
                        <li key={index} className="flex items-center text-sm text-text-muted">
                          <Icon name="AlertCircle" size={14} className="mr-2 text-warning" />
                          {requirement}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Configuration Options */}
          <div className="space-y-4">
            <h4 className="font-medium text-text-primary">Configuration Options</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(selectedRoleData.configOptions).map(([option, defaultValue]) => (
                <div key={option} className="flex items-center justify-between p-4 bg-surface-secondary rounded-lg">
                  <div>
                    <h5 className="font-medium text-text-primary capitalize">
                      {option.replace(/([A-Z])/g, ' $1').trim()}
                    </h5>
                    <p className="text-sm text-text-muted">
                      {option === 'autoClassification' && 'Automatically classify incoming tickets'}
                      {option === 'responseTemplates' && 'Use predefined response templates'}
                      {option === 'escalationRules' && 'Apply escalation rules and workflows'}
                      {option === 'integrationSettings' && 'Configure external system integrations'}
                      {option === 'validationRules' && 'Set up validation and verification rules'}
                      {option === 'testingProtocols' && 'Define testing and validation protocols'}
                      {option === 'complianceChecks' && 'Enable compliance and audit checks'}
                      {option === 'reportingSettings' && 'Configure reporting and analytics'}
                      {option === 'communicationChannels' && 'Set up customer communication channels'}
                      {option === 'knowledgeBase' && 'Connect to knowledge base systems'}
                      {option === 'satisfactionTracking' && 'Track customer satisfaction metrics'}
                      {option === 'escalationMatrix' && 'Define escalation paths and triggers'}
                      {option === 'priorityRules' && 'Set priority assessment rules'}
                      {option === 'slaMonitoring' && 'Monitor SLA compliance and alerts'}
                      {option === 'specialistRouting' && 'Configure specialist routing rules'}
                      {option === 'expertiseAreas' && 'Define areas of expertise'}
                      {option === 'availabilitySchedule' && 'Set availability and working hours'}
                      {option === 'mentorshipSettings' && 'Configure mentoring and training'}
                      {option === 'processImprovement' && 'Enable process improvement tracking'}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={roleConfig[option] || false}
                      onChange={(e) => handleConfigChange(option, e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-end space-x-4 pt-6 border-t border-border">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          variant="primary" 
          onClick={handleSave} 
          loading={isLoading} 
          iconName="Save"
          disabled={!selectedRole}
        >
          Save Role Assignment
        </Button>
      </div>
    </div>
  );
};

export default RoleAssignmentTab;