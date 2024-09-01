import React from 'react';

import { dummyConversations, dummyMessages, dummyUsers } from './dummyData';
import ChatListItem from '../molecules/ChatListItem';

const ChatList: React.FC = () => {
  return (
    <div className="mt-4 overflow-y-auto max-h-[calc(100vh-4rem)]">
      {dummyConversations.map((conversation) => {
        const isGroup = conversation.isGroup;
        const participants = conversation.participants.map(
          (id) => dummyUsers.find((user) => user.id === id)?.name || ''
        );

        const lastMessage = dummyMessages.find(
          (message) => message.conversation === conversation.id
        );

        return (
          <ChatListItem
            key={conversation.id}
            imageSrc={isGroup ? conversation.groupImage || '' : dummyUsers.find((user) => user.id === conversation.participants[0])?.image || ''}
            name={isGroup ? `${conversation.groupName}${participants.length > 2 ? `, ${participants[2]}...` : ''}` : participants.join(', ')}
            lastMessage={lastMessage ? lastMessage.content : 'No messages yet'}
          />
        );
      })}
    </div>
  );
};

export default ChatList;
