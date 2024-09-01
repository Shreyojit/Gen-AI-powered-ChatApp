import React, { useState } from 'react';
import { X, Search } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';

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

  console.log("USERS ARRAY PASSED IS------->>>>>>",users)
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [searchResults, setSearchResults] = useState<User[]>(users);
  const [groupName, setGroupName] = useState('');
  const [groupImage, setGroupImage] = useState<File | null>(null); // File or null

  const { data: session } = useSession();

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

  // Handle file upload for images
  const uploadHandler = async (file: File): Promise<string | null> => {
    const toastId = toast.loading('Uploading image...');
    try {
      const resSign = await fetch('/api/cloudinary-sign', { method: 'POST' });
      const { signature, timestamp } = await resSign.json();

      const formData = new FormData();
      formData.append('file', file);
      formData.append('signature', signature);
      formData.append('timestamp', timestamp);
      formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!);
      

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );
      const data = await res.json();

      if (res.ok) {
        toast.success('File uploaded successfully');
        return data.secure_url;
      } else {
        throw new Error(data.error.message || 'Image upload failed');
      }
    } catch (err: any) {
      toast.error(err.message);
      return null;
    }
  };

  const handleCreateGroup = async () => {
    if (!groupName || selectedUsers.length === 0) {
      alert('Please enter a group name and select at least one user.');
      return;
    }
  
    // Upload the group image and get the URL
    let groupImageUrl = null;
    if (groupImage) {
      groupImageUrl = await uploadHandler(groupImage);
    }
  
    // Prepare the JSON object
    const groupData = {
      name: groupName,
      image: groupImageUrl,
      admin: session?.user?._id as string,
      members: selectedUsers.map(user => user._id),
    };
  
    // Log the JSON object
    console.log('Group Data to be sent:', groupData);
  
    try {
      const response = await fetch('/api/groups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(groupData),
      });
  
      if (response.ok) {
        const newGroup = await response.json();
        console.log('Group created successfully:', newGroup);
        onClose();
      } else {
        console.error('Failed to create group');
      }
    } catch (error) {
      console.error('Error creating group:', error);
    }
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

        {/* Group Name Input */}
        <input
          type="text"
          placeholder="Group Name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          className="mb-4 w-full p-2 border rounded-lg"
        />

        {/* Group Image Upload */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Group Image</label>
          <input
            type="file"
            onChange={(e) => setGroupImage(e.target.files ? e.target.files[0] : null)}
            className="w-full text-gray-700 p-2 border rounded-lg"
          />
          {groupImage && (
            <div className="mt-2">
              <img
                src={URL.createObjectURL(groupImage)}
                alt="Group Preview"
                className="w-32 h-32 object-cover rounded-full border"
              />
            </div>
          )}
        </div>

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

        <button
          onClick={handleCreateGroup}
          className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
        >
          Create Group
        </button>
      </div>
    </div>
  );
};

export default CreateGroupChatModal;
