import React from 'react';

interface WashiTapeProps {
  className?: string;
  variant?: 'cream' | 'pink' | 'floral' | 'gold';
  rotation?: number;
  width?: string;
}

export const WashiTape: React.FC<WashiTapeProps> = ({
  className = '',
  variant = 'cream',
  rotation = 0,
  width = 'w-24',
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'pink':
        return 'washi-tape-pink text-pink-700';
      case 'floral':
        return 'bg-pink-100/80 border-pink-300 border-dashed border-x-2 text-rose-800';
      case 'gold':
        return 'bg-amber-100/80 border-amber-300 border-dashed border-x-2 text-amber-800';
      default:
        return 'washi-tape text-amber-900/60';
    }
  };

  return (
    <div
      className={`h-6 ${width} ${getVariantStyles()} flex items-center justify-center pointer-events-none select-none ${className}`}
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <div className="w-full h-full opacity-30 bg-paper-texture" />
    </div>
  );
};
