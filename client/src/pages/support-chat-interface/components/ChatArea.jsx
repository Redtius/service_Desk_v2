import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const ChatArea = ({ selectedRoom, currentAgent, onSendMessage }) => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([]);
  const [showTemplates, setShowTemplates] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Mock message data
  useEffect(() => {
    if (selectedRoom) {
      const mockMessages = [
        {
          id: 1,
          content: 'Hello, I need help with my account login. I keep getting an error message.',
          sender: 'user',
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
          senderName: selectedRoom.user?.name,
          senderAvatar: null
        },
        {
          id: 2,
          content: 'Hi! I\'m here to help you with your login issue. Can you please tell me what error message you\'re seeing?',
          sender: 'agent',
          timestamp: new Date(Date.now() - 28 * 60 * 1000),
          senderName: currentAgent?.name,
          senderAvatar: null
        },
        {
          id: 3,
          content: 'It says "Invalid credentials" but I\'m sure my password is correct.',
          sender: 'user',
          timestamp: new Date(Date.now() - 25 * 60 * 1000),
          senderName: selectedRoom.user?.name,
          senderAvatar: null
        },
        {
          id: 4,
          content: 'I understand that can be frustrating. Let me check your account status. Can you please confirm your email address?',
          sender: 'agent',
          timestamp: new Date(Date.now() - 20 * 60 * 1000),
          senderName: currentAgent?.name,
          senderAvatar: null
        },
        {
          id: 5,
          content: selectedRoom.user?.email || 'user@example.com',
          sender: 'user',
          timestamp: new Date(Date.now() - 15 * 60 * 1000),
          senderName: selectedRoom.user?.name,
          senderAvatar: null
        }
      ];
      setMessages(mockMessages);
    }
  }, [selectedRoom, currentAgent]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!message.trim() || !selectedRoom) return;
    
    const newMessage = {
      id: messages.length + 1,
      content: message,
      sender: 'agent',
      timestamp: new Date(),
      senderName: currentAgent?.name,
      senderAvatar: null
    };
    
    setMessages(prev => [...prev, newMessage]);
    onSendMessage(message);
    setMessage('');
    setShowTemplates(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleTemplateSelect = (template) => {
    setMessage(template.content);
    setShowTemplates(false);
    inputRef.current?.focus();
  };

  const quickTemplates = [
    {
      id: 1,
      title: 'Account Issue',
      content: 'I understand you\'re having trouble with your account. Let me help you resolve this issue.'
    },
    {
      id: 2,
      title: 'Password Reset',
      content: 'I can help you reset your password. Please check your email for the reset link I\'ve sent.'
    },
    {
      id: 3,
      title: 'Technical Support',
      content: 'Thank you for contacting technical support. I\'ll investigate this issue and get back to you shortly.'
    },
    {
      id: 4,
      title: 'Follow Up',
      content: 'I wanted to follow up on your previous inquiry. Is there anything else I can help you with?'
    }
  ];

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?';
  };

  if (!selectedRoom) {
    return (
      <div className="h-full bg-surface-secondary flex items-center justify-center">
        <div className="text-center">
          <Icon name="MessageCircle" size={48} className="text-text-muted mx-auto mb-4" />
          <h3 className="text-lg font-medium text-text-primary mb-2">No Chat Selected</h3>
          <p className="text-text-secondary">
            Select a chat room from the left panel to start messaging
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-surface flex flex-col">
      {/* Chat Header */}
      <div className="p-4 border-b border-border bg-surface">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-primary">
                {getInitials(selectedRoom.user?.name)}
              </span>
            </div>
            <div>
              <h3 className="font-medium text-text-primary">{selectedRoom.title}</h3>
              <div className="flex items-center space-x-2 text-sm text-text-secondary">
                <span>{selectedRoom.user?.name}</span>
                <span>•</span>
                <span>{selectedRoom.ticketId}</span>
                <span>•</span>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span>Online</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowTemplates(!showTemplates)}
              className="p-2 hover:bg-surface-secondary rounded-lg transition-smooth"
              title="Quick Templates"
            >
              <Icon name="FileText" size={16} />
            </button>
            <button
              className="p-2 hover:bg-surface-secondary rounded-lg transition-smooth"
              title="Attach File"
            >
              <Icon name="Paperclip" size={16} />
            </button>
            <button
              className="p-2 hover:bg-surface-secondary rounded-lg transition-smooth"
              title="Video Call"
            >
              <Icon name="Video" size={16} />
            </button>
            <button
              className="p-2 hover:bg-surface-secondary rounded-lg transition-smooth"
              title="More Options"
            >
              <Icon name="MoreHorizontal" size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Templates */}
      {showTemplates && (
        <div className="p-4 border-b border-border bg-surface-secondary">
          <h4 className="text-sm font-medium text-text-primary mb-3">Quick Response Templates</h4>
          <div className="grid grid-cols-2 gap-2">
            {quickTemplates.map(template => (
              <button
                key={template.id}
                onClick={() => handleTemplateSelect(template)}
                className="p-2 text-left bg-surface rounded-lg hover:bg-surface-secondary transition-smooth text-sm"
              >
                <div className="font-medium text-text-primary mb-1">{template.title}</div>
                <div className="text-text-secondary truncate">{template.content}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'agent' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex space-x-2 max-w-xs lg:max-w-md ${msg.sender === 'agent' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              {/* Avatar */}
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-medium text-primary">
                  {getInitials(msg.senderName)}
                </span>
              </div>
              
              {/* Message Bubble */}
              <div className={`px-4 py-2 rounded-lg ${
                msg.sender === 'agent' ?'bg-primary text-white' :'bg-surface-secondary text-text-primary'
              }`}>
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                <div className={`text-xs mt-1 ${
                  msg.sender === 'agent' ?'text-primary-200' :'text-text-muted'
                }`}>
                  {formatTime(msg.timestamp)}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex space-x-2">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium text-primary">
                  {getInitials(selectedRoom.user?.name)}
                </span>
              </div>
              <div className="px-4 py-2 bg-surface-secondary rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-text-muted rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-border bg-surface">
        <div className="flex items-end space-x-2">
          <button
            className="p-2 hover:bg-surface-secondary rounded-lg transition-smooth"
            title="Attach File"
          >
            <Icon name="Plus" size={16} />
          </button>
          
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="w-full p-3 pr-12 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none max-h-32"
              rows={1}
            />
            <button
              onClick={handleSendMessage}
              disabled={!message.trim()}
              className="absolute right-2 bottom-2 p-2 bg-primary text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-smooth"
            >
              <Icon name="Send" size={16} />
            </button>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-xs text-text-muted mt-2">
          <span>Press Enter to send, Shift+Enter for new line</span>
          <span>Agent: {currentAgent?.name}</span>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;