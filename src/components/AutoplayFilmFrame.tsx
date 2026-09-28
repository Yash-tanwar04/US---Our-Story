import React, { useRef, useState } from 'react';
import { Volume2, VolumeX, Maximize2, Play } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface AutoplayFilmFrameProps {
  src: string;
  poster?: string;
  caption?: string;
  date?: string;
  rotation?: number;
  tapeColor?: 'cream' | 'pink' | 'gold' | 'rose';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  note?: string;
  notePos?: 'left' | 'right' | 'bottom';
  className?: string;
}

export const AutoplayFilmFrame: React.FC<AutoplayFilmFrameProps> = ({
  src,
  poster,
  caption,
  date,
  rotation = 0,
  tapeColor = 'cream',
  size = 'md',
  note,
  notePos = 'bottom',
  className = '',
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);

  const sizeMap = {
    xs: 'w-28 sm:w-32',
    sm: 'w-36 sm:w-40',
    md: 'w-44 sm:w-50',
    lg: 'w-56 sm:w-64',
  };

  const tapeStyle = {
    cream: 'bg-[#f5e9d3]/95 border-x-2 border-amber-300/60 border-dashed',
    pink:  'bg-[#fce4ec]/95 border-x-2 border-rose-300/70 border-dashed',
    gold:  'bg-[#fff8e1]/95 border-x-2 border-amber-400/60 border-dashed',
    rose:  'bg-[#ffebee]/95 border-x-2 border-rose-400/70 border-dashed',
  };

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      if (!isMuted) soundEngine.pauseMusic();
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      const willMute = !videoRef.current.muted;
      videoRef.current.muted = willMute;
      setIsMuted(willMute);
      if (!willMute) {
        soundEngine.pauseMusic();
        videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    }
  };

  const handleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  return (
    <div
      className={`relative inline-block ${sizeMap[size]} ${className}`}
      style={{ transform: `rotate(${rotation}deg)` }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Tape strip */}
      <div className={`absolute -top-2.5 left-1/2 -translate-x-1/2 h-4 sm:h-5 w-16 sm:w-20 ${tapeStyle[tapeColor]} shadow-xs z-10`} />

      {/* Polaroid Video Frame */}
      <div className="bg-[#fffdf9] p-1.5 sm:p-2 pb-3.5 sm:pb-4 shadow-[0_6px_20px_rgba(75,45,25,0.2)] rounded-xs border border-amber-900/10 group">
        <div
          onClick={togglePlay}
          className="relative overflow-hidden bg-black aspect-[3/4] rounded-xs shadow-inner cursor-pointer"
          title="Tap to play / pause video"
        >
          <video
            ref={videoRef}
            src={src}
            poster={poster}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            preload="auto"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            className="w-full h-full object-cover"
          />

          {/* Play icon indicator when paused */}
          {!isPlaying && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center pointer-events-none">
              <div className="w-8 h-8 rounded-full bg-rose-600/90 text-white flex items-center justify-center shadow-md">
                <Play className="w-4 h-4 fill-white ml-0.5" />
              </div>
            </div>
          )}

          {/* Controls overlay on hover */}
          <div className="absolute bottom-2 right-2 flex items-center gap-1.5 opacity-70 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-xs p-1 rounded-full">
            <button
              onClick={toggleSound}
              className="p-1 rounded-full text-white/90 hover:text-white transition-colors"
              title={isMuted ? "Unmute video" : "Mute video"}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-rose-300" />}
            </button>
            <button
              onClick={handleFullscreen}
              className="p-1 rounded-full text-white/90 hover:text-white transition-colors"
              title="Full screen"
            >
              <Maximize2 className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Handwritten caption */}
        {(caption || date) && (
          <div className="pt-1.5 text-center font-handwriting text-[#241713] leading-tight">
            {caption && <p className="text-[14px] sm:text-[15px] font-semibold">{caption}</p>}
            {date && <p className="text-[11px] text-amber-900/70 italic mt-0.5">{date}</p>}
          </div>
        )}
      </div>

      {/* Arrow Notes */}
      {note && notePos === 'right' && (
        <div className="absolute -right-14 top-1/3 font-handwriting text-rose-deep text-[12px] rotate-[-4deg] w-14 leading-tight text-center">
          ← {note}
        </div>
      )}
      {note && notePos === 'left' && (
        <div className="absolute -left-14 top-1/3 font-handwriting text-rose-deep text-[12px] rotate-[4deg] w-14 leading-tight text-center">
          {note} →
        </div>
      )}
      {note && notePos === 'bottom' && (
        <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 font-handwriting text-rose-deep text-[12px] whitespace-nowrap rotate-[-2deg]">
          ↑ {note}
        </div>
      )}
    </div>
  );
};
