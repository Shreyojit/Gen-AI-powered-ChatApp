"use client";
import React from 'react';

interface IconButtonProps {
  onClick: () => void;
  icon: React.ReactNode;
  className?: string;
}

const IconButton: React.FC<IconButtonProps> = ({ onClick, icon, className }) => (
  <button onClick={onClick} className={`icon-button ${className}`}>
    {icon}
  </button>
);

export default IconButton;
