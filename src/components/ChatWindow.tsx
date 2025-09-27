import React, { useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { ChatPreview, Message, UserProfile } from '../types';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';

interface ChatWindowProps {
  chat: ChatPreview | null;
  messages: Message[];
  onSendMessage: (messageText: string) => void;
  userRole: 'admin' | 'agent' | 'viewer';
  currentUserProfile: UserProfile;
}

const ChatWindow = ({ chat, messages, onSendMessage, userRole, currentUserProfile }: ChatWindowProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getOtherMemberEmail = (memberInfo: any) => {
    if (!memberInfo) return "Unknown Chat";
    const otherMemberKey = Object.keys(memberInfo).find(uid => uid !== currentUserProfile.uid);
    return otherMemberKey ? memberInfo[otherMemberKey].email : "Unknown User";
  };
  
  if (!chat) {
    return (
      <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'transparent' }}>
        <Typography variant="h6" sx={{ color: 'text.secondary' }}>
          Select a chat to start messaging
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', bgcolor: 'transparent' }}>
      <Paper elevation={0} sx={{ padding: '12px 16px', bgcolor: 'rgba(0,0,0,0.2)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <Typography variant="h6">
          Chat with {chat.memberInfo ? getOtherMemberEmail(chat.memberInfo) : chat.customerName}
        </Typography>
      </Paper>
      <Box sx={{ flexGrow: 1, overflowY: 'auto', padding: '16px' }}>
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} currentUserProfile={currentUserProfile} />
        ))}
        <div ref={messagesEndRef} />
      </Box>
      {userRole !== 'viewer' && (
        <MessageInput onSendMessage={onSendMessage} />
      )}
    </Box>
  );
};
export default ChatWindow;