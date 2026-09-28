import React, { useState } from 'react';
import { TulipSVG } from './TulipSVG';
import { LilySVG } from './LilySVG';
import { soundEngine } from '../utils/audio';

interface ClosedCoverProps {
  title?: string;
  subTitle?: string;
  onOpen: () => void;
}

export const ClosedCover: React.FC<ClosedCoverProps> = ({
  onOpen,
}) => {
  const [isOpening, setIsOpening] = useState(false);

  const handleOpen = () => {
    if (isOpening) return;
    setIsOpening(true);
    soundEngine.playPaperFlip();
    soundEngine.startMusic();

    setTimeout(() => {
      onOpen();
    }, 950);
  };

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center p-4 bg-[#fbf5f7] bg-paper-texture">
      {/* Container with 3D Perspective */}
      <div className="relative perspective-1000 w-full max-w-[350px] sm:max-w-[430px] aspect-[1/1.42]">
        {/* Soft Shadow on Desk */}
        <div className="absolute -bottom-6 left-4 right-4 h-12 bg-black/25 blur-xl rounded-full transform scale-95" />

        {/* The Diary Cover Book Object */}
        <div
          onClick={handleOpen}
          className={`relative w-full h-full cursor-pointer rounded-r-xl rounded-l-sm leather-texture shadow-diary-cover transition-transform duration-1000 transform-style-3d origin-left ${
            isOpening ? 'rotate-y-[-140deg] scale-95 opacity-80' : 'hover:scale-[1.015] hover:-rotate-y-2'
          }`}
          style={{
            transformStyle: 'preserve-3d',
            perspective: '1200px',
          }}
        >
          {/* Leather embossed border line */}
          <div className="absolute inset-3 sm:inset-4 border-2 border-amber-100/25 rounded-r-lg rounded-l-xs pointer-events-none" />
          <div className="absolute inset-4 sm:inset-5 border border-amber-200/20 rounded-r-md rounded-l-xs pointer-events-none" />

          {/* Spine Binding Details */}
          <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-10 book-spine rounded-l-sm flex flex-col justify-between py-8 px-1 shadow-inner">
            <div className="h-0.5 bg-amber-200/40 w-full" />
            <div className="h-0.5 bg-amber-200/40 w-full" />
            <div className="h-0.5 bg-amber-200/40 w-full" />
            <div className="h-0.5 bg-amber-200/40 w-full" />
          </div>

          {/* Metal Corner Accents */}
          <div className="absolute top-2.5 right-2.5 w-5 h-5 border-t-2 border-r-2 border-amber-200/50 rounded-tr" />
          <div className="absolute bottom-2.5 right-2.5 w-5 h-5 border-b-2 border-r-2 border-amber-200/50 rounded-br" />

          {/* Cover Content */}
          <div className="h-full flex flex-col items-center justify-between p-7 sm:p-9 pl-12 sm:pl-14 text-center">
            {/* Top Floral Motif */}
            <div className="pt-2 flex items-center justify-center gap-3 opacity-90">
              <TulipSVG size={32} color="#f8bbd0" />
              <LilySVG size={32} color="#fcedf2" />
            </div>

            {/* Title & Subtitle */}
            <div className="my-auto space-y-3 sm:space-y-4">
              <h1 className="font-title text-4xl sm:text-5xl text-paper-cream tracking-wide font-bold drop-shadow-md leading-tight">
                US ♡
              </h1>

              <div className="w-16 h-0.5 bg-amber-200/40 mx-auto" />

              <p className="font-serif text-[13px] sm:text-sm text-paper-cream/90 italic max-w-[270px] mx-auto leading-relaxed">
                The beautiful story of a selfish, careless &amp; narcissistic boy falling in love with a cute, soft, caring &amp; kindest soul on earth.
              </p>

              <div className="w-12 h-px bg-amber-200/30 mx-auto" />

              <div className="space-y-1">
                <p className="font-handwriting text-lg sm:text-xl text-paper-cream/80">
                  My story, her story and
                </p>
                <p className="font-title text-2xl sm:text-3xl text-amber-100 font-bold tracking-wider">
                  OUR STORY
                </p>
              </div>

              <div className="font-serif italic text-[11px] sm:text-[12px] text-paper-cream/75 space-y-0.5 text-left max-w-[240px] mx-auto pt-1">
                <p>• Full of ups &amp; downs.</p>
                <p>• Just two clumsy kids trying to LOVE each other.</p>
                <p>• The best phase of my life.</p>
              </div>
            </div>

            {/* Bottom Call to Action */}
            <div className="pb-2 animate-bounce">
              <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-black/20 border border-amber-200/30 shadow-sm">
                <span className="font-handwriting text-xl sm:text-2xl text-amber-100/95 tracking-wide drop-shadow">
                  Open our story →
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
