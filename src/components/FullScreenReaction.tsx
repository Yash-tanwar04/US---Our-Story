import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { reactionListeners, type ReactionPayload } from '../utils/reactions';

export const FullScreenReactionOverlay: React.FC = () => {
  const [current, setCurrent] = useState<ReactionPayload | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = (payload: ReactionPayload) => {
      setCurrent(payload);
      setVisible(true);

      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(() => setCurrent(null), 300);
      }, 1300);

      return () => clearTimeout(timer);
    };

    reactionListeners.add(handler);
    return () => {
      reactionListeners.delete(handler);
    };
  }, []);

  if (!current || typeof document === 'undefined') return null;

  const defaultParticles = [current.emoji, '💖', '✨', '💕', current.emoji, '🌸', '✨'];
  const particleList = current.particles || defaultParticles;

  return createPortal(
    <div
      className={`fixed inset-0 z-[999999] pointer-events-none flex flex-col items-center justify-center transition-opacity duration-300 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        background: 'radial-gradient(circle at center, rgba(139,38,62,0.35) 0%, rgba(0,0,0,0.65) 100%)',
        backdropFilter: 'blur(3px)',
      }}
    >
      {/* Floating radial particles around center */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particleList.map((p, idx) => {
          const angle = (idx / particleList.length) * 360;
          const dist = 110 + (idx % 3) * 45;
          const rad = (angle * Math.PI) / 180;
          const x = Math.cos(rad) * dist;
          const y = Math.sin(rad) * dist;

          return (
            <div
              key={idx}
              className="absolute left-1/2 top-1/2 text-3xl sm:text-4xl animate-ping"
              style={{
                transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                animationDuration: `${0.8 + (idx % 3) * 0.3}s`,
                animationIterationCount: 'infinite',
              }}
            >
              {p}
            </div>
          );
        })}
      </div>

      {/* Main Massive Pop Center Emoji */}
      <div className="relative flex flex-col items-center justify-center text-center px-4">
        {/* Giant Pulsing Emoji covering full phone center */}
        <div
          className="text-9xl sm:text-[140px] filter drop-shadow-[0_12px_30px_rgba(255,80,140,0.85)] animate-pop-scale select-none"
        >
          {current.emoji}
        </div>

        {/* Floating Heart Bubbles */}
        <div className="flex gap-2 my-2 text-2xl animate-pulse">
          <span>✨</span>
          <span>💖</span>
          <span>✨</span>
        </div>

        {/* Message Banner */}
        <div className="bg-[#fff9ed]/95 border-2 border-rose-400 text-ink-dark px-5 py-2.5 rounded-2xl shadow-2xl max-w-[85vw] backdrop-blur-md transform scale-105">
          <h2 className="font-handwriting text-2xl sm:text-3xl font-bold text-rose-deep leading-tight">
            {current.title}
          </h2>
          {current.subtitle && (
            <p className="font-handwriting text-base sm:text-lg text-amber-950/85 italic mt-0.5 leading-snug">
              {current.subtitle}
            </p>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};
