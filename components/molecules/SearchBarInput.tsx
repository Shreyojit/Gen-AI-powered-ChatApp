import React, { useState, useEffect } from 'react';
import Input from '../atoms/Input';
import { SearchIcon } from '@/lib/utils/icons';
import Icon from '../atoms/Icon';

import { User } from '@/lib/models/User'; // Update import

import { useSession } from 'next-auth/react';
import { useChatStore } from '@/lib/hooks/chatStore';

interface SearchBarInputProps {
  placeholder?: string;
  users: User[];
}

const SearchBarInput: React.FC<SearchBarInputProps> = ({ placeholder, users }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  // const setSelectedUser = useChatStore((state) => state.setSelectedUser);
  const setSelectedConversation = useChatStore((state) => state.setSelectedConversation);

  const { data: session } = useSession();
  console.log("INSIDE SEARCHBAR INP--->",session?.user._id,typeof(session?.user._id))

  useEffect(() => {
    if (searchTerm) {
      const results = users.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(results);
    } else {
      setFilteredUsers([]);
    }
  }, [searchTerm, users]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleUserClick = (user: User) => {
    console.log("SELECTED USER IN LIST SEARCHBAR---->",user,typeof(user._id))
    console.log("CONSTRUCTED STRING----->",user._id+"-"+session?.user._id)
    
    const constructedId = `${user._id}-${session?.user._id}`;
    console.log("Constructed Conversation ID:", constructedId);
    
   
  
    // Store the constructed conversation ID in Zustand
    setSelectedConversation(constructedId);
    
   
  };

  return (
    <div className="relative w-full">
      <Input
        placeholder={placeholder}
        className="pl-12 rounded-full input-bordered w-full bg-gray-100 placeholder:text-gray-500"
        onChange={handleChange}
      />
      <Icon src={<SearchIcon />} />

      {searchTerm && filteredUsers.length > 0 && (
        <div className="absolute top-full left-0 w-full bg-white border rounded-lg shadow-lg mt-2 z-10">
          {filteredUsers.map((user) => (
            <div
              key={user._id}
              className="flex items-center gap-4 p-2 cursor-pointer hover:bg-gray-100"
              onClick={() => handleUserClick(user)}
            >
              <img
                src={user.image || '/path/to/default-avatar.png'}
                alt={user.name}
                className="w-8 h-8 rounded-full"
              />
              <span>{user.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBarInput;
