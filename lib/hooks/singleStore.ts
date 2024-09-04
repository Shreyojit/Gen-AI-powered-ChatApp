// store/singleStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SingleMessage } from '@/lib/models/SingleMessageSchema';
import { User } from '../models/User';

interface ChatState {
  selectedUser: User | null;
  messages: SingleMessage[];
  currentUser: User | null;
  setSelectedUser: (user: User | null) => void;
  addMessage: (message: SingleMessage) => void;
  setCurrentUser: (user: User | null) => void;
}

export const useChatStore = create<ChatState>()(
  persist((set) => ({
    selectedUser: null,
    messages: [],
    currentUser: null,
    setSelectedUser: (user) => {
      console.log('Setting selected user:', user); // Log here
      set({ selectedUser: user });
    },
    addMessage: (message) => {
      console.log('Adding message:', message); // Log here
      set((state) => ({
        messages: [...state.messages, message],
      }));
    },
    setCurrentUser: (user) => {
      console.log('Setting current user:', user); // Log here
      set({ currentUser: user });
    },
  }), {
    name: 'singleStore',
  })
);
