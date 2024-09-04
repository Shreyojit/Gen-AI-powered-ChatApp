import React from 'react';
import Image from 'next/image';

interface AvatarProps {
  imageSrc: string;
  className?: string;
  onClick?: () => void; // Add this line
}

const Avatar: React.FC<AvatarProps> = ({ imageSrc, className, onClick }) => {
  return (
    <div 
      className={`avatar online ${className}`} 
      onClick={onClick} // Attach the onClick handler
      style={{ cursor: onClick ? 'pointer' : 'default' }} // Show pointer cursor if onClick is defined
    >
      <div className="w-12 rounded-full ring">
        <Image
          src={imageSrc}
          width={256}
          height={256}
          alt="avatar"
        />
      </div>
    </div>
  );
};

export default Avatar;
