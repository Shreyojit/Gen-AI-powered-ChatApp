import React from 'react';
import SearchBar from '@/components/organisms/SearchBar';
import { userProps } from '@/types';
import { dummyUser } from './dummyUser';
import ChatList from '../organisms/ChatList';



interface SearchBarProps {
  user: userProps;
}

const Sidebar = () => {
  return (
    <div className='!block z-10 border-r-2 border-slate-400 md:w-1/2 lg:w-1/3 p-3 bg-white h-screen'>
      {/* SEARCHBAR */}
      <SearchBar user={dummyUser} />
      {/* CHATLIST */}
       
       <ChatList />

    </div>
  );
};

export default Sidebar;
