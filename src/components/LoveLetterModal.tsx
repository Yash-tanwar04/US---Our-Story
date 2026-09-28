import React, { useState } from 'react';
import { Heart, X, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEngine } from '../utils/audio';

interface LoveLetterModalProps {
  girlName?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const LoveLetterModal: React.FC<LoveLetterModalProps> = ({
  girlName = "Tannu",
  isOpen,
  onClose,
}) => {
  const [isOpenedLetter, setIsOpenedLetter] = useState(false);

  if (!isOpen) return null;

  const handleOpenEnvelope = () => {
    setIsOpenedLetter(true);
    soundEngine.playSpecialChime();
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#f8bbd0', '#d81b60', '#ad1457', '#ffd54f', '#ffffff']
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div className="relative max-w-lg w-full bg-paper-ivory rounded-lg p-5 sm:p-8 shadow-2xl border-2 border-rose-dust/35 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-ink-muted hover:text-ink-dark p-1.5 rounded-full hover:bg-rose-100/50 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!isOpenedLetter ? (
          <div className="text-center py-6">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-rose-100/90 flex items-center justify-center text-rose-deep shadow-inner animate-pulse">
              <Heart className="w-10 h-10 fill-current" />
            </div>
            <h3 className="font-title text-3xl sm:text-4xl text-rose-deep font-bold mb-2">
              A Letter For You, Tannu
            </h3>
            <p className="font-handwriting text-xl text-ink-muted mb-6">
              "To the girl who taught a selfish boy how to love..."
            </p>
            <button
              onClick={handleOpenEnvelope}
              className="px-6 py-3 bg-[#8b263e] hover:bg-[#6e1e30] text-white rounded-full font-handwriting text-2xl shadow-lg transition-transform hover:scale-105 active:scale-95 flex items-center gap-2 mx-auto"
            >
              <Sparkles className="w-5 h-5" /> Open Letter ♡
            </button>
          </div>
        ) : (
          <div className="space-y-4 font-handwriting text-ink-dark text-lg sm:text-xl leading-relaxed">
            <div className="text-center pb-2 border-b border-rose-dust/20">
              <span className="font-title text-2xl sm:text-3xl text-rose-deep font-semibold">
                Happy Birthday, {girlName}! ♡
              </span>
            </div>
            <p>
              Happy Birthday to the most precious, kindest, and most special person in my whole life.
            </p>
            <p>
              When I look back at where we started — two strangers on Schmooze, awkward dry replies on Instagram, two months of absolute silence, and then that one comedy club story reply — I realize how lucky I am. If I had missed that story, I would have missed the best thing that ever happened to me.
            </p>
            <p>
              Thank you for being you. Thank you for your pouts, your 11:11 wishes, your love for pastels and capsicum, and even your silly teasing when you go <em>"m ghewar ni khaata vo to meetho ki mithai h"</em> just to get on my nerves.
            </p>
            <p>
              You gave the homesick, insecure boy who cried at night in hostel a safe place to breathe. You taught me that vulnerability isn't weakness.
            </p>
            <p className="text-rose-deep font-bold text-2xl text-center py-2">
              "We're going to Santorini, I promise. And this is just volume one."
            </p>
            <p>
              I love you more than words, more than this diary, more than anything.
            </p>
            <div className="text-right pt-3 font-script text-3xl text-rose-deep">
              Forever yours,<br />
              Yash ♡
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
