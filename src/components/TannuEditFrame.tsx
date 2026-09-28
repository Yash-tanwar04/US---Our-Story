import React, { useRef, useState } from 'react';
import { Volume2, VolumeX, Maximize2, Play, Sparkles } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface TannuEditFrameProps {
  className?: string;
}

export const TannuEditFrame: React.FC<TannuEditFrameProps> = ({ className = '' }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      soundEngine.pauseMusic();
      video.muted = isMuted;
      video.play().then(() => setIsPlaying(true)).catch(() => {
        // Fallback to muted autoplay if blocked
        video.muted = true;
        setIsMuted(true);
        video.play().then(() => setIsPlaying(true)).catch(() => {});
      });
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    const willMute = !video.muted;
    video.muted = willMute;
    setIsMuted(willMute);

    if (!willMute) {
      soundEngine.pauseMusic();
      video.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const handleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (video && video.requestFullscreen) {
      video.requestFullscreen();
    }
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={`relative my-2 w-full max-w-[220px] sm:max-w-[240px] mx-auto select-none ${className}`}
    >
      {/* Decorative Washi Tape */}
      <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-20 h-4 bg-pink-100/95 border-x-2 border-rose-300/80 border-dashed shadow-xs z-10" />

      {/* Frame Container */}
      <div className="bg-[#fffdf9] p-2 pb-3 shadow-[0_6px_20px_rgba(75,45,25,0.18)] rounded-xs border border-amber-900/15 text-center space-y-1.5 rotate-[0.5deg]">
        {/* Header */}
        <div className="flex items-center justify-between text-[11px] font-handwriting text-rose-deep border-b border-amber-900/10 pb-1 pt-1 font-bold">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-rose-500 animate-spin" style={{ animationDuration: '8s' }} />
            <span>Her Edit ♡</span>
          </span>
          <span className="text-amber-900/70 italic text-[10px]">Tap to play with sound</span>
        </div>

        {/* Video Area (9:16 vertical reel) */}
        <div
          onClick={togglePlay}
          className="relative rounded-xs overflow-hidden bg-black aspect-[9/16] shadow-inner cursor-pointer group"
          title="Tap to play / pause video"
        >
          <video
            ref={videoRef}
            src="/assets/her/tannu_edit.mp4"
            loop
            playsInline
            controls={false}
            preload="auto"
            muted={isMuted}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            className="w-full h-full object-cover"
          />

          {/* Center Play Button Overlay when paused */}
          {!isPlaying && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity">
              <div className="w-12 h-12 rounded-full bg-rose-600/90 text-white flex items-center justify-center shadow-lg border-2 border-white/80 animate-pulse">
                <Play className="w-5 h-5 fill-white ml-0.5" />
              </div>
            </div>
          )}

          {/* Quick Floating Controls (Sound & Fullscreen) */}
          <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/60 backdrop-blur-xs p-1 rounded-full text-white z-10">
            <button
              type="button"
              onClick={toggleSound}
              className="p-1 rounded-full hover:bg-white/20 transition-colors"
              title={isMuted ? "Unmute video sound" : "Mute video sound"}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5 text-white/80" /> : <Volume2 className="w-3.5 h-3.5 text-rose-300" />}
            </button>
            <button
              type="button"
              onClick={handleFullscreen}
              className="p-1 rounded-full hover:bg-white/20 transition-colors"
              title="Fullscreen"
            >
              <Maximize2 className="w-3 h-3 text-white/80" />
            </button>
          </div>
        </div>

        {/* Caption */}
        <div className="space-y-0.5 pt-1">
          <p className="font-handwriting text-xs sm:text-[13px] text-[#341b12] italic leading-tight">
            "Every frame of you is my favorite view in this universe."
          </p>
          <p className="font-handwriting text-[10.5px] text-rose-deep font-bold">
            — The girl who softened a selfish boy ♡
          </p>
        </div>
      </div>
    </div>
  );
};
