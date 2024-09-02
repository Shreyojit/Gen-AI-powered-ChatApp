"use client";
import React, { useEffect, useState } from 'react';
import Pusher from 'pusher-js';
import ChatTemplate from '../ChatTemplate/ChatTemplate';
import GroupChatTemplate from '../GroupChatTemplate/GroupChatTemplate';
import { User } from '../Messages/model';
import { SingleMessage } from '@/lib/models/SingleMessageSchema';
import { GroupMessage } from '@/lib/models/GroupMessageSchema';

import { useSession } from 'next-auth/react';

const dummyUser: User = {
  _id: '66cf6e8ced78a4952dfd79c5',
  name: 'John Doe',
  email: 'johndoe@email.com',
  image: 'https://randomuser.me/api/portraits/men/67.jpg',
  tokenIdentifier: 'token123',
  isOnline: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const dummyReceiver: User = {
  _id: '66cf73b32ab5595510905b7f',
  name: 'Jane Doe',
  email: 'janedoe@email.com',
  image: 'https://randomuser.me/api/portraits/women/67.jpg',
  tokenIdentifier: 'token124',
  isOnline: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const dummyGroupId = '66d0dd1fe485466d430ca6a4';

type Message = SingleMessage | GroupMessage;

const Messages: React.FC<{ selectedConversationId?: string; selectedGroupId?: string }> = ({ selectedConversationId, selectedGroupId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  
  const { data: session } = useSession();

  useEffect(() => {
    if (selectedConversationId) {
      const fetchMessages = async () => {
        try {
          const response = await fetch(
            `http://localhost:3000/api/messages/single?senderId=${dummyUser._id}&receiverId=${dummyReceiver._id}`
          );
          const data: SingleMessage[] = await response.json();
          setMessages(data);
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      };
  
      fetchMessages();
  
      const pusher = new Pusher("00b691724236d02babc5", {
        cluster: "ap2",
      });
  
      const channel = pusher.subscribe(`user-${dummyReceiver._id}`);
  
      channel.bind('singleMessage', (data: SingleMessage) => {
        setMessages(prevMessages => {
          if (prevMessages.some(msg => (msg as SingleMessage)._id === data._id)) {
            return prevMessages;
          }
          return [...prevMessages, data];
        });
      });
  
      return () => {
        channel.unbind_all();
        channel.unsubscribe();
      };
  
    } else if (selectedGroupId) {
      const fetchMessages = async () => {
        try {
          const response = await fetch(`http://localhost:3000/api/messages/group?groupId=${selectedGroupId}`);
          const data: GroupMessage[] = await response.json();
          setMessages(data);
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      };
  
      fetchMessages();
  
      const pusher = new Pusher('00b691724236d02babc5', {
        cluster: 'ap2',
      });
  
      const channel = pusher.subscribe(`group-${selectedGroupId}`);
  
      channel.bind('groupMessage', (data: GroupMessage) => {
        setMessages(prevMessages => {
          if (prevMessages.some(msg => (msg as GroupMessage)._id === data._id)) {
            return prevMessages;
          }
          return [...prevMessages, data];
        });
      });
  
      return () => {
        channel.unbind('groupMessage');
        channel.unsubscribe();
      };
    }
  }, [selectedConversationId, selectedGroupId]);

  const handleSendMessage = (message: SingleMessage | GroupMessage) => {
    setMessages(prevMessages => {
      if (prevMessages.length === 0) {
        return [message];
      }
  
      const isSingle = (prevMessages[0] as SingleMessage).receiver !== undefined;
      const isGroup = (prevMessages[0] as GroupMessage).groupId !== undefined;
  
      if (isSingle && (message as SingleMessage).receiver !== undefined) {
        return [...prevMessages as SingleMessage[], message as SingleMessage];
      } else if (isGroup && (message as GroupMessage).groupId !== undefined) {
        return [...prevMessages as GroupMessage[], message as GroupMessage];
      }
  
      return prevMessages;
    });
  };

  if (!selectedConversationId && !selectedGroupId) {
    return <div className="text-gray-500 text-lg">NO CHATS SELECTED!!</div>;
  }

  return (
    <div className="w-screen h-screen flex">
      {selectedConversationId ? (
        <ChatTemplate
          user={dummyUser}
          receiver={dummyReceiver}
          messages={messages as SingleMessage[]}
          onSendMessage={handleSendMessage}
        />
      ) : (
        <GroupChatTemplate
          user={dummyUser}
          groupId={selectedGroupId || ''}
          messages={messages as GroupMessage[]}
          onSendMessage={handleSendMessage}
          groupMembers={[]} // Replace with actual group members
        />
      )}
    </div>
  );
};

export default Messages;








// import Pusher from 'pusher-js';
// import React, { useEffect, useState } from 'react';
// import GroupChatTemplate from '../GroupChatTemplate/GroupChatTemplate'; // Ensure correct import
// import { User } from '../Messages/model';
// import { GroupMessage } from '@/lib/models/GroupMessageSchema';

// // Example GroupMessage definition


// // Example group ID
// const groupId = '66d0dd1fe485466d430ca6a4';

// // Replace these with your actual user data
// const dummyUser: User = {
//   _id: '66cf6e8ced78a4952dfd79c5',
//   name: 'John Doe',
//   email: 'johndoe@email.com',
//   image: 'https://randomuser.me/api/portraits/men/67.jpg',
//   tokenIdentifier: 'token123',
//   isOnline: true,
//   createdAt: new Date().toISOString(),
//   updatedAt: new Date().toISOString(),
// };


// // Example user list
// const dummyUsers: User[] = [
//   {
//     _id: '66cf6e8ced78a4952dfd79c5',
//     name: 'John Doe',
//     email: 'johndoe@email.com',
//     image: 'https://randomuser.me/api/portraits/men/67.jpg',
//     tokenIdentifier: 'token123',
//     isOnline: true,
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString(),
//   },
//   {
//     _id: '66cf73b32ab5595510905b7f',
//     name: 'Jane Doe',
//     email: 'janedoe@email.com',
//     image: 'https://randomuser.me/api/portraits/women/67.jpg',
//     tokenIdentifier: 'token124',
//     isOnline: true,
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString(),
//   },
//   {
//     _id: '66cf73b32ab5595510905b80',
//     name: 'Alice Smith',
//     email: 'alicesmith@email.com',
//     image: 'https://randomuser.me/api/portraits/women/68.jpg',
//     tokenIdentifier: 'token125',
//     isOnline: false,
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString(),
//   },
//   {
//     _id: '66cf73b32ab5595510905b81',
//     name: 'Bob Johnson',
//     email: 'bobjohnson@email.com',
//     image: 'https://randomuser.me/api/portraits/men/68.jpg',
//     tokenIdentifier: 'token126',
//     isOnline: true,
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString(),
//   },
//   {
//     _id: '66cf73b32ab5595510905b82',
//     name: 'Charlie Brown',
//     email: 'charliebrown@email.com',
//     image: 'https://randomuser.me/api/portraits/men/69.jpg',
//     tokenIdentifier: 'token127',
//     isOnline: false,
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString(),
//   },
// ];


// const GroupMessages: React.FC = () => {
//   const [messages, setMessages] = useState<GroupMessage[]>([]);

//   useEffect(() => {
//     const fetchMessages = async () => {
//       try {
//         const response = await fetch(`http://localhost:3000/api/messages/group?groupId=${groupId}`);
//         const data: GroupMessage[] = await response.json();
//         setMessages(data.map(msg => ({
//           ...msg,
//           sentAt: new Date(msg.sentAt)
//         })));
//       } catch (error) {
//         console.error('Error fetching messages:', error);
//       }
//     };

//     fetchMessages();

//     const pusher = new Pusher('YOUR_APP_KEY', {
//       cluster: 'ap2',
//     });

//     const channel = pusher.subscribe(`group-${groupId}`);
 
//     const handleMessage = (data: GroupMessage) => {
//       const newMessage: GroupMessage = {
//         ...data,
//         sentAt: new Date(data.sentAt)
//       };
     
//       setMessages(prevMessages => {
//       //     @ts-ignore
//         if (prevMessages.some(msg => msg._id === newMessage._id)) {
//           return prevMessages; // Prevent adding duplicate messages
//         }
//         return [...prevMessages, newMessage];
//       });
//     };

//     channel.bind('groupMessage', handleMessage);

//     return () => {
//       channel.unbind('groupMessage', handleMessage); // Unbind specific event handler
//       channel.unsubscribe();
//     };
//   }, []);

//   const handleSendMessage = (message: GroupMessage) => {
//     setMessages(prevMessages => [...prevMessages, message]);
//   };

//   return (
//     <div className="w-screen h-screen flex">
//       <GroupChatTemplate
//         user={dummyUser} 
//         groupId={groupId} 
//         messages={messages} 
//         onSendMessage={handleSendMessage} 
//         groupMembers={dummyUsers}
//       />
//     </div>
//   );
// };

// export default GroupMessages;
