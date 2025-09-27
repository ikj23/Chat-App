// src/types/index.ts

import { Timestamp } from 'firebase/firestore';

export interface ChatPreview {
  id: string;
  lastMessage: string;
  timestamp: Timestamp;
  avatarUrl?: string; 
  members?: string[];
  memberInfo?: { [key: string]: { email: string | null } };
  customerName?: string; 
}

export interface Message {
  id: string;
  text: string;
  timestamp: Timestamp | null;
  sender: string; // Changed to string to store User UID
  status?: 'sent' | 'read';
}

export interface UserProfile {
  uid: string;
  email: string;
  role: 'admin' | 'agent' | 'viewer';
}