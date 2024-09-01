import React, { useState, useEffect } from "react";
import Avatar from "../atoms/Avatar";
import SearchBarInput from "../molecules/SearchBarInput";
import { userProps } from "@/types";
import IconButton from "../atoms/IconButton";
import CreateGroupChatModal from "../CreateGroupChatModal";

interface User {
  _id: string;
  name: string;
  image?: string; // Image is optional
}

interface SearchBarProps {
  user: userProps;
}

const SearchBar: React.FC<SearchBarProps> = ({ user }) => {
  console.log("THIS IS SEARCHBAR USER", user);

  const [isModalOpen, setModalOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = async () => {
    try {
      console.log("Inside fetchUsers");
  
      // Log the entire user object to verify its structure
      console.log("User object inside fetchUsers:", user);
  
      const userId = user._id?.toString(); // Ensure _id is a string
  
      console.log("userID is this->>>>>>>>>>>>>", userId); // This should print the correct _id
  
      if (!userId || userId === "1") {
        console.error("Invalid User ID detected:", userId);
        return; // Early return if userId is invalid
      }
  
      const response = await fetch(`http://localhost:3000/api/user/getAllContacts?excludeUserId=${userId}`);
      const data = await response.json();
  
      console.log("Fetched users data:", data);
  
      if (Array.isArray(data)) {
        setUsers(data);
      } else {
        console.error("Fetched data is not an array:", data);
        setUsers([]); // Fallback to an empty array if the data is not as expected
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  
  useEffect(() => {
    console.log("useEffect triggered"); // Log to check if useEffect is triggered
    if (user._id) {
      fetchUsers();
    } else {
      console.log("user._id is not defined yet"); // Log if user._id is undefined
    }
  }, [user._id]);

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  return (
    <div className="bg-white rounded-lg w-full">
      {/* Row 1: Avatar, IconButton */}
      <div className="flex items-center justify-between gap-4">
        <Avatar imageSrc={user?.imageId || ""} />
        <IconButton onClick={handleOpenModal} className="ml-2" />
      </div>

      {/* Row 2: SearchBarInput */}
      <div className="mt-4">
        <SearchBarInput placeholder="Search" />
      </div>

      <CreateGroupChatModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        users={users.map((user) => ({
          _id: user._id,
          name: user.name,
          image: user.image || "/path/to/default-avatar.png", // Use a default image if none is provided
        }))}
      />
    </div>
  );
};

export default SearchBar;
