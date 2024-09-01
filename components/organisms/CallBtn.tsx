"use client";
import React from 'react';
import { useRouter } from 'next/navigation';

import { useCookies } from 'react-cookie';
import { io } from "socket.io-client";
import { PhoneIcon } from '@/lib/utils/icons';

const CallBtn: React.FC = () => {
  const router = useRouter();
  const [cookie] = useCookies(["user"]);
  const socket = io("http://localhost:3000");

  function handleClick() {
    socket.emit(
      "private message",
      "selectedUserEmail",
      "📞 CurrentUserName is calling SelectedUserName 📞",
      cookie.user
    );
    router.push("/chat/room");
  }

  return (
    <button onClick={handleClick}>
      <PhoneIcon />
    </button>
  );
}

export default CallBtn;
