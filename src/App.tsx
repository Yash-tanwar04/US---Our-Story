import { useState } from 'react';
import { ClosedCover } from './components/ClosedCover';
import { DiaryBook } from './components/DiaryBook';
import { FloatingPetals } from './components/FloatingPetals';
import { AudioToggle } from './components/AudioToggle';
import { CustomizerModal } from './components/CustomizerModal';
import type { CustomDiaryData } from './components/CustomizerModal';
import { LoveLetterModal } from './components/LoveLetterModal';
import { FullScreenReactionOverlay } from './components/FullScreenReaction';

const DEFAULT_DATA: CustomDiaryData = {
  girlName: "Tannu",
  diaryTitle: "US ♡",
  diarySubTitle: "my story, her story and our story",
  firstMetDate: "22 May 2025",
  favMemory: "The auto ride where we kissed for the first time",
};

export function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [customData, setCustomData] = useState<CustomDiaryData>(DEFAULT_DATA);
  const [isLetterOpen, setIsLetterOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#fcedf2] text-ink-dark relative overflow-x-hidden font-handwriting">
      {/* Ambient Floating Flower Petals */}
      <FloatingPetals />

      {/* Floating Sound Control (🔊 / 🔇) */}
      <AudioToggle />

      {/* Global Full-Screen Emoji Reaction Overlay */}
      <FullScreenReactionOverlay />

      {/* Discreet Personalization Settings Panel */}
      <CustomizerModal
        data={customData}
        onSave={(newData) => setCustomData(newData)}
        onReset={() => setCustomData(DEFAULT_DATA)}
      />

      {/* Main Experience: Closed Cover vs Open Diary Book */}
      {!isOpen ? (
        <ClosedCover
          title={customData.diaryTitle}
          subTitle={customData.diarySubTitle}
          onOpen={() => setIsOpen(true)}
        />
      ) : (
        <main className="relative z-10 w-full animate-fadeIn min-h-screen flex flex-col items-center justify-start sm:justify-center">
          <DiaryBook
            customData={customData}
            onOpenLetter={() => setIsLetterOpen(true)}
          />
        </main>
      )}

      {/* Birthday Letter Envelope Modal */}
      <LoveLetterModal
        girlName={customData.girlName}
        isOpen={isLetterOpen}
        onClose={() => setIsLetterOpen(false)}
      />
    </div>
  );
}

export default App;
