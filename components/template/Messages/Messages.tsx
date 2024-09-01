"use client"
import Pusher from 'pusher-js';
import React, { useEffect, useState } from 'react';
import ChatTemplate from '../ChatTemplate/ChatTemplate';
import { User } from '../Messages/model';
import { SingleMessage } from '@/lib/models/SingleMessageSchema';

const idString = '64e44f14f3c3e82bcecfb5e0';

// Convert the string to an object
const object = {
  id: idString
};

// Replace these with your actual user and receiver data
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

const Messages: React.FC = () => {
  const [messages, setMessages] = useState<SingleMessage[]>([]);
  
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(
          'http://localhost:3000/api/messages/single?senderId=66cf6e8ced78a4952dfd79c5&receiverId=66cf73b32ab5595510905b7f'
        );
        const data: SingleMessage[] = await response.json();
        setMessages(data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();

    // Initialize Pusher
    const pusher = new Pusher("00b691724236d02babc5", {
      cluster: "ap2",
    });

    // Subscribe to the user's channel
    const channel = pusher.subscribe(`user-${dummyReceiver._id}`);

    // Bind to the 'singleMessage' event
    channel.bind('singleMessage', (data: SingleMessage) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    // Cleanup
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, []);

  const handleSendMessage = (message: SingleMessage) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  return (
    <div className="w-screen h-screen flex">
      <ChatTemplate 
        user={dummyUser} 
        receiver={dummyReceiver} 
        messages={messages} 
        onSendMessage={handleSendMessage} 
      />
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
