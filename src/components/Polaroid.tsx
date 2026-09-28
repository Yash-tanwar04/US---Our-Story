import React from 'react';
import { WashiTape } from './WashiTape';

interface PolaroidProps {
  src: string;
  caption?: string;
  date?: string;
  rotation?: number;
  tape?: boolean;
  tapeVariant?: 'cream' | 'pink' | 'floral' | 'gold';
  tapePosition?: 'top-left' | 'top-right' | 'top-center' | 'both-top';
  size?: 'sm' | 'md' | 'lg' | 'full';
  arrowNote?: string;
  onClick?: () => void;
  className?: string;
}

export const Polaroid: React.FC<PolaroidProps> = ({
  src,
  caption,
  date,
  rotation = 0,
  tape = true,
  tapeVariant = 'cream',
  tapePosition = 'top-center',
  size = 'md',
  arrowNote,
  onClick,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-36 p-2 pb-5 text-xs',
    md: 'w-48 sm:w-56 p-2.5 pb-6 text-sm',
    lg: 'w-60 sm:w-68 p-3 pb-8 text-base',
    full: 'w-full p-3 pb-8 text-base',
  };

  return (
    <div
      className={`relative inline-block polaroid-frame transition-all duration-300 ${sizeClasses[size]} ${className}`}
      style={{ transform: `rotate(${rotation}deg)` }}
      onClick={onClick}
    >
      {/* Tape overlays */}
      {tape && (tapePosition === 'top-center' || tapePosition === 'both-top') && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
          <WashiTape variant={tapeVariant} rotation={-1.5} width="w-20" />
        </div>
      )}
      {tape && tapePosition === 'top-left' && (
        <div className="absolute -top-3 -left-3 z-20">
          <WashiTape variant={tapeVariant} rotation={-18} width="w-16" />
        </div>
      )}
      {tape && tapePosition === 'top-right' && (
        <div className="absolute -top-3 -right-3 z-20">
          <WashiTape variant={tapeVariant} rotation={18} width="w-16" />
        </div>
      )}
      {tape && tapePosition === 'both-top' && (
        <>
          <div className="absolute -top-3 -left-2 z-20">
            <WashiTape variant={tapeVariant} rotation={-12} width="w-16" />
          </div>
          <div className="absolute -top-3 -right-2 z-20">
            <WashiTape variant={tapeVariant} rotation={12} width="w-16" />
          </div>
        </>
      )}

      {/* Photo Image */}
      <div className="relative overflow-hidden bg-rose-50/50 rounded-sm aspect-[4/3] group">
        <img
          src={src}
          alt={caption || 'Diary Memory'}
          className="w-full h-full object-cover grayscale-[15%] contrast-[105%] sepia-[10%] group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {/* Subtle photo grain and lighting */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/10 pointer-events-none" />
      </div>

      {/* Caption & Date */}
      {(caption || date) && (
        <div className="mt-2.5 text-center font-handwriting leading-snug">
          {caption && <p className="text-ink-dark font-medium text-lg leading-tight">{caption}</p>}
          {date && <p className="text-ink-muted text-xs font-serif italic mt-0.5">{date}</p>}
        </div>
      )}

      {/* Handwritten Arrow Side Note */}
      {arrowNote && (
        <div className="absolute -bottom-7 -right-12 sm:-right-16 text-rose-deep font-handwriting text-sm flex items-center gap-1 rotate-[-4deg]">
          <span>↗ {arrowNote}</span>
        </div>
      )}
    </div>
  );
};
