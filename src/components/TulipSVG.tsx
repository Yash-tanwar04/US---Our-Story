import React from 'react';

interface TulipProps {
  className?: string;
  size?: number;
  color?: string;
}

export const TulipSVG: React.FC<TulipProps> = ({ className = '', size = 48, color = '#d81b60' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block ${className}`}
    >
      {/* Stem & Leaves */}
      <path
        d="M50 45 C48 65, 52 80, 50 95"
        stroke="#5a7052"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path
        d="M50 75 C35 70, 20 60, 28 45 C38 55, 46 68, 50 75 Z"
        fill="#728c68"
        opacity="0.85"
      />
      <path
        d="M50 70 C65 65, 80 55, 72 40 C62 50, 54 63, 50 70 Z"
        fill="#5d7853"
        opacity="0.85"
      />

      {/* Tulip Petals */}
      <path
        d="M50 45 C35 42, 28 30, 32 18 C40 22, 47 34, 50 45 Z"
        fill={color}
        opacity="0.75"
      />
      <path
        d="M50 45 C65 42, 72 30, 68 18 C60 22, 53 34, 50 45 Z"
        fill={color}
        opacity="0.75"
      />
      <path
        d="M40 45 C38 28, 42 12, 50 10 C58 12, 62 28, 60 45 C52 48, 48 48, 40 45 Z"
        fill={color}
        opacity="0.95"
      />

      {/* Subtle Sketch Outline */}
      <path
        d="M50 10 C36 14, 28 28, 38 46 C48 48, 52 48, 62 46 C72 28, 64 14, 50 10 Z"
        stroke="#8b263e"
        strokeWidth="1.2"
        strokeDasharray="40 2"
        opacity="0.4"
      />
    </svg>
  );
};
