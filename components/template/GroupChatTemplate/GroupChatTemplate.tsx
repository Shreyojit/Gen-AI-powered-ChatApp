import React, { useState, useRef, useEffect } from 'react';
import { MdAttachFile, MdEmojiEmotions, MdSend } from "react-icons/md";
import { GroupMessage } from '@/lib/models/GroupMessageSchema';
import { User } from '../Messages/model';

export interface GroupChatTemplateProps {
  user: User;
  groupId: string;
  messages: GroupMessage[];
  onSendMessage: (message: GroupMessage) => void;
  groupName: string; // Added groupName prop
  groupAdmin: string; // Added groupAdmin prop
  groupMembers: User[];
}

const GroupChatTemplate: React.FC<GroupChatTemplateProps> = ({ user, groupId, messages, onSendMessage, groupName, groupAdmin, groupMembers }) => {

  console.log("THIS IS USER--------------------->", groupMembers);

  const [inputValue, setInputValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false); // Loading state for LLaMA queries
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    console.log("Input Changed:", e.target.value); // Debug log
  };

  // Handle sending messages
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Send Message Function Called"); // Debug log

    if (!inputValue.trim()) return;

    // Check if the message starts with '@llama'
    const llamaPrefix = '@llama';
    const trimmedInput = inputValue.trim();
    const isLlamaQuery = trimmedInput.startsWith(llamaPrefix);

    console.log("Trimmed Input:", trimmedInput); // Debug log
    console.log("Is Llama Query:", isLlamaQuery); // Debug log

    let messageToSend = inputValue;
    setIsLoading(true); // Set loading state

    if (isLlamaQuery) {
      // Extract the query part after '@llama'
      const query = trimmedInput.slice(llamaPrefix.length).trim();

      console.log("QUERY IS--------------------->", query); // Debug log

      if (!query) {
        console.error('No query provided after @llama');
        setIsLoading(false);
        return;
      }

      try {
        // Fetch response from LLaMA API
        const response = await fetch('/api/llama', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query }),
        });

        if (!response.ok) {
          throw new Error('Failed to get response from LLaMA');
        }

        const data = await response.json();
        console.log('Response from LLaMA:', data);

        const { answer } = data; // Ensure the field 'answer' is what your backend returns

        // Update message to include LLaMA's response
        messageToSend = `LLaMA says: ${answer}`;
      } catch (error) {
        console.error('Error fetching LLaMA response:', error);
        messageToSend = `Error: Could not get response from LLaMA.`;
      }
    }

    const newMessage: GroupMessage = {
      groupId,
      senderId: user._id,
      message: messageToSend,
      sentAt: new Date(), // Ensure this is a Date object
    };

    console.log("New Message Object:", newMessage); // Debug log

    try {
      const response = await fetch('http://localhost:3000/api/messages/group', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          groupId,
          senderId: user._id,
          message: messageToSend,
          type: isLlamaQuery ? 'llama' : 'text', // Add type to differentiate
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      setInputValue('');
      onSendMessage(newMessage); // Update messages in parent
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false); // Ensure loading state is cleared
    }
  };

  const getSenderName = (senderId: string) => {
    console.log("Finding Sender Name for ID:", senderId); // Debug log
  
    // Print groupMembers to ensure it contains the expected data
    console.log("Group Members:", groupMembers); // Debug log
    
    const user = groupMembers.find(member => member._id === senderId);
    
    if (user) {
      console.log("User Found:", user); // Debug log
      return user.name; // Return the name property
    } else {
      console.log("User Not Found"); // Debug log
      return 'Unknown'; // Return default value if user is not found
    }
  };
  
  

  // Scroll to the bottom of the messages list when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      console.log("Scrolled to bottom of messages"); // Debug log
    }
  }, [messages]);

  return (
    <div className="bg-white flex flex-col h-full w-full shadow-lg">
      {/* Topbar */}
      <div className="bg-gray-100 border-b border-gray-300 flex items-center justify-between p-4">
        <h3 className="font-semibold text-lg">{groupName}</h3> {/* Display group name */}
        <div className="flex items-center gap-3">
          {groupMembers.map(member => (
            <div key={member._id} className="w-12 h-12 rounded-full overflow-hidden">
              <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex flex-col space-y-4">
          {messages.map((message, index) => {
            const sentAtDate = new Date(message.sentAt); // Convert to Date object
            console.log("Rendering Message:", message); // Debug log
            return (
              <div
                key={index}
                className={`flex ${message.senderId === user._id ? 'justify-end' : 'justify-start'} items-start space-x-2`}
              >
                <div
                  className={`px-4 py-2 rounded-lg max-w-xs ${
                    message.senderId === user._id ? 'bg-blue-500 text-white' : 'bg-gray-200'
                  }`}
                >
                  <div className="font-semibold text-sm">
                    {getSenderName(message.senderId)}
                  </div>
                  <div className="mt-1">
                    {message.message}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {sentAtDate.toLocaleString()} {/* Use a more readable format */}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <form className="bg-gray-100 p-4 flex items-center" onSubmit={handleSendMessage}>
        <MdEmojiEmotions className="text-gray-500 w-6 h-6 mr-2 cursor-pointer" />
        <MdAttachFile className="text-gray-500 w-6 h-6 mr-2 cursor-pointer" />
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Type your message..."
          className="flex-1 mr-2 pl-4 rounded-full border border-gray-300 bg-gray-100 placeholder:text-gray-500"
          disabled={isLoading} // Disable input when loading
        />
        <button type="submit" className={`p-2 rounded-full ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`} disabled={isLoading}>
          {isLoading ? 'Processing...' : <MdSend />}
        </button>
      </form>
    </div>
  );
};

export default GroupChatTemplate;
