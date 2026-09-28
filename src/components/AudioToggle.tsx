import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause, SkipForward, Disc } from 'lucide-react';
import { soundEngine } from '../utils/audio';

export const AudioToggle: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(soundEngine.getIsPlaying());
  const [isMuted, setIsMuted] = useState(soundEngine.getIsMuted());
  const [track, setTrack] = useState(soundEngine.getCurrentTrack());
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const unsub = soundEngine.subscribe(() => {
      setIsPlaying(soundEngine.getIsPlaying());
      setIsMuted(soundEngine.getIsMuted());
      setTrack(soundEngine.getCurrentTrack());
    });
    return unsub;
  }, []);

  const handleTogglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundEngine.togglePlay();
  };

  const handleNextTrack = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundEngine.nextTrack();
  };

  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundEngine.setMuted(!isMuted);
  };

  return (
    <div className="fixed top-3 right-3 sm:top-4 sm:right-4 z-40 flex items-center">
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 bg-paper-ivory/95 hover:bg-white text-ink-dark border border-amber-900/15 py-1.5 px-3 rounded-full shadow-lg backdrop-blur-md transition-all duration-300 cursor-pointer"
      >
        {/* Spinning Vinyl Icon */}
        <div className={`text-rose-deep ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }}>
          <Disc className="w-5 h-5 text-[#8b263e]" />
        </div>

        {/* Track Title */}
        <div className="text-left font-serif text-[11px] sm:text-xs max-w-[130px] sm:max-w-[170px] truncate leading-tight">
          <p className="font-semibold text-ink-dark truncate">{track.title}</p>
          <p className="text-[10px] text-ink-muted truncate italic">{track.artist}</p>
        </div>

        {/* Play/Pause Button */}
        <button
          onClick={handleTogglePlay}
          className="p-1 rounded-full hover:bg-rose-100/60 text-[#8b263e] transition-colors"
          title={isPlaying ? "Pause Song" : "Play Song"}
        >
          {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
        </button>

        {/* Next Track */}
        <button
          onClick={handleNextTrack}
          className="p-1 rounded-full hover:bg-rose-100/60 text-ink-muted hover:text-ink-dark transition-colors"
          title="Next Song"
        >
          <SkipForward className="w-3.5 h-3.5" />
        </button>

        {/* Mute Button */}
        <button
          onClick={handleToggleMute}
          className="p-1 rounded-full hover:bg-rose-100/60 text-ink-muted hover:text-ink-dark transition-colors"
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5 text-ink-faded" /> : <Volume2 className="w-3.5 h-3.5 text-rose-deep" />}
        </button>
      </div>
    </div>
  );
};
