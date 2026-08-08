import React, { useState } from 'react';
import { useSadhana } from '../context/JapaContext';
import { RotateCcw, Plus, Check, MessageSquare, Mic, MicOff, Sun, Moon, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TimeOfDay } from '../types';

export const QuickAddButtons: React.FC = () => {
  const { addChantSession, undoLastSession, lastAddedEntry, selectedSadhana } = useSadhana();
  const [customValue, setCustomValue] = useState<string>('');
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('Morning');
  const [note, setNote] = useState<string>('');
  const [showNoteInput, setShowNoteInput] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const QUICK_BUTTONS = [
    { label: '+1', count: 1 },
    { label: '+3', count: 3 },
    { label: '+9', count: 9 },
    { label: '+11', count: 11 },
    { label: '+27', count: 27 },
    { label: '+54', count: 54 },
    { label: '+108 (1 Mala)', count: 108, isPopular: true },
    { label: '+216 (2 Mala)', count: 216, isPopular: true },
    { label: '+1008 (10 Mala)', count: 1008, isPopular: true }
  ];

  const handleQuickAdd = (count: number) => {
    addChantSession(count, selectedSadhana?.id, timeOfDay, note || undefined);
    showToast(`Added +${count} ${selectedSadhana?.name || 'Chants'} (${timeOfDay})!`);
    setNote('');
    setShowNoteInput(false);
  };

  const handleCustomAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(customValue, 10);
    if (!isNaN(val) && val > 0) {
      addChantSession(val, selectedSadhana?.id, timeOfDay, note || undefined);
      showToast(`Added +${val} ${selectedSadhana?.name || 'Chants'}!`);
      setCustomValue('');
      setNote('');
      setShowNoteInput(false);
    }
  };

  const handleUndo = () => {
    if (lastAddedEntry) {
      const count = lastAddedEntry.count;
      const success = undoLastSession();
      if (success) {
        showToast(`Undone last +${count} session entry.`);
      }
    }
  };

  // Optional Voice Input helper using Web Speech Recognition API if supported
  const toggleVoiceInput = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition =
      (window as unknown as { SpeechRecognition: unknown }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition: unknown }).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      showToast('Voice input is not supported in this browser.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const recognition = new (SpeechRecognition as any)();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        showToast('Listening... Speak a number (e.g. "108")');
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        const numberMatch = transcript.match(/\d+/);
        if (numberMatch) {
          const num = parseInt(numberMatch[0], 10);
          if (num > 0) {
            handleQuickAdd(num);
          }
        } else {
          showToast(`Heard "${transcript}". Please say a count number.`);
        }
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
        showToast('Voice recognition ended.');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
      showToast('Could not start voice recognition.');
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="relative glass-card p-5 border border-amber-200/60 dark:border-amber-900/40 shadow-xl">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute top-2 left-1/2 -translate-x-1/2 z-20 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-600 to-orange-600 text-white text-xs font-bold shadow-lg flex items-center gap-1.5 pointer-events-none"
          >
            <Check className="w-3.5 h-3.5 text-white" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold font-marcellus text-amber-950 dark:text-amber-100 flex items-center gap-2">
          <span>📿</span> Log Chant Session
        </h2>

        {/* Undo Button */}
        {lastAddedEntry && (
          <button
            onClick={handleUndo}
            className="flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-marcellus font-bold text-amber-900 dark:text-amber-200 bg-amber-200/80 dark:bg-amber-950/80 hover:bg-amber-300/80 border border-amber-300/60 dark:border-amber-800 transition-colors"
            title={`Undo last session of +${lastAddedEntry.count}`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Undo (+{lastAddedEntry.count})</span>
          </button>
        )}
      </div>

      {/* Session Time of Day Switcher */}
      <div className="mb-4 flex items-center gap-1 bg-amber-100/70 dark:bg-stone-900/90 p-1.5 rounded-xl border border-amber-300/60 dark:border-amber-800/60">
        {(['Morning', 'Afternoon', 'Evening', 'Night'] as TimeOfDay[]).map(tod => {
          const isActive = timeOfDay === tod;
          return (
            <button
              key={tod}
              type="button"
              onClick={() => setTimeOfDay(tod)}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-marcellus font-bold flex items-center justify-center gap-1 transition-all ${
                isActive
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-stone-700 dark:text-stone-300 hover:text-amber-900'
              }`}
            >
              {tod === 'Morning' && <Sun className="w-3.5 h-3.5" />}
              {tod === 'Afternoon' && <Clock className="w-3.5 h-3.5" />}
              {tod === 'Evening' && <Sun className="w-3.5 h-3.5 opacity-70" />}
              {tod === 'Night' && <Moon className="w-3.5 h-3.5" />}
              <span>{tod}</span>
            </button>
          );
        })}
      </div>

      {/* Preset Quick Buttons Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-3 gap-2.5 mb-4">
        {QUICK_BUTTONS.map(btn => (
          <button
            key={btn.label}
            type="button"
            onClick={() => handleQuickAdd(btn.count)}
            className={`py-2.5 px-3 text-xs sm:text-sm font-marcellus font-bold rounded-xl transition-all border ${
              btn.isPopular
                ? 'bg-gradient-to-r from-amber-600 via-orange-600 to-amber-500 hover:from-amber-700 hover:to-orange-700 text-white border-amber-400/40 shadow-xs active:scale-95'
                : 'bg-amber-50/90 dark:bg-stone-900/90 hover:bg-amber-100 dark:hover:bg-amber-950/80 text-amber-950 dark:text-amber-100 border-amber-300/60 dark:border-stone-800 active:scale-95'
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Note Input Toggle */}
      <div className="mb-3">
        {!showNoteInput ? (
          <button
            type="button"
            onClick={() => setShowNoteInput(true)}
            className="text-xs text-amber-800 dark:text-amber-300 hover:underline flex items-center gap-1 font-semibold"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>+ Add Session Note (e.g. Temple, Sunset Mala, Focus)</span>
          </button>
        ) : (
          <input
            type="text"
            placeholder="Add note (optional: Temple, Focus, Sunset Japa...)"
            value={note}
            onChange={e => setNote(e.target.value)}
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-amber-200 dark:border-amber-800 bg-white/80 dark:bg-stone-800 text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        )}
      </div>

      {/* Custom Count Form with Voice Option */}
      <form onSubmit={handleCustomAdd} className="flex gap-2">
        <input
          type="number"
          min="1"
          placeholder="Custom Count..."
          value={customValue}
          onChange={e => setCustomValue(e.target.value)}
          className="flex-1 px-4 py-2.5 text-sm rounded-2xl border border-amber-200 dark:border-amber-800 bg-white/90 dark:bg-stone-800 text-stone-800 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
        />

        {/* Voice Input Button */}
        <button
          type="button"
          onClick={toggleVoiceInput}
          title="Voice Input Count"
          className={`px-3 py-2.5 rounded-2xl border transition-all flex items-center justify-center ${
            isListening
              ? 'bg-rose-500 text-white border-rose-600 animate-pulse'
              : 'bg-amber-100/80 dark:bg-stone-800 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-stone-700 hover:bg-amber-200'
          }`}
        >
          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>

        <button
          type="submit"
          className="btn-saffron px-5 py-2.5 text-sm font-bold rounded-2xl flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add</span>
        </button>
      </form>
    </div>
  );
};
