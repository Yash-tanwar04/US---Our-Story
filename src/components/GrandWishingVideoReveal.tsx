import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Maximize2, X, Sparkles, Heart, Film, Gift } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEngine } from '../utils/audio';
import { triggerReaction } from '../utils/reactions';

interface GrandWishingVideoRevealProps {
  className?: string;
}

export const GrandWishingVideoReveal: React.FC<GrandWishingVideoRevealProps> = ({ className = '' }) => {
  const [step, setStep] = useState<number>(0); // 0: Teaser, 1: Promise 1, 2: Promise 2, 3: Revealed Video
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCinemaOpen, setIsCinemaOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const cinemaVideoRef = useRef<HTMLVideoElement | null>(null);

  const handleNextStep = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundEngine.playPaperFlip();

    if (step < 2) {
      setStep(step + 1);
    } else {
      // Step 3: THE GRAND UNVEILING!
      setStep(3);
      soundEngine.pauseMusic();

      triggerReaction({
        emoji: '🎬',
        title: "Your Birthday Video Wish ♡",
        subtitle: "From Yash, with all his heart and soul ✨",
        particles: ['🎬', '✨', '💖', '🎂', '🎉', '🥺', '🌟', '🌸'],
      });

      confetti({
        particleCount: 140,
        spread: 100,
        origin: { y: 0.55 },
        colors: ['#ad1457', '#e91e63', '#ffc107', '#ff80ab', '#ffffff', '#ffd700'],
      });

      // Start playing instantly!
      setTimeout(() => {
        if (videoRef.current) {
          const video = videoRef.current;
          video.currentTime = 0;
          const p = video.play();
          if (p !== undefined) {
            p.then(() => {
              setIsPlaying(true);
            }).catch(() => {
              // If unmuted autoplay blocked by mobile policy, start muted and allow unmute
              video.muted = true;
              video.play().then(() => setIsPlaying(true)).catch(() => {});
            });
          }
        }
      }, 100);
    }
  };

  // Also auto-play if step is 3 and video mounts
  React.useEffect(() => {
    if (step === 3 && videoRef.current) {
      soundEngine.pauseMusic();
      const video = videoRef.current;
      const p = video.play();
      if (p !== undefined) {
        p.then(() => setIsPlaying(true)).catch(() => {
          video.muted = true;
          video.play().then(() => setIsPlaying(true)).catch(() => {});
        });
      }
    }
  }, [step]);

  const handlePlayVideo = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!videoRef.current) return;

    soundEngine.pauseMusic();
    const video = videoRef.current;
    if (video.paused) {
      video.muted = false; // ensure sound is unmuted
      const p = video.play();
      if (p !== undefined) {
        p.then(() => setIsPlaying(true)).catch(() => {
          video.muted = true;
          video.play().then(() => setIsPlaying(true)).catch(() => {});
        });
      }
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const openCinemaModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current && !videoRef.current.paused) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
    soundEngine.pauseMusic();
    setIsCinemaOpen(true);
    setTimeout(() => {
      if (cinemaVideoRef.current) {
        cinemaVideoRef.current.play().catch(() => {});
      }
    }, 300);
  };

  const closeCinemaModal = () => {
    if (cinemaVideoRef.current) {
      cinemaVideoRef.current.pause();
    }
    setIsCinemaOpen(false);
  };

  return (
    <div onClick={(e) => e.stopPropagation()} className={`w-full max-w-[360px] mx-auto select-none my-2 ${className}`}>
      <AnimatePresence mode="wait">
        {step < 3 ? (
          // BUILD-UP STAGES (0 -> 1 -> 2)
          <motion.div
            key={step}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="relative group p-3.5 sm:p-4 rounded-md bg-gradient-to-b from-[#2b121c] via-[#3a1826] to-[#1c0c13] text-amber-100 border-2 border-amber-400/60 shadow-[0_6px_24px_rgba(43,18,28,0.4)] text-center overflow-hidden"
          >
            {/* Shimmer light effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-300/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />

            {step === 0 && (
              <div className="space-y-2">
                <div className="flex justify-center items-center gap-2 text-amber-300 text-sm">
                  <span className="animate-pulse">✨</span>
                  <Gift className="w-5 h-5 text-amber-300 animate-bounce" />
                  <span className="animate-pulse">✨</span>
                </div>

                <div className="inline-block px-2.5 py-0.5 rounded-full bg-rose-500/25 border border-rose-400/40 text-rose-300 font-handwriting text-xs uppercase tracking-wider font-bold">
                  The Grand Finale Surprise
                </div>

                <h4 className="font-handwriting text-xl sm:text-2xl font-bold text-amber-200 leading-tight">
                  One Final Gift For You ♡
                </h4>

                <p className="font-handwriting text-xs sm:text-[13px] text-amber-100/85 italic leading-snug">
                  "Wait... before you close this diary, there is one last thing. A personal wishing video I recorded and kept hidden until the very end."
                </p>

                <p className="font-handwriting text-[11px] text-amber-300/90 font-bold">
                  Take a deep breath and answer 2 little questions to unlock it ✨
                </p>

                <button
                  type="button"
                  onClick={handleNextStep}
                  className="w-full mt-2 py-2 px-3 rounded-full bg-gradient-to-r from-rose-600 via-pink-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-handwriting text-sm font-bold shadow-md cursor-pointer transition-all flex items-center justify-center gap-1.5 active:scale-95 animate-pulse"
                >
                  <Sparkles className="w-4 h-4 text-amber-200" />
                  <span>Begin Final Reveal (Step 1 of 2) 🎁</span>
                </button>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-full bg-rose-500/20 border border-rose-400/40 flex items-center justify-center mx-auto text-rose-300 text-lg">
                  💖
                </div>

                <span className="text-[11px] font-mono text-amber-300/80 uppercase tracking-widest">
                  Promise 1 of 2
                </span>

                <h4 className="font-handwriting text-lg sm:text-xl font-bold text-amber-200 leading-snug px-1">
                  "Promise you will never doubt how deeply, completely loved you are by me?"
                </h4>

                <p className="font-handwriting text-xs text-amber-100/75 italic">
                  Even on days when distance hurts or arguments happen... my heart is forever yours.
                </p>

                <button
                  type="button"
                  onClick={handleNextStep}
                  className="w-full mt-2 py-2 px-3 rounded-full bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 text-white font-handwriting text-sm font-bold shadow-md cursor-pointer transition-all flex items-center justify-center gap-1.5 active:scale-95"
                >
                  <Heart className="w-4 h-4 fill-white" />
                  <span>I Promise, Always Yash ♡ (Next)</span>
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center mx-auto text-amber-300 text-lg">
                  🥺✨
                </div>

                <span className="text-[11px] font-mono text-amber-300/80 uppercase tracking-widest">
                  Promise 2 of 2
                </span>

                <h4 className="font-handwriting text-lg sm:text-xl font-bold text-amber-200 leading-snug px-1">
                  "Promise me you'll smile right now and watch this with your earphones on?"
                </h4>

                <p className="font-handwriting text-xs text-amber-100/75 italic">
                  Because this is straight from my heart to your eyes.
                </p>

                <button
                  type="button"
                  onClick={handleNextStep}
                  className="w-full mt-2 py-2 px-3 rounded-full bg-gradient-to-r from-amber-400 via-rose-500 to-pink-600 hover:from-amber-300 hover:to-pink-500 text-white font-handwriting text-sm font-bold shadow-lg cursor-pointer transition-all flex items-center justify-center gap-1.5 active:scale-95 animate-bounce"
                >
                  <Film className="w-4 h-4 text-amber-200" />
                  <span>I Promise! Show My Wishing Video 🎬</span>
                </button>
              </div>
            )}

            {/* Quick Skip Option */}
            <div className="mt-2 pt-1 border-t border-amber-400/20">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setStep(3);
                }}
                className="text-[11px] font-handwriting text-amber-300/70 hover:text-amber-200 underline cursor-pointer"
              >
                Skip straight to video ⏩
              </button>
            </div>
          </motion.div>
        ) : (
          // STEP 3: REVEALED GRAND WISHING VIDEO
          <motion.div
            key="revealed"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="relative bg-[#fffdf9] p-2.5 sm:p-3 pb-3 sm:pb-3.5 shadow-xl border border-amber-900/20 rounded-xs space-y-2 -rotate-[0.5deg]"
          >
            {/* Vintage Tape at Top */}
            <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-24 h-4 bg-rose-100/90 border-x border-rose-300/80 border-dashed shadow-xs z-10" />

            {/* Header Ribbon */}
            <div className="flex items-center justify-between text-[11px] font-handwriting text-amber-900/75 border-b border-amber-900/10 pb-1 pt-1">
              <span className="font-bold text-rose-deep flex items-center gap-1">
                <Film className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
                <span>Yash's Birthday Wishing Video</span>
              </span>
              <span className="italic text-amber-900/70">From My Whole Heart ♡</span>
            </div>

            {/* Video Container (16:9 Landscape) */}
            <div className="relative rounded-xs overflow-hidden shadow-inner border border-amber-900/15 bg-black group">
              <video
                ref={videoRef}
                src="/assets/us/birthday_wishing_video.mp4"
                playsInline
                controls
                preload="metadata"
                onPlay={() => {
                  soundEngine.pauseMusic();
                  setIsPlaying(true);
                }}
                onPause={() => setIsPlaying(false)}
                onEnded={() => setIsPlaying(false)}
                className="w-full aspect-video object-contain mx-auto block"
              />

              {/* Overlay Play Button when paused */}
              {!isPlaying && (
                <div
                  onClick={handlePlayVideo}
                  className="absolute inset-0 bg-black/35 flex items-center justify-center cursor-pointer transition-opacity hover:bg-black/25 group"
                  title="Click to play wishing video"
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-rose-600/90 text-white flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-110 active:scale-95 border-2 border-white/80">
                    <Play className="w-6 h-6 fill-white ml-0.5" />
                  </div>
                </div>
              )}

              {/* Fullscreen Cinema indicator button */}
              <button
                type="button"
                onClick={openCinemaModal}
                className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-xs text-white font-handwriting text-[10.5px] border border-white/30 flex items-center gap-1 shadow-md transition-all cursor-pointer"
                title="Watch in Fullscreen Cinema Mode"
              >
                <Maximize2 className="w-3 h-3 text-amber-300" />
                <span>Cinema Mode</span>
              </button>
            </div>

            {/* Handwritten Personal Caption */}
            <div className="space-y-1 text-center px-1">
              <p className="font-handwriting text-[13px] sm:text-[14px] leading-snug text-[#341b12] italic">
                "Seeing your smile, hearing your laughter... you are everything I ever prayed for. Happy Birthday, my baby girl. Watching this, remember that every single word is a promise carved in stone."
              </p>
              <p className="font-handwriting text-[11px] text-rose-deep font-bold">
                — Recorded with all my love for my Tannu ♡
              </p>
            </div>

            {/* Interactive Buttons */}
            <div className="pt-1.5 border-t border-amber-900/10 grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={openCinemaModal}
                className="py-1.5 px-2 rounded-full bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-handwriting text-xs font-bold shadow-xs cursor-pointer transition-all flex items-center justify-center gap-1"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Cinema Mode 🎬</span>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  triggerReaction({
                    emoji: '💋',
                    title: '100 Birthday Forehead Kisses! 💋',
                    subtitle: 'For the sweetest, prettiest girl in the universe ♡',
                    particles: ['💋', '💖', '✨', '🌸', '🥰', '💫'],
                  });
                }}
                className="py-1.5 px-2 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-deep border border-rose-300 font-handwriting text-xs font-bold shadow-xs cursor-pointer transition-all active:scale-95 flex items-center justify-center gap-1"
              >
                <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                <span>Send Kisses 💋</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FULLSCREEN CINEMA THEATRE MODAL */}
      <AnimatePresence>
        {isCinemaOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCinemaModal}
            className="fixed inset-0 z-50 bg-[#0d0509]/95 backdrop-blur-md flex flex-col items-center justify-center p-3 sm:p-6 overflow-y-auto"
          >
            {/* Twinkling fairy lights header */}
            <div className="absolute top-2 left-0 right-0 flex justify-around pointer-events-none opacity-60 text-xs sm:text-sm text-amber-200 animate-pulse">
              <span>✨</span><span>🌟</span><span>✨</span><span>🌟</span><span>✨</span><span>🌟</span><span>✨</span>
            </div>

            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-lg w-full bg-[#1b0c13] border-2 border-amber-400/50 rounded-lg p-3 sm:p-5 shadow-[0_0_50px_rgba(251,191,36,0.3)] text-amber-100 space-y-3 my-auto"
            >
              {/* Top Bar with Close button */}
              <div className="flex items-center justify-between border-b border-amber-400/20 pb-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-base sm:text-lg">🎬</span>
                  <div>
                    <h3 className="font-handwriting text-base sm:text-lg font-bold text-amber-200 leading-tight">
                      Yash's Birthday Wishing Video
                    </h3>
                    <p className="font-handwriting text-[11px] text-rose-300">
                      The grand finale wish for my whole world ♡
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={closeCinemaModal}
                  className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-amber-200 transition-colors cursor-pointer"
                  title="Close Cinema Mode"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Main Video Display */}
              <div className="relative rounded-sm overflow-hidden border border-amber-300/40 shadow-2xl bg-black">
                <video
                  ref={cinemaVideoRef}
                  src="/assets/us/birthday_wishing_video.mp4"
                  playsInline
                  controls
                  autoPlay
                  onPlay={() => soundEngine.pauseMusic()}
                  className="w-full aspect-video object-contain mx-auto block"
                />
              </div>

              {/* Yash's personal romantic note */}
              <div className="bg-black/40 rounded-sm p-2.5 sm:p-3 border border-amber-400/20 text-center space-y-1">
                <p className="font-handwriting text-sm sm:text-base text-amber-100 italic leading-snug">
                  "No matter how far we are, no matter how hard things get, you will always be my happiest thought. Happy Birthday, my Tannu."
                </p>
                <p className="font-handwriting text-xs text-rose-300 font-bold">
                  Forever and always yours, Yash ♡
                </p>
              </div>

              {/* Actions in Cinema Modal */}
              <div className="flex items-center justify-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    triggerReaction({
                      emoji: '💋',
                      title: '100 Birthday Forehead Kisses! 💋',
                      subtitle: 'Right on your forehead, for my sweet booboo ♡',
                      particles: ['💋', '💖', '✨', '🌸', '🥰'],
                    });
                  }}
                  className="py-1.5 px-4 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-handwriting text-xs sm:text-sm font-bold shadow-md cursor-pointer transition-all active:scale-95 flex items-center gap-1.5"
                >
                  <Heart className="w-4 h-4 fill-white" />
                  <span>Send Forehead Kiss 💋</span>
                </button>

                <button
                  type="button"
                  onClick={closeCinemaModal}
                  className="py-1.5 px-4 rounded-full bg-amber-500/25 border border-amber-400/50 text-amber-100 font-handwriting text-xs sm:text-sm font-bold shadow-md cursor-pointer transition-all active:scale-95 hover:bg-amber-500/35"
                >
                  <span>Close Cinema ✖</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
