// components/atoms/IconButton.tsx
import React from 'react';

interface IconButtonProps {
  onClick: () => void;
  className?: string;
}

const IconButton: React.FC<IconButtonProps> = ({ onClick, className }) => {
  return (
    <button
      onClick={onClick}
      className={`w-10 h-10 flex items-center justify-center border border-gray-300 bg-white rounded-md shadow-md ${className}`}
    >
      <span className="text-xl font-bold">+</span>
    </button>
  );
};

export default IconButton;
