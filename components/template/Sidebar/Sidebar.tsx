import React, { useEffect, useState } from 'react';
import SearchBar from '@/components/organisms/SearchBar';
import { userProps } from '@/types';
import ChatList from '@/components/organisms/ChatList';
import { useSession } from 'next-auth/react';

const Sidebar = () => {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<userProps | null>(null);

  // Handle side effects and loading state
  useEffect(() => {
    if (status === 'loading') {
      // While loading, you might want to show a loading spinner or placeholder
      console.log('Session is loading...');
      return;
    }

    if (session) {
      // Optionally, log session data
      console.log('Session data:', session);

      // Type assertion to userProps
      const userData = session as unknown as userProps;
      setUser(userData);
    }
  }, [session, status]);

  // Render loading state or fallback UI
  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!user) {
    // Optionally handle the case where user data is still not available
    return <div>No user data available</div>;
  }

  return (
    <div className='!block z-10 border-r-2 border-slate-400 md:w-1/2 lg:w-1/3 p-3 bg-white h-screen'>
      {/* SEARCHBAR */}
      <SearchBar user={user} />
      {/* CHATLIST */}
      <ChatList />
    </div>
  );
};

export default Sidebar;
