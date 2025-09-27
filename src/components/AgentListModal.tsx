// src/components/AgentListModal.tsx

import React, { useState, useEffect } from 'react';
// Import 'where' from firestore
import { collection, query, where, getDocs } from 'firebase/firestore'; 
import { db, auth } from '../firebase';
import { UserProfile } from '../types';
import { Modal, Box, Typography, List, ListItemButton, ListItemText, CircularProgress, Divider } from '@mui/material';

// Style for the modal box (remains the same)
const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

interface AgentListModalProps {
  open: boolean;
  onClose: () => void;
  onSelectAgent: (agent: UserProfile) => void;
}

const AgentListModal = ({ open, onClose, onSelectAgent }: AgentListModalProps) => {
  const [agents, setAgents] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      const fetchAgents = async () => {
        setLoading(true);
        
        // ===============================================================
        // THE FIX IS HERE: We've added a 'where' clause to the query
        // ===============================================================
        const usersQuery = query(
          collection(db, "users"), 
          where("role", "in", ["agent", "admin"]) // Only get users who are agents or admins
        );
        
        const querySnapshot = await getDocs(usersQuery);
        
        const allUsers = querySnapshot.docs.map(doc => doc.data() as UserProfile);
        
        // Filter out the currently logged-in user from the list
        const otherAgents = allUsers.filter(user => user.uid !== auth.currentUser?.uid);
        
        setAgents(otherAgents);
        setLoading(false);
      };

      fetchAgents();
    }
  }, [open]);

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="new-chat-modal-title">
      <Box sx={style}>
        <Typography id="new-chat-modal-title" variant="h6" component="h2">
          Start a new chat with...
        </Typography>
        <List sx={{ mt: 2 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <CircularProgress />
            </Box>
          ) : (
            agents.map(agent => (
              <React.Fragment key={agent.uid}>
                <ListItemButton onClick={() => onSelectAgent(agent)}>
                  <ListItemText primary={agent.email} secondary={agent.role} />
                </ListItemButton>
                <Divider />
              </React.Fragment>
            ))
          )}
        </List>
      </Box>
    </Modal>
  );
};

export default AgentListModal;