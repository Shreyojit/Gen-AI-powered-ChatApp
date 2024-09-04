import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ChatListItem from '../molecules/ChatListItem';
import { useGroupStore } from '@/lib/hooks/groupStore';

interface SingleMessage {
  conversationId: string;
  senderName: string;
  receiverName: string;
  lastMessage: string;
  sentAt: string;
}

interface GroupMessage {
  groupId: string;
  groupName: string;
  lastMessage: string;
  sentAt: string;
}

interface ChatResponse {
  data: {
    lastSingleMessages: SingleMessage[];
    lastGroupMessages: GroupMessage[];
  };
  success: boolean;
}

interface Conversation {
  conversationId?: string; // Optional for single chats
  groupId?: string; // Optional for group chats
  isGroup: boolean;
  name: string;
  lastMessage: string;
  sentAt: string;
  imageSrc: string;
}

interface ChatListProps {
  userId: string;
}

const ChatList: React.FC<ChatListProps> = ({ userId }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const { groups } = useGroupStore(); // Use Zustand store to fetch groups
console.log(groups);
  useEffect(() => {
    const fetchChatData = async () => {
      try {
        const response = await axios.get<ChatResponse>(`/api/messages/lastMessages?userId=${userId}`);
        const { lastSingleMessages, lastGroupMessages } = response.data.data;

        const allConversations: Conversation[] = [
          ...lastSingleMessages.map(msg => ({
            conversationId: msg.conversationId,
            isGroup: false,
            name: `${msg.senderName} and ${msg.receiverName}`,
            lastMessage: msg.lastMessage,
            sentAt: msg.sentAt,
            imageSrc: '', // Set to appropriate avatar URL if available
          })),
          ...lastGroupMessages.map(msg => ({
            groupId: msg.groupId,
            isGroup: true,
            name: msg.groupName,
            lastMessage: msg.lastMessage,
            sentAt: msg.sentAt,
            imageSrc: '', // Set to appropriate group image URL if available
          })),
          ...groups.map(group => ({
            
            groupId: group.groupId,
            isGroup: true,
            name: group.name,
            lastMessage: group.lastMessage,
            sentAt: group.sentAt,
            imageSrc: group.imageSrc,
          })),
        ];

        setConversations(allConversations);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching chat data:', error);
      }
    };

    fetchChatData();
  }, [userId, groups]); // Include groups in the dependency array

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mt-4 overflow-y-auto max-h-[calc(100vh-4rem)]">
      {conversations.map((conversation) => (
        <ChatListItem
          key={conversation.conversationId || conversation.groupId} // Use whichever is defined
          imageSrc={conversation.imageSrc}
          name={conversation.name}
          lastMessage={conversation.lastMessage}
          conversationId={conversation.conversationId}
          groupId={conversation.groupId}
        />
      ))}
    </div>
  );
};

export default ChatList;
