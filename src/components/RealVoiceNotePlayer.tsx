import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, RotateCcw, RotateCw, Volume2, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { soundEngine } from '../utils/audio';
import { triggerReaction } from '../utils/reactions';
import confetti from 'canvas-confetti';

interface VoiceTrack {
  id: number;
  part: number;
  title: string;
  durationStr: string;
  totalSeconds: number;
  src: string;
  summary: string;
  highlights: Array<{ time: string; text: string }>;
}

const VOICE_TRACKS: VoiceTrack[] = [
  {
    id: 1,
    part: 1,
    title: "Part 1 • Happy Birthday Baby & Opening My Heart",
    durationStr: "5:24",
    totalSeconds: 324,
    src: "/audio/yash_birthday_vn_part1.mp3",
    summary: "Apologies, promises to be more mature & patient, and why you mean everything to me",
    highlights: [
      { time: "00:27", text: "Sabse pehle to Happy Birthday baby, I love you..." },
      { time: "00:46", text: "Maine last chance maanga hai to main pura try karunga... tu actually me bahut kuch hai mere liye." },
      { time: "01:38", text: "Tere liye birthday gift main mature ho jaunga, thoda aur patient ho jaunga... defend kam karunga." },
      { time: "02:04", text: "Chats pe ye sab baatein nahi karenge, call pe zyada sahi rehta hai." },
      { time: "03:22", text: "Tera birthday hai, enjoy karne ka try kar... main hu na tere sath." },
      { time: "04:41", text: "Main actually me sochta hu tere sath future... main hamesha rahunga." },
    ],
  },
  {
    id: 2,
    part: 2,
    title: "Part 2 • Micro-Efforts & Our Forever",
    durationStr: "5:41",
    totalSeconds: 341,
    src: "/audio/yash_birthday_vn_part2.mp3",
    summary: "Calling you in every small free moment, addressing your fears, and loving my booboo",
    highlights: [
      { time: "00:11", text: "Baby I love you, I really love you... distance hai to main zyada effort karne ka try karunga." },
      { time: "00:36", text: "Micro-efforts: 10 min mil rahe hain to 10 min baat kar lunga... 2 ghante ka wait karna chhod dunga." },
      { time: "01:35", text: "Yaad to mujhe obviously bahut aati hai teri... jab hum sath rehte hain time itni jaldi nikalta hai." },
      { time: "02:14", text: "Tu controlling nahi hai, tu bilkul bhi controlling nahi hai... meri galti hai ki main samajh nahi pata, ab samajhunga." },
      { time: "03:48", text: "Starbucks me jab tune baat kari thi, maine tabhi soch liya tha lunch me call karunga." },
      { time: "04:18", text: "Tujhe jaane to nahi dunga pakka, na tujhe chhodunga... I love you, happiest birthday baby." },
      { time: "05:31", text: "Happy birthday to my booboo muah ♡" },
    ],
  },
];

interface RealVoiceNotePlayerProps {
  title?: string;
  initialPart?: 1 | 2;
  compact?: boolean;
  className?: string;
}

export const RealVoiceNotePlayer: React.FC<RealVoiceNotePlayerProps> = ({
  title = "Yash's Spoken Voice Note for Tannu",
  initialPart = 1,
  compact = false,
  className = '',
}) => {
  const [activePart, setActivePart] = useState<1 | 2>(initialPart);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(VOICE_TRACKS[initialPart - 1].totalSeconds);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [showNotes, setShowNotes] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const prevPartRef = useRef(activePart);
  const currentTrack = VOICE_TRACKS[activePart - 1];

  // Only sync track when activePart changes (NOT on play/pause)
  useEffect(() => {
    if (prevPartRef.current !== activePart && audioRef.current) {
      prevPartRef.current = activePart;
      const wasPlaying = isPlaying;
      audioRef.current.src = currentTrack.src;
      audioRef.current.load();
      setCurrentTime(0);
      setDuration(currentTrack.totalSeconds);
      if (wasPlaying) {
        audioRef.current.play().catch(() => {});
      }
    }
  }, [activePart, currentTrack.src, currentTrack.totalSeconds, isPlaying]);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      soundEngine.pauseMusic();
      audio.playbackRate = playbackRate;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            triggerReaction({
              emoji: '🎙️',
              title: "Listening to Yash's Voice ♡",
              subtitle: `Playing ${currentTrack.title}...`,
              particles: ['🎙️', '💖', '✨', '🎧', '🌸'],
            });
          })
          .catch((err) => {
            console.error('Audio play error:', err);
          });
      }
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      if (audioRef.current.duration && !isNaN(audioRef.current.duration)) {
        setDuration(audioRef.current.duration);
      }
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    if (activePart === 1) {
      // Auto advance to Part 2!
      setActivePart(2);
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.play().catch(() => {});
          setIsPlaying(true);
        }
      }, 500);
    } else {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ad1457', '#ff80ab', '#ffd700'],
      });
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleSkip = (seconds: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!audioRef.current) return;
    const target = Math.max(0, Math.min(duration, audioRef.current.currentTime + seconds));
    audioRef.current.currentTime = target;
    setCurrentTime(target);
  };

  const cycleSpeed = (e: React.MouseEvent) => {
    e.stopPropagation();
    const rates = [1, 1.25, 1.5];
    const nextIdx = (rates.indexOf(playbackRate) + 1) % rates.length;
    const nextRate = rates[nextIdx];
    setPlaybackRate(nextRate);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextRate;
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = Math.floor(secs % 60);
    return `${mins}:${remainingSecs < 10 ? '0' : ''}${remainingSecs}`;
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={`my-2 w-full max-w-[360px] mx-auto rounded-sm bg-[#fff8ef] border-2 border-rose-300/80 shadow-[0_4px_16px_rgba(139,38,62,0.12)] p-2.5 sm:p-3 select-none text-[#2d1810] relative overflow-hidden ${className}`}
    >
      <audio
        ref={audioRef}
        src={currentTrack.src}
        onTimeUpdate={handleTimeUpdate}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={handleEnded}
        preload="auto"
      />

      {/* Decorative Washi Tape */}
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-20 h-3.5 bg-rose-100/90 border-x border-rose-300/80 border-dashed z-10" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-rose-200 pb-1 mb-2 pt-1 text-[11px] font-handwriting">
        <span className="font-bold text-rose-deep flex items-center gap-1">
          <Volume2 className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
          <span>{title}</span>
        </span>
        <span className="italic text-amber-900/70">
          Recorded with love ♡
        </span>
      </div>

      {/* Part 1 / Part 2 Switcher Tabs */}
      <div className="grid grid-cols-2 gap-1.5 mb-2">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setActivePart(1);
          }}
          className={`py-1 px-2 rounded-full font-handwriting text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 shadow-2xs ${
            activePart === 1
              ? 'bg-rose-600 text-white shadow-xs scale-[1.02]'
              : 'bg-rose-50 text-rose-deep border border-rose-200/70 hover:bg-rose-100'
          }`}
        >
          <span>🎙️ Part 1</span>
          <span className="text-[10px] opacity-80">(5:24)</span>
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setActivePart(2);
          }}
          className={`py-1 px-2 rounded-full font-handwriting text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 shadow-2xs ${
            activePart === 2
              ? 'bg-rose-600 text-white shadow-xs scale-[1.02]'
              : 'bg-rose-50 text-rose-deep border border-rose-200/70 hover:bg-rose-100'
          }`}
        >
          <span>🎙️ Part 2</span>
          <span className="text-[10px] opacity-80">(5:41)</span>
        </button>
      </div>

      {/* Active Track Title & Subtitle */}
      <div className="text-center mb-2 px-1">
        <h4 className="font-handwriting text-sm sm:text-base font-bold text-rose-deep leading-tight">
          {currentTrack.title}
        </h4>
        <p className="font-handwriting text-[11px] sm:text-[12px] text-amber-950/70 italic leading-snug mt-0.5">
          "{currentTrack.summary}"
        </p>
      </div>

      {/* Realistic Voice Waveform Visualizer */}
      <div className="flex items-center justify-center gap-0.5 h-6 my-1.5 bg-rose-50/70 rounded-xs px-2 border border-rose-200/50">
        {[25, 45, 75, 30, 90, 60, 100, 45, 80, 55, 95, 35, 85, 50, 70, 40, 90, 65, 45, 30].map((h, i) => (
          <div
            key={i}
            className={`flex-1 rounded-full transition-all duration-200 ${
              isPlaying
                ? (i % 2 === 0 ? 'bg-rose-600 animate-pulse' : 'bg-amber-600')
                : 'bg-amber-900/25'
            }`}
            style={{
              height: isPlaying
                ? `${Math.max(25, (h + ((i + Math.floor(currentTime * 3)) % 5) * 15) % 100)}%`
                : `${Math.max(15, h * 0.35)}%`,
            }}
          />
        ))}
      </div>

      {/* Progress Bar & Timestamps */}
      <div className="space-y-0.5 my-1.5">
        <input
          type="range"
          min={0}
          max={duration || 100}
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-1.5 bg-rose-200 rounded-lg appearance-none cursor-pointer accent-rose-600"
        />
        <div className="flex items-center justify-between text-[10.5px] font-mono text-amber-950/70 px-0.5">
          <span>{formatTime(currentTime)}</span>
          <span className="font-sans font-bold text-rose-deep text-[10px]">
            {isPlaying ? '● Playing' : '○ Paused'}
          </span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls Bar: -10s, Play/Pause, +10s, Speed */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 my-2">
        <button
          type="button"
          onClick={(e) => handleSkip(-10, e)}
          className="p-1.5 rounded-full bg-rose-100 hover:bg-rose-200 text-rose-deep transition-all cursor-pointer active:scale-90"
          title="Rewind 10 seconds"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={togglePlay}
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white flex items-center justify-center shadow-md cursor-pointer transition-all active:scale-95 group"
          title={isPlaying ? 'Pause' : 'Play voice note'}
        >
          {isPlaying ? (
            <Pause className="w-5 h-5 fill-white" />
          ) : (
            <Play className="w-5 h-5 fill-white ml-0.5 group-hover:scale-110 transition-transform" />
          )}
        </button>

        <button
          type="button"
          onClick={(e) => handleSkip(10, e)}
          className="p-1.5 rounded-full bg-rose-100 hover:bg-rose-200 text-rose-deep transition-all cursor-pointer active:scale-90"
          title="Forward 10 seconds"
        >
          <RotateCw className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={cycleSpeed}
          className="px-2 py-1 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-900 font-mono text-[11px] font-bold transition-all cursor-pointer active:scale-90 ml-1"
          title="Playback Speed"
        >
          {playbackRate}x
        </button>
      </div>

      {/* Transcript / Moments Toggle */}
      {!compact && (
        <div className="pt-1.5 border-t border-rose-200/80 mt-1">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowNotes(!showNotes);
            }}
            className="w-full flex items-center justify-between text-xs font-handwriting text-rose-deep hover:text-rose-700 font-bold py-0.5 cursor-pointer"
          >
            <span className="flex items-center gap-1">
              <FileText className="w-3.5 h-3.5" />
              <span>{showNotes ? 'Hide Key Moments & Words' : 'Read Key Moments from Voice Note 📜'}</span>
            </span>
            {showNotes ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showNotes && (
            <div className="mt-1.5 p-2 bg-[#fdf5e9] rounded-xs border border-amber-900/15 space-y-1.5 max-h-48 overflow-y-auto font-handwriting text-xs text-[#3a2016]">
              <p className="font-bold text-rose-deep text-[11px] uppercase tracking-wide">
                Key Words in {currentTrack.title}:
              </p>
              {currentTrack.highlights.map((h, idx) => (
                <div
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    const [m, s] = h.time.split(':').map(Number);
                    const targetSecs = m * 60 + s;
                    if (audioRef.current) {
                      audioRef.current.currentTime = targetSecs;
                      setCurrentTime(targetSecs);
                      if (!isPlaying) {
                        soundEngine.pauseMusic();
                        audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
                      }
                    }
                  }}
                  className="flex items-start gap-1.5 p-1 rounded hover:bg-rose-100/60 cursor-pointer transition-colors"
                  title="Click to jump to this moment"
                >
                  <span className="font-mono text-[10px] text-rose-600 bg-rose-100 px-1 py-0.2 rounded font-bold shrink-0">
                    {h.time}
                  </span>
                  <span className="italic leading-tight">"{h.text}"</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Bottom Sweet Sign-Off */}
      <div className="mt-1 flex items-center justify-between text-[10px] font-handwriting text-amber-900/60 pt-0.5">
        <span>🎧 Best experienced with earphones</span>
        <span className="text-rose-600 font-bold">Forever yours, Yash ♡</span>
      </div>
    </div>
  );
};
