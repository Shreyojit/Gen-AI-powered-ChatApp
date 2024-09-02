import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ChatState {
  selectedConversationId?: string;
  selectedGroupId?: string;
  setSelectedConversation: (id: string) => void;
  setSelectedGroup: (id: string) => void;
  clearSelection: () => void;
}

export const useChatStore = create<ChatState>()(
  persist((set) => ({
    selectedConversationId: undefined,
    selectedGroupId: undefined,
    setSelectedConversation: (id) => set({ selectedConversationId: id, selectedGroupId: undefined }),
    setSelectedGroup: (id) => set({ selectedGroupId: id, selectedConversationId: undefined }),
    clearSelection: () => set({ selectedConversationId: undefined, selectedGroupId: undefined }),
  }), {
    name: 'chatStore',
  })
);
