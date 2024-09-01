"use client";
import React, { useState } from "react";
import Avatar from "../atoms/Avatar";
import SearchBarInput from "../molecules/SearchBarInput";
import { userProps } from "@/types";
import IconButton from "../atoms/IconButton";
import CreateGroupChatModal from "../CreateGroupChatModal";

// Example dummy data
const dummyUsers = [
  {
    _id: "1",
    name: "John Doe",
    image: "/path/to/avatar1.png",
  },
  {
    _id: "2",
    name: "Jane Smith",
    image: "/path/to/avatar2.png",
  },
  // Add more users as needed
];

interface SearchBarProps {
  user: userProps;
}

const SearchBar: React.FC<SearchBarProps> = ({ user }) => {
  const [isModalOpen, setModalOpen] = useState(false);

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
        users={dummyUsers}
      />
    </div>
  );
};

export default SearchBar;
