import React, { useRef, useState, useEffect, forwardRef } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { ChevronLeft, ChevronRight, Heart, Bookmark, Film, Sparkles, Volume2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { TulipSVG } from './TulipSVG';
import { LilySVG } from './LilySVG';
import { soundEngine } from '../utils/audio';
import { AutoplayFilmFrame } from './AutoplayFilmFrame';
import { UnfilteredFilmModal } from './UnfilteredFilmModal';
import { triggerReaction } from '../utils/reactions';
import type { CustomDiaryData } from './CustomizerModal';

interface DiaryBookProps {
  customData: CustomDiaryData;
  onOpenLetter: () => void;
}

// ─── FLIPBOOK CONTEXT FOR ACCESSIBLE HEART PAGE-TURN BUTTONS ─────────────────
interface FlipContextType {
  flipNext: () => void;
  flipPrev: () => void;
}
const FlipContext = React.createContext<FlipContextType>({
  flipNext: () => {},
  flipPrev: () => {},
});

// ─── AUTHENTIC DIARY HEADER (TOP OF EVERY PAGE) ──────────────────────────────
interface DiaryHeaderProps {
  date: string;
  location?: string;
  mood?: string;
}
const DiaryHeader: React.FC<DiaryHeaderProps> = ({
  date,
  location = 'Gurugram',
  mood = 'Thinking of Tannu ♡',
}) => (
  <div className="flex items-center justify-between text-[11px] sm:text-[12px] font-handwriting text-amber-900/60 pb-1 border-b border-amber-900/15 mb-1 select-none shrink-0">
    <div className="flex items-center gap-1 font-semibold truncate max-w-[65%]">
      <span>📅 {date}</span>
      {location && <span className="hidden xs:inline">• 📍 {location}</span>}
    </div>
    <div className="italic text-rose-deep/80 font-bold truncate max-w-[35%] text-right">
      ☁️ {mood}
    </div>
  </div>
);

// ─── INTERACTIVE COMPONENT 1: WAX SEAL SECRET REVEAL ─────────────────────────
interface PeelWaxSealProps {
  title?: string;
  secret: string;
  rotation?: number;
}
const PeelWaxSeal: React.FC<PeelWaxSealProps> = ({
  title = 'Secret thought from Yash',
  secret,
  rotation = -1,
}) => {
  const [open, setOpen] = useState(false);
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        setOpen(!open);
      }}
      className="my-1.5 p-2 rounded-xs border border-rose-300/60 bg-[#fff5f5]/90 hover:bg-[#ffebee] transition-all duration-300 shadow-2xs cursor-pointer select-none"
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <div className="flex items-center justify-between gap-1 text-[13px] sm:text-[14px] font-handwriting">
        <div className="flex items-center gap-1.5 font-bold text-rose-deep truncate">
          <span className="w-4 h-4 rounded-full bg-rose-600 text-white flex items-center justify-center text-[9px] shadow-2xs shrink-0">💌</span>
          <span className="truncate">{open ? 'Secret Unlocked:' : title}</span>
        </div>
        <span className="text-[10.5px] text-amber-900/60 italic font-sans shrink-0">
          {open ? 'tap to close' : 'tap to reveal 🔓'}
        </span>
      </div>
      {open && (
        <div className="mt-1.5 pt-1.5 border-t border-rose-200/80 font-handwriting text-[15px] sm:text-[16px] text-[#2c1d18] italic leading-snug animate-fadeIn">
          "{secret}"
        </div>
      )}
    </div>
  );
};

// ─── INTERACTIVE COMPONENT 2: MEMORY QUIZ ───────────────────────────────────
interface MemoryQuizProps {
  question: string;
  options: string[];
  reaction: string;
}
const MemoryQuiz: React.FC<MemoryQuizProps> = ({ question, options, reaction }) => {
  const [chosen, setChosen] = useState<number | null>(null);
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="my-1.5 p-2 rounded-xs bg-[#faf5e8]/90 border border-amber-900/20 shadow-2xs select-none"
    >
      <div className="font-handwriting text-[12px] font-bold uppercase tracking-wider text-rose-deep mb-0.5">
        💭 Pop Quiz for Tannu
      </div>
      <p className="font-handwriting text-[14.5px] sm:text-[15.5px] text-[#241713] font-semibold leading-tight mb-1.5">
        {question}
      </p>
      <div className="flex flex-wrap gap-1">
        {options.map((opt, i) => (
          <button
            key={i}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setChosen(i);
            }}
            className={`px-2 py-0.5 rounded text-[12px] sm:text-[13px] font-handwriting transition-all cursor-pointer ${
              chosen === i
                ? 'bg-rose-deep text-white font-bold shadow-2xs scale-102'
                : 'bg-white/80 hover:bg-rose-50 text-[#3d2721] border border-amber-900/15'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
      {chosen !== null && (
        <div className="mt-1.5 pt-1 border-t border-amber-900/15 font-handwriting text-[13.5px] sm:text-[14.5px] text-[#8b263e] italic leading-tight animate-fadeIn">
          ✎ Yash: "{reaction}"
        </div>
      )}
    </div>
  );
};

// ─── INTERACTIVE COMPONENT 3: PROMISE CHECKLIST ─────────────────────────────
interface InteractiveChecklistProps {
  title: string;
  items: string[];
}
const InteractiveChecklist: React.FC<InteractiveChecklistProps> = ({ title, items }) => {
  const [checked, setChecked] = useState<Record<number, boolean>>({ 0: true, 1: true });
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="my-1.5 p-2 rounded-xs bg-[#fffdf5]/95 border-dashed border border-amber-800/30 select-none"
    >
      <p className="font-handwriting text-[12px] uppercase tracking-wider text-rose-deep font-bold mb-1">
        ✎ {title}
      </p>
      <div className="space-y-0.5 font-handwriting text-[14px] sm:text-[15px] text-[#3d2721]">
        {items.map((item, idx) => {
          const isDone = !!checked[idx];
          return (
            <label
              key={idx}
              className="flex items-center gap-1.5 cursor-pointer hover:text-rose-deep transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setChecked((prev) => ({ ...prev, [idx]: !prev[idx] }));
              }}
            >
              <span className={`w-3.5 h-3.5 rounded-xs border flex items-center justify-center text-[10px] transition-all shrink-0 ${
                isDone ? 'bg-rose-deep border-rose-deep text-white font-bold' : 'border-amber-900/40 bg-white'
              }`}>
                {isDone ? '✓' : ''}
              </span>
              <span className={isDone ? 'line-through opacity-70' : ''}>{item}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
};

// ─── INTERACTIVE COMPONENT 4: FOREHEAD KISS BUTTON (WITH FULL SCREEN POP) ────
const ForeheadKissButton: React.FC<{ label?: string }> = ({ label = 'Send Yash a forehead kiss 💋' }) => {
  const [kisses, setKisses] = useState(0);

  const handleKiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setKisses((k) => k + 1);

    // Trigger full-screen pop emoji explosion!
    triggerReaction({
      emoji: '💋',
      title: 'Forehead Kiss Delivered! 💋',
      subtitle: 'Yash just felt it & is smiling like an idiot right now ♡',
      particles: ['💋', '💖', '✨', '💋', '💕', '💋', '🌸']
    });
  };

  return (
    <div className="my-1 text-center select-none" onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        onClick={handleKiss}
        className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-500/10 hover:bg-rose-500/20 active:scale-90 border border-rose-400/40 text-rose-deep font-handwriting text-[13px] sm:text-[14px] font-bold cursor-pointer transition-all shadow-2xs"
      >
        <span>{label}</span>
        {kisses > 0 && <span className="bg-rose-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">{kisses}</span>}
      </button>
    </div>
  );
};

// ─── INTERACTIVE COMPONENT 5: LOVE METER (WITH FULL SCREEN REACTION) ────────
const LoveMeter: React.FC<{ caption?: string }> = ({ caption = "How much Yash loves Tannu:" }) => {
  const [val, setVal] = useState('Infinity');
  return (
    <div onClick={(e) => e.stopPropagation()} className="my-1.5 p-1.5 bg-[#fffdf5]/90 rounded-xs border border-rose-200 select-none">
      <div className="flex items-center justify-between font-handwriting text-[12px] sm:text-[12.5px] text-rose-deep font-bold mb-1">
        <span>{caption}</span>
        <span className="text-rose-700 font-bold">{val} ♡</span>
      </div>
      <div className="flex gap-1">
        {['100%', '10,000%', 'To the Moon 🌙', 'Infinity & Beyond 🚀'].map((item) => (
          <button
            key={item}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setVal(item);
              triggerReaction({
                emoji: item.includes('🚀') ? '🚀' : '💖',
                title: `Love Level: ${item} ♡`,
                subtitle: 'Yash loves you more than all the stars in the sky ♡',
                particles: ['💖', '✨', '🌟', '💕', '🚀', '💖']
              });
            }}
            className={`flex-1 py-0.5 rounded text-[10.5px] sm:text-[11px] font-handwriting transition-all cursor-pointer ${
              val === item ? 'bg-rose-600 text-white font-bold' : 'bg-rose-50 text-rose-900 hover:bg-rose-100'
            }`}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
};

// ─── INTERACTIVE COMPONENT 6: FOLDOUT LETTER NOTE ────────────────────────────
interface FoldOutNoteProps {
  teaser: string;
  letter: string;
}
const FoldOutNote: React.FC<FoldOutNoteProps> = ({ teaser, letter }) => {
  const [open, setOpen] = useState(false);
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        setOpen(!open);
      }}
      className="my-1.5 p-2 rounded-xs bg-[#fff9ed]/95 border border-amber-300 shadow-2xs cursor-pointer hover:bg-amber-100/70 transition-all select-none"
    >
      <div className="flex items-center justify-between text-rose-deep font-handwriting text-[13px] sm:text-[14px] font-bold">
        <span>📜 {teaser}</span>
        <span className="text-[10.5px] text-amber-900/60 font-sans">{open ? '▲ close' : '▼ unfold letter'}</span>
      </div>
      {open && (
        <div className="mt-1.5 pt-1.5 border-t border-amber-900/15 font-handwriting text-[15px] sm:text-[16px] text-[#2c1d18] leading-snug italic animate-fadeIn bg-white/70 p-2 rounded-xs">
          "{letter}"
        </div>
      )}
    </div>
  );
};

// ─── NEW CREATIVE COMPONENT 7: FLIP POLAROID (READ THE BACK NOTE) ───────────
interface FlipPolaroidProps {
  src: string;
  caption?: string;
  date?: string;
  backNote?: string;
  rotation?: number;
  tapeColor?: 'cream' | 'pink' | 'gold' | 'rose';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}
const FlipPolaroid: React.FC<FlipPolaroidProps> = ({
  src,
  caption,
  date,
  backNote = 'I remember this second like it was five minutes ago. You looked so unfairly pretty.',
  rotation = 0,
  tapeColor = 'cream',
  size = 'sm',
  className = '',
}) => {
  const [flipped, setFlipped] = useState(false);
  const sizeMap = {
    xs: 'w-24 sm:w-28',
    sm: 'w-30 sm:w-34',
    md: 'w-38 sm:w-44',
    lg: 'w-48 sm:w-54',
  };
  const tapeStyle = {
    cream: 'bg-[#f5e9d3]/95 border-x-2 border-amber-300/60 border-dashed',
    pink:  'bg-[#fce4ec]/95 border-x-2 border-rose-300/70 border-dashed',
    gold:  'bg-[#fff8e1]/95 border-x-2 border-amber-400/60 border-dashed',
    rose:  'bg-[#ffebee]/95 border-x-2 border-rose-400/70 border-dashed',
  };

  return (
    <div
      className={`relative inline-block ${sizeMap[size]} ${className} cursor-pointer group select-none`}
      style={{ transform: `rotate(${rotation}deg)` }}
      onClick={(e) => {
        e.stopPropagation();
        setFlipped(!flipped);
      }}
      title="Tap photo to flip and read back inscription"
    >
      <div className={`absolute -top-2.5 left-1/2 -translate-x-1/2 h-4 sm:h-5 w-16 sm:w-20 ${tapeStyle[tapeColor]} shadow-xs z-10`} />
      <div className="bg-[#fffdf9] p-1.5 sm:p-2 pb-3 shadow-[0_5px_18px_rgba(75,45,25,0.18)] rounded-xs border border-amber-900/10 transition-all duration-300">
        {!flipped ? (
          <>
            <div className="relative overflow-hidden bg-stone-100 aspect-[3/4] rounded-xs">
              <img src={src} alt={caption || 'memory'} className="w-full h-full object-cover" loading="lazy" />
              <div className="absolute bottom-1 right-1 bg-black/55 text-white text-[9px] px-1 rounded font-sans backdrop-blur-xs">
                ↺ flip
              </div>
            </div>
            <div className="pt-1 text-center font-handwriting text-[#241713] leading-tight">
              {caption && <p className="text-[13px] sm:text-[14px] font-semibold truncate">{caption}</p>}
              {date && <p className="text-[10px] text-amber-900/70 italic mt-0.5">{date}</p>}
            </div>
          </>
        ) : (
          <div className="aspect-[3/4] flex flex-col justify-between p-2 bg-[#fcf8f0] border border-dashed border-amber-800/30 rounded-xs text-[#2c1d18]">
            <div className="text-[9.5px] text-amber-900/60 uppercase tracking-widest font-sans font-bold flex justify-between">
              <span>PHOTO BACK</span>
              <span className="text-rose-600">↺ back</span>
            </div>
            <p className="font-handwriting text-[13px] sm:text-[14px] italic leading-tight text-[#8b263e]">
              "{backNote}"
            </p>
            <div className="text-[11px] font-handwriting text-right text-amber-900/70">
              — Yash ♡
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── NEW CREATIVE COMPONENT 8: LOVE COUPON (PERFORATED TICKET) ──────────────
interface LoveCouponProps {
  id: string;
  title: string;
  benefit: string;
}
const LoveCoupon: React.FC<LoveCouponProps> = ({ id, title, benefit }) => {
  const [redeemed, setRedeemed] = useState(false);
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="my-1.5 p-2 rounded-xs border-2 border-dashed border-rose-400/60 bg-[#fffbfc] shadow-2xs relative select-none"
    >
      <div className="flex items-center justify-between border-b border-rose-200/60 pb-1 mb-1 font-handwriting text-[11.5px] font-bold text-rose-deep">
        <span>🎟️ LOVE COUPON #{id}</span>
        <span className="text-[9px] font-sans px-1.5 py-0.2 rounded-full bg-rose-100 text-rose-800">
          {redeemed ? 'CLAIMED' : 'UNLIMITED USE'}
        </span>
      </div>
      <p className="font-handwriting text-[14px] sm:text-[15px] font-bold text-[#241713] leading-snug">
        {title}
      </p>
      <p className="font-handwriting text-[12px] text-amber-950/80 italic mb-1.5">
        {benefit}
      </p>
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-handwriting text-amber-900/60">Issued with love</span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setRedeemed(true);
            triggerReaction({
              emoji: '🎟️',
              title: 'Coupon Redeemed! ✨',
              subtitle: `"${title}" saved to Yash's to-do list ♡`,
              particles: ['🎟️', '✨', '💖', '💌', '🌸']
            });
          }}
          disabled={redeemed}
          className={`px-2.5 py-0.5 rounded font-handwriting text-[11.5px] font-bold transition-all cursor-pointer ${
            redeemed
              ? 'bg-emerald-600 text-white'
              : 'bg-rose-600 hover:bg-rose-700 text-white shadow-2xs active:scale-95'
          }`}
        >
          {redeemed ? '✓ REDEEMED!' : 'Redeem Now ✨'}
        </button>
      </div>
    </div>
  );
};

// ─── NEW CREATIVE COMPONENT 9: VOICE NOTE SIMULATOR ─────────────────────────
interface VoiceNoteSimulatorProps {
  title: string;
  time: string;
  transcript: string;
}
const VoiceNoteSimulator: React.FC<VoiceNoteSimulatorProps> = ({ title, time, transcript }) => {
  const [playing, setPlaying] = useState(false);
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="my-1.5 p-2 rounded-xs bg-[#f4ece1]/80 border border-amber-900/20 shadow-2xs select-none"
    >
      <div className="flex items-center justify-between text-[11px] font-handwriting text-amber-900/70 mb-1">
        <span className="font-bold text-rose-deep flex items-center gap-1">
          <Volume2 className="w-3 h-3 inline text-rose-600" />
          <span>{title}</span>
        </span>
        <span>{time}</span>
      </div>
      <div className="flex items-center gap-2 bg-white/70 p-1 rounded-full border border-amber-900/10">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setPlaying(!playing);
          }}
          className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center text-[10px] font-bold shadow-xs cursor-pointer hover:bg-rose-700 transition-all"
        >
          {playing ? '⏸' : '▶'}
        </button>
        <div className="flex-1 flex items-center gap-0.5 h-3.5">
          {[40, 70, 30, 90, 60, 100, 45, 80, 55, 95, 35, 75, 50, 85, 60, 40].map((h, i) => (
            <div
              key={i}
              className={`flex-1 rounded-full transition-all duration-300 ${
                playing ? 'bg-rose-600 animate-pulse' : 'bg-amber-900/30'
              }`}
              style={{ height: `${playing ? Math.max(20, (h + (i % 3) * 15) % 100) : h * 0.4}%` }}
            />
          ))}
        </div>
        <span className="text-[10px] font-mono text-amber-900/80 pr-1.5">0:{playing ? '24' : '42'}</span>
      </div>
      <div className="mt-1.5 pt-1 border-t border-amber-900/15 font-handwriting text-[13px] sm:text-[14px] text-[#3d2721] italic leading-tight">
        "{transcript}"
      </div>
    </div>
  );
};

// ─── NEW CREATIVE COMPONENT 10: GOLDEN SCRATCH CARD ─────────────────────────
interface GoldenScratchCardProps {
  prompt?: string;
  hiddenMessage: string;
}
const GoldenScratchCard: React.FC<GoldenScratchCardProps> = ({
  prompt = 'Tap to scratch golden ticket ✨',
  hiddenMessage,
}) => {
  const [scratched, setScratched] = useState(false);
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        setScratched(true);
        triggerReaction({
          emoji: '✨',
          title: 'Golden Truth Unlocked! ✨',
          subtitle: 'A sacred promise sealed in our stars ♡',
          particles: ['✨', '🌟', '💖', '💫', '✨', '💛']
        });
      }}
      className={`my-1.5 p-2 rounded-xs border-2 select-none cursor-pointer transition-all duration-300 shadow-2xs ${
        scratched
          ? 'bg-amber-50/95 border-amber-400/80 text-[#2c1d18]'
          : 'bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-300 border-amber-500/60 text-amber-950 hover:brightness-105'
      }`}
    >
      {!scratched ? (
        <div className="flex items-center justify-between text-[12.5px] sm:text-[13px] font-handwriting font-bold">
          <span>✨ {prompt}</span>
          <span className="text-[9px] font-sans uppercase tracking-wider bg-amber-900/10 px-1.5 py-0.5 rounded">Scratch</span>
        </div>
      ) : (
        <div className="animate-fadeIn">
          <div className="text-[10.5px] font-handwriting uppercase tracking-wider text-rose-deep font-bold mb-0.5">
            ★ UNLOCKED GOLDEN TRUTH ★
          </div>
          <p className="font-handwriting text-[14px] sm:text-[15px] italic leading-tight text-[#8b263e]">
            "{hiddenMessage}"
          </p>
        </div>
      )}
    </div>
  );
};

// ─── NEW CREATIVE COMPONENT 11: INTERACTIVE BIRTHDAY CAKE & CANDLE BLOW ─────
const InteractiveBirthdayCake: React.FC<{ onOpenLetter: () => void }> = ({ onOpenLetter }) => {
  const [blown, setBlown] = useState(false);

  const handleBlow = (e: React.MouseEvent) => {
    e.stopPropagation();
    setBlown(true);

    triggerReaction({
      emoji: '🎂',
      title: 'Wish Made & Locked! 🎂✨',
      subtitle: 'Yash will spend this whole year making it come true for you ♡',
      particles: ['🎂', '✨', '🎉', '💖', '🥳', '🌟']
    });

    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#ad1457', '#e91e63', '#ffc107', '#ff80ab', '#ffffff']
    });
  };

  return (
    <div onClick={(e) => e.stopPropagation()} className="p-2.5 rounded-sm bg-[#fff8e7] border-2 border-amber-300 shadow-sm max-w-[270px] mx-auto space-y-1.5 my-1 text-center select-none">
      <div className="flex justify-center items-center gap-3 text-2xl">
        {!blown ? (
          <>
            <span className="animate-bounce">🕯️🔥</span>
            <span className="animate-pulse">🎂</span>
            <span className="animate-bounce">🔥🕯️</span>
          </>
        ) : (
          <span className="text-3xl animate-bounce">✨ 🎂 💨 ✨</span>
        )}
      </div>

      <p className="font-handwriting text-base font-bold text-rose-deep">
        {!blown ? 'Make a Wish, My Babu!' : 'Wish Made & Locked in the Stars! 🌟'}
      </p>

      <p className="font-handwriting text-xs text-amber-950/70 italic">
        {!blown
          ? 'Close your eyes, think of your happiest wish, and blow the candles!'
          : 'Whatever you wished for, I will spend this whole year making come true for you ♡'}
      </p>

      {!blown ? (
        <button
          type="button"
          onClick={handleBlow}
          className="w-full py-1 px-3 rounded-full bg-amber-500 hover:bg-amber-600 text-white font-handwriting text-[13px] font-bold shadow-xs cursor-pointer transition-all active:scale-95"
        >
          💨 Blow the Candles!
        </button>
      ) : (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpenLetter();
          }}
          className="w-full py-1.5 px-3 rounded-full bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-handwriting text-sm font-bold shadow-xs cursor-pointer transition-all flex items-center justify-center gap-1.5 animate-pulse"
        >
          <Sparkles className="w-4 h-4" />
          <span>Open Yash's Birthday Letter 💌</span>
        </button>
      )}
    </div>
  );
};

// ─── STICKY NOTE COMPONENT ───────────────────────────────────────────────────
interface StickyNoteProps {
  children: React.ReactNode;
  color?: 'yellow' | 'pink' | 'amber';
  rotation?: number;
  className?: string;
}
const StickyNote: React.FC<StickyNoteProps> = ({
  children,
  color = 'yellow',
  rotation = -2,
  className = '',
}) => {
  const bgStyles = {
    yellow: 'bg-[#fffde7]/95 border-amber-300/60 text-[#3d2721]',
    pink: 'bg-[#fce4ec]/95 border-rose-300/60 text-[#4a1c29]',
    amber: 'bg-[#fff8e1]/95 border-amber-400/60 text-[#3e2723]',
  };
  return (
    <div
      className={`relative p-2 rounded-xs shadow-2xs border ${bgStyles[color]} ${className}`}
      style={{ transform: `rotate(${rotation}deg)` }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-2.5 bg-amber-100/90 border-x border-amber-300/70 border-dashed" />
      <div className="font-handwriting text-[13.5px] sm:text-[14.5px] leading-tight">
        {children}
      </div>
    </div>
  );
};

// ─── MARGIN NOTE ─────────────────────────────────────────────────────────────
const MarginNote: React.FC<{ children: React.ReactNode; color?: 'red' | 'ink'; rotation?: number; className?: string }> = ({
  children,
  color = 'red',
  rotation = 2,
  className = '',
}) => (
  <div
    className={`font-handwriting text-[12.5px] sm:text-[13.5px] leading-tight select-none ${
      color === 'red' ? 'text-[#8b263e]' : 'text-[#3d2721]/80'
    } ${className}`}
    style={{ transform: `rotate(${rotation}deg)` }}
    onClick={(e) => e.stopPropagation()}
  >
    {children}
  </div>
);

// ─── VINTAGE STAMP ───────────────────────────────────────────────────────────
const VintageStamp: React.FC<{ text: string; rotation?: number }> = ({ text, rotation = -4 }) => (
  <div
    className="inline-block px-2 py-0.5 border-2 border-dashed border-[#8b263e]/60 text-[#8b263e] rounded-xs font-handwriting text-[11.5px] sm:text-[12.5px] uppercase tracking-wider font-bold select-none"
    style={{ transform: `rotate(${rotation}deg)` }}
    onClick={(e) => e.stopPropagation()}
  >
    {text}
  </div>
);

// ─── CONVERSATION SCREENSHOT COMPONENT ───────────────────────────────────────
interface ConvoScreenshotProps {
  src: string;
  caption?: string;
  rotation?: number;
  className?: string;
}
const ConvoScreenshot: React.FC<ConvoScreenshotProps> = ({ src, caption, rotation = 0, className = '' }) => (
  <div
    className={`relative inline-block ${className}`}
    style={{ transform: `rotate(${rotation}deg)` }}
    onClick={(e) => e.stopPropagation()}
  >
    <div className="absolute -top-2 left-1/2 -translate-x-1/2 h-3.5 w-16 bg-[#fce4ec]/95 border-x-2 border-rose-300/70 border-dashed shadow-xs z-10" />
    <div className="bg-[#fffdf9] p-1.5 pb-2 shadow-[0_4px_14px_rgba(75,45,25,0.16)] rounded-xs border border-amber-900/10">
      <div className="rounded overflow-hidden border border-stone-200">
        <img src={src} alt="conversation" className="w-full object-cover" loading="lazy" decoding="async" />
      </div>
      {caption && <p className="text-center font-handwriting text-amber-950/80 text-[12px] pt-1 italic">{caption}</p>}
    </div>
  </div>
);

// ─── 100% HANDWRITTEN TYPOGRAPHY PRIMITIVES ─────────────────────────────────
const ChapterHeader: React.FC<{ number: string; title: string }> = ({ number, title }) => (
  <div className="text-center pb-0.5 border-b border-amber-900/20 mb-1 shrink-0">
    <span className="font-handwriting text-[13px] sm:text-[14px] tracking-widest uppercase text-rose-deep font-bold">{number}</span>
    <h3 className="font-handwriting text-2xl sm:text-[26px] font-bold text-[#241713] mt-0.5 leading-tight drop-shadow-xs">{title}</h3>
  </div>
);

const P: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <p className={`font-handwriting text-[15.5px] sm:text-[17px] text-[#2c1d18] leading-[1.42] tracking-wide ${className}`}>
    {children}
  </p>
);

const Hand: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <p className={`font-handwriting text-[17.5px] sm:text-[19px] text-[#8b263e] leading-snug font-bold ${className}`}>
    {children}
  </p>
);

const Quote: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="border-l-[3px] border-[#8b263e]/70 pl-2.5 py-0.5 my-1 bg-amber-900/[0.04] rounded-r-xs">
    <p className="font-handwriting italic text-[15.5px] sm:text-[17px] text-[#3d241d] leading-snug">{children}</p>
  </div>
);

// ─── PAGE WRAPPER WITH BURNED EDGE PAPER & DEDICATED HEART TURN BUTTON ──────
const Page = forwardRef<HTMLDivElement, {
  children: React.ReactNode;
  pageNumber: number;
  totalPages: number;
  warm?: boolean;
}>(({ children, pageNumber, totalPages, warm = false }, ref) => {
  const { flipNext, flipPrev } = React.useContext(FlipContext);
  const isLeft = pageNumber % 2 !== 0;
  const bgClass = warm ? 'burned-paper-warm' : 'burned-paper';

  return (
    <div
      ref={ref}
      className={`${bgClass} text-ink-dark h-full w-full relative flex flex-col overflow-hidden`}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Book binding gutter shadow */}
      <div className={`absolute top-0 bottom-0 w-6 pointer-events-none z-10 ${
        isLeft ? 'right-0 bg-gradient-to-l from-amber-950/[0.12] to-transparent' : 'left-0 bg-gradient-to-r from-amber-950/[0.12] to-transparent'
      }`} />
      
      {/* Scrollable content area: cozy responsive padding on mobile with min-h-0 for flex scrolling */}
      <div
        className="p-2 sm:p-4 flex-1 min-h-0 flex flex-col justify-between overflow-y-auto z-0 scrollbar-thin overscroll-contain"
        style={{
          WebkitOverflowScrolling: 'touch',
          touchAction: 'pan-y',
        }}
      >
        {children}
      </div>

      {/* Burned vintage footer with dedicated Heart Page-Turn buttons */}
      <div className="px-2.5 sm:px-4 py-2 flex items-center justify-between text-amber-950/70 font-handwriting border-t border-amber-900/15 z-20 shrink-0 bg-amber-900/[0.04]">
        {/* Left page-turn heart button */}
        {pageNumber > 1 ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              flipPrev();
            }}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/15 hover:bg-rose-500/25 active:scale-90 border border-rose-400/50 text-rose-deep text-[12.5px] sm:text-[13.5px] font-bold cursor-pointer transition-all shadow-xs touch-manipulation group"
            title="Turn to previous page"
          >
            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 group-hover:scale-110 transition-transform" />
            <span>Prev</span>
          </button>
        ) : (
          <div className="w-14" />
        )}

        {/* Page Number */}
        <span className="italic font-bold tracking-wide text-amber-900/80 text-[12px] sm:text-[13.5px] select-none">
          — {pageNumber} of {totalPages} —
        </span>

        {/* Right page-turn heart button */}
        {pageNumber < totalPages ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              flipNext();
            }}
            className="flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-600 hover:bg-rose-700 active:scale-90 border border-rose-600 text-white text-[12.5px] sm:text-[13.5px] font-bold cursor-pointer transition-all shadow-sm touch-manipulation group animate-pulse hover:animate-none"
            title="Turn to next page"
          >
            <span>Turn page</span>
            <Heart className="w-3.5 h-3.5 fill-white text-white group-hover:scale-125 transition-transform" />
          </button>
        ) : (
          <div className="w-16" />
        )}
      </div>
    </div>
  );
});
Page.displayName = 'Page';

// ─── CHAPTER DIRECTORY (FOR QUICK NAVIGATION) ─────────────────────────────────
const CHAPTER_DIRECTORY = [
  { page: 1, label: 'Cover & Dedication' },
  { page: 3, label: 'Ch 1: The Boy Before (Yash)' },
  { page: 7, label: 'Ch 2: The Girl I Didn\'t Know' },
  { page: 9, label: 'Ch 3: The Story I Replied To' },
  { page: 13, label: 'Ch 4: 20th September 2025' },
  { page: 15, label: 'Ch 5: The First Jealousy' },
  { page: 17, label: 'Ch 6: Somewhere Between Us' },
  { page: 20, label: 'Ch 7: And Then We Met' },
  { page: 25, label: 'Ch 7.5: 15th February 2026' },
  { page: 27, label: 'Ch 8: The Real Tannu' },
  { page: 31, label: 'Ch 9: The Little Things' },
  { page: 33, label: 'Ch 10: Stupid Little Moments' },
  { page: 36, label: 'Ch 11: Things I Don\'t Say Enough' },
  { page: 38, label: 'Ch 12: Not-So-Perfect Parts' },
  { page: 39, label: 'Ch 13: The Life I Imagine' },
  { page: 41, label: 'Ch 14: If I Could Go Back' },
  { page: 42, label: 'Ch 15: The Boy After You' },
  { page: 43, label: 'Happy Birthday Tannu ♡' },
];

// ─── MAIN 44-PAGE DIARY BOOK COMPONENT ────────────────────────────────────────
export const DiaryBook: React.FC<DiaryBookProps> = ({ onOpenLetter }) => {
  const flipBookRef = useRef<any>(null);
  const [_currentPage, setCurrentPage] = useState(0);
  const [isClosing, setIsClosing] = useState(false);
  const [showChapterMenu, setShowChapterMenu] = useState(false);
  const [isFilmModalOpen, setIsFilmModalOpen] = useState(false);
  const totalPages = 44;

  const handlePageFlip = (e: { data: number }) => {
    setCurrentPage(e.data);
    soundEngine.playPaperFlip();
    soundEngine.setTrackForPage(e.data + 1);
  };

  const nextFlip = () => {
    const pf = (flipBookRef.current as any)?.pageFlip();
    if (!pf) return;
    if (pf.getState && pf.getState() !== 'read') return;
    soundEngine.playPaperFlip();
    pf.flipNext();
  };

  const prevFlip = () => {
    const pf = (flipBookRef.current as any)?.pageFlip();
    if (!pf) return;
    if (pf.getState && pf.getState() !== 'read') return;
    soundEngine.playPaperFlip();
    pf.flipPrev();
  };

  const jumpToPage = (pageNum: number) => {
    soundEngine.playPaperFlip();
    (flipBookRef.current as any)?.pageFlip()?.turnToPage(pageNum - 1);
    setShowChapterMenu(false);
  };

  const handleCloseDiary = () => {
    setIsClosing(true);
    soundEngine.playPaperFlip();
    setTimeout(() => window.location.reload(), 1200);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextFlip();
      if (e.key === 'ArrowLeft') prevFlip();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  if (isClosing) {
    return (
      <div className="fixed inset-0 z-50 bg-[#3d1525] flex items-center justify-center animate-fadeIn">
        <div className="text-center font-handwriting text-amber-100 text-3xl animate-pulse">
          closing our diary... ♡
        </div>
      </div>
    );
  }

  return (
    <FlipContext.Provider value={{ flipNext: nextFlip, flipPrev: prevFlip }}>
      <div className="relative w-full max-w-5xl mx-auto flex flex-col items-center justify-start sm:justify-center min-h-screen py-1 sm:py-5 px-1 sm:px-2 pt-14 sm:pt-4 pb-16 sm:pb-8">
        {/* Top Controls: Chapter Index & Unfiltered Film Reel (Mobile responsive) */}
        <div className="relative z-30 mb-2 flex items-center justify-center gap-2 font-handwriting text-xs sm:text-base max-w-full px-2">
          <button
            onClick={() => setShowChapterMenu(!showChapterMenu)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fbf6ec] border border-amber-900/25 shadow-xs text-amber-950 hover:text-rose-deep transition-colors text-xs sm:text-sm font-bold"
          >
            <Bookmark className="w-3.5 h-3.5 text-rose-deep" />
            <span>Chapters Index</span>
          </button>

          <button
            onClick={() => setIsFilmModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100/90 hover:bg-rose-200 border border-rose-300 shadow-xs text-rose-deep transition-all hover:scale-105 active:scale-95 cursor-pointer text-xs sm:text-sm font-bold"
          >
            <Film className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
            <span>Us, Unfiltered 🎞️</span>
          </button>

          {showChapterMenu && (
            <div className="absolute top-8 left-0 z-40 bg-[#fcf8ef] border border-amber-900/30 shadow-2xl rounded-md p-2 w-56 sm:w-60 max-h-72 overflow-y-auto font-handwriting text-base text-ink-dark">
              <p className="text-[11px] font-handwriting uppercase tracking-widest text-rose-deep px-2 py-1 border-b border-amber-900/15 font-bold">
                Jump to Chapter
              </p>
              {CHAPTER_DIRECTORY.map((ch, idx) => (
                <button
                  key={idx}
                  onClick={() => jumpToPage(ch.page)}
                  className="w-full text-left px-2 py-1 hover:bg-rose-100/50 rounded transition-colors flex justify-between items-center text-sm"
                >
                  <span className="truncate">{ch.label}</span>
                  <span className="text-[10px] text-amber-900/70 font-sans shrink-0 ml-1">p.{ch.page}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="relative w-full flex justify-center items-center">
          {/* Left Click Turn Overlay for desktop hover */}
          <div onClick={prevFlip} className="hidden sm:flex absolute left-0 top-0 bottom-0 w-8 sm:w-14 z-20 cursor-pointer items-center opacity-0 hover:opacity-100 transition-opacity">
            <div className="p-1.5 sm:p-2 rounded-r-full bg-[#fbf6ec]/90 border border-amber-900/20 text-rose-deep shadow">
              <ChevronLeft className="w-4 sm:w-5 h-4 sm:h-5" />
            </div>
          </div>
          {/* Right Click Turn Overlay for desktop hover */}
          <div onClick={nextFlip} className="hidden sm:flex absolute right-0 top-0 bottom-0 w-8 sm:w-14 z-20 cursor-pointer items-center justify-end opacity-0 hover:opacity-100 transition-opacity">
            <div className="p-1.5 sm:p-2 rounded-l-full bg-[#fbf6ec]/90 border border-amber-900/20 text-rose-deep shadow">
              <ChevronRight className="w-4 sm:w-5 h-4 sm:h-5" />
            </div>
          </div>

          {/* @ts-expect-error – react-pageflip library types */}
          <HTMLFlipBook
            ref={flipBookRef}
            width={360} height={535} size="stretch"
            minWidth={280} maxWidth={460}
            minHeight={420} maxHeight={630}
            maxShadowOpacity={0.3}
            showCover={false}
            mobileScrollSupport={true}
            disableFlipByClick={false}
            clickEventForward={true}
            useMouseEvents={false}
            usePortrait={true}
            startPage={0}
            onFlip={handlePageFlip}
            className="shadow-2xl mx-auto"
          >

            {/* PAGE 1 */}
            <Page pageNumber={1} totalPages={totalPages}>

              <div className="h-full flex flex-col justify-between text-center py-1">
                <div className="flex justify-between w-full opacity-60">
                  <TulipSVG size={26} color="#8b263e" />
                  <LilySVG size={26} color="#ad1457" />
                </div>
                <div className="space-y-1.5 my-auto max-w-[280px] mx-auto">
                  <div className="font-handwriting text-5xl sm:text-6xl font-bold text-rose-deep tracking-tight">US ♡</div>
                  <div className="w-14 h-0.5 bg-amber-900/25 mx-auto" />
                  <p className="font-handwriting italic text-[16px] sm:text-[17.5px] text-[#3d2721] leading-snug">
                    Tannu, this is the true story of how a selfish, careless &amp; narcissistic boy fell completely, hopelessly in love with the kindest, cutest soul on earth.
                  </p>
                  <div className="w-10 h-px bg-amber-900/20 mx-auto" />
                  <Hand className="text-lg text-[#3d2721]">My story, your story, and</Hand>
                  <p className="font-handwriting text-2xl sm:text-3xl font-bold text-rose-deep tracking-wide">OUR STORY</p>
                  <div className="font-handwriting italic text-[14px] text-[#4a2e25] space-y-0.5 text-left pl-3 bg-amber-900/[0.04] p-1.5 rounded-xs border-l-2 border-rose-deep/40">
                    <p>• Started in 2025 &amp; forever expanding.</p>
                    <p>• Full of our messy ups &amp; downs.</p>
                    <p>• Just two clumsy kids loving each other.</p>
                    <p>• Genuinely the best phase of my life.</p>
                  </div>
                </div>

                <div className="space-y-1.5 w-full max-w-[270px] mx-auto">
                  <LoveMeter caption="Yash's love for Tannu right now:" />
                  <ForeheadKissButton label="Tap to send a forehead kiss to Yash 💋" />
                  <StickyNote color="pink" rotation={1} className="w-full text-center">
                    Dedicated to my Tannu — tap 'Turn page 💖' below to open my heart to you ♡
                  </StickyNote>
                </div>
              </div>

            </Page>

            {/* PAGE 2 */}
            <Page pageNumber={2} totalPages={totalPages} warm>

              <div className="space-y-1">
                <DiaryHeader date="2025 - Forever" location="Our Universe" mood="Grateful for every single second" />
                <div className="text-center pb-0.5 border-b border-amber-900/20">
                  <span className="font-handwriting text-[12px] uppercase text-rose-deep font-bold">Chapters of My Heart</span>
                  <h3 className="font-handwriting text-xl sm:text-2xl font-bold text-ink-dark leading-tight">Index of Our Memories</h3>
                </div>
                <P className="italic text-center text-xs sm:text-sm text-amber-950/80 leading-snug">
                  "Every single page in this diary, Tannu, was handwritten just for you."
                </P>
                <div className="space-y-0 font-handwriting text-[12.5px] sm:text-[14px] text-[#3d2a23] pl-2 border-l-2 border-amber-900/20 leading-tight">
                  <p><strong className="text-rose-deep font-bold">Ch 1 (p. 3):</strong> Who I was before 2025 (The guarded boy)</p>
                  <p><strong className="text-rose-deep font-bold">Ch 2 (p. 7):</strong> July 2025: When we were strangers</p>
                  <p><strong className="text-rose-deep font-bold">Ch 3 (p. 9):</strong> Sept 2025: That comedy story I replied to</p>
                  <p><strong className="text-rose-deep font-bold">Ch 4 (p. 13):</strong> 20th September 2025 (YOU confessed first!)</p>
                  <p><strong className="text-rose-deep font-bold">Ch 5 (p. 15):</strong> Oct 2025: The twirl &amp; the first jealousy</p>
                  <p><strong className="text-rose-deep font-bold">Ch 6 (p. 17):</strong> Nov 2025: 3 AM FaceTime hours &amp; screens</p>
                  <p><strong className="text-rose-deep font-bold">Ch 7 (p. 20):</strong> Winter 2025: Café table &amp; auto ride first kiss</p>
                  <p><strong className="text-rose-deep font-bold">Ch 7.5 (p. 25):</strong> 15th February 2026 (Our sacred milestone)</p>
                  <p><strong className="text-rose-deep font-bold">Ch 8 (p. 27):</strong> 2026: The real, sleepy, capsicum Tannu</p>
                  <p><strong className="text-rose-deep font-bold">Ch 9 (p. 31):</strong> Stolen polaroids &amp; mirror hugs</p>
                  <p><strong className="text-rose-deep font-bold">Ch 10 (p. 33):</strong> Our stupid little moments &amp; bakchodi</p>
                  <p><strong className="text-rose-deep font-bold">Ch 11 (p. 36):</strong> Things I notice about you &amp; never say</p>
                  <p><strong className="text-rose-deep font-bold">Ch 12 (p. 38):</strong> Fights, storms &amp; kitchen hugs</p>
                  <p><strong className="text-rose-deep font-bold">Ch 13 (p. 39):</strong> The life I imagine (Santorini dreams)</p>
                  <p><strong className="text-rose-deep font-bold">Ch 14 (p. 41):</strong> In every lifetime, it will still be you</p>
                  <p><strong className="text-rose-deep font-bold">Ch 15 (p. 42):</strong> The boy you transformed</p>
                  <p><strong className="text-rose-deep font-bold">Finale (p. 43):</strong> Happy Birthday to my favorite girl ♡</p>
                </div>
                <PeelWaxSeal
                  title="Yash's secret note before you start reading"
                  secret="Tannu, 2025 was the year my life truly began. Everything before you was just waiting for you to arrive."
                />
              </div>

            </Page>

            {/* PAGE 3 */}
            <Page pageNumber={3} totalPages={totalPages}>

              <div className="space-y-1.5">
                <DiaryHeader date="2024 - Early 2025" location="College / Hostel" mood="Cold, detached, pretending to be fine" />
                <ChapterHeader number="Chapter One" title="The Boy Before You" />
                <div className="flex items-start gap-2">
                  <div className="flex-1 space-y-1">
                    <P className="font-bold text-rose-deep">
                      Who was I before you walked into my life, Tannu?
                    </P>
                    <P>
                      To everyone else in 2024, I acted completely nonchalant. Cool, detached, like I never needed anyone to affect me.
                    </P>
                    <P>
                      I convinced myself I didn't care about anything or anyone.
                    </P>
                  </div>
                  <FlipPolaroid
                    src="/assets/yash/yash_before.jpg"
                    caption="me before you"
                    date="2024 hostel era"
                    backNote="Look at my face here. So serious, so guarded. I had no idea a girl named Tanisha was about to turn my whole world upside down in 2025."
                    rotation={2}
                    tapeColor="gold"
                    size="xs"
                  />
                </div>
                <P>
                  I used to sit alone in class, acting like I had it all together, but there was this constant emptiness eating at me. Behind all that swagger, that insecure kid just desperately wanted to be loved.
                </P>
                <MemoryQuiz
                  question="Guess what Yash's routine was before meeting you in 2025?"
                  options={["Gym & sleep", "Partying nonstop", "Sitting alone pretending to not care"]}
                  reaction="Sitting alone pretending to not care. Until you came along in 2025 and gave me a reason to care about everything."
                />
                <GoldenScratchCard
                  prompt="Scratch to reveal Yash's hidden confession"
                  hiddenMessage="I was searching for a home in all the wrong people, not knowing my real home was waiting for me in 2025."
                />
              </div>

            </Page>

            {/* PAGE 4 */}
            <Page pageNumber={4} totalPages={totalPages} warm>

              <div className="space-y-1.5">
                <DiaryHeader date="Hostel Era 2024" location="Room 204" mood="Restless & guarded" />
                <div className="flex items-start gap-2">
                  <FlipPolaroid
                    src="/assets/yash/yash2.jpg"
                    caption="the guarded boy"
                    date="pre-Tannu days"
                    backNote="I used to think being emotionless was a strength. You proved to me that loving with your whole heart is the bravest thing in the world."
                    rotation={-2}
                    tapeColor="cream"
                    size="xs"
                  />
                  <div className="flex-1 space-y-1">
                    <P>
                      I had built these tall, rigid walls around myself. I used humor as a shield and sarcasm as armor so nobody could get close enough to see that I was struggling.
                    </P>
                    <P>
                      I thought that if I never let anyone in, I would never get hurt.
                    </P>
                  </div>
                </div>
                <Quote>
                  "I called it being independent. The truth was, I was just terrified of being vulnerable."
                </Quote>
                <P>
                  I was careless with my words and selfish with my time. But then you showed up, and you didn't run away when I was distant. You just stood there with your soft heart and slowly took down every brick I built.
                </P>
                <PeelWaxSeal
                  title="Secret confession about my walls"
                  secret="Whenever someone tried to get close in the past, I pushed them away. You were the only person whose stubborn warmth broke straight through my defenses."
                />
                <MarginNote color="ink" rotation={1} className="text-right">
                  — you broke through without even trying ♡
                </MarginNote>
              </div>

            </Page>

            {/* PAGE 5 */}
            <Page pageNumber={5} totalPages={totalPages}>

              <div className="space-y-1.5">
                <DiaryHeader date="College 2024" location="Lecture Hall" mood="Lost in my own head" />
                <P className="font-semibold text-rose-deep">
                  The deepest insecurity I used to hide:
                </P>
                <P>
                  I wanted to know that my presence actually mattered to someone, and that my absence would actually hurt. I wanted to be someone's first choice.
                </P>
                <div className="flex items-center justify-center my-1">
                  <FlipPolaroid
                    src="/assets/yash/yash3.jpg"
                    caption="looking for something real"
                    backNote="I was wandering through crowds wondering if anyone would ever truly see me. Then you came and looked right into my soul."
                    rotation={1}
                    tapeColor="rose"
                    size="sm"
                  />
                </div>
                <P>
                  I spent so many nights staring at the ceiling, wondering if anyone would ever look at the real, messy, unpolished version of me and still choose to stay.
                </P>
                <InteractiveChecklist
                  title="Things Yash pretended he didn't care about"
                  items={[
                    "Being someone's first choice",
                    "Receiving sweet goodnight texts",
                    "Having a real home in another person's arms"
                  ]}
                />
                <StickyNote color="amber" rotation={2} className="text-center">
                  And then in 2025 the universe gave me you — the one person who makes me feel deeply chosen every single day.
                </StickyNote>
              </div>

            </Page>

            {/* PAGE 6 */}
            <Page pageNumber={6} totalPages={totalPages} warm>

              <div className="space-y-1.5">
                <DiaryHeader date="Early 2025" location="Gurugram" mood="Waiting for fate" />
                <div className="flex items-center justify-around gap-2">
                  <FlipPolaroid
                    src="/assets/yash/yash4.jpg"
                    caption="mirror thoughts"
                    backNote="The last days of being lonely. You were right around the corner."
                    rotation={-2}
                    tapeColor="pink"
                    size="xs"
                  />
                  <FlipPolaroid
                    src="/assets/yash/yash5.jpg"
                    caption="alien Yash matching you"
                    backNote="Look at how goofy I became once you entered my life! You brought out the real kid in me."
                    rotation={2}
                    tapeColor="cream"
                    size="xs"
                  />
                </div>
                <P>
                  Look at these pictures of me back then. I looked so lost, trying to find purpose in all the wrong places.
                </P>
                <P>
                  I didn't know it yet, but mid-2025 was about to introduce me to Tanisha Jha — the girl who would completely rewrite my destiny.
                </P>
                <ForeheadKissButton label="Tap to send comfort to past Yash 💋" />
                <div className="flex justify-between items-center pt-1 border-t border-amber-900/15">
                  <VintageStamp text="CHAPTER 1 COMPLETE" rotation={-2} />
                  <MarginNote color="red" rotation={1}>
                    2025 starts on next page →
                  </MarginNote>
                </div>
              </div>

            </Page>

            {/* PAGE 7 */}
            <Page pageNumber={7} totalPages={totalPages}>

              <div className="space-y-1.5">
                <DiaryHeader date="July 2025" location="New Delhi / Gurugram" mood="Curious about a stranger" />
                <ChapterHeader number="Chapter Two" title="The Girl I Didn't Know" />
                <div className="flex items-start gap-2">
                  <div className="flex-1 space-y-1">
                    <P className="font-bold text-rose-deep">
                      July 2025. And then came Tanisha Jha.
                    </P>
                    <P>
                      I didn't know you existed. I was busy living in my own bubble, completely unaware that someone with your energy, your humor, and your heart was out there.
                    </P>
                  </div>
                  <FlipPolaroid
                    src="/assets/her/h1.jpg"
                    caption="that soft radiant face"
                    date="July 2025"
                    backNote="The first time I saw this photo, I literally stared for 5 whole minutes. Unfairly pretty."
                    rotation={-1.5}
                    tapeColor="pink"
                    size="xs"
                  />
                </div>
                <P>
                  The first time I saw your pictures, I stopped dead in my tracks. You had this effortless, quiet charm — this warmth that felt like morning sunlight after months of cold rain.
                </P>
                <div className="flex items-center justify-around gap-2 my-1">
                  <FlipPolaroid
                    src="/assets/her/h13.jpg"
                    caption="pure sunshine"
                    date="July 2025"
                    backNote="Look at that innocent smile. You had no idea what you were doing to my heart."
                    rotation={2}
                    tapeColor="cream"
                    size="xs"
                  />
                  <StickyNote color="pink" rotation={-2} className="w-36 text-center">
                    "I didn't believe in love at first sight, but you made me second-guess everything in 2025."
                  </StickyNote>
                </div>
                <PeelWaxSeal
                  title="What went through my head the first second I saw you"
                  secret="I literally paused and thought: 'Who is this girl and why does her smile feel so familiar, like I've known her forever?'"
                />
              </div>

            </Page>

            {/* PAGE 8 */}
            <Page pageNumber={8} totalPages={totalPages} warm>

              <div className="space-y-1.5">
                <DiaryHeader date="August 2025" location="Schmooze App" mood="Awkward silence & suspense" />
                <P className="font-bold text-rose-deep">
                  We matched on Schmooze in August 2025.
                </P>
                <P>
                  Out of thousands of people swiping memes, our broken humor matched us together. We exchanged a couple of quick, casual texts... and then came two whole months of complete, dead silence.
                </P>
                <div className="flex items-center justify-center gap-2 my-1">
                  <ConvoScreenshot
                    src="/assets/convo/ss2.jpg"
                    caption="our first Schmooze match"
                    rotation={-1}
                    className="w-28 sm:w-32"
                  />
                  <ConvoScreenshot
                    src="/assets/convo/ss1.jpg"
                    caption="the awkward 2-month silence"
                    rotation={1.5}
                    className="w-28 sm:w-32"
                  />
                </div>
                <MemoryQuiz
                  question="Why did we go completely silent for two months?"
                  options={["Too busy studying", "Both waiting for the other", "Destiny building suspense"]}
                  reaction="Destiny was definitely building suspense! But honestly, I was just too intimidated by how pretty you were."
                />
                <StickyNote color="yellow" rotation={1} className="text-center">
                  Two months of awkward quiet. We almost became strangers who never happened. But the universe wasn't going to let us slip away in 2025.
                </StickyNote>
              </div>

            </Page>

            {/* PAGE 9 */}
            <Page pageNumber={9} totalPages={totalPages}>

              <div className="space-y-1.5">
                <DiaryHeader date="Early September 2025" location="Instagram" mood="Taking a leap of faith" />
                <ChapterHeader number="Chapter Three" title="The Story I Replied To" />
                <div className="flex items-start gap-2">
                  <div className="flex-1 space-y-1">
                    <P>
                      Then, one random night in September 2025, you posted a stand-up comedy reel on your Instagram story.
                    </P>
                    <P className="font-bold text-rose-deep">
                      I didn't swipe past. I typed a reply.
                    </P>
                  </div>
                  <ConvoScreenshot
                    src="/assets/convo/ss3.jpg"
                    caption="the reply that started it all"
                    rotation={2}
                    className="w-28 sm:w-32"
                  />
                </div>
                <P>
                  That single, ordinary tap on my screen in September 2025 was the best decision of my entire existence. If I had closed the app that night, I would have missed out on my whole world.
                </P>
                <FoldOutNote
                  teaser="What I was doing right before I replied"
                  letter="I typed, deleted, and re-typed that message three times. I was trying so hard to sound funny and casual, but my hands were literally sweating over an Instagram DM."
                />
                <div className="flex justify-between items-center pt-1 border-t border-amber-900/15">
                  <VintageStamp text="BEST DM OF 2025" rotation={-2} />
                  <MarginNote color="red" rotation={2}>
                    and the magic began →
                  </MarginNote>
                </div>
              </div>

            </Page>

            {/* PAGE 10 */}
            <Page pageNumber={10} totalPages={totalPages} warm>

              <div className="space-y-1.5">
                <DiaryHeader date="Mid September 2025" location="DMs till 3 AM" mood="Laughing till my ribs hurt" />
                <P className="font-bold text-rose-deep">
                  We talked about stand-up comedy for hours.
                </P>
                <P>
                  I realized you had the exact same sarcastic, slightly unhinged humor as me. We tore each other's jokes apart and matched each other line for line.
                </P>
                <div className="flex items-center justify-center my-1">
                  <AutoplayFilmFrame
                    src="/assets/her/hv1.mp4"
                    poster="/assets/her/h8.jpg"
                    caption="your smile while roasting me"
                    rotation={-1}
                    size="sm"
                  />
                </div>
                <P>
                  You weren't like anyone else I'd ever met. You were sharp, funny, and completely unapologetically yourself.
                </P>
                <InteractiveChecklist
                  title="Signs I was already hopelessly hooked"
                  items={[
                    "Checking my phone every 30 seconds for your notification",
                    "Laughing out loud in public like a crazy person",
                    "Ignoring my sleep schedule because talking to you was better"
                  ]}
                />
                <StickyNote color="pink" rotation={-1.5} className="text-center">
                  "You became my favorite notification within 48 hours."
                </StickyNote>
              </div>

            </Page>

            {/* PAGE 11 */}
            <Page pageNumber={11} totalPages={totalPages}>

              <div className="space-y-1.5">
                <DiaryHeader date="Mid September 2025" location="Everywhere I walked" mood="Constantly smiling at my screen" />
                <div className="flex items-start gap-2">
                  <div className="flex-1 space-y-1">
                    <P>
                      Suddenly, in September 2025, the boy who never gave his time to anyone was checking his phone every 30 seconds.
                    </P>
                    <P>
                      My entire day revolved around when you would text. Walking to class, eating lunch, sitting in my room — everything felt brighter because you were in my notifications.
                    </P>
                  </div>
                  <FlipPolaroid
                    src="/assets/her/h2.jpg"
                    caption="the girl in my head 24/7"
                    date="Sept 2025"
                    backNote="I was completely hopelessly smitten by this week. You had completely conquered my schedule."
                    rotation={2}
                    tapeColor="pink"
                    size="xs"
                  />
                </div>
                <P>
                  I used to guard my peace so aggressively, but with you, I wanted you in every single corner of my day.
                </P>
                <LoveMeter caption="Yash's addiction to talking to Tannu:" />
                <PeelWaxSeal
                  title="Private thought from this week"
                  secret="My roommate asked me why I kept smiling at my phone like an idiot. I didn't want to admit that a girl had completely taken over my brain."
                />
                <MarginNote color="ink" rotation={-2} className="text-right">
                  — you owned my attention from day one ♡
                </MarginNote>
              </div>

            </Page>

            {/* PAGE 12 */}
            <Page pageNumber={12} totalPages={totalPages} warm>

              <div className="space-y-1.5">
                <DiaryHeader date="18th September 2025" location="Midnight call" mood="Soft, tender, defenseless" />
                <div className="flex items-start gap-2">
                  <FlipPolaroid
                    src="/assets/her/h3.jpg"
                    caption="when banter turned into love"
                    date="18 Sept 2025"
                    backNote="Two days before the confession. We both knew something huge was coming."
                    rotation={-2}
                    tapeColor="gold"
                    size="xs"
                  />
                  <div className="flex-1 space-y-1">
                    <P>
                      Somewhere between roasting each other and sharing memes, the tone quietly shifted.
                    </P>
                    <P>
                      You started telling me about your day, your little worries, the random thoughts in your head. And I found myself caring so deeply about every single detail.
                    </P>
                  </div>
                </div>
                <Quote>
                  "I didn't just want to make you laugh anymore. I wanted to make sure you felt safe with me."
                </Quote>
                <P>
                  That was the turning point. I wasn't just having fun chatting with a cute girl; my heart was quietly packing its bags and moving into yours.
                </P>
                <ForeheadKissButton label="Tap to send comfort to Tannu 💋" />
                <StickyNote color="amber" rotation={1.5} className="text-center">
                  "I knew right here that I was in deep trouble. Good trouble."
                </StickyNote>
              </div>

            </Page>

            {/* PAGE 13 */}
            <Page pageNumber={13} totalPages={totalPages}>

              <div className="space-y-1.5">
                <DiaryHeader date="20th September 2025" location="Late Night / Forever" mood="Heart exploded with joy" />
                <ChapterHeader number="Chapter Four" title="20th September 2025" />
                <div className="flex items-start gap-2">
                  <div className="flex-1 space-y-1">
                    <P className="font-bold text-rose-deep text-lg">
                      YOU CONFESSED FIRST, TANNU!
                    </P>
                    <P>
                      Let this digital diary officially etch it into history: <strong>On 20th September 2025, you were the one who spoke first!</strong>
                    </P>
                  </div>
                  <FlipPolaroid
                    src="/assets/her/h4.jpg"
                    caption="20 Sept 2025: you confessed first"
                    date="20 Sept 2025"
                    backNote="The greatest night of 2025. You told me you liked me, and my whole universe shifted into color."
                    rotation={1.5}
                    tapeColor="gold"
                    size="xs"
                  />
                </div>
                <P>
                  That late-night conversation on 20th September 2025... my heart was racing so hard against my ribs I thought you could hear it through the phone. When you admitted how you felt, my entire universe clicked into place.
                </P>
                <MemoryQuiz
                  question="Who said I love you / confessed first on 20th September 2025?"
                  options={["Tannu (100%)", "Tannu (Obviously)", "Tannu (Yash will tease her forever)"]}
                  reaction="YOU DID! And I will remind you of this every single day until we are 90 years old, my babu!"
                />
                <VintageStamp text="20 SEPT 2025 • SACRED CONFESSION" rotation={-3} />
              </div>

            </Page>

            {/* PAGE 14 */}
            <Page pageNumber={14} totalPages={totalPages} warm>

              <div className="space-y-1.5">
                <DiaryHeader date="21st September 2025" location="Morning After" mood="Smug, giddy, completely in love" />
                <P className="font-bold text-rose-deep">
                  I will tease you about this forever.
                </P>
                <P>
                  You tried to act all cool afterward, like: 'Yeah, whatever, I just said it.' But we both knew you had fallen for this boy in 2025!
                </P>
                <div className="flex items-center justify-center my-1">
                  <AutoplayFilmFrame
                    src="/assets/her/hv2.mp4"
                    poster="/assets/her/h7.jpg"
                    caption="you trying not to smile when I tease you"
                    rotation={1.5}
                    size="sm"
                  />
                </div>
                <FoldOutNote
                  teaser="The honest truth about who fell first"
                  letter="Even though you spoke first, Tannu, the truth is I fell for you weeks before that night. You just had the bravery to say out loud what was already consuming my soul."
                />
                <P>
                  From 20th September 2025 onwards, there was no more 'I' and 'you' in my mind. It was only 'US'.
                </P>
                <StickyNote color="pink" rotation={-2} className="text-center">
                  "You confessed first, but I promise I will love you the longest."
                </StickyNote>
              </div>

            </Page>

            {/* PAGE 15 */}
            <Page pageNumber={15} totalPages={totalPages}>

              <div className="space-y-1.5">
                <DiaryHeader date="October 2025" location="Your room / My screen" mood="Blood boiling with possessiveness" />
                <ChapterHeader number="Chapter Five" title="The First Jealousy" />
                <div className="flex items-start gap-2">
                  <div className="flex-1 space-y-1">
                    <P className="font-bold text-rose-deep">
                      And then came the twirl incident.
                    </P>
                    <P>
                      You looked so breathtakingly gorgeous, and then you mentioned someone else or someone looked at you.
                    </P>
                  </div>
                  <FlipPolaroid
                    src="/assets/her/h5.jpg"
                    caption="that stunning twirl & outfit"
                    date="Oct 2025"
                    backNote="You twirled in this outfit and looked like a goddess. I instantly wanted to punch any guy who dared look at you."
                    rotation={-2}
                    tapeColor="rose"
                    size="xs"
                  />
                </div>
                <P>
                  Something snapped inside me so violently it scared me. I felt this intense, burning jealousy rush straight to my head.
                </P>
                <InteractiveChecklist
                  title="Yash's internal reaction to other guys looking at you"
                  items={[
                    "Blood boiled in 0.5 seconds",
                    "Acted cool and casual on the outside",
                    "Internally screamed: 'SHE IS MINE'",
                    "Realized I was completely, helplessly in love"
                  ]}
                />
                <MarginNote color="red" rotation={-1.5} className="font-bold">
                  — I never knew I could be that possessive until you.
                </MarginNote>
              </div>

            </Page>

            {/* PAGE 16 */}
            <Page pageNumber={16} totalPages={totalPages} warm>

              <div className="space-y-1.5">
                <DiaryHeader date="Late October 2025" location="Quiet night" mood="Surrendered & at peace" />
                <div className="flex items-start gap-2">
                  <FlipPolaroid
                    src="/assets/her/h6.jpg"
                    caption="the girl who owns me completely"
                    date="Oct 2025"
                    backNote="The night I surrendered completely. There was no more running from it."
                    rotation={2}
                    tapeColor="gold"
                    size="xs"
                  />
                  <div className="flex-1 space-y-1">
                    <P>
                      That jealousy was the ultimate mirror. You don't get that protective or that scared over someone who is just a casual person in your life.
                    </P>
                    <P>
                      You only feel that when you realize your entire heart is in their hands.
                    </P>
                  </div>
                </div>
                <Quote>
                  "I looked at myself in the mirror and finally admitted it: I am head-over-heels, irreversibly in love with Tanisha."
                </Quote>
                <P>
                  There was no turning back. I didn't want any exit doors or safety nets. I wanted you, all of you, forever.
                </P>
                <PeelWaxSeal
                  title="Secret from that night"
                  secret="I wrote in my phone notes that night: 'If anything ever happens between us, I will never love anyone else like this again.' And that is still true today."
                />
                <ForeheadKissButton label="Tap to calm possessive Yash 💋" />
              </div>

            </Page>

            {/* PAGE 17 */}
            <Page pageNumber={17} totalPages={totalPages}>

              <div className="space-y-1.5">
                <DiaryHeader date="November 2025" location="Phone Screens" mood="Aching with distance" />
                <ChapterHeader number="Chapter Six" title="Somewhere Between Us" />
                <div className="flex items-start gap-2">
                  <div className="flex-1 space-y-1">
                    <P className="font-bold text-rose-deep">
                      The distance between us was unbearable.
                    </P>
                    <P>
                      Falling in love through glowing screens in late 2025 was the sweetest agony. We spent hours living inside each other's headphones.
                    </P>
                  </div>
                  <FlipPolaroid
                    src="/assets/her/h7.jpg"
                    caption="my favorite screen view"
                    date="Nov 2025"
                    backNote="Every time my screen lit up with your face, my whole room felt warm."
                    rotation={-1.5}
                    tapeColor="pink"
                    size="xs"
                  />
                </div>
                <P>
                  I memorized the exact cadence of your voice, the way you sigh when you're sleepy, the little hum you make when you're thinking.
                </P>
                <MemoryQuiz
                  question="What was our longest recorded phone call in late 2025?"
                  options={["3 hours", "6 hours", "Until our phones literally overheated"]}
                  reaction="Until our phones overheated and our eyes burned, but neither of us wanted to say bye first!"
                />
                <StickyNote color="yellow" rotation={1} className="text-center">
                  "Distance meant so little when you already meant so much."
                </StickyNote>
              </div>

            </Page>

            {/* PAGE 18 */}
            <Page pageNumber={18} totalPages={totalPages} warm>

              <div className="space-y-1.5">
                <DiaryHeader date="Late November 2025" location="Bed at 3 AM" mood="Sleepy, soft, whispering" />
                <P className="font-bold text-rose-deep">
                  Those 3 AM FaceTime hours &amp; late-night voice notes.
                </P>
                <P>
                  You with your messy bun, cuddled under your blanket, telling me about everything and nothing. I would watch you start nodding off, your eyelids getting heavy.
                </P>
                <div className="flex items-center justify-center my-1">
                  <AutoplayFilmFrame
                    src="/assets/her/hv3.mp4"
                    poster="/assets/her/h9.jpg"
                    caption="your sleepy face on FaceTime"
                    rotation={1}
                    size="sm"
                  />
                </div>
                <VoiceNoteSimulator
                  title="Voice Note from Yash (2:43 AM)"
                  time="2:18 min"
                  transcript="Hey babu... you just fell asleep on FaceTime. I'm whispering so I don't wake you up, but you look so peaceful right now. Sleep well my angel. I love you so much."
                />
                <LoveMeter caption="How pretty Tannu looks when sleepy:" />
              </div>

            </Page>

            {/* PAGE 19 */}
            <Page pageNumber={19} totalPages={totalPages}>

              <div className="space-y-1.5">
                <DiaryHeader date="December 2025" location="Counting Days" mood="Impatience & butterflies" />
                <div className="flex items-start gap-2">
                  <FlipPolaroid
                    src="/assets/her/h8.jpg"
                    caption="counting the hours"
                    date="Dec 2025"
                    backNote="The days leading up to our first meeting felt like centuries. I couldn't focus on anything."
                    rotation={-2}
                    tapeColor="gold"
                    size="xs"
                  />
                  <div className="flex-1 space-y-1">
                    <P>
                      Screens weren't enough anymore. I needed to see you in 3D.
                    </P>
                    <P>
                      I wanted to see your height next to mine, smell your perfume, and feel your hand in mine without a piece of glass between us.
                    </P>
                  </div>
                </div>
                <InteractiveChecklist
                  title="Yash's nervous preparation before meeting in Dec 2025"
                  items={[
                    "Ironed three different shirts",
                    "Overthought what my first sentence would be",
                    "Heart rate: steady 150 bpm all day",
                    "Prayed you wouldn't find me awkward in person"
                  ]}
                />
                <PeelWaxSeal
                  title="What terrified me most before our first date"
                  secret="I was terrified that in real life, you wouldn't feel the same spark. But the second I saw you walk up, all my fear vanished."
                />
                <VintageStamp text="FIRST MEETING PENDING" rotation={-2} />
              </div>

            </Page>

            {/* PAGE 20 */}
            <Page pageNumber={20} totalPages={totalPages} warm>

              <div className="space-y-1.5">
                <DiaryHeader date="Winter 2025" location="Delhi / First Meeting" mood="World stopped spinning" />
                <ChapterHeader number="Chapter Seven" title="And Then We Met" />
                <div className="flex items-center justify-around gap-2 my-1">
                  <FlipPolaroid
                    src="/assets/us/u1.jpg"
                    caption="our very first meeting"
                    date="Winter 2025"
                    backNote="The second you walked up, I literally forgot how to speak proper English for five minutes."
                    rotation={-1.5}
                    tapeColor="cream"
                    size="xs"
                  />
                  <FlipPolaroid
                    src="/assets/us/u2.jpg"
                    caption="standing next to you at last"
                    date="Winter 2025"
                    backNote="Finally together in the real world. You fit perfectly right next to my shoulder."
                    rotation={2}
                    tapeColor="pink"
                    size="xs"
                  />
                </div>
                <P>
                  The exact moment you walked toward me in late 2025... I swear the noise of the whole city faded into silence.
                </P>
                <P>
                  You were smaller than I imagined, and so, so beautiful. We gave each other that shy, awkward side hug, and the scent of your hair hit me like heaven.
                </P>
                <StickyNote color="pink" rotation={-1.5} className="text-center">
                  "All my cool-guy arrogance melted into water the second your hand brushed against mine."
                </StickyNote>
                <ForeheadKissButton label="Send a first meeting kiss 💋" />
              </div>

            </Page>

            {/* PAGE 21 */}
            <Page pageNumber={21} totalPages={totalPages}>

              <div className="space-y-1.5">
                <DiaryHeader date="December 2025" location="Café Table" mood="Mesmerized by your eyes" />
                <P className="font-bold text-rose-deep">
                  Sitting across from you in that café.
                </P>
                <P>
                  You were talking with your hands, looking around, sipping your drink. Every time your eyes locked with mine, both of us would quickly look down and blush like little school kids.
                </P>
                <div className="flex items-center justify-center my-1">
                  <AutoplayFilmFrame
                    src="/assets/us/uv1.mp4"
                    poster="/assets/us/u2.jpg"
                    caption="you looking at me across the table"
                    rotation={-1}
                    size="sm"
                  />
                </div>
                <MemoryQuiz
                  question="What was the cutest awkward moment during our café date?"
                  options={["Both reaching for the same straw", "Looking away shyly when our eyes met", "Forgetting our own names"]}
                  reaction="Looking away shyly every time our eyes met! I couldn't look into your eyes for more than 3 seconds without my heart doing backflips."
                />
                <MarginNote color="ink" rotation={2} className="text-right">
                  — the prettiest girl in the entire café ♡
                </MarginNote>
              </div>

            </Page>

            {/* PAGE 22 */}
            <Page pageNumber={22} totalPages={totalPages} warm>

              <div className="space-y-1.5">
                <DiaryHeader date="Winter 2025" location="Delhi Auto Ride" mood="Electric, golden magic" />
                <div className="flex items-center justify-around gap-2 my-1">
                  <FlipPolaroid
                    src="/assets/us/u3.jpg"
                    caption="wind in your hair"
                    date="Winter 2025"
                    backNote="The wind was messing up your hair and you were trying to tuck it behind your ears. The most beautiful sight."
                    rotation={-2}
                    tapeColor="gold"
                    size="xs"
                  />
                  <FlipPolaroid
                    src="/assets/us/u4.jpg"
                    caption="sitting so close in that auto"
                    date="Winter 2025"
                    backNote="Right before our first kiss. My heart was practically beating out of my chest."
                    rotation={2}
                    tapeColor="rose"
                    size="xs"
                  />
                </div>
                <P className="font-bold text-rose-deep">
                  The bumpy auto ride through Delhi.
                </P>
                <P>
                  The cold evening wind was blowing your hair everywhere. Sitting packed next to you, our shoulders touching, every bump made us slide closer.
                </P>
                <FoldOutNote
                  teaser="Our very first kiss in that auto"
                  letter="I gathered all the courage I had, reached out, and held your hand. Then I leaned in... and kissed you. The world outside was honking and rushing, but inside that auto with you, time completely stood still."
                />
                <VintageStamp text="FIRST KISS SEALED ♡" rotation={-2} />
              </div>

            </Page>

            {/* PAGE 23 */}
            <Page pageNumber={23} totalPages={totalPages}>

              <div className="space-y-1.5">
                <DiaryHeader date="Winter 2025" location="Cold Delhi Pavement" mood="Warmest heart on earth" />
                <P className="font-bold text-rose-deep">
                  Your tiny, freezing hand slipped into my pocket.
                </P>
                <P>
                  It was freezing outside. You looked up at me with those big eyes, and without saying a word, slid your cold hand right into my warm jacket pocket. My fingers wrapped around yours.
                </P>
                <div className="flex items-center justify-center my-1">
                  <AutoplayFilmFrame
                    src="/assets/us/uv2.mp4"
                    poster="/assets/us/u4.jpg"
                    caption="walking with our hands locked"
                    rotation={1}
                    size="sm"
                  />
                </div>
                <InteractiveChecklist
                  title="Things I promised myself in that jacket pocket"
                  items={[
                    "Never let go of this girl's hand",
                    "Keep her warm through every single winter of our lives",
                    "Be the shelter she can always run to"
                  ]}
                />
                <StickyNote color="pink" rotation={-1.5} className="text-center">
                  "My jacket pocket was made for your hand."
                </StickyNote>
              </div>

            </Page>

            {/* PAGE 24 */}
            <Page pageNumber={24} totalPages={totalPages} warm>

              <div className="space-y-1.5">
                <DiaryHeader date="Midnight Farewell" location="By the Curb" mood="Never wanted the night to end" />
                <div className="flex items-center justify-around gap-2 my-1">
                  <FlipPolaroid
                    src="/assets/us/u5.jpg"
                    caption="walking under streetlights"
                    date="Winter 2025"
                    backNote="We took tiny steps just to stretch out the minutes together."
                    rotation={-2}
                    tapeColor="cream"
                    size="xs"
                  />
                  <FlipPolaroid
                    src="/assets/us/u6.jpg"
                    caption="the tightest goodbye hug"
                    date="Winter 2025"
                    backNote="That hug lasted so long the cab driver had to honk. I didn't care."
                    rotation={1.5}
                    tapeColor="pink"
                    size="xs"
                  />
                </div>
                <P>
                  We walked so slowly because neither of us wanted to say goodbye. When we reached the drop-off, we stood there for ten whole minutes, holding each other like letting go was impossible.
                </P>
                <PeelWaxSeal
                  title="What I felt on the cab ride back home"
                  secret="I was still smelling your perfume on my collar. I felt like I was floating two feet off the ground. I couldn't stop grinning the entire ride home."
                />
                <ForeheadKissButton label="Send a goodbye kiss 💋" />
              </div>

            </Page>

            {/* PAGE 25 */}
            <Page pageNumber={25} totalPages={totalPages}>

              <div className="space-y-1.5">
                <DiaryHeader date="15th February 2026" location="Our Sacred Date" mood="Eternity started here" />
                <ChapterHeader number="Chapter 7.5" title="15th February 2026" />
                <div className="flex items-start gap-2">
                  <div className="flex-1 space-y-1">
                    <P className="font-bold text-rose-deep text-lg">
                      15TH FEBRUARY 2026.
                    </P>
                    <P>
                      Some dates are just numbers printed on a calendar. But 15th February 2026 is carved in pure gold into my soul.
                    </P>
                  </div>
                  <FlipPolaroid
                    src="/assets/us/u7.jpg"
                    caption="15th Feb 2026: our sacred day"
                    date="15 Feb 2026"
                    backNote="15th February 2026. The milestone that locked our fates together forever."
                    rotation={2}
                    tapeColor="gold"
                    size="xs"
                  />
                </div>
                <P>
                  The day we looked each other in the eyes and knew this wasn't temporary. This wasn't a passing phase. We were choosing each other for life.
                </P>
                <MemoryQuiz
                  question="Why is 15th February 2026 our most sacred milestone?"
                  options={["It's our official forever date", "The promises we made to each other", "All of the above (1000x)"]}
                  reaction="ALL OF THE ABOVE! It is the anchor of our whole story, Tannu. I celebrate you on the 15th of every single month."
                />
                <VintageStamp text="15 FEB 2026 • SACRED MILESTONE" rotation={-3} />
              </div>

            </Page>

            {/* PAGE 26 */}
            <Page pageNumber={26} totalPages={totalPages} warm>

              <div className="space-y-1.5">
                <DiaryHeader date="15th Feb 2026 Forever" location="In Our Hearts" mood="Deep devotion" />
                <div className="flex items-center justify-around gap-2 my-1">
                  <FlipPolaroid
                    src="/assets/us/u8.jpg"
                    caption="together on 15th Feb 2026"
                    date="15 Feb 2026"
                    backNote="Look at us here. Two clumsy kids who found everything they ever wanted in each other."
                    rotation={-1.5}
                    tapeColor="rose"
                    size="xs"
                  />
                  <AutoplayFilmFrame
                    src="/assets/us/uv3.mp4"
                    poster="/assets/us/u8.jpg"
                    caption="our 15th Feb laughter"
                    rotation={1.5}
                    size="xs"
                  />
                </div>
                <Quote>
                  "On 15th February 2026, I promised you my honesty, my loyalty, my patience, and every ounce of my heart."
                </Quote>
                <FoldOutNote
                  teaser="The unspoken vow from 15th February"
                  letter="I swore to God and to myself that whatever life throws at us — whether we are laughing on a beach or crying during a storm — you will never face this world alone again. As long as I have breath in my lungs, you are protected and loved."
                />
                <ForeheadKissButton label="Seal our 15th Feb vow 💋" />
              </div>

            </Page>

            {/* PAGE 27 */}
            <Page pageNumber={27} totalPages={totalPages}>

              <div className="space-y-1.5">
                <DiaryHeader date="Daily Life 2026" location="With You" mood="Adoring every quirk" />
                <ChapterHeader number="Chapter Eight" title="The Real Tannu" />
                <div className="flex items-start gap-2">
                  <div className="flex-1 space-y-1">
                    <P className="font-bold text-rose-deep">
                      The world sees you all dressed up and polite.
                    </P>
                    <P>
                      But I get to see the real, unfiltered Tannu. The goofy, sleepy, dramatic, sweetest baby who exists behind closed doors.
                    </P>
                  </div>
                  <FlipPolaroid
                    src="/assets/her/h9.jpg"
                    caption="my raw cute baby"
                    date="2026 daily life"
                    backNote="No makeup, hair in a messy bun, laughing at my dumb joke. This is my favorite version of you."
                    rotation={-1.5}
                    tapeColor="pink"
                    size="xs"
                  />
                </div>
                <P>
                  The little faces you make when you're thinking, the way your eyebrows knit together when you're focused, how you pout when you want attention.
                </P>
                <PeelWaxSeal
                  title="My favorite thing about the real you"
                  secret="Your absolute authenticity. You don't try to impress anyone; you are 100% pure-hearted, raw, and completely genuine."
                />
                <StickyNote color="pink" rotation={1.5} className="text-center">
                  "You are most beautiful to me when you're just being completely yourself."
                </StickyNote>
              </div>

            </Page>

            {/* PAGE 28 */}
            <Page pageNumber={28} totalPages={totalPages} warm>

              <div className="space-y-1.5">
                <DiaryHeader date="Cozy Afternoons 2026" location="My Wardrobe / Your Home" mood="Warmest aesthetic" />
                <div className="flex items-start gap-2">
                  <FlipPolaroid
                    src="/assets/her/h10.jpg"
                    caption="drowning in my hoodie"
                    date="2026"
                    backNote="You put this on and declared it was yours now. I never got it back."
                    rotation={2}
                    tapeColor="cream"
                    size="xs"
                  />
                  <div className="flex-1 space-y-1">
                    <P className="font-bold text-rose-deep">
                      You stealing all my clothes.
                    </P>
                    <P>
                      You put on my oversized hoodie, the sleeves completely covering your hands, you swimming inside it smelling like your vanilla perfume.
                    </P>
                  </div>
                </div>
                <InteractiveChecklist
                  title="Tannu's official wardrobe theft record"
                  items={[
                    "My favorite oversized black hoodie",
                    "My warm grey sweatshirt",
                    "Half of my clean oversized t-shirts",
                    "My entire heart (irreversible theft)"
                  ]}
                />
                <LoveCoupon
                  id="001"
                  title="Midnight Ice Cream & Drive Pass"
                  benefit="Redeemable anytime Tannu has a sweet craving or needs late-night fresh air. Yash drives and pays."
                />
              </div>

            </Page>

            {/* PAGE 29 */}
            <Page pageNumber={29} totalPages={totalPages}>

              <div className="space-y-1.5">
                <DiaryHeader date="Food Cravings 2026" location="Kitchen / Zomato" mood="Entertained by your demands" />
                <div className="flex items-start gap-2">
                  <div className="flex-1 space-y-1">
                    <P className="font-bold text-rose-deep">
                      Your funny food obsessions.
                    </P>
                    <P>
                      Your love for capsicum! The sudden 11 PM cravings for something very specific, and the grumpy baby face you make when you're hungry.
                    </P>
                  </div>
                  <FlipPolaroid
                    src="/assets/her/h11.jpg"
                    caption="hungry and dramatic ♡"
                    date="2026 food diaries"
                    backNote="Five minutes after this photo, her food arrived and she smiled like sunshine again."
                    rotation={-2}
                    tapeColor="gold"
                    size="xs"
                  />
                </div>
                <MemoryQuiz
                  question="What happens when Tannu gets hangry?"
                  options={["She turns into a tiny angry demon", "She pouts until fed", "Both (and Yash loves it)"]}
                  reaction="Both! And the absolute best feeling in the world is feeding my angry baby her favorite food and seeing that bright smile return."
                />
                <VintageStamp text="OFFICIAL CHEF FOR TANNU" rotation={-3} />
              </div>

            </Page>

            {/* PAGE 30 */}
            <Page pageNumber={30} totalPages={totalPages} warm>

              <div className="space-y-1.5">
                <DiaryHeader date="Late Night Cuddles 2026" location="Safe & Sound" mood="Don't move a single muscle" />
                <div className="flex items-center justify-around gap-2 my-1">
                  <FlipPolaroid
                    src="/assets/her/h12.jpg"
                    caption="sleepy cuddles"
                    date="2026"
                    backNote="My arm went completely numb 20 minutes ago. Still didn't move an inch."
                    rotation={-1.5}
                    tapeColor="pink"
                    size="xs"
                  />
                  <FlipPolaroid
                    src="/assets/her/h13.jpg"
                    caption="peaceful angel"
                    date="2026"
                    backNote="The purest soul on this planet. Protected by me always."
                    rotation={2}
                    tapeColor="cream"
                    size="xs"
                  />
                </div>
                <P>
                  When you fall asleep with your head on my shoulder or arm. My arm loses all blood circulation and goes completely numb, but I refuse to move an inch because you look so peaceful.
                </P>
                <LoveCoupon
                  id="002"
                  title="100 Forehead Kisses & Head Massages"
                  benefit="To be redeemed on stressful days, tired evenings, or whenever Tannu needs unconditional pampering."
                />
                <ForeheadKissButton label="Give sleeping Tannu a forehead kiss 💋" />
              </div>

            </Page>

            {/* PAGE 31 */}
            <Page pageNumber={31} totalPages={totalPages}>

              <div className="space-y-1.5">
                <DiaryHeader date="Every Single Day 2026" location="Everywhere" mood="Noticing every little thing" />
                <ChapterHeader number="Chapter Nine" title="The Little Things" />
                <div className="flex items-center justify-around gap-2 my-1">
                  <FlipPolaroid
                    src="/assets/us/u9.jpg"
                    caption="stolen quiet moment"
                    date="2026"
                    backNote="Just holding you by the window on a random quiet afternoon."
                    rotation={-2}
                    tapeColor="gold"
                    size="xs"
                  />
                  <FlipPolaroid
                    src="/assets/us/u10.jpg"
                    caption="your smile at me"
                    date="2026"
                    backNote="You looked up at me right here and my heart melted into a puddle."
                    rotation={1.5}
                    tapeColor="pink"
                    size="xs"
                  />
                </div>
                {/* Infographic: Love in Numbers */}
                <div className="p-2 rounded-xs bg-[#fffef5] border border-amber-900/15 shadow-2xs font-handwriting text-center select-none">
                  <span className="text-[12px] uppercase text-rose-deep font-bold tracking-wider">📊 OUR LOVE IN NUMBERS</span>
                  <div className="grid grid-cols-3 gap-1 mt-1 text-[13px] text-[#2c1d18]">
                    <div className="bg-rose-50 p-1 rounded-xs"><strong className="text-rose-deep block text-sm">15th Feb</strong>Sacred Date</div>
                    <div className="bg-amber-50 p-1 rounded-xs"><strong className="text-amber-900 block text-sm">50,000+</strong>Texts Exchanged</div>
                    <div className="bg-rose-50 p-1 rounded-xs"><strong className="text-rose-deep block text-sm">0.000%</strong>Chance I'll Leave</div>
                  </div>
                </div>
                <StickyNote color="amber" rotation={-1.5} className="text-center">
                  "In a world obsessed with big things, you made me fall in love with the quiet, ordinary seconds."
                </StickyNote>
              </div>

            </Page>

            {/* PAGE 32 */}
            <Page pageNumber={32} totalPages={totalPages} warm>

              <div className="space-y-1.5">
                <DiaryHeader date="Mirror Moments 2026" location="Elevators & Hallways" mood="Holding you tight" />
                <div className="flex items-center justify-around gap-2 my-1">
                  <FlipPolaroid
                    src="/assets/us/u11.jpg"
                    caption="our elevator mirror hugs"
                    date="2026"
                    backNote="Every elevator ride is an excuse to wrap both arms around you."
                    rotation={-1.5}
                    tapeColor="cream"
                    size="xs"
                  />
                  <AutoplayFilmFrame
                    src="/assets/us/uv4.mp4"
                    poster="/assets/us/u11.jpg"
                    caption="us holding each other"
                    rotation={2}
                    size="xs"
                  />
                </div>
                <P className="font-bold text-rose-deep">
                  Every mirror is an excuse to hug you.
                </P>
                <P>
                  Every elevator mirror, hallway reflection, or fitting room mirror — I always pull you into my arms from behind, tuck my chin onto your shoulder, and snap a photo.
                </P>
                <PeelWaxSeal
                  title="What I think every time I see our reflection"
                  secret="I look at us and genuinely wonder: 'What good karma did I do in my past life to deserve a girl this precious in my arms?'"
                />
                <MarginNote color="ink" rotation={-1} className="text-right">
                  — forever wrapped around you ♡
                </MarginNote>
              </div>

            </Page>

            {/* PAGE 33 */}
            <Page pageNumber={33} totalPages={totalPages}>

              <div className="space-y-1.5">
                <DiaryHeader date="Pure Bakchodi 2026" location="Everywhere We Go" mood="Pure chaos & laughter" />
                <ChapterHeader number="Chapter Ten" title="Stupid Little Moments" />
                <div className="flex items-center justify-around gap-2 my-1">
                  <FlipPolaroid
                    src="/assets/us/u12.jpg"
                    caption="our dumb faces"
                    date="2026"
                    backNote="We literally make faces like this in fancy restaurants. Zero regrets."
                    rotation={-2}
                    tapeColor="rose"
                    size="xs"
                  />
                  <FlipPolaroid
                    src="/assets/us/u13.jpg"
                    caption="laughing uncontrollably"
                    date="2026"
                    backNote="I was laughing so hard my stomach cramped. You are the funniest person I know."
                    rotation={2}
                    tapeColor="gold"
                    size="xs"
                  />
                </div>
                <P>
                  The stupid inside jokes nobody else would ever understand. Making silly accents, mocking each other, doing random bakchodi in public where people look at us like we're insane.
                </P>
                <LoveCoupon
                  id="003"
                  title="The 'Tannu Wins The Argument' Pass"
                  benefit="Can be presented at any moment during a playful disagreement. Yash must immediately say: 'You are right, babu.'"
                />
                <StickyNote color="pink" rotation={-1} className="text-center">
                  "Life is serious enough. With you, it is pure comedy and joy."
                </StickyNote>
              </div>

            </Page>

            {/* PAGE 34 */}
            <Page pageNumber={34} totalPages={totalPages} warm>

              <div className="space-y-1.5">
                <DiaryHeader date="Road Trip Era 2026" location="In the Car" mood="Fighting for the aux cord" />
                <div className="flex items-center justify-around gap-2 my-1">
                  <AutoplayFilmFrame
                    src="/assets/us/uv5.mp4"
                    poster="/assets/us/u14.jpg"
                    caption="screaming song lyrics"
                    rotation={-1.5}
                    size="xs"
                  />
                  <FlipPolaroid
                    src="/assets/us/u14.jpg"
                    caption="stealing my fries"
                    date="2026"
                    backNote="'I don't want anything to eat' ... and then this happened."
                    rotation={2}
                    tapeColor="cream"
                    size="xs"
                  />
                </div>
                <P className="font-bold text-rose-deep">
                  'I am not hungry,' she said.
                </P>
                <P>
                  And then proceeded to eat 80% of my fries! Fighting over the aux cord, screaming romantic songs off-key at the top of our lungs with the windows down.
                </P>
                <InteractiveChecklist
                  title="Rules of our drives"
                  items={[
                    "Tannu is the resident DJ (even when songs are questionable)",
                    "My food belongs to Tannu",
                    "Tannu's food belongs strictly to Tannu",
                    "Hand-holding is mandatory on the gear shift"
                  ]}
                />
                <ForeheadKissButton label="Send a road trip kiss 💋" />
              </div>

            </Page>

            {/* PAGE 35 */}
            <Page pageNumber={35} totalPages={totalPages}>

              <div className="space-y-1.5">
                <DiaryHeader date="The Living Reel 2026" location="Our Vault" mood="100% raw & real" />
                <ChapterHeader number="Chapter 10.5" title="Us, Unfiltered" />
                <div className="flex items-center justify-around gap-2 my-1">
                  <AutoplayFilmFrame
                    src="/assets/unfiltered/unfiltered_1.mp4"
                    poster="/assets/us/u15.jpg"
                    caption="reel frame 1"
                    rotation={-1.5}
                    size="xs"
                  />
                  <AutoplayFilmFrame
                    src="/assets/unfiltered/unfiltered_2.mp4"
                    poster="/assets/us/u16.jpg"
                    caption="reel frame 2"
                    rotation={2}
                    size="xs"
                  />
                </div>
                <P>
                  These clips aren't curated for social media. These are our real, goofy, beautiful moments together.
                </P>
                <PeelWaxSeal
                  title="Why these videos are my favorite"
                  secret="Because in these videos, there is zero pretense. It is just you and me being completely goofy, safe, and happy in our own little universe."
                />
                <div className="text-center pt-1">
                  <VintageStamp text="100% RAW & UNFILTERED" rotation={-2} />
                </div>
              </div>

            </Page>

            {/* PAGE 36 */}
            <Page pageNumber={36} totalPages={totalPages} warm>

              <div className="space-y-1.5">
                <DiaryHeader date="Late Night Thoughts 2026" location="Under the Stars" mood="Vulnerable & deeply grateful" />
                <ChapterHeader number="Chapter Eleven" title="Things I Don't Say Enough" />
                <div className="flex items-center justify-around gap-2 my-1">
                  <FlipPolaroid
                    src="/assets/us/u15.jpg"
                    caption="holding your hand forever"
                    date="2026"
                    backNote="I hold your hand in public because I want the whole world to know you are mine."
                    rotation={-1.5}
                    tapeColor="gold"
                    size="xs"
                  />
                  <FlipPolaroid
                    src="/assets/us/u16.jpg"
                    caption="your warmth beside me"
                    date="2026"
                    backNote="Every time you lean your head on my shoulder, all my stress disappears."
                    rotation={2}
                    tapeColor="pink"
                    size="xs"
                  />
                </div>
                <P>
                  I know I am not always the best at expressing everything out loud, Tannu. But I want you to know how deeply proud I am of the woman you are.
                </P>
                <FoldOutNote
                  teaser="A letter of appreciation for my girl"
                  letter="You handle so much in your life with so much quiet grace. You work hard, you care for the people around you, and you have the purest, softest heart. Loving you has made me want to be the best version of myself."
                />
                <StickyNote color="pink" rotation={-1.5} className="text-center">
                  "You make this world so much softer just by being in it."
                </StickyNote>
              </div>

            </Page>

            {/* PAGE 37 */}
            <Page pageNumber={37} totalPages={totalPages}>

              <div className="space-y-1.5">
                <DiaryHeader date="When Life Gets Heavy" location="My Anchor" mood="Calmed by your touch" />
                <div className="flex items-start gap-2">
                  <FlipPolaroid
                    src="/assets/us/u17.jpg"
                    caption="my safe harbor"
                    date="2026"
                    backNote="You are my safe harbor. No matter what happens outside, here with you I am at peace."
                    rotation={-2}
                    tapeColor="cream"
                    size="xs"
                  />
                  <div className="flex-1 space-y-1">
                    <P className="font-bold text-rose-deep">
                      You are the calm in my storm.
                    </P>
                    <P>
                      Whenever my thoughts get loud, whenever anxiety hits me, all I need is for you to put your hand on my chest or hold my cheek.
                    </P>
                  </div>
                </div>
                <Quote>
                  "Your touch can silence a hurricane in my head in two seconds."
                </Quote>
                <LoveMeter caption="How much peace Tannu brings me:" />
                <ForeheadKissButton label="Send a kiss to your anchor 💋" />
              </div>

            </Page>

            {/* PAGE 38 */}
            <Page pageNumber={38} totalPages={totalPages} warm>

              <div className="space-y-1.5">
                <DiaryHeader date="Through the Storms" location="Kitchen Floor / Long Hugs" mood="Choosing each other every time" />
                <ChapterHeader number="Chapter Twelve" title="Not-So-Perfect Parts" />
                <div className="flex items-start gap-2">
                  <div className="flex-1 space-y-1">
                    <P className="font-bold text-rose-deep">
                      We are not a fairytale.
                    </P>
                    <P>
                      We have had misunderstandings. We have argued, we have cried, we have sat in painful silence.
                    </P>
                  </div>
                  <FlipPolaroid
                    src="/assets/us/u18.jpg"
                    caption="after the rain comes warmth"
                    date="2026"
                    backNote="We fought for an hour, cried, and then held each other for two hours. We are unbreakable."
                    rotation={2}
                    tapeColor="gold"
                    size="xs"
                  />
                </div>
                <P>
                  But what makes us sacred is that neither of us ever walks away. We always end up in that tight kitchen hug, whispering apologies and holding each other like our lives depend on it.
                </P>
                <InteractiveChecklist
                  title="Our non-negotiable fight rules"
                  items={[
                    "Never go to sleep without resolving it",
                    "Always hold hands even when we are mad",
                    "Apologize first because love is bigger than pride",
                    "Always choose each other at the end of the day"
                  ]}
                />
                <MarginNote color="red" rotation={-1} className="font-bold">
                  — storms don't break us, they bind us tighter ♡
                </MarginNote>
              </div>

            </Page>

            {/* PAGE 39 */}
            <Page pageNumber={39} totalPages={totalPages}>

              <div className="space-y-1.5">
                <DiaryHeader date="Future Dreams" location="Our Future Home" mood="Dreaming of forever with you" />
                <ChapterHeader number="Chapter Thirteen" title="The Life I Imagine" />
                <div className="flex items-start gap-2">
                  <div className="flex-1 space-y-1">
                    <P className="font-bold text-rose-deep">
                      When I close my eyes and imagine the future...
                    </P>
                    <P>
                      It is never just me. It is always you beside me.
                    </P>
                  </div>
                  <FlipPolaroid
                    src="/assets/us/u19.jpg"
                    caption="my forever person"
                    date="2026 & forever"
                    backNote="My future wife, my best friend, my soulmate. I see you in all my tomorrows."
                    rotation={-1.5}
                    tapeColor="pink"
                    size="xs"
                  />
                </div>
                <P>
                  A warm little apartment filled with plants, sunlight streaming through sheer curtains, waking up to your messy hair, making tea for you in the morning, and kissing your sleepy forehead.
                </P>
                <MemoryQuiz
                  question="What is the first thing we will buy for our future place?"
                  options={["A giant comfortable couch", "A cute puppy", "Plants that Tannu promises to water"]}
                  reaction="A puppy and that giant couch where we can binge-watch shows with you curled up on my chest!"
                />
                <StickyNote color="amber" rotation={1.5} className="text-center">
                  "Building a lifetime with you is the only dream I care about."
                </StickyNote>
              </div>

            </Page>

            {/* PAGE 40 */}
            <Page pageNumber={40} totalPages={totalPages} warm>

              <div className="space-y-1.5">
                <DiaryHeader date="Bucket List" location="Santorini & Mountains" mood="Counting the sunsets we'll see" />
                <div className="flex items-center justify-around gap-2 my-1">
                  <AutoplayFilmFrame
                    src="/assets/unfiltered/unfiltered_5.mp4"
                    poster="/assets/us/u17.jpg"
                    caption="travel memories 1"
                    rotation={-1.5}
                    size="xs"
                  />
                  <AutoplayFilmFrame
                    src="/assets/unfiltered/unfiltered_6.mp4"
                    poster="/assets/us/u18.jpg"
                    caption="travel memories 2"
                    rotation={2}
                    size="xs"
                  />
                </div>
                <P className="font-bold text-rose-deep">
                  We are going to see the world together.
                </P>
                <P>
                  Standing on the cliffs of Santorini watching the sun melt into the Mediterranean. Clumsily dancing together in our kitchen while dinner burns on the stove.
                </P>
                <FoldOutNote
                  teaser="A promise for all our tomorrows"
                  letter="I promise to show you all the places you've dreamed of visiting. We will collect sunsets across the world, hand in hand, step by step."
                />
                <VintageStamp text="FOREVER COMMITTED" rotation={-2} />
              </div>

            </Page>

            {/* PAGE 41 */}
            <Page pageNumber={41} totalPages={totalPages}>

              <div className="space-y-1.5">
                <DiaryHeader date="A Thousand Lifetimes" location="The Cosmos" mood="In every universe, it's you" />
                <ChapterHeader number="Chapter Fourteen" title="If I Could Go Back" />
                <div className="flex items-center justify-around gap-2 my-1">
                  <AutoplayFilmFrame
                    src="/assets/unfiltered/unfiltered_9.mp4"
                    poster="/assets/us/u19.jpg"
                    caption="timeless us 1"
                    rotation={-2}
                    size="xs"
                  />
                  <AutoplayFilmFrame
                    src="/assets/unfiltered/unfiltered_10.mp4"
                    poster="/assets/her/h1.jpg"
                    caption="timeless us 2"
                    rotation={1.5}
                    size="xs"
                  />
                </div>
                <P>
                  If someone gave me a time machine and allowed me to live a thousand different lives in a thousand different realities...
                </P>
                <Quote>
                  "I would search for you in every single universe, and I would choose you every single time."
                </Quote>
                <GoldenScratchCard
                  prompt="Tap to scratch the eternal promise ticket ✨"
                  hiddenMessage="In every lifetime, in every universe, I would find you faster, hold you sooner, and love you even deeper than I do today."
                />
                <ForeheadKissButton label="Send a lifetime kiss 💋" />
              </div>

            </Page>

            {/* PAGE 42 */}
            <Page pageNumber={42} totalPages={totalPages} warm>

              <div className="space-y-1.5">
                <DiaryHeader date="2026: Full Circle" location="Present Day" mood="Completely transformed by love" />
                <ChapterHeader number="Chapter Fifteen" title="The Boy After You" />
                <div className="flex items-center justify-around gap-2 my-1">
                  <FlipPolaroid
                    src="/assets/yash/yash_before.jpg"
                    caption="2024: the lonely boy before"
                    date="pre-2025"
                    backNote="The boy who thought he was too cool to feel anything."
                    rotation={-2}
                    tapeColor="gold"
                    size="xs"
                  />
                  <FlipPolaroid
                    src="/assets/us/u19.jpg"
                    caption="2026: the boy you softened"
                    date="2026"
                    backNote="The boy whose entire happiness resides in your smile."
                    rotation={2}
                    tapeColor="pink"
                    size="xs"
                  />
                </div>
                <P>
                  Look at the boy on Page 3 and look at the boy sitting here today writing this for you.
                </P>
                <P>
                  The careless, selfish boy is gone. You taught me how to care, how to feel, how to be patient, and how to love with everything I have.
                </P>
                <InteractiveChecklist
                  title="What Tannu did to Yash"
                  items={[
                    "Taught him what home feels like",
                    "Softened every sharp edge of his heart",
                    "Made him believe in true soulmates",
                    "Became the center of his entire universe"
                  ]}
                />
                <StickyNote color="pink" rotation={-1.5} className="text-center font-bold">
                  "I am who I am today because you loved me."
                </StickyNote>
              </div>

            </Page>

            {/* PAGE 43 */}
            <Page pageNumber={43} totalPages={totalPages}>

              <div className="space-y-1.5 text-center">
                <DiaryHeader date="TODAY" location="Our Sacred Space" mood="Celebrating my favorite human" />
                <span className="font-handwriting text-[13px] uppercase text-rose-deep font-bold tracking-widest">CHAPTER FINALE</span>
                <h3 className="font-handwriting text-3xl font-bold text-rose-deep drop-shadow-xs">Happy Birthday, My Tannu ♡</h3>
                <div className="w-16 h-0.5 bg-amber-900/20 mx-auto my-0.5" />
                <P className="italic text-[#2c1d18]">
                  Happy Birthday to the girl who holds my entire world in her hands. Today is about celebrating the day the universe gave me my greatest blessing.
                </P>

                {/* Interactive Candle Blowing Cake */}
                <InteractiveBirthdayCake onOpenLetter={onOpenLetter} />

                <ForeheadKissButton label="Send 100 Birthday Forehead Kisses 💋" />
              </div>

            </Page>

            {/* PAGE 44 */}
            <Page pageNumber={44} totalPages={totalPages} warm>

              <div className="h-full flex flex-col justify-between items-center text-center py-2">
                <DiaryHeader date="Forever and Always" location="Our Journey" mood="Just the beginning" />
                <div className="my-auto space-y-2 max-w-[270px]">
                  <div className="w-12 h-12 rounded-full border-2 border-rose-deep/40 flex items-center justify-center mx-auto text-xl shadow-xs">
                    💌
                  </div>
                  <div className="font-handwriting text-2xl font-bold text-rose-deep">
                    The End of This Diary.
                  </div>
                  <div className="font-handwriting text-xl text-[#3d2721] font-semibold">
                    The Beginning of Our Forever.
                  </div>
                  <P className="italic text-sm text-[#4a2e25]">
                    "I love you, Tanisha Jha. More than yesterday, and less than tomorrow."
                  </P>
                  <VintageStamp text="YASH ♡ TANNU • TO INFINITY" rotation={-2} />
                </div>
                <div className="space-y-1 w-full max-w-[250px]">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCloseDiary();
                    }}
                    className="w-full py-1.5 px-3 rounded-full bg-amber-900/10 hover:bg-amber-900/20 active:scale-95 text-[#3d2721] font-handwriting text-sm font-bold border border-amber-900/20 shadow-2xs cursor-pointer transition-all"
                  >
                    Close Diary ♡ (Keep in my heart)
                  </button>
                </div>
              </div>

            </Page>

          </HTMLFlipBook>
        </div>

        {/* Bottom Quick Bar */}
        <div className="mt-3 flex items-center justify-between w-full max-w-lg px-4 text-xs font-handwriting text-amber-900/60">
          <button onClick={handleCloseDiary} className="hover:text-rose-deep transition-colors cursor-pointer flex items-center gap-1 font-bold">
            <span>✖</span> Close Diary
          </button>
          <button onClick={onOpenLetter} className="hover:text-rose-deep transition-colors cursor-pointer flex items-center gap-1 font-bold">
            <span>💌</span> Birthday Letter
          </button>
        </div>

        {/* Us Unfiltered Continuous Stories Modal */}
        <UnfilteredFilmModal isOpen={isFilmModalOpen} onClose={() => setIsFilmModalOpen(false)} />
      </div>
    </FlipContext.Provider>
  );
};
