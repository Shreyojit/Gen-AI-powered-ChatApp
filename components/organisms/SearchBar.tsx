import React, { useState, useEffect } from "react";
import Avatar from "../atoms/Avatar";
import SearchBarInput from "../molecules/SearchBarInput";
import IconButton from "../atoms/IconButton";
import CreateGroupChatModal from "../CreateGroupChatModal";
import UpdateUserModal from "../updateUserModal";
import { userProps } from "@/types";

interface User {
  _id: string;
  name: string;
  email: string;
  image?: string;
}

interface SearchBarProps {
  user: userProps;
}

const SearchBar: React.FC<SearchBarProps> = ({ user }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const fetchUsers = async () => {
    try {
      const userId = user._id?.toString(); // Ensure _id is a string
      if (!userId || userId === "1") {
        console.error("Invalid User ID detected:", userId);
        return; // Early return if userId is invalid
      }

      const response = await fetch(`/api/user/getAllContacts?excludeUserId=${userId}`);
      const data = await response.json();

      if (Array.isArray(data)) {
        setUsers(data.map((u: any) => ({
          _id: u._id,
          name: u.name,
          email: u.email,
          image: u.image || ""
        })));
      } else {
        console.error("Fetched data is not an array:", data);
        setUsers([]);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    if (user._id) {
      fetchUsers();
    } else {
      console.log("user._id is not defined yet");
    }
  }, [user._id]);

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const handleAvatarClick = (user: User) => {
    setSelectedUser(user);
    setUpdateModalOpen(true);
  };

  const handleUpdateModalClose = () => {
    setUpdateModalOpen(false);
    setSelectedUser(null);
  };

  return (
    <div className="bg-white rounded-lg w-full">
      <div className="flex items-center justify-between gap-4">
        <Avatar
          imageSrc={user.imageId || ""}
          onClick={() => handleAvatarClick({
            _id: user._id || "",
            name: user.name || "",
            email: user.email || "",
            image: user.imageId || ""
          })}
        />
        <IconButton onClick={handleOpenModal} className="ml-2" />
      </div>

      <div className="mt-4">
        <SearchBarInput placeholder="Search" users={users} />
      </div>

      <CreateGroupChatModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        users={users.map((user) => ({
          _id: user._id,
          name: user.name,
          image: user.image || "/path/to/default-avatar.png",
        }))}
      />

      {selectedUser && (
        <UpdateUserModal
          isOpen={isUpdateModalOpen}
          onClose={handleUpdateModalClose}
          user={selectedUser}
        />
      )}
    </div>
  );
};

export default SearchBar;
