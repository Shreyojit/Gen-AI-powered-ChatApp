// store/groupStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Group {
  groupId: string;
  isGroup:boolean;
  name: string;
  lastMessage: string;
  sentAt: string;
  imageSrc: string;
}

interface GroupState {
  groups: Group[];
  addGroup: (group: Group) => void;
  setGroups: (groups: Group[]) => void;
}

export const useGroupStore = create<GroupState>()(
  persist((set) => ({
    groups: [],
    addGroup: (group) => set((state) => ({
      groups: [...state.groups, group],
    })),
    setGroups: (groups) => set({ groups }),
  }), {
    name: 'groupStore',
  })
);
