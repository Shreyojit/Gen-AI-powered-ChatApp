"use client";
import React from 'react';

interface MessageItemProps {
  user: boolean;
  message: string;
}

const MessageItem: React.FC<MessageItemProps> = ({ user, message }) => (
  <div className={`chat ${user ? "chat-end" : "chat-start"}`}>
    <div className={`chat-bubble ${user ? "chat-bubble" : "chat-bubble-primary"}`}>
      {message}
    </div>
  </div>
);

export default MessageItem;
