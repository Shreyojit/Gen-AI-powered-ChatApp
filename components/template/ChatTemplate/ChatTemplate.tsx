import React, { useEffect, useRef, useState } from 'react';
import { MdAttachFile, MdEmojiEmotions, MdSend, MdPhone, MdVideocam } from "react-icons/md"; // Import phone and video call icons
import { SingleMessage } from '@/lib/models/SingleMessageSchema';
import { User } from '../Messages/model';
import Link from 'next/link'

interface ChatTemplateProps {
  user: User;
  receiver: User;
  messages: SingleMessage[];
  onSendMessage: (message: SingleMessage) => void; // Callback to handle new messages
}

const ChatTemplate: React.FC<ChatTemplateProps> = ({ user, receiver, messages, onSendMessage }) => {
  const [inputValue, setInputValue] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null); // Ref to track the end of the messages list

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!inputValue.trim()) return;
  
    const newMessage: SingleMessage = {
      sender: user._id,
      receiver: receiver._id,
      message: inputValue,
      sentAt: new Date(),
      receivedAt: undefined,
      readAt: undefined,
    };
  
    try {
      const response = await fetch('http://localhost:3000/api/messages/single', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          senderId: user._id,
          receiverId: receiver._id,
          message: inputValue,
          type: 'text',
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
  
      setInputValue(''); // Clear the input field
      onSendMessage(newMessage); // Notify parent component about the new message
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  

  useEffect(() => {
    // Scroll to the bottom of the messages list whenever a new message is added
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]); // The effect will run whenever the messages array changes

  return (
    <div className="bg-white flex flex-col h-full w-full shadow-lg">
      {/* Topbar */}
      <div className="bg-gray-100 border-b border-gray-300 flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden">
            <img src={receiver.image} alt={receiver.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col">
            <h3 className="font-semibold text-lg">{receiver.name}</h3>
            <p className="text-gray-500">{receiver.isOnline ? 'Online' : 'Offline'}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Phone Call Button */}
          <Link href={`/video-call?userID=${user._id}&receiverID=${receiver._id}`} legacyBehavior>
            <a className="p-2 rounded-full hover:bg-gray-200">
              <MdPhone className="text-gray-500 w-6 h-6" />
            </a>
          </Link>
          {/* Video Call Button */}
          <Link
  href={{
    pathname: '/video-call',
    query: {
      userID: user._id,
      receiverID: receiver._id,
      user: encodeURIComponent(JSON.stringify(user)), // Serialize and encode the user object
    },
  }}
  legacyBehavior
>
  <a className="p-2 rounded-full hover:bg-gray-200">
    <MdVideocam className="text-gray-500 w-6 h-6" />
  </a>
</Link>
        </div>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex flex-col space-y-4">
          {messages.map((message, index) => (
            <div
              key={index} // Use index if no unique ID available
              className={`flex ${message.sender === user._id ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`px-4 py-2 rounded-lg max-w-xs ${
                  message.sender === user._id ? 'bg-blue-500 text-white' : 'bg-gray-200'
                }`}
              >
                {message.message}
              </div>
            </div>
          ))}
          {/* Ref to the last message */}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <form className="bg-gray-100 p-4 flex items-center" onSubmit={handleSendMessage}>
        {/* Emoji Icon */}
        <MdEmojiEmotions className="text-gray-500 w-6 h-6 mr-2 cursor-pointer" />

        {/* Attachment Icon */}
        <MdAttachFile className="text-gray-500 w-6 h-6 mr-2 cursor-pointer" />

        {/* Input Field */}
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Type your message..."
          className="flex-1 mr-2 pl-4 rounded-full border border-gray-300 bg-gray-100 placeholder:text-gray-500"
        />

        {/* Send Button */}
        <button type="submit" className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600">
          <MdSend />
        </button>
      </form>
    </div>
  );
};

export default ChatTemplate;
