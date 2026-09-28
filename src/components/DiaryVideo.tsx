import React, { useState } from 'react';
import { Play, X } from 'lucide-react';
import { WashiTape } from './WashiTape';

interface DiaryVideoProps {
  videoUrl?: string;
  posterUrl?: string;
  caption?: string;
  date?: string;
  rotation?: number;
}

export const DiaryVideo: React.FC<DiaryVideoProps> = ({
  videoUrl = 'https://assets.mixkit.co/videos/preview/mixkit-romantic-couple-walking-on-the-beach-at-sunset-41487-large.mp4',
  posterUrl = 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80',
  caption = 'one of my favourite little moments ♡',
  date = 'Captured forever',
  rotation = 1.5,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div
        className="relative inline-block polaroid-frame p-3 pb-6 w-64 sm:w-72 cursor-pointer transition-transform duration-300 hover:scale-[1.02]"
        style={{ transform: `rotate(${rotation}deg)` }}
        onClick={() => setIsOpen(true)}
      >
        {/* Tape */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
          <WashiTape variant="pink" rotation={-2} width="w-24" />
        </div>

        {/* Video Thumbnail Frame */}
        <div className="relative aspect-[4/3] bg-rose-950 overflow-hidden rounded-sm group">
          <img
            src={posterUrl}
            alt="Video Memory"
            className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm text-rose-deep flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Play className="w-6 h-6 fill-current translate-x-0.5" />
            </div>
          </div>
          <div className="absolute bottom-2 right-2 text-[10px] bg-black/60 text-white/90 px-1.5 py-0.5 rounded font-mono">
            ▶ Video Memory
          </div>
        </div>

        {/* Handwritten Note */}
        <div className="mt-2.5 text-center font-handwriting">
          <p className="text-ink-dark font-medium text-lg leading-snug">{caption}</p>
          <p className="text-ink-muted text-xs font-serif italic mt-0.5">{date}</p>
        </div>
      </div>

      {/* Video Lightbox Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn" onClick={() => setIsOpen(false)}>
          <div className="relative max-w-3xl w-full bg-paper-ivory p-4 rounded-lg shadow-2xl border-4 border-rose-dust/30" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setIsOpen(false)}
              className="absolute -top-4 -right-4 w-10 h-10 rounded-full bg-rose-deep text-white flex items-center justify-center shadow-lg hover:bg-rose-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="relative aspect-video rounded overflow-hidden bg-black shadow-inner">
              <video
                src={videoUrl}
                controls
                autoPlay
                className="w-full h-full object-contain"
              />
            </div>
            <div className="mt-3 text-center font-handwriting text-ink-dark text-xl">
              ♡ {caption} ♡
            </div>
          </div>
        </div>
      )}
    </>
  );
};
