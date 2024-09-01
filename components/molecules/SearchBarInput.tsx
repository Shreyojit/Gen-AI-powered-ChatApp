import React from 'react';
import Input from '../atoms/Input';

import { SearchIcon } from '@/lib/utils/icons';
import Icon from '../atoms/Icon';


interface SearchBarInputProps {
  placeholder?: string;
}

const SearchBarInput: React.FC<SearchBarInputProps> = ({ placeholder }) => {
  return (
    <div className="relative w-full">
      <Input placeholder={placeholder} />
      <Icon src={<SearchIcon />} />
    </div>
  );
};

export default SearchBarInput;
