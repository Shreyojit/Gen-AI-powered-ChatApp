import React from 'react';
import Image from 'next/image';

interface AvatarProps {
  imageSrc: string;
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ imageSrc, className }) => {
  // If imageSrc is empty or not provided, you might want to handle it with a placeholder or default image
  const defaultImageSrc = '/user_img.jpeg'; // Replace with the path to a default avatar image

  return (
    <div className={`avatar online ${className}`}>
      <div className="w-12 h-12 rounded-full ring ring-primary">
        <Image
          src={imageSrc || defaultImageSrc} // Use default image if imageSrc is empty
          width={48} // 12 * 4 (as tailwind w-12 is 3rem, default image size)
          height={48} // Match width for a square image
          alt="avatar"
          className="object-cover" // Ensures image covers the area without distortion
        />
      </div>
    </div>
  );
};

export default Avatar;
