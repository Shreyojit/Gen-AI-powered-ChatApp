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
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [receiver, setReceiver] = useState<User | null>(null);
  const [groupData, setGroupData] = useState<GroupData | null>(null);
  const [memberNames, setMemberNames] = useState<string[]>([]); // Moved useState inside component

  const fetchCurrentUser = useCallback(async (userId: string) => {
    console.log(`Fetching current user with ID: ${userId}`);
    try {
      const response = await fetch(`http://localhost:3000/api/users/${userId}`);
      if (!response.ok) {
        throw new Error(`Error fetching current user: ${response.statusText}`);
      }
      const data = await response.json();
      console.log("Fetched current user:", data);
      setCurrentUser(data);
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  }, []);

  const fetchReceiver = useCallback(async (receiverId: string) => {
    console.log(`Fetching receiver with ID: ${receiverId}`);
    try {
      const response = await fetch(`http://localhost:3000/api/users/${receiverId}`);
      if (!response.ok) {
        throw new Error(`Error fetching receiver: ${response.statusText}`);
      }
      const data = await response.json();
      console.log("Fetched receiver:", data);
      setReceiver(data);
    } catch (error) {
      console.error('Error fetching receiver:', error);
    }
  }, []);

  const fetchMessages = useCallback(async (senderId: string, receiverId: string) => {
    console.log(`Fetching messages between sender ${senderId} and receiver ${receiverId}`);
    try {
      const response = await fetch(`http://localhost:3000/api/messages/single?senderId=${senderId}&receiverId=${receiverId}`);
      if (!response.ok) {
        throw new Error(`Error fetching messages: ${response.statusText}`);
      }
      const data: SingleMessage[] = await response.json();
      console.log("Fetched messages:", data);
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  }, []);

  const fetchGroupData = useCallback(async (groupId: string) => {
    console.log(`Fetching group data with ID: ${groupId}`);
    try {
      const response = await fetch(`http://localhost:3000/api/groups/${groupId}`);
      if (!response.ok) {
        throw new Error(`Error fetching group data: ${response.statusText}`);
      }
      const data = await response.json();
      console.log("Fetched group data:", data);
      setGroupData({
        name: data.group.name,
        admin: data.group.admin,
        members: data.group.members.map((member: User) => ({
          _id: member._id,
          name: member.name,
          email: member.email,
          image: member.image,
        })),
      });

      // Set member names here
      setMemberNames(data.group.members.map((member: User) => member.name));
      console.log("MEMBER NAMES------>", data.group.members.map((member: User) => member.name));
    } catch (error) {
      console.error('Error fetching group data:', error);
    }
  }, []);

  const fetchGroupMessages = useCallback(async (groupId: string) => {
    console.log(`Fetching group messages with group ID: ${groupId}`);
    try {
      const response = await fetch(`http://localhost:3000/api/messages/group?groupId=${groupId}`);
      if (!response.ok) {
        throw new Error(`Error fetching group messages: ${response.statusText}`);
      }
      const data: GroupMessage[] = await response.json();
      console.log("Fetched group messages:", data);
      setMessages(data);
    } catch (error) {
      console.error('Error fetching group messages:', error);
    }
  }, []);

  useEffect(() => {
    if (selectedConversationId) {
      const [senderId, receiverId] = selectedConversationId.split('-');
      console.log(`Selected conversation ID: ${selectedConversationId}`);
      fetchCurrentUser(senderId);
      fetchReceiver(receiverId);
      fetchMessages(senderId, receiverId);

      const pusher = new Pusher("00b691724236d02babc5", { cluster: "ap2" });
      const channel = pusher.subscribe(`user-${receiverId}`);
      
      channel.bind('singleMessage', (data: SingleMessage) => {
        console.log("Received single message via Pusher:", data);
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
      console.log(`Selected group ID: ${selectedGroupId}`);
      fetchGroupData(selectedGroupId);
      fetchGroupMessages(selectedGroupId);

      const pusher = new Pusher('00b691724236d02babc5', { cluster: 'ap2' });
      const channel = pusher.subscribe(`group-${selectedGroupId}`);

      channel.bind('groupMessage', (data: GroupMessage) => {
        console.log("Received group message via Pusher:", data);
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
    console.log("Handling send message:", message);
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

  console.log("THIS IS GROUP DATA------->", groupData);
  
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
