import React from 'react';

interface InputProps {
  placeholder?: string;
  className?: string;
}

const Input: React.FC<InputProps> = ({ placeholder, className }) => {
  return (
    <input
      type="text"
      placeholder={placeholder}
      className={`pl-12 rounded-full input-bordered w-full bg-gray-100 placeholder:text-gray-500 ${className}`}
    />
  );
};

export default Input;
