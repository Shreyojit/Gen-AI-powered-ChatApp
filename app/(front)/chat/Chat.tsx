import Messages from '@/components/template/Messages/Messages';
import Sidebar from '@/components2/template/Sidebar';

import React from 'react';

const Chat = () => {
  return (
   

    <div className="flex flex-row flex-grow">

        {/* SIDEBAR */}
       
        <Sidebar />
       

       {/* MESSAGES */}
      
         <Messages />
    </div>
      

     

    
  );
};

export default Chat;


