import React from 'react';

interface IconProps {
  src: React.ReactNode; // Adjust if needed for the actual icon component
  className?: string;
}

const Icon: React.FC<IconProps> = ({ src, className }) => {
  return (
    <div className={`w-5 h-5 absolute top-3 left-5 -translate-x-1/2 -translate-y-1/2 ${className}`}>
      {src}
    </div>
  );
};

export default Icon;
