import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import ChatRoomList from './components/ChatRoomList';
import ChatArea from './components/ChatArea';
import TicketContext from './components/TicketContext';
import AgentToolbar from './components/AgentToolbar';

const SupportChatInterface = () => {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [chatRooms, setChatRooms] = useState([]);
  const [agents, setAgents] = useState([]);
  const [currentAgent, setCurrentAgent] = useState(null);

  // Mock data for demonstration
  useEffect(() => {
    // Simulate loading chat rooms created by Room Creation workflow nodes
    const mockRooms = [
      {
        id: 'room-1',
        ticketId: 'TICKET-001',
        title: 'Login Authentication Issue',
        priority: 'high',
        status: 'active',
        user: {
          name: 'John Doe',
          email: 'john.doe@example.com',
          avatar: null
        },
        lastMessage: {
          content: 'I cannot log into my account',
          timestamp: new Date(Date.now() - 5 * 60 * 1000),
          sender: 'user'
        },
        unreadCount: 3,
        escalated: false,
        workflowNodeId: 'room-creation-node-1'
      },
      {
        id: 'room-2',
        ticketId: 'TICKET-002',
        title: 'Payment Processing Error',
        priority: 'critical',
        status: 'active',
        user: {
          name: 'Jane Smith',
          email: 'jane.smith@example.com',
          avatar: null
        },
        lastMessage: {
          content: 'My payment failed but money was deducted',
          timestamp: new Date(Date.now() - 15 * 60 * 1000),
          sender: 'user'
        },
        unreadCount: 1,
        escalated: true,
        workflowNodeId: 'room-creation-node-2'
      },
      {
        id: 'room-3',
        ticketId: 'TICKET-003',
        title: 'Feature Request Discussion',
        priority: 'low',
        status: 'pending',
        user: {
          name: 'Bob Johnson',
          email: 'bob.johnson@example.com',
          avatar: null
        },
        lastMessage: {
          content: 'Thank you for the clarification',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          sender: 'agent'
        },
        unreadCount: 0,
        escalated: false,
        workflowNodeId: 'room-creation-node-3'
      }
    ];

    const mockAgents = [
      {
        id: 'agent-1',
        name: 'Sarah Williams',
        email: 'sarah.williams@company.com',
        status: 'online',
        activeChats: 3,
        avatar: null
      },
      {
        id: 'agent-2',
        name: 'Mike Chen',
        email: 'mike.chen@company.com',
        status: 'busy',
        activeChats: 5,
        avatar: null
      },
      {
        id: 'agent-3',
        name: 'Lisa Rodriguez',
        email: 'lisa.rodriguez@company.com',
        status: 'away',
        activeChats: 1,
        avatar: null
      }
    ];

    setChatRooms(mockRooms);
    setAgents(mockAgents);
    setCurrentAgent(mockAgents[0]);
    
    // Auto-select first room if available
    if (mockRooms.length > 0) {
      setSelectedRoom(mockRooms[0]);
    }
  }, []);

  const handleRoomSelect = (room) => {
    setSelectedRoom(room);
    // Mark room as read
    setChatRooms(prev => 
      prev.map(r => 
        r.id === room.id 
          ? { ...r, unreadCount: 0 }
          : r
      )
    );
  };

  const handleSendMessage = (message) => {
    if (!selectedRoom) return;
    
    // Update the room's last message
    const newMessage = {
      content: message,
      timestamp: new Date(),
      sender: 'agent'
    };
    
    setChatRooms(prev => 
      prev.map(room => 
        room.id === selectedRoom.id 
          ? { ...room, lastMessage: newMessage }
          : room
      )
    );
    
    // Update selected room
    setSelectedRoom(prev => ({ ...prev, lastMessage: newMessage }));
  };

  const handleEscalateTicket = (ticketId) => {
    setChatRooms(prev => 
      prev.map(room => 
        room.ticketId === ticketId 
          ? { ...room, escalated: true, priority: 'critical' }
          : room
      )
    );
  };

  const handleChangeStatus = (ticketId, newStatus) => {
    setChatRooms(prev => 
      prev.map(room => 
        room.ticketId === ticketId 
          ? { ...room, status: newStatus }
          : room
      )
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-15">
        {/* Page Header */}
        <div className="bg-surface border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div className='pt-12'>
              <Breadcrumb />
              <h1 className="text-2xl font-heading font-semibold text-text-primary mt-2">
                Support Chat Interface
              </h1>
              <p className="text-text-secondary mt-1">
                Manage customer support conversations and ticket-based chat rooms
              </p>
            </div>
            <AgentToolbar 
              currentAgent={currentAgent}
              agents={agents}
              onAgentStatusChange={(status) => setCurrentAgent(prev => ({ ...prev, status }))}
            />
          </div>
        </div>

        {/* Main Interface */}
        <div className="flex h-[calc(100vh-140px)]">
          {/* Left Panel - Chat Rooms (25%) */}
          <div className="w-1/4 min-w-80 flex-shrink-0">
            <ChatRoomList
              rooms={chatRooms}
              selectedRoom={selectedRoom}
              onRoomSelect={handleRoomSelect}
            />
          </div>

          {/* Center Panel - Chat Area (50%) */}
          <div className="flex-1">
            <ChatArea
              selectedRoom={selectedRoom}
              currentAgent={currentAgent}
              onSendMessage={handleSendMessage}
            />
          </div>

          {/* Right Panel - Ticket Context (25%) */}
          <div className="w-1/4 min-w-80 flex-shrink-0">
            <TicketContext
              selectedRoom={selectedRoom}
              onEscalateTicket={handleEscalateTicket}
              onChangeStatus={handleChangeStatus}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportChatInterface;