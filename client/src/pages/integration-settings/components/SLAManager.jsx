import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const SLAManager = () => {
  const [slaContent, setSlaContent] = useState(`# Service Level Agreement (SLA)

## Response Times
- **Critical Issues**: 1 hour
- **High Priority**: 4 hours  
- **Medium Priority**: 24 hours
- **Low Priority**: 72 hours

## Resolution Times
- **Critical Issues**: 4 hours
- **High Priority**: 24 hours
- **Medium Priority**: 72 hours
- **Low Priority**: 1 week

## Escalation Matrix
1. **Level 1**: Support Agent (0-2 hours)
2. **Level 2**: Senior Support (2-8 hours)
3. **Level 3**: Technical Lead (8-24 hours)
4. **Level 4**: Management (24+ hours)

## Availability
- **Business Hours**: 9:00 AM - 6:00 PM (Monday-Friday)
- **Emergency Support**: 24/7 for Critical Issues
- **Maintenance Windows**: Saturdays 2:00 AM - 4:00 AM`);

  const [isEditing, setIsEditing] = useState(false);
  const [fileName, setFileName] = useState('SLA.md');
  const [lastModified, setLastModified] = useState(new Date());

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSlaContent(e.target.result);
        setFileName(file.name);
        setLastModified(new Date());
      };
      reader.readAsText(file);
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    setLastModified(new Date());
    console.log('Saving SLA content:', slaContent);
  };

  const handleDownload = () => {
    const blob = new Blob([slaContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setSlaContent(`# Service Level Agreement (SLA)

## Response Times
- **Critical Issues**: 1 hour
- **High Priority**: 4 hours  
- **Medium Priority**: 24 hours
- **Low Priority**: 72 hours

## Resolution Times
- **Critical Issues**: 4 hours
- **High Priority**: 24 hours
- **Medium Priority**: 72 hours
- **Low Priority**: 1 week

## Escalation Matrix
1. **Level 1**: Support Agent (0-2 hours)
2. **Level 2**: Senior Support (2-8 hours)
3. **Level 3**: Technical Lead (8-24 hours)
4. **Level 4**: Management (24+ hours)

## Availability
- **Business Hours**: 9:00 AM - 6:00 PM (Monday-Friday)
- **Emergency Support**: 24/7 for Critical Issues
- **Maintenance Windows**: Saturdays 2:00 AM - 4:00 AM`);
    setFileName('SLA.md');
    setLastModified(new Date());
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* File Information */}
      <div className="bg-surface-secondary rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Icon name="FileText" size={20} className="text-primary" />
            <div>
              <h3 className="font-medium text-text-primary">{fileName}</h3>
              <p className="text-sm text-text-secondary">
                Last modified: {lastModified.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              iconName="Download"
              iconPosition="left"
            >
              Download
            </Button>
            <Button
              variant={isEditing ? "success" : "primary"}
              size="sm"
              onClick={isEditing ? handleSave : () => setIsEditing(true)}
              iconName={isEditing ? "Save" : "Edit"}
              iconPosition="left"
            >
              {isEditing ? "Save" : "Edit"}
            </Button>
          </div>
        </div>
      </div>

      {/* File Upload */}
      <div className="bg-surface rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Upload SLA Document</h3>
        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
          <Icon name="Upload" size={48} className="text-text-muted mx-auto mb-4" />
          <p className="text-text-primary font-medium mb-2">Upload your SLA.md file</p>
          <p className="text-sm text-text-secondary mb-4">
            Drag and drop your file here, or click to browse
          </p>
          <Input
            type="file"
            accept=".md,.txt"
            onChange={handleFileUpload}
            className="hidden"
            id="sla-upload"
          />
          <label htmlFor="sla-upload">
            <Button variant="outline" iconName="Upload" iconPosition="left">
              Choose File
            </Button>
          </label>
        </div>
      </div>

      {/* SLA Content Editor/Viewer */}
      <div className="bg-surface rounded-lg border border-border">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="text-lg font-semibold text-text-primary">SLA Content</h3>
          <div className="flex items-center space-x-2">
            {isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(false)}
                iconName="X"
              >
                Cancel
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              iconName="RotateCcw"
            >
              Reset
            </Button>
          </div>
        </div>
        
        <div className="p-6">
          {isEditing ? (
            <textarea
              value={slaContent}
              onChange={(e) => setSlaContent(e.target.value)}
              className="w-full h-96 p-4 border border-border rounded-lg font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter your SLA content in Markdown format..."
            />
          ) : (
            <div className="prose prose-sm max-w-none">
              <pre className="whitespace-pre-wrap font-mono text-sm text-text-primary bg-surface-secondary p-4 rounded-lg overflow-auto max-h-96">
                {slaContent}
              </pre>
            </div>
          )}
        </div>
      </div>

      {/* SLA Metrics Configuration */}
      <div className="bg-surface rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">SLA Monitoring</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              SLA Breach Warning (% of time remaining)
            </label>
            <Input
              type="number"
              placeholder="20"
              defaultValue="20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Escalation Trigger (hours overdue)
            </label>
            <Input
              type="number"
              placeholder="2"
              defaultValue="2"
            />
          </div>
          <div className="md:col-span-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-text-primary">
                Enable SLA Notifications
              </label>
              <Input
                type="checkbox"
                defaultChecked={true}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
        <Button variant="outline" onClick={handleReset}>
          Reset to Default
        </Button>
        <Button variant="primary" onClick={handleSave} iconName="Save" iconPosition="left">
          Save Configuration
        </Button>
      </div>
    </div>
  );
};

export default SLAManager;