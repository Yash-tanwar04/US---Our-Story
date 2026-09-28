import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Play, Pause, ChevronLeft, ChevronRight, Volume2, VolumeX, Film } from 'lucide-react';

import { UNFILTERED_VIDEOS } from '../data/unfilteredVideos';

interface UnfilteredFilmModalProps {
  isOpen: boolean;
  onClose: () => void;
  startIndex?: number;
}

export const UnfilteredFilmModal: React.FC<UnfilteredFilmModalProps> = ({
  isOpen,
  onClose,
  startIndex = 0,
}) => {
  const [prevStartIndex, setPrevStartIndex] = useState(startIndex);
  const [currentIndex, setCurrentIndex] = useState(startIndex);

  if (prevStartIndex !== startIndex) {
    setPrevStartIndex(startIndex);
    setCurrentIndex(startIndex);
  }

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isOpen && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  }, [currentIndex, isOpen]);

  if (!isOpen || typeof document === 'undefined') return null;

  const currentItem = UNFILTERED_VIDEOS[currentIndex];

  const handleNext = () => {
    if (currentIndex < UNFILTERED_VIDEOS.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0); // loop back
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(UNFILTERED_VIDEOS.length - 1);
    }
  };

  const handleVideoEnded = () => {
    // Flow seamlessly to the next video when current video completes!
    handleNext();
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[10000] bg-black/92 backdrop-blur-md flex flex-col items-center justify-between p-3 sm:p-6 animate-fadeIn"
      onClick={onClose}
    >
      {/* Top Header Bar */}
      <div
        className="w-full max-w-xl flex items-center justify-between z-20 text-white/90 pt-2"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2">
          <Film className="w-5 h-5 text-rose-400" />
          <span className="font-handwriting text-xl sm:text-2xl text-amber-100 font-bold">
            Us, Unfiltered (Film Reel)
          </span>
          <span className="text-xs font-serif opacity-60 ml-1">
            {currentIndex + 1} / {UNFILTERED_VIDEOS.length}
          </span>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          title="Close Film Reel"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Stories-style Progress Bars across the top */}
      <div
        className="w-full max-w-xl flex items-center gap-1 my-2 z-20"
        onClick={(e) => e.stopPropagation()}
      >
        {UNFILTERED_VIDEOS.map((_, i) => (
          <div
            key={i}
            onClick={() => setCurrentIndex(i)}
            className="flex-1 h-1 rounded-full cursor-pointer bg-white/20 overflow-hidden"
          >
            <div
              className={`h-full bg-rose-400 transition-all duration-300 ${
                i < currentIndex ? 'w-full' : i === currentIndex ? 'w-full' : 'w-0'
              }`}
            />
          </div>
        ))}
      </div>

      {/* Main Video Frame (Vintage Film Projector aesthetic) */}
      <div
        className="relative my-auto w-full max-w-sm sm:max-w-md aspect-[3/4] max-h-[68vh] flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Previous Button */}
        <button
          onClick={handlePrev}
          className="absolute -left-3 sm:-left-12 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white/90 border border-white/20 transition-all hover:scale-110 active:scale-95"
          title="Previous Moment"
        >
          <ChevronLeft className="w-5 sm:w-6 h-5 sm:h-6" />
        </button>

        {/* Video Card with film borders */}
        <div className="relative w-full h-full rounded-sm overflow-hidden bg-black shadow-2xl border-4 border-[#fffdf9] p-1">
          <video
            ref={videoRef}
            src={currentItem.src}
            autoPlay
            playsInline
            muted={isMuted}
            onEnded={handleVideoEnded}
            className="w-full h-full object-cover rounded-xs"
          />

          {/* Quick Play/Pause Tap on video */}
          <div
            onClick={togglePlay}
            className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black/10 hover:bg-black/20 transition-colors group"
          >
            {!isPlaying && (
              <div className="w-14 h-14 rounded-full bg-black/60 text-white flex items-center justify-center backdrop-blur-xs">
                <Play className="w-7 h-7 fill-white translate-x-0.5" />
              </div>
            )}
          </div>

          {/* Bottom Video Controls overlay */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white/90 z-20 pointer-events-none">
            <span className="font-handwriting text-base sm:text-lg text-amber-100 bg-black/60 px-2.5 py-0.5 rounded-full backdrop-blur-xs">
              {currentItem.note}
            </span>

            <div className="flex items-center gap-1.5 pointer-events-auto">
              <button
                onClick={togglePlay}
                className="p-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white"
                title={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
              </button>
              <button
                onClick={toggleMute}
                className="p-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white"
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-rose-300" />}
              </button>
            </div>
          </div>
        </div>

        {/* Next Button */}
        <button
          onClick={handleNext}
          className="absolute -right-3 sm:-right-12 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white/90 border border-white/20 transition-all hover:scale-110 active:scale-95"
          title="Next Moment"
        >
          <ChevronRight className="w-5 sm:w-6 h-5 sm:h-6" />
        </button>
      </div>

      {/* Bottom Caption & Auto-advance notice */}
      <div
        className="w-full max-w-xl text-center pb-2 z-20"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="font-handwriting text-2xl sm:text-3xl text-amber-100 font-bold drop-shadow">
          "{currentItem.caption}"
        </p>
        <p className="font-handwriting text-sm text-rose-300/80 mt-1">
          auto-flows from one video to the next ♡
        </p>
      </div>
    </div>,
    document.body
  );
};
