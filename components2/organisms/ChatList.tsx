"use client"

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ChatListItem from '../molecules/ChatListItem';

interface SingleMessage {
  conversationId: string;
  senderName: string;
  receiverName: string;
  lastMessage: string;
  sentAt: string;
}

interface GroupMessage {
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
  conversationId: string;
  isGroup: boolean;
  name: string;
  lastMessage: string;
  sentAt: string;
  imageSrc: string; // Placeholder for group images or user avatars
}

const ChatList: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChatData = async () => {
      try {
        console.log('Fetching chat data...');
        const userId = '66cf6e8ced78a4952dfd79c5'; // Replace with dynamic user ID if needed
        const response = await axios.get<ChatResponse>(`/api/messages/lastMessages?userId=${userId}`);
        console.log('API response:', response);

        const { lastSingleMessages, lastGroupMessages } = response.data.data;

        const allConversations: Conversation[] = [
          ...lastSingleMessages.map(msg => ({
            conversationId: msg.conversationId,
            isGroup: false,
            name: `${msg.senderName} and ${msg.receiverName}`,
            lastMessage: msg.lastMessage,
            sentAt: msg.sentAt,
            imageSrc: '' // Set to appropriate avatar URL if available
          })),
          ...lastGroupMessages.map(msg => ({
            conversationId: msg.groupName,
            isGroup: true,
            name: msg.groupName,
            lastMessage: msg.lastMessage,
            sentAt: msg.sentAt,
            imageSrc: '' // Set to appropriate group image URL if available
          }))
        ];

        setConversations(allConversations);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching chat data:', error);
      }
    };

    fetchChatData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mt-4 overflow-y-auto max-h-[calc(100vh-4rem)]">
      {conversations.map((conversation) => (
        <ChatListItem
          key={conversation.conversationId}
          imageSrc={conversation.imageSrc}
          name={conversation.name}
          lastMessage={conversation.lastMessage}
        />
      ))}
    </div>
  );
};

export default ChatList;
