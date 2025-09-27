import React, { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import SendIcon from '@mui/icons-material/Send';

interface MessageInputProps {
  onSendMessage: (messageText: string) => void;
}

const MessageInput = ({ onSendMessage }: MessageInputProps) => {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (text.trim()) {
      onSendMessage(text);
      setText('');
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <Box sx={{ padding: '16px', bgcolor: 'rgba(0,0,0,0.2)' }}>
      <TextField
        fullWidth
        variant="outlined"
        size="small"
        placeholder="Type a message"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyPress={handleKeyPress}
        sx={{
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'background.paper',
            borderRadius: '20px',
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.2)',
            },
            '&:hover fieldset': {
              borderColor: 'primary.main',
            },
          },
        }}
      />
      <Tooltip title="Send Message">
        <IconButton color="primary" onClick={handleSend} sx={{ marginLeft: '8px' }}>
          <SendIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
};
export default MessageInput;