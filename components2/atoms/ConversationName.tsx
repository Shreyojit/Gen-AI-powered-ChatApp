import React from 'react';

interface ConversationNameProps {
  name: string;
}

const ConversationName: React.FC<ConversationNameProps> = ({ name }) => {
  return (
    <div className="font-bold truncate">
      {name}
    </div>
  );
};

export default ConversationName;
