import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';
import { RealVoiceNotePlayer } from './RealVoiceNotePlayer';

interface VoiceNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPart?: 1 | 2;
}

export const VoiceNoteModal: React.FC<VoiceNoteModalProps> = ({
  isOpen,
  onClose,
  initialPart = 1,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 bg-[#12080d]/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
        >
          <motion.div
            initial={{ scale: 0.92, y: 15 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.92, y: 15 }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-md w-full bg-[#fdf7ee] border-2 border-rose-300 rounded-lg shadow-2xl p-3 sm:p-5 text-[#2d1810] my-auto"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-3 right-3 p-1 rounded-full text-amber-900/60 hover:text-rose-deep hover:bg-rose-100/50 transition-colors cursor-pointer"
              title="Close Player"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Title */}
            <div className="text-center mb-3 pr-6">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-deep font-handwriting text-xs font-bold uppercase tracking-wider mb-1">
                <Sparkles className="w-3 h-3 text-rose-500" />
                <span>Yash's Spoken Voice Message</span>
              </span>
              <h3 className="font-handwriting text-2xl font-bold text-rose-deep">
                Straight from My Heart ♡
              </h3>
              <p className="font-handwriting text-xs text-amber-900/70 italic mt-0.5">
                "I couldn't put everything into written words, so I sat down and recorded this for you..."
              </p>
            </div>

            {/* Embedded Player */}
            <RealVoiceNotePlayer initialPart={initialPart} />

            {/* Footer reassurance */}
            <div className="mt-3 text-center">
              <button
                type="button"
                onClick={onClose}
                className="py-1 px-4 rounded-full bg-amber-900/10 hover:bg-amber-900/20 text-[#3d2721] font-handwriting text-xs font-bold transition-all cursor-pointer"
              >
                Close & Continue Diary 📖
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
