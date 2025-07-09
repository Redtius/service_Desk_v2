import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const WorkflowToolbar = ({ onSave, onTest, onExport, onImport, onClear }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave?.();
    } finally {
      setIsSaving(false);
    }
  };

  const handleTest = async () => {
    setIsTesting(true);
    try {
      await onTest?.();
    } finally {
      setIsTesting(false);
    }
  };

  const workflowActions = [
    {
      id: 'save',
      label: 'Save Workflow',
      icon: 'Save',
      variant: 'primary',
      onClick: handleSave,
      loading: isSaving
    },
    {
      id: 'test',
      label: 'Test Workflow',
      icon: 'Play',
      variant: 'secondary',
      onClick: handleTest,
      loading: isTesting
    },
    {
      id: 'export',
      label: 'Export',
      icon: 'Download',
      variant: 'outline',
      onClick: onExport
    },
    {
      id: 'import',
      label: 'Import',
      icon: 'Upload',
      variant: 'outline',
      onClick: onImport
    }
  ];

  const utilityActions = [
    {
      id: 'validate',
      label: 'Validate',
      icon: 'CheckCircle',
      variant: 'ghost'
    },
    {
      id: 'clear',
      label: 'Clear Canvas',
      icon: 'Trash2',
      variant: 'ghost',
      onClick: onClear
    }
  ];

  return (
    <div className="bg-surface border-b border-border px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Left Section - Main Actions */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            {workflowActions.map((action) => (
              <Button
                key={action.id}
                variant={action.variant}
                size="sm"
                iconName={action.icon}
                iconPosition="left"
                onClick={action.onClick}
                loading={action.loading}
              >
                {action.label}
              </Button>
            ))}
          </div>
          
          <div className="w-px h-6 bg-border"></div>
          
          <div className="flex items-center space-x-1">
            {utilityActions.map((action) => (
              <Button
                key={action.id}
                variant={action.variant}
                size="sm"
                iconName={action.icon}
                onClick={action.onClick}
                title={action.label}
              />
            ))}
          </div>
        </div>

        {/* Center Section - Workflow Info */}
        <div className="hidden md:flex items-center space-x-4 text-sm text-text-secondary">
          <div className="flex items-center space-x-2">
            <Icon name="FileText" size={16} />
            <span>Untitled Workflow</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success rounded-full"></div>
            <span>Auto-saved</span>
          </div>
        </div>

        {/* Right Section - View Controls */}
        <div className="flex items-center space-x-3">
          <div className="hidden lg:flex items-center space-x-2 text-sm text-text-secondary">
            <Icon name="Eye" size={16} />
            <span>View:</span>
            <select className="bg-transparent border-none text-text-secondary focus:outline-none">
              <option value="design">Design</option>
              <option value="preview">Preview</option>
              <option value="code">Code</option>
            </select>
          </div>
          
          <div className="w-px h-6 bg-border"></div>
          
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              iconName="Undo"
              title="Undo"
            />
            <Button
              variant="ghost"
              size="sm"
              iconName="Redo"
              title="Redo"
            />
          </div>
        </div>
      </div>

      {/* Mobile Actions */}
      <div className="md:hidden mt-3 flex items-center justify-between">
        <div className="flex items-center space-x-2 text-sm text-text-secondary">
          <Icon name="FileText" size={16} />
          <span>Untitled Workflow</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-success rounded-full"></div>
          <span className="text-sm text-text-secondary">Auto-saved</span>
        </div>
      </div>
    </div>
  );
};

export default WorkflowToolbar;