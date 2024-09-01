import React from 'react';
import Image from 'next/image';

interface AvatarProps {
  imageSrc: string;
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ imageSrc, className }) => {
  return (
    <div className={`avatar online ${className}`}>
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
