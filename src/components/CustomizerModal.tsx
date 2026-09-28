import React, { useState } from 'react';
import { Settings, X, Save, RotateCcw } from 'lucide-react';

export interface CustomDiaryData {
  girlName: string;
  diaryTitle: string;
  diarySubTitle: string;
  firstMetDate: string;
  favMemory: string;
}

interface CustomizerModalProps {
  data: CustomDiaryData;
  onSave: (newData: CustomDiaryData) => void;
  onReset: () => void;
}

export const CustomizerModal: React.FC<CustomizerModalProps> = ({
  data,
  onSave,
  onReset,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<CustomDiaryData>(data);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Discreet Settings Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 z-40 bg-paper-ivory/80 hover:bg-white text-ink-muted hover:text-ink-dark border border-rose-dust/30 p-2.5 rounded-full shadow-md backdrop-blur-sm transition-all duration-300 hover:scale-110 opacity-70 hover:opacity-100"
        title="Personalize Diary Content"
      >
        <Settings className="w-5 h-5" />
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative max-w-md w-full bg-paper-ivory p-6 rounded-lg shadow-2xl border-2 border-rose-dust/30 text-ink-dark">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 text-ink-muted hover:text-ink-dark"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-title text-2xl text-rose-deep font-semibold mb-4 text-center">
              Personalize Our Love Story
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 font-sans text-sm">
              <div>
                <label className="block text-xs font-semibold text-ink-muted mb-1">
                  Girlfriend's Name / Nickname
                </label>
                <input
                  type="text"
                  value={formData.girlName}
                  onChange={(e) => setFormData({ ...formData, girlName: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-rose-dust/30 rounded focus:outline-none focus:ring-1 focus:ring-rose-deep"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-muted mb-1">
                  Diary Cover Title
                </label>
                <input
                  type="text"
                  value={formData.diaryTitle}
                  onChange={(e) => setFormData({ ...formData, diaryTitle: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-rose-dust/30 rounded focus:outline-none focus:ring-1 focus:ring-rose-deep"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-muted mb-1">
                  Diary Subtitle
                </label>
                <input
                  type="text"
                  value={formData.diarySubTitle}
                  onChange={(e) => setFormData({ ...formData, diarySubTitle: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-rose-dust/30 rounded focus:outline-none focus:ring-1 focus:ring-rose-deep"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-muted mb-1">
                  Special Anniversary / First Met Date
                </label>
                <input
                  type="text"
                  value={formData.firstMetDate}
                  onChange={(e) => setFormData({ ...formData, firstMetDate: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-rose-dust/30 rounded focus:outline-none focus:ring-1 focus:ring-rose-deep"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-rose-deep hover:bg-rose-700 text-white py-2 rounded font-medium flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Save className="w-4 h-4" /> Save Diary
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onReset();
                    setIsOpen(false);
                  }}
                  className="px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded font-medium flex items-center justify-center gap-1 transition-colors"
                  title="Reset to Default Story"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
