// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import ChatListItem from '../molecules/ChatListItem';

// interface SingleMessage {
//   conversationId: string;
//   senderName: string;
//   receiverName: string;
//   lastMessage: string;
//   sentAt: string;
// }

// interface GroupMessage {
//   groupName: string;
//   lastMessage: string;
//   sentAt: string;
// }

// interface ChatResponse {
//   data: {
//     lastSingleMessages: SingleMessage[];
//     lastGroupMessages: GroupMessage[];
//   };
//   success: boolean;
// }

// interface Conversation {
//   conversationId: string;
//   isGroup: boolean;
//   name: string;
//   lastMessage: string;
//   sentAt: string;
//   imageSrc: string; // Placeholder for group images or user avatars
// }

// interface ChatListProps {
//   userId: string;
// }

// const ChatList: React.FC<ChatListProps> = ({ userId }) => {
//   console.log("INSIDE CHATLIST COMP------>",userId,typeof(userId))
//   const [conversations, setConversations] = useState<Conversation[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchChatData = async () => {
//       try {
//         console.log('Fetching chat data...');
//         const response = await axios.get<ChatResponse>(`/api/messages/lastMessages?userId=${userId}`);
//         console.log('API response:', response);

//         const { lastSingleMessages, lastGroupMessages } = response.data.data;

//         const allConversations: Conversation[] = [
//           ...lastSingleMessages.map(msg => ({
//             conversationId: msg.conversationId,
//             isGroup: false,
//             name: `${msg.senderName} and ${msg.receiverName}`,
//             lastMessage: msg.lastMessage,
//             sentAt: msg.sentAt,
//             imageSrc: '' // Set to appropriate avatar URL if available
//           })),
//           ...lastGroupMessages.map(msg => ({
//             conversationId: msg.groupName,
//             isGroup: true,
//             name: msg.groupName,
//             lastMessage: msg.lastMessage,
//             sentAt: msg.sentAt,
//             imageSrc: '' // Set to appropriate group image URL if available
//           }))
//         ];

//         setConversations(allConversations);
//         setLoading(false);
//       } catch (error) {
//         console.error('Error fetching chat data:', error);
//       }
//     };

//     fetchChatData();
//   }, [userId]);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="mt-4 overflow-y-auto max-h-[calc(100vh-4rem)]">
//       {conversations.map((conversation) => (
//         <ChatListItem
//           key={conversation.conversationId}
//           imageSrc={conversation.imageSrc}
//           name={conversation.name}
//           lastMessage={conversation.lastMessage}
//         />
//       ))}
//     </div>
//   );
// };

// export default ChatList;




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
  groupId: string;
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
  conversationId?: string; // Optional for group chats
  groupId?: string; // Optional for single chats
  isGroup: boolean;
  name: string;
  lastMessage: string;
  sentAt: string;
  imageSrc: string;
}

interface ChatListProps {
  userId: string;
}

const ChatList: React.FC<ChatListProps> = ({ userId }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChatData = async () => {
      try {
        const response = await axios.get<ChatResponse>(`/api/messages/lastMessages?userId=${userId}`);
        const { lastSingleMessages, lastGroupMessages } = response.data.data;

        const allConversations: Conversation[] = [
          ...lastSingleMessages.map(msg => ({
            conversationId: msg.conversationId,
            isGroup: false,
            name: `${msg.senderName} and ${msg.receiverName}`,
            lastMessage: msg.lastMessage,
            sentAt: msg.sentAt,
            imageSrc: '', // Set to appropriate avatar URL if available
          })),
          ...lastGroupMessages.map(msg => ({
            groupId: msg.groupId,
            isGroup: true,
            name: msg.groupName,
            lastMessage: msg.lastMessage,
            sentAt: msg.sentAt,
            imageSrc: '', // Set to appropriate group image URL if available
          })),
        ];

        setConversations(allConversations);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching chat data:', error);
      }
    };

    fetchChatData();
  }, [userId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mt-4 overflow-y-auto max-h-[calc(100vh-4rem)]">
      {conversations.map((conversation) => (
        <ChatListItem
          key={conversation.conversationId || conversation.groupId} // Use whichever is defined
          imageSrc={conversation.imageSrc}
          name={conversation.name}
          lastMessage={conversation.lastMessage}
          conversationId={conversation.conversationId}
          groupId={conversation.groupId}
        />
      ))}
    </div>
  );
};

export default ChatList;

