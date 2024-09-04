"use client";
import React, { useEffect, useState, useCallback } from 'react';
import Pusher from 'pusher-js';
import ChatTemplate from '../ChatTemplate/ChatTemplate';
import GroupChatTemplate from '../GroupChatTemplate/GroupChatTemplate';
import { User } from '../Messages/model';
import { SingleMessage } from '@/lib/models/SingleMessageSchema';
import { GroupMessage } from '@/lib/models/GroupMessageSchema';

interface Member {
  image: string | null;
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

interface GroupData {
  name: string;
  admin: string;
  members: User[];
}

type Message = SingleMessage | GroupMessage;

const Messages: React.FC<{ selectedConversationId?: string; selectedGroupId?: string }> = ({ selectedConversationId, selectedGroupId }) => {
 console.log("THIS IS TEST FOR SELECTEDCONVID---->",selectedConversationId)
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [receiver, setReceiver] = useState<User | null>(null);
  const [groupData, setGroupData] = useState<GroupData | null>(null);

  const fetchCurrentUser = useCallback(async (userId: string) => {
    try {
      const response = await fetch(`http://localhost:3000/api/users/${userId}`);
      const data = await response.json();
      console.log("CURR USER______________________>",data)
      setCurrentUser(data);
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  }, []);

  const fetchReceiver = useCallback(async (receiverId: string) => {
    try {
      const response = await fetch(`http://localhost:3000/api/users/${receiverId}`);
      const data = await response.json();
      setReceiver(data);
    } catch (error) {
      console.error('Error fetching receiver:', error);
    }
  }, []);

  const fetchMessages = useCallback(async (senderId: string, receiverId: string) => {
    try {
      const response = await fetch(`http://localhost:3000/api/messages/single?senderId=${senderId}&receiverId=${receiverId}`);
      const data: SingleMessage[] = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  }, []);

  const fetchGroupData = useCallback(async (groupId: string) => {
    try {
      const response = await fetch(`http://localhost:3000/api/groups/${groupId}`);
      const data = await response.json();
      console.log("THE DATA FOR GROUP DATA____>",data)
      setGroupData({
        name: data.group.name,
        admin: data.group.admin,
        members: data.group.members,
      });
    } catch (error) {
      console.error('Error fetching group data:', error);
    }
  }, []);

  const fetchGroupMessages = useCallback(async (groupId: string) => {
    try {
      const response = await fetch(`http://localhost:3000/api/messages/group?groupId=${groupId}`);
      const data: GroupMessage[] = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching group messages:', error);
    }
  }, []);

  useEffect(() => {
    if (selectedConversationId) {
      const [senderId, receiverId] = selectedConversationId.split('-');
      fetchCurrentUser(senderId);
      fetchReceiver(receiverId);
      fetchMessages(senderId, receiverId);

      const pusher = new Pusher("00b691724236d02babc5", { cluster: "ap2" });
      const channel = pusher.subscribe(`user-${receiverId}`);
      
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
      fetchGroupData(selectedGroupId);
      fetchGroupMessages(selectedGroupId);

      const pusher = new Pusher('00b691724236d02babc5', { cluster: 'ap2' });
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
  }, [selectedConversationId, selectedGroupId, fetchCurrentUser, fetchReceiver, fetchMessages, fetchGroupData, fetchGroupMessages]);

  const handleSendMessage = (message: SingleMessage | GroupMessage) => {
    setMessages(prevMessages => {
      const isSingle = (prevMessages[0] as SingleMessage)?.receiver !== undefined;
      const isGroup = (prevMessages[0] as GroupMessage)?.groupId !== undefined;

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
          user={currentUser || ({} as User)}
          receiver={receiver || ({} as User)}
          messages={messages as SingleMessage[]}
          onSendMessage={handleSendMessage}
        />
      ) : (
        <GroupChatTemplate
          user={currentUser || ({} as User)}
          groupId={selectedGroupId || ''}
          messages={messages as GroupMessage[]}
          onSendMessage={handleSendMessage}
          groupName={groupData?.name || ''}
          groupAdmin={groupData?.admin || ''}
          groupMembers={groupData?.members || []}
        />
      )}
    </div>
  );
};

export default Messages;
