'use client'

import React, { useState, useEffect } from 'react';
import Input from '../atoms/Input';
import { SearchIcon } from '@/lib/utils/icons';
import Icon from '../atoms/Icon';
import { useSession } from 'next-auth/react';

interface User {
  _id: string;
  name: string;
  image?: string; // Image is optional
}

interface SearchBarInputProps {
  placeholder?: string;
  users: User[];
}

const SearchBarInput: React.FC<SearchBarInputProps> = ({ placeholder, users }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

  const { data: session } = useSession()
  console.log(session)



  useEffect(() => {
    if (searchTerm) {
      // Filter users based on the search term
      const results = users.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(results);
    } else {
      // Clear filtered users when searchTerm is empty
      setFilteredUsers([]);
    }
  }, [searchTerm, users]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="relative w-full">
      <Input
        placeholder={placeholder}
        className="pl-12 rounded-full input-bordered w-full bg-gray-100 placeholder:text-gray-500"
        onChange={handleChange}
      />
      <Icon src={<SearchIcon />} />

      {/* Display filtered users only if searchTerm is not empty and there are matches */}
      {searchTerm && filteredUsers.length > 0 && (
        <div className="absolute top-full left-0 w-full bg-white border rounded-lg shadow-lg mt-2 z-10">
          {filteredUsers.map((user) => (
            <div
              key={user._id}
              className="flex items-center gap-4 p-2 cursor-pointer hover:bg-gray-100"
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
