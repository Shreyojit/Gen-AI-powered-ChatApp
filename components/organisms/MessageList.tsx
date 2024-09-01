"use client";
import React, { useEffect, useState } from 'react';
import { dummyMessages } from './dummyData'; // Adjust the path as needed

import { useAutoAnimate } from '@formkit/auto-animate/react';
import MessageItem from '../molecules/MessageItem';

const MessageList: React.FC = () => {
  const [messages, setMessages] = useState(dummyMessages);
  const [parent] = useAutoAnimate();

  useEffect(() => {
    // Simulate a message refresh
    // Replace this with actual socket event handler later
    setMessages(dummyMessages);
  }, []);

  return (
    <div ref={parent} className='w-full mb-10 flex flex-col max-h-[75vh] overflow-auto no-scrollbar'>
      {messages.map((item, i) => (
        <MessageItem
          key={i}
          user={item.sender === "1"} // Assuming "1" is the current user's ID
          message={item.messageType}
        />
      ))}
    </div>
  );
}

export default MessageList;
