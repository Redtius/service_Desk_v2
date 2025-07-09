import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const ChatRoomList = ({ rooms, selectedRoom, onRoomSelect }) => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRooms = rooms?.filter(room => {
    const matchesSearch = room.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         room.ticketId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         room.user?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filter === 'all' || 
                         (filter === 'active' && room.status === 'active') ||
                         (filter === 'pending' && room.status === 'pending') ||
                         (filter === 'escalated' && room.escalated) ||
                         (filter === 'unread' && room.unreadCount > 0);
    
    return matchesSearch && matchesFilter;
  }) || [];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'text-error';
      case 'high': return 'text-warning';
      case 'medium': return 'text-primary';
      case 'low': return 'text-success';
      default: return 'text-text-secondary';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-success-100 text-success-700';
      case 'pending': return 'bg-warning-100 text-warning-700';
      case 'resolved': return 'bg-slate-100 text-slate-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const now = new Date();
    const diff = now - new Date(timestamp);
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?';
  };

  return (
    <div className="h-full bg-surface border-r border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="MessageCircle" size={20} className="text-primary" />
          <h3 className="font-heading font-semibold text-text-primary">Chat Rooms</h3>
          <div className="ml-auto bg-primary-100 text-primary text-xs px-2 py-1 rounded-full">
            {rooms?.length || 0}
          </div>
        </div>
        
        {/* Search */}
        <div className="relative mb-4">
          <Icon name="Search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search rooms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>
        
        {/* Filter Tabs */}
        <div className="flex space-x-1 bg-surface-secondary rounded-lg p-1">
          {[
            { key: 'all', label: 'All' },
            { key: 'active', label: 'Active' },
            { key: 'pending', label: 'Pending' },
            { key: 'escalated', label: 'Escalated' },
            { key: 'unread', label: 'Unread' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`flex-1 px-3 py-2 text-xs font-medium rounded-md transition-smooth ${
                filter === tab.key 
                  ? 'bg-surface text-primary shadow-sm' 
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Room List */}
      <div className="flex-1 overflow-y-auto">
        {filteredRooms.length === 0 ? (
          <div className="p-4 text-center">
            <Icon name="MessageCircle" size={32} className="text-text-muted mx-auto mb-2" />
            <p className="text-text-secondary text-sm">No chat rooms found</p>
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {filteredRooms.map(room => (
              <div
                key={room.id}
                onClick={() => onRoomSelect(room)}
                className={`p-3 rounded-lg cursor-pointer transition-smooth ${
                  selectedRoom?.id === room.id 
                    ? 'bg-primary-50 border-2 border-primary' :'hover:bg-surface-secondary border-2 border-transparent'
                }`}
              >
                <div className="flex items-start space-x-3">
                  {/* User Avatar */}
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-medium text-primary">
                      {getInitials(room.user?.name)}
                    </span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    {/* Room Header */}
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="flex items-center space-x-1">
                        <Icon name="Hash" size={12} className={getPriorityColor(room.priority)} />
                        <span className="text-xs font-medium text-text-secondary">
                          {room.ticketId}
                        </span>
                      </div>
                      
                      {room.escalated && (
                        <Icon name="AlertTriangle" size={12} className="text-error" />
                      )}
                      
                      {room.unreadCount > 0 && (
                        <div className="bg-primary text-white text-xs px-2 py-0.5 rounded-full">
                          {room.unreadCount}
                        </div>
                      )}
                    </div>
                    
                    {/* Room Title */}
                    <h4 className="font-medium text-text-primary truncate mb-1">
                      {room.title}
                    </h4>
                    
                    {/* User Info */}
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-xs text-text-secondary truncate">
                        {room.user?.name}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(room.status)}`}>
                        {room.status}
                      </span>
                    </div>
                    
                    {/* Last Message */}
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-text-muted truncate flex-1">
                        {room.lastMessage?.sender === 'agent' ? 'You: ' : ''}
                        {room.lastMessage?.content}
                      </p>
                      <span className="text-xs text-text-muted ml-2">
                        {formatTime(room.lastMessage?.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatRoomList;