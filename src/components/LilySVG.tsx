import React from 'react';

interface LilyProps {
  className?: string;
  size?: number;
  color?: string;
}

export const LilySVG: React.FC<LilyProps> = ({ className = '', size = 48, color = '#f8bbd0' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block ${className}`}
    >
      {/* Stem */}
      <path
        d="M50 55 C48 70, 52 85, 50 98"
        stroke="#5d7853"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* Curved Lily Petals */}
      <path
        d="M50 52 C35 48, 15 45, 12 35 C22 30, 40 40, 50 52 Z"
        fill={color}
        stroke="#8b263e"
        strokeWidth="0.8"
        opacity="0.9"
      />
      <path
        d="M50 52 C65 48, 85 45, 88 35 C78 30, 60 40, 50 52 Z"
        fill={color}
        stroke="#8b263e"
        strokeWidth="0.8"
        opacity="0.9"
      />
      <path
        d="M50 52 C45 35, 38 15, 50 10 C62 15, 55 35, 50 52 Z"
        fill="#ffffff"
        stroke="#d81b60"
        strokeWidth="0.8"
        opacity="0.95"
      />
      <path
        d="M50 52 C32 60, 22 75, 30 82 C40 78, 46 62, 50 52 Z"
        fill={color}
        stroke="#8b263e"
        strokeWidth="0.8"
        opacity="0.85"
      />
      <path
        d="M50 52 C68 60, 78 75, 70 82 C60 78, 54 62, 50 52 Z"
        fill={color}
        stroke="#8b263e"
        strokeWidth="0.8"
        opacity="0.85"
      />

      {/* Stamens */}
      <path d="M50 52 Q42 38 38 32" stroke="#8b263e" strokeWidth="1.2" />
      <circle cx="38" cy="32" r="2" fill="#c2185b" />
      <path d="M50 52 Q50 34 50 28" stroke="#8b263e" strokeWidth="1.2" />
      <circle cx="50" cy="28" r="2" fill="#c2185b" />
      <path d="M50 52 Q58 38 62 32" stroke="#8b263e" strokeWidth="1.2" />
      <circle cx="62" cy="32" r="2" fill="#c2185b" />
    </svg>
  );
};
