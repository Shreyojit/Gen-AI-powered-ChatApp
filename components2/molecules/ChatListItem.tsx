import React from 'react';
import Avatar from '../atoms/Avatar';
import ConversationName from '../atoms/ConversationName';
import MessagePreview from '../atoms/MessagePreview';

interface ChatListItemProps {
  imageSrc: string;
  name: string;
  lastMessage: string;
}

const ChatListItem: React.FC<ChatListItemProps> = ({ imageSrc, name, lastMessage }) => {
  return (
    <div className="flex items-center p-2 hover:bg-gray-100 cursor-pointer border-b border-gray-200">
      <Avatar imageSrc={imageSrc} />
      <div className="ml-4 flex-1 overflow-hidden">
        <ConversationName name={name} />
        <MessagePreview content={lastMessage} />
      </div>
    </div>
  );
};

export default ChatListItem;
