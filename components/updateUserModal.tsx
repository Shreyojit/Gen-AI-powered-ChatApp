import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import { User } from '@/lib/models/User';
import { useGroupStore } from '@/lib/hooks/groupStore';

type UpdateUserModalProps = {
  isOpen: boolean;
  onClose: () => void;
  user: User;
};

const UpdateUserModal: React.FC<UpdateUserModalProps> = ({ isOpen, onClose, user }) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [image, setImage] = useState(user.image || '');
  const [imageFile, setImageFile] = useState<File | null>(null);

  console.log("INSIDE UPDATE USER MODAL----->",user.image)

  const { data: session } = useSession();
  const { addGroup } = useGroupStore(); // Example usage, if needed

  useEffect(() => {
    setName(user.name);
    setEmail(user.email);
    setImage(user.image || '');
  }, [user]);

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

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      setImageFile(file);
      const imageUrl = await uploadHandler(file);
      if (imageUrl) {
        setImage(imageUrl);
      }
    }
  };

  const handleSave = async () => {
    try {
        console.log("CHECK FOR POST REQ----->",user._id,typeof(user._id))
      const response = await fetch(`/api/users/${user._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, image }),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        console.log('User updated:', updatedUser);
        onClose();
      } else {
        console.error('Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
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
        <h2 className="text-lg font-semibold mb-4">Update User</h2>

        {/* User Image Upload */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Profile Image</label>
          <input
            type="file"
            onChange={handleImageChange}
            className="w-full text-gray-700 p-2 border rounded-lg"
          />
          {imageFile && (
            <div className="mt-2">
              <img
                src={URL.createObjectURL(imageFile)}
                alt="Profile Preview"
                className="w-32 h-32 object-cover rounded-full border"
              />
            </div>
          )}
          {image && !imageFile && (
            <div className="mt-2">
              <img
                src={image}
                alt="Current Profile"
                className="w-32 h-32 object-cover rounded-full border"
              />
            </div>
          )}
        </div>

        {/* Name Input */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded-lg"
          />
        </div>

        {/* Email Input */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded-lg"
          />
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default UpdateUserModal;
