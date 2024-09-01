import React from 'react';

interface MessagePreviewProps {
  content: string;
}

const MessagePreview: React.FC<MessagePreviewProps> = ({ content }) => {
  return (
    <div className="text-sm text-gray-600 truncate">
      {content.length > 50 ? content.slice(0, 50) + '...' : content}
    </div>
  );
};

export default MessagePreview;
