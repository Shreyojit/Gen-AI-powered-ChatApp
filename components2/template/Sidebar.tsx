
"use client"
import React, { useEffect, useState } from 'react';
import SearchBar from '@/components/organisms/SearchBar';
import { userProps } from '@/types';
import ChatList from '../organisms/ChatList';
import { useSession } from 'next-auth/react';

const Sidebar = () => {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<userProps | undefined>();
console.log("SIDEBAR DATA USER----------->",session)
  useEffect(() => {
    if (status === 'loading') {
      return;
    }

    if (session && session.user) {
      const userData: userProps = {
        _id: session.user._id || '', // Default to empty string if _id is undefined
        name: session.user.name || '',
        email: session.user.email || '',
        imageId: session.user.image || '',
        messages: [], // Provide an empty array or actual messages if available
      };
      setUser(userData);
    }
  }, [session, status]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return (
    <div className='!block z-10 border-r-2 border-slate-400 md:w-1/2 lg:w-1/3 p-3 bg-white h-screen'>
      {/* SEARCHBAR */}
      {user && <SearchBar user={user} />}
      {/* CHATLIST */}
      {user?._id && <ChatList userId={user._id} />} {/* Ensure userId is defined */}
    </div>
  );
};

export default Sidebar;
