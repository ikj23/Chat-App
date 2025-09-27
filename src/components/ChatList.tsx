// src/components/ChatList.tsx

import React from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemButton, ListItemAvatar, Avatar, ListItemText, Divider, IconButton, Skeleton, Stack, Tooltip } from '@mui/material';
import AddCommentIcon from '@mui/icons-material/AddComment';
import { ChatPreview, UserProfile } from '../types';

interface ChatListProps {
  chats: ChatPreview[];
  onChatSelect: (id: string) => void;
  selectedChatId: string | null;
  onNewChat: () => void;
  currentUserProfile: UserProfile;
  loading: boolean;
}

const ChatList = ({ chats, onChatSelect, selectedChatId, onNewChat, currentUserProfile, loading }: ChatListProps) => {
  
  const getOtherMemberEmail = (memberInfo: any) => {
    if (!memberInfo) return "Unknown Chat";
    const otherMemberKey = Object.keys(memberInfo).find(uid => uid !== currentUserProfile.uid);
    return otherMemberKey ? memberInfo[otherMemberKey].email : "Unknown User";
  };

  const renderSkeletons = () => (
    <Stack spacing={1} sx={{ padding: '8px' }}>
      {[...Array(5)].map((_, index) => (
        <Box key={index} sx={{ display: 'flex', alignItems: 'center', padding: '8px' }}>
          <Skeleton variant="circular" width={40} height={40} sx={{ marginRight: '16px' }} />
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="text" width="90%" />
          </Box>
        </Box>
      ))}
    </Stack>
  );

  return (
    <Box sx={{ width: '350px', borderRight: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', flexDirection: 'column', bgcolor: 'background.paper' }}>
      <Paper elevation={0} sx={{ padding: '8px 16px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'rgba(255,255,255,0.05)' }}>
        <Typography variant="h6">Chats</Typography>
        <Tooltip title="Start New Chat">
          <IconButton onClick={onNewChat} color="primary">
            <AddCommentIcon />
          </IconButton>
        </Tooltip>
      </Paper>
      
      <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
        {loading ? (
          renderSkeletons()
        ) : chats.length === 0 ? (
          <Box sx={{ textAlign: 'center', padding: '20px', color: 'text.secondary' }}>
            <Typography variant="body1">
              No conversations yet.
            </Typography>
            <Typography variant="body2">
              Click the '+' icon to start a new chat.
            </Typography>
          </Box>
        ) : (
          <List sx={{ padding: 0 }}>
            {chats.map((chat, index) => (
              <React.Fragment key={chat.id}>
                <ListItem disablePadding> 
                  <ListItemButton onClick={() => onChatSelect(chat.id)} selected={selectedChatId === chat.id}> 
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'secondary.main' }}>
                        {getOtherMemberEmail(chat.memberInfo)?.[0].toUpperCase()}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={getOtherMemberEmail(chat.memberInfo)}
                      secondary={chat.lastMessage}
                    />
                  </ListItemButton>
                </ListItem>
                {index < chats.length - 1 && <Divider component="li" sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Box>
    </Box>
  );
};

export default ChatList;