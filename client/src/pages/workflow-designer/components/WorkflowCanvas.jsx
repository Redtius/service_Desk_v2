import React, { useState, useRef, useCallback, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const WorkflowCanvas = ({ selectedElement, onElementSelect, onElementAdd }) => {
  const [canvasElements, setCanvasElements] = useState([]);
  const [connections, setConnections] = useState([]);
  const [draggedElement, setDraggedElement] = useState(null);
  const [draggedCanvasElement, setDraggedCanvasElement] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const canvasRef = useRef(null);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - pan.x) / zoom;
    const y = (e.clientY - rect.top - pan.y) / zoom;
    
    try {
      const elementData = JSON.parse(e.dataTransfer.getData('application/json'));
      const newElement = {
        ...elementData,
        id: `${elementData.type}-${Date.now()}`,
        x,
        y,
        width: 120,
        height: 80
      };
      
      setCanvasElements(prev => [...prev, newElement]);
      onElementAdd && onElementAdd(newElement);
    } catch (error) {
      console.error('Error parsing dropped element:', error);
    }
  }, [zoom, pan, onElementAdd]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }, []);

  const handleElementMouseDown = useCallback((e, element) => {
    e.stopPropagation();
    const rect = canvasRef.current.getBoundingClientRect();
    const elementRect = e.currentTarget.getBoundingClientRect();
    
    setDraggedCanvasElement(element);
    setDragOffset({
      x: e.clientX - elementRect.left,
      y: e.clientY - elementRect.top
    });
    
    onElementSelect && onElementSelect(element);
  }, [onElementSelect]);

  const handleMouseMove = useCallback((e) => {
    if (draggedCanvasElement) {
      const rect = canvasRef.current.getBoundingClientRect();
      const newX = (e.clientX - rect.left - dragOffset.x - pan.x) / zoom;
      const newY = (e.clientY - rect.top - dragOffset.y - pan.y) / zoom;
      
      setCanvasElements(prev => 
        prev.map(el => 
          el.id === draggedCanvasElement.id 
            ? { ...el, x: Math.max(0, newX), y: Math.max(0, newY) }
            : el
        )
      );
    } else if (isPanning) {
      const deltaX = e.clientX - panStart.x;
      const deltaY = e.clientY - panStart.y;
      
      setPan(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }));
      
      setPanStart({ x: e.clientX, y: e.clientY });
    }
  }, [draggedCanvasElement, dragOffset, zoom, pan, isPanning, panStart]);

  const handleMouseUp = useCallback(() => {
    if (draggedCanvasElement) {
      // Update the element in the parent component
      const updatedElement = canvasElements.find(el => el.id === draggedCanvasElement.id);
      if (updatedElement) {
        onElementAdd && onElementAdd(updatedElement);
      }
    }
    setDraggedCanvasElement(null);
    setIsPanning(false);
  }, [draggedCanvasElement, canvasElements, onElementAdd]);

  const handleCanvasMouseDown = useCallback((e) => {
    if (e.target === canvasRef.current) {
      setIsPanning(true);
      setPanStart({ x: e.clientX, y: e.clientY });
      onElementSelect && onElementSelect(null);
    }
  }, [onElementSelect]);

  // Add event listeners for mouse move and up
  React.useEffect(() => {
    if (draggedCanvasElement || isPanning) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [draggedCanvasElement, isPanning, handleMouseMove, handleMouseUp]);

  const handleElementClick = (element) => {
    onElementSelect && onElementSelect(element);
  };

  const handleElementDelete = (elementId) => {
    setCanvasElements(prev => prev.filter(el => el.id !== elementId));
    if (selectedElement?.id === elementId) {
      onElementSelect && onElementSelect(null);
    }
  };

  const handleElementDuplicate = (element) => {
    const newElement = {
      ...element,
      id: `${element.type}-${Date.now()}`,
      x: element.x + 20,
      y: element.y + 20
    };
    setCanvasElements(prev => [...prev, newElement]);
    onElementAdd && onElementAdd(newElement);
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev * 1.2, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev / 1.2, 0.3));
  };

  const handleFitToScreen = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const renderElement = (element) => {
    const isSelected = selectedElement?.id === element.id;
    const isDragging = draggedCanvasElement?.id === element.id;
    
    return (
      <div
        key={element.id}
        className={`absolute cursor-move transition-smooth ${
          isSelected ? 'ring-2 ring-primary shadow-elevation-2' : 'hover:shadow-elevation-1'
        } ${isDragging ? 'opacity-80 scale-105' : ''}`}
        style={{
          left: element.x,
          top: element.y,
          width: element.width,
          height: element.height,
          transform: `scale(${zoom})`,
          transformOrigin: 'top left'
        }}
        onMouseDown={(e) => handleElementMouseDown(e, element)}
        onClick={() => handleElementClick(element)}
      >
        <div className={`w-full h-full rounded-lg border-2 p-3 bg-surface ${element.color} ${
          isDragging ? 'shadow-elevation-3' : ''
        }`}>
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Icon name={element.icon} size={24} className="text-text-primary mb-2" />
            <div className="text-xs font-medium text-text-primary truncate w-full">
              {element.name}
            </div>
          </div>
        </div>
        
        {/* Element Actions (only show when selected) */}
        {isSelected && (
          <div className="absolute -top-2 -right-2 flex space-x-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleElementDuplicate(element);
              }}
              className="w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-elevation-1 hover:scale-110 transition-smooth"
              title="Duplicate"
            >
              <Icon name="Copy" size={12} color="white" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleElementDelete(element.id);
              }}
              className="w-6 h-6 bg-error rounded-full flex items-center justify-center shadow-elevation-1 hover:scale-110 transition-smooth"
              title="Delete"
            >
              <Icon name="X" size={12} color="white" />
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="relative w-full h-full bg-surface-secondary overflow-hidden">
      {/* Canvas Controls */}
      <div className="absolute top-4 left-4 z-10 flex items-center space-x-2">
        <div className="bg-surface rounded-lg shadow-elevation-1 border border-border p-2">
          <div className="flex items-center space-x-2">
            <button
              onClick={handleZoomOut}
              className="p-1 hover:bg-surface-secondary rounded transition-smooth"
              title="Zoom Out"
            >
              <Icon name="ZoomOut" size={16} />
            </button>
            <span className="text-sm font-medium text-text-primary min-w-12 text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              className="p-1 hover:bg-surface-secondary rounded transition-smooth"
              title="Zoom In"
            >
              <Icon name="ZoomIn" size={16} />
            </button>
            <div className="w-px h-4 bg-border mx-1"></div>
            <button
              onClick={handleFitToScreen}
              className="p-1 hover:bg-surface-secondary rounded transition-smooth"
              title="Fit to Screen"
            >
              <Icon name="Maximize" size={16} />
            </button>
          </div>
        </div>
        
        {/* Instructions */}
        <div className="bg-surface rounded-lg shadow-elevation-1 border border-border px-3 py-2">
          <div className="text-xs text-text-secondary">
            {draggedCanvasElement ? 'Drag to move element' : 'Click to select • Drag to move • Space+drag to pan'}
          </div>
        </div>
      </div>

      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, #e5e7eb 1px, transparent 1px),
            linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
          `,
          backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
          backgroundPosition: `${pan.x}px ${pan.y}px`
        }}
      />

      {/* Canvas Area */}
      <div
        ref={canvasRef}
        className={`w-full h-full relative ${isPanning ? 'cursor-grabbing' : 'cursor-grab'}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onMouseDown={handleCanvasMouseDown}
        style={{ transform: `translate(${pan.x}px, ${pan.y}px)` }}
      >
        {canvasElements.map(renderElement)}
        
        {/* Empty State */}
        {canvasElements.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <Icon name="MousePointer" size={48} className="text-text-muted mx-auto mb-4" />
              <h3 className="text-lg font-medium text-text-primary mb-2">
                Start Building Your Workflow
              </h3>
              <p className="text-text-secondary max-w-md">
                Drag elements from the toolbox on the left to create your agent workflow. 
                Click and drag elements to reposition them on the canvas.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Canvas Info */}
      <div className="absolute bottom-4 left-4 bg-surface rounded-lg shadow-elevation-1 border border-border px-3 py-2">
        <div className="flex items-center space-x-4 text-sm text-text-secondary">
          <span>Elements: {canvasElements.length}</span>
          <span>Connections: {connections.length}</span>
          <span>Zoom: {Math.round(zoom * 100)}%</span>
          {selectedElement && (
            <span className="text-primary">Selected: {selectedElement.name}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkflowCanvas;