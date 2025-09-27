// src/pages/Dashboard.tsx
import React from 'react';
import { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { auth, db } from '../firebase';
import { 
  collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, doc, updateDoc, where, getDoc, setDoc
} from 'firebase/firestore';
import { UserProfile, ChatPreview, Message } from '../types';
import { Box, Typography, Button, Chip, Tooltip, IconButton } from '@mui/material';
import ChatList from '../components/ChatList';
import ChatWindow from '../components/ChatWindow';
import AgentListModal from '../components/AgentListModal';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const Dashboard = ({ userProfile }: { userProfile: UserProfile }) => {
  const [chats, setChats] = useState<ChatPreview[]>([]);
  const [chatsLoading, setChatsLoading] = useState(true);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!userProfile) return;
    const chatsQuery = query(collection(db, "directMessages"), where("members", "array-contains", userProfile.uid), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(chatsQuery, 
      (querySnapshot) => {
        const chatsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as ChatPreview[];
        setChats(chatsData);
        setChatsLoading(false);
      }, 
      (error) => { console.error("Error fetching direct messages: ", error); setChatsLoading(false); }
    );
    return () => unsubscribe();
  }, [userProfile]);
  
  useEffect(() => {
    if (!selectedChatId) { setMessages([]); return; }
    const messagesQuery = query(collection(db, "directMessages", selectedChatId, "messages"), orderBy("timestamp"));
    const unsubscribe = onSnapshot(messagesQuery, (querySnapshot) => {
      const messagesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), })) as Message[];
      setMessages(messagesData);
      querySnapshot.docs.forEach(doc => {
        const message = doc.data() as Message;
        if (message.sender !== userProfile.uid && message.status !== 'read') {
          updateDoc(doc.ref, { status: 'read' });
        }
      });
    });
    return () => unsubscribe();
  }, [selectedChatId, userProfile.uid]);

  const handleSelectAgent = async (agent: UserProfile) => {
    handleCloseNewChatModal();
    const currentUser = auth.currentUser;
    if (!currentUser) return;
    const chatID = [currentUser.uid, agent.uid].sort().join('_');
    const chatDocRef = doc(db, 'directMessages', chatID);
    const chatDoc = await getDoc(chatDocRef);
    if (!chatDoc.exists()) {
      await setDoc(chatDocRef, {
        members: [currentUser.uid, agent.uid],
        memberInfo: {
          [currentUser.uid]: { email: currentUser.email },
          [agent.uid]: { email: agent.email }
        },
        timestamp: serverTimestamp(),
        lastMessage: "Chat created."
      });
    }
    setSelectedChatId(chatID);
  };

  const handleSendMessage = async (messageText: string) => {
    if (!selectedChatId || !auth.currentUser) return;
    const messagesColRef = collection(db, "directMessages", selectedChatId, "messages");
    await addDoc(messagesColRef, { text: messageText, sender: auth.currentUser.uid, timestamp: serverTimestamp(), status: 'sent' });
    const chatDocRef = doc(db, 'directMessages', selectedChatId);
    await updateDoc(chatDocRef, { lastMessage: messageText, timestamp: serverTimestamp() });
  };

  const handleOpenNewChatModal = () => setIsModalOpen(true);
  const handleCloseNewChatModal = () => setIsModalOpen(false);
  const handleChatSelect = (id: string) => { setSelectedChatId(id); };
  const handleLogout = () => { signOut(auth); };
  const selectedChat = chats.find(chat => chat.id === selectedChatId) || null;

  return (
    <>
      <Box sx={{ display: 'flex', height: '100vh', width: '100vw', bgcolor: 'transparent' }}>
        <Box sx={{ width: '70px', bgcolor: 'background.paper', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <Tooltip title={userProfile.email} placement="right">
              <IconButton><AccountCircleIcon sx={{ color: 'text.primary' }}/></IconButton>
            </Tooltip>
            <Tooltip title={`Role: ${userProfile.role}`} placement="right">
                <Chip 
                  label={userProfile.role.substring(0, 1).toUpperCase()} 
                  color={userProfile.role === 'admin' ? "secondary" : "primary"}
                  size="small"
                  sx={{ width: 28, height: 28, fontSize: '0.8rem', fontWeight: 'bold' }}
                />
            </Tooltip>
             {userProfile.role === 'admin' && (
              <Tooltip title="Admin Panel" placement="right">
                <IconButton><AdminPanelSettingsIcon sx={{ color: 'text.primary' }}/></IconButton>
              </Tooltip>
            )}
          </Box>
          <Tooltip title="Sign Out" placement="right">
            <IconButton onClick={handleLogout}><LogoutIcon sx={{ color: 'text.primary' }}/></IconButton>
          </Tooltip>
        </Box>
        <ChatList chats={chats} onChatSelect={handleChatSelect} selectedChatId={selectedChatId} onNewChat={handleOpenNewChatModal} currentUserProfile={userProfile} loading={chatsLoading}/>
        <ChatWindow chat={selectedChat} messages={messages} onSendMessage={handleSendMessage} userRole={userProfile.role} currentUserProfile={userProfile}/>
      </Box>
      <AgentListModal open={isModalOpen} onClose={handleCloseNewChatModal} onSelectAgent={handleSelectAgent}/>
    </>
  );
};
export default Dashboard;