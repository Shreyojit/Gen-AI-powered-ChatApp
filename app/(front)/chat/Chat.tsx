"use client"
import React from 'react';
import Messages from '@/components/template/Messages/Messages';
import Sidebar from '@/components2/template/Sidebar';
import { useChatStore } from '@/lib/hooks/chatStore';


const Chat = () => {
  const { selectedConversationId, selectedGroupId } = useChatStore();

  return (
    <div className="flex flex-row flex-grow">
      {/* SIDEBAR */}
      <Sidebar />

      {/* MESSAGES */}
      <div className="flex-1 p-4 flex items-center justify-center">
        {selectedConversationId || selectedGroupId ? (
          <Messages selectedConversationId={selectedConversationId} selectedGroupId={selectedGroupId} />
        ) : (
          <div className="text-gray-500 text-lg">NO CHATS SELECTED!!</div>
        )}
      </div>
    </div>
  );
};

export default Chat;
