import React from 'react';

interface InputProps {
  placeholder?: string;
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; // Add onChange prop
}

const Input: React.FC<InputProps> = ({ placeholder, className, onChange }) => {
  return (
    <input
      type="text"
      placeholder={placeholder}
      className={`pl-12 rounded-full input-bordered w-full bg-gray-100 placeholder:text-gray-500 ${className}`}
      onChange={onChange} // Pass onChange to the input element
    />
  );
};

export default Input;
