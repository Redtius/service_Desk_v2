import React from 'react';
import Icon from '../../../components/AppIcon';

const ToolboxPanel = ({ onDragStart }) => {
  const workflowElements = [
    {
      id: 'start-node',
      type: 'start',
      name: 'Start Node',
      icon: 'Play',
      description: 'Workflow entry point',
      color: 'bg-success-100 border-success-300'
    },
    {
      id: 'end-node',
      type: 'end',
      name: 'End Node',
      icon: 'Square',
      description: 'Workflow completion',
      color: 'bg-error-100 border-error-300'
    },
    {
      id: 'decision-point',
      type: 'decision',
      name: 'Decision Point',
      icon: 'GitBranch',
      description: 'Conditional logic branch',
      color: 'bg-warning-100 border-warning-300'
    },
    {
      id: 'action-block',
      type: 'action',
      name: 'Action Block',
      icon: 'Zap',
      description: 'Execute specific action',
      color: 'bg-primary-100 border-primary-300'
    },
    {
      id: 'escalation-trigger',
      type: 'escalation',
      name: 'Escalation Trigger',
      icon: 'AlertTriangle',
      description: 'Escalate to human expert',
      color: 'bg-accent-100 border-accent-300'
    },
    {
      id: 'room-creation',
      type: 'room_creation',
      name: 'Room Creation',
      icon: 'MessageCircle',
      description: 'Create support chat room',
      color: 'bg-blue-100 border-blue-300'
    },
    {
      id: 'automation-agent',
      type: 'agent',
      name: 'Automation Agent',
      icon: 'Bot',
      description: 'AI agent processing',
      color: 'bg-secondary-100 border-secondary-300'
    },
    {
      id: 'verification-step',
      type: 'verification',
      name: 'Verification Step',
      icon: 'CheckCircle',
      description: 'Validate conditions',
      color: 'bg-success-100 border-success-300'
    },
    {
      id: 'delay-timer',
      type: 'delay',
      name: 'Delay Timer',
      icon: 'Clock',
      description: 'Wait for specified time',
      color: 'bg-slate-100 border-slate-300'
    }
  ];

  const handleDragStart = (e, element) => {
    e.dataTransfer.setData('application/json', JSON.stringify(element));
    e.dataTransfer.effectAllowed = 'copy';
    onDragStart && onDragStart(element);
  };

  return (
    <div className="w-full h-full bg-surface border-r border-border overflow-y-auto">
      <div className="p-4">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="Package" size={20} className="text-primary" />
          <h3 className="font-heading font-semibold text-text-primary">Workflow Elements</h3>
        </div>
        
        <div className="space-y-3">
          {workflowElements.map((element) => (
            <div
              key={element.id}
              draggable
              onDragStart={(e) => handleDragStart(e, element)}
              className={`p-3 rounded-lg border-2 border-dashed cursor-grab active:cursor-grabbing transition-smooth hover:shadow-elevation-1 hover:scale-105 ${element.color}`}
            >
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <Icon name={element.icon} size={18} className="text-text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-text-primary truncate">
                    {element.name}
                  </div>
                  <div className="text-xs text-text-secondary mt-1">
                    {element.description}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-border">
          <h4 className="text-sm font-medium text-text-primary mb-3">Quick Actions</h4>
          <div className="space-y-2">
            <button className="w-full flex items-center space-x-2 p-2 text-sm text-text-secondary hover:text-text-primary hover:bg-surface-secondary rounded-lg transition-smooth">
              <Icon name="Download" size={16} />
              <span>Import Template</span>
            </button>
            <button className="w-full flex items-center space-x-2 p-2 text-sm text-text-secondary hover:text-text-primary hover:bg-surface-secondary rounded-lg transition-smooth">
              <Icon name="FileText" size={16} />
              <span>View Examples</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolboxPanel;