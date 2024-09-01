import React, { useState } from 'react';
import { X, Search } from 'lucide-react';

type User = {
  _id: string;
  name: string;
  image: string;
};

type CreateGroupChatModalProps = {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
};

const CreateGroupChatModal: React.FC<CreateGroupChatModalProps> = ({ isOpen, onClose, users }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [searchResults, setSearchResults] = useState<User[]>(users);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    setSearchResults(users.filter(user => user.name.toLowerCase().includes(term.toLowerCase())));
  };

  const handleSelectUser = (user: User) => {
    if (!selectedUsers.find(selected => selected._id === user._id)) {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const handleDeselectUser = (user: User) => {
    setSelectedUsers(selectedUsers.filter(selected => selected._id !== user._id));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-xl text-gray-500 hover:text-gray-700"
        >
          <X />
        </button>
        <h2 className="text-lg font-semibold mb-4">Create Group Chat</h2>
        
        {/* Selected Users */}
        <div className="flex flex-wrap gap-2 mb-4 max-h-24 overflow-auto p-1 border border-gray-200 rounded-lg">
          {selectedUsers.map(user => (
            <div key={user._id} className="flex items-center gap-2 bg-gray-100 p-2 rounded-md w-auto max-w-xs">
              <img
                src={user.image}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="text-sm">{user.name}</span>
              <button
                onClick={() => handleDeselectUser(user)}
                className="text-red-500"
              >
                <X />
              </button>
            </div>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search users"
            value={searchTerm}
            onChange={handleSearch}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-full w-full"
          />
          <div className="absolute top-2 left-3 text-gray-500">
            <Search />
          </div>
        </div>

        {/* User List */}
        <div className="max-h-60 overflow-y-auto"> {/* Adjust the height as needed */}
          <div className="flex flex-col gap-3">
            {searchResults.map(user => (
              <div
                key={user._id}
                className="flex items-center gap-3 p-2 border rounded cursor-pointer hover:bg-gray-100"
                onClick={() => handleSelectUser(user)}
              >
                <img
                  src={user.image}
                  alt={user.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-grow">
                  <h3 className="text-md font-medium">{user.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateGroupChatModal;
