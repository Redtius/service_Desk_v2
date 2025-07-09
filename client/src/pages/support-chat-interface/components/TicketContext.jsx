import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const TicketContext = ({ selectedRoom, onEscalateTicket, onChangeStatus }) => {
  const [showKnowledgeBase, setShowKnowledgeBase] = useState(false);
  const [notes, setNotes] = useState('');

  if (!selectedRoom) {
    return (
      <div className="h-full bg-surface border-l border-border flex items-center justify-center">
        <div className="text-center p-6">
          <Icon name="FileText" size={48} className="text-text-muted mx-auto mb-4" />
          <h3 className="text-lg font-medium text-text-primary mb-2">No Ticket Selected</h3>
          <p className="text-text-secondary">
            Select a chat room to view ticket details and context
          </p>
        </div>
      </div>
    );
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'bg-error-100 text-error-700 border-error-200';
      case 'high': return 'bg-warning-100 text-warning-700 border-warning-200';
      case 'medium': return 'bg-primary-100 text-primary-700 border-primary-200';
      case 'low': return 'bg-success-100 text-success-700 border-success-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-success-100 text-success-700 border-success-200';
      case 'pending': return 'bg-warning-100 text-warning-700 border-warning-200';
      case 'resolved': return 'bg-slate-100 text-slate-700 border-slate-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const handleEscalate = () => {
    onEscalateTicket(selectedRoom.ticketId);
  };

  const handleStatusChange = (newStatus) => {
    onChangeStatus(selectedRoom.ticketId, newStatus);
  };

  const mockWorkflowInfo = {
    currentNode: 'Room Creation',
    nodeType: 'room_creation',
    previousNodes: ['Start Node', 'User Input Validation'],
    nextNodes: ['Agent Assignment', 'Escalation Trigger'],
    executionTime: '2024-01-15 10:30:00'
  };

  const mockKnowledgeBase = [
    {
      id: 1,
      title: 'Login Issues - Common Solutions',
      category: 'Authentication',
      relevance: 95,
      content: 'Password reset procedures and account lockout solutions...'
    },
    {
      id: 2,
      title: 'Account Security Best Practices',
      category: 'Security',
      relevance: 78,
      content: 'Two-factor authentication setup and security recommendations...'
    },
    {
      id: 3,
      title: 'Browser Compatibility Guide',
      category: 'Technical',
      relevance: 65,
      content: 'Supported browsers and troubleshooting steps...'
    }
  ];

  return (
    <div className="h-full bg-surface border-l border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center space-x-2 mb-3">
          <Icon name="FileText" size={20} className="text-primary" />
          <h3 className="font-heading font-semibold text-text-primary">Ticket Context</h3>
        </div>
        
        {/* Quick Actions */}
        <div className="flex space-x-2">
          <button
            onClick={handleEscalate}
            className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-smooth ${
              selectedRoom.escalated 
                ? 'bg-error-100 text-error-700 border border-error-200' :'bg-surface-secondary text-text-secondary hover:bg-warning-100 hover:text-warning-700'
            }`}
          >
            <Icon name="AlertTriangle" size={14} />
            <span>{selectedRoom.escalated ? 'Escalated' : 'Escalate'}</span>
          </button>
          
          <div className="relative">
            <select
              value={selectedRoom.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="appearance-none bg-surface-secondary border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="resolved">Resolved</option>
            </select>
            <Icon name="ChevronDown" size={12} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-text-muted pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Ticket Details */}
        <div className="p-4 border-b border-border">
          <h4 className="font-medium text-text-primary mb-3">Ticket Details</h4>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">Ticket ID</span>
              <span className="text-sm font-medium text-text-primary">{selectedRoom.ticketId}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">Priority</span>
              <span className={`text-xs px-2 py-1 rounded-full border ${getPriorityColor(selectedRoom.priority)}`}>
                {selectedRoom.priority}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">Status</span>
              <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(selectedRoom.status)}`}>
                {selectedRoom.status}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">Created</span>
              <span className="text-sm text-text-primary">2 hours ago</span>
            </div>
          </div>
        </div>

        {/* User Information */}
        <div className="p-4 border-b border-border">
          <h4 className="font-medium text-text-primary mb-3">User Information</h4>
          
          <div className="space-y-3">
            <div>
              <span className="text-sm text-text-secondary">Name</span>
              <p className="text-sm font-medium text-text-primary">{selectedRoom.user?.name}</p>
            </div>
            
            <div>
              <span className="text-sm text-text-secondary">Email</span>
              <p className="text-sm text-text-primary">{selectedRoom.user?.email}</p>
            </div>
            
            <div>
              <span className="text-sm text-text-secondary">Account Type</span>
              <p className="text-sm text-text-primary">Premium</p>
            </div>
            
            <div>
              <span className="text-sm text-text-secondary">Previous Tickets</span>
              <p className="text-sm text-text-primary">3 resolved</p>
            </div>
          </div>
        </div>

        {/* Workflow Context */}
        <div className="p-4 border-b border-border">
          <h4 className="font-medium text-text-primary mb-3">Workflow Context</h4>
          
          <div className="space-y-3">
            <div>
              <span className="text-sm text-text-secondary">Current Node</span>
              <div className="flex items-center space-x-2 mt-1">
                <Icon name="MessageCircle" size={16} className="text-primary" />
                <span className="text-sm font-medium text-text-primary">{mockWorkflowInfo.currentNode}</span>
              </div>
            </div>
            
            <div>
              <span className="text-sm text-text-secondary">Node ID</span>
              <p className="text-sm text-text-primary font-mono">{selectedRoom.workflowNodeId}</p>
            </div>
            
            <div>
              <span className="text-sm text-text-secondary">Execution Time</span>
              <p className="text-sm text-text-primary">{mockWorkflowInfo.executionTime}</p>
            </div>
            
            <div>
              <span className="text-sm text-text-secondary">Next Steps</span>
              <div className="mt-1 space-y-1">
                {mockWorkflowInfo.nextNodes.map((node, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Icon name="ArrowRight" size={12} className="text-text-muted" />
                    <span className="text-sm text-text-primary">{node}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Knowledge Base */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-text-primary">Knowledge Base</h4>
            <button
              onClick={() => setShowKnowledgeBase(!showKnowledgeBase)}
              className="text-sm text-primary hover:text-primary-600"
            >
              {showKnowledgeBase ? 'Hide' : 'Show'}
            </button>
          </div>
          
          {showKnowledgeBase && (
            <div className="space-y-2">
              {mockKnowledgeBase.map(article => (
                <div key={article.id} className="p-3 bg-surface-secondary rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h5 className="text-sm font-medium text-text-primary">{article.title}</h5>
                    <span className="text-xs text-success-600 bg-success-100 px-2 py-1 rounded">
                      {article.relevance}%
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary mb-2">{article.category}</p>
                  <p className="text-xs text-text-muted">{article.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Internal Notes */}
        <div className="p-4">
          <h4 className="font-medium text-text-primary mb-3">Internal Notes</h4>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add internal notes about this ticket..."
            className="w-full p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none"
            rows={4}
          />
          <button className="mt-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-smooth text-sm">
            Save Notes
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketContext;