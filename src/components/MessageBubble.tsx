// src/components/MessageBubble.tsx

import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { Message, UserProfile } from '../types';
import DoneIcon from '@mui/icons-material/Done';
import DoneAllIcon from '@mui/icons-material/DoneAll';

interface MessageBubbleProps {
  message: Message;
  currentUserProfile: UserProfile;
}

const MessageBubble = ({ message, currentUserProfile }: MessageBubbleProps) => {
  const isSentByMe = message.sender === currentUserProfile.uid;

  const renderStatusIcon = () => {
    if (!isSentByMe || !message.status) return null;
    
    switch (message.status) {
      case 'sent':
        return <DoneAllIcon sx={{ fontSize: '1rem', color: '#a0a0a0', marginRight: '4px' }} />;
      case 'read':
        return <DoneAllIcon sx={{ fontSize: '1rem', color: 'primary.main', marginRight: '4px' }} />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: isSentByMe ? 'flex-end' : 'flex-start', marginBottom: '8px' }}>
      <Paper
        elevation={1}
        sx={{
          padding: '8px 12px',
          borderRadius: '12px',
          maxWidth: '70%',
          backgroundColor: isSentByMe ? '#005C4B' : 'background.paper', // Dark green for sent, paper for received
        }}
      >
        <Typography 
          variant="body1" 
          sx={{ 
            overflowWrap: 'break-word', 
            whiteSpace: 'pre-wrap',
            color: isSentByMe ? '#ffffff' : 'text.primary' // Explicitly set white text for sent messages
          }}
        >
          {message.text}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginTop: '4px' }}>
          {renderStatusIcon()} 
          <Typography variant="caption" sx={{ color: isSentByMe ? '#a0a0a0' : 'text.secondary' }}>
            {message.timestamp?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default MessageBubble;