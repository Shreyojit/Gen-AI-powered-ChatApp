import React from 'react';
import Avatar from '../atoms/Avatar';
import ConversationName from '../atoms/ConversationName';
import MessagePreview from '../atoms/MessagePreview';
import { useChatStore } from '@/lib/hooks/chatStore';
import { useGroupStore } from '@/lib/hooks/groupStore';


interface ChatListItemProps {
  imageSrc: string;
  name: string;
  lastMessage: string;
  conversationId?: string; // Optional for single chats
  groupId?: string; // Optional for group chats
}

const ChatListItem: React.FC<ChatListItemProps> = ({ imageSrc, name, lastMessage, conversationId, groupId }) => {
  // Access Zustand store methods
  const { setSelectedConversation, setSelectedGroup } = useChatStore();

  const { groups } = useGroupStore();
  console.log('Groups from store:', groups);

  const handleClick = () => {
    if (conversationId) {
      console.log('Single Chat Clicked:', conversationId);
      setSelectedConversation(conversationId); // Update Zustand store with the selected conversation
    } else if (groupId) {
      console.log('Group Chat Clicked:', groupId,typeof(groupId));
      setSelectedGroup(groupId); // Update Zustand store with the selected group
    }
  };

  return (
    <div onClick={handleClick} className="flex items-center p-2 hover:bg-gray-100 cursor-pointer border-b border-gray-200">
      <Avatar imageSrc={imageSrc} />
      <div className="ml-4 flex-1 overflow-hidden">
        <ConversationName name={name} />
        <MessagePreview content={lastMessage} />
      </div>
    </div>
  );
};

export default ChatListItem;
