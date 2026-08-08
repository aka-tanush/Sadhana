import React, { useState } from 'react';
import { GAYATRI_QUOTES, getTodayQuote } from '../data/quotes';
import { Sparkles, Quote, BookOpen, Copy, Check } from 'lucide-react';
import { RippleButton } from '../components/RippleButton';

export const DailyInspirationPage: React.FC = () => {
  const todayQuote = getTodayQuote();
  const [selectedQuote, setSelectedQuote] = useState(todayQuote);
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = () => {
    const textToCopy = `${selectedQuote.sanskrit}\n\n${selectedQuote.transliteration}\n\n"${selectedQuote.englishMeaning}"\n— ${selectedQuote.source}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 pb-20 sm:pb-8">
      {/* Featured Quote Banner */}
      <div className="relative bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 text-white rounded-3xl p-6 sm:p-10 shadow-xl overflow-hidden">
        <div className="absolute top-2 right-4 text-9xl font-serif opacity-15 pointer-events-none select-none">
          🕉️
        </div>

        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span>Daily Gayatri Wisdom</span>
          </div>

          {/* Sanskrit Devanagari */}
          <h2 className="text-2xl sm:text-3xl font-extrabold font-serif leading-relaxed text-amber-50 drop-shadow-sm">
            {selectedQuote.sanskrit}
          </h2>

          {/* Transliteration */}
          <p className="text-sm sm:text-base font-medium italic text-amber-100/90 tracking-wide font-sans">
            {selectedQuote.transliteration}
          </p>

          <div className="pt-2 border-t border-white/20">
            <p className="text-base sm:text-lg font-bold text-white leading-relaxed">
              "{selectedQuote.englishMeaning}"
            </p>
            <p className="text-xs text-amber-200 mt-1 font-semibold">
              — Source: {selectedQuote.source}
            </p>
          </div>

          {/* Spiritual Reflection */}
          <div className="p-4 rounded-2xl bg-black/20 backdrop-blur-md border border-white/10 text-xs sm:text-sm text-amber-100 leading-relaxed">
            <span className="font-bold text-yellow-300 block mb-1">
              Sadhana Reflection:
            </span>
            {selectedQuote.reflection}
          </div>

          <div className="flex justify-end pt-2">
            <RippleButton
              variant="gold"
              onClick={handleCopy}
              className="py-2 px-4 text-xs font-bold"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-amber-900" />
                  <span>Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-amber-900" />
                  <span>Share Wisdom</span>
                </>
              )}
            </RippleButton>
          </div>
        </div>
      </div>

      {/* Collection of Gayatri Wisdom Verses */}
      <div className="bg-white/80 dark:bg-stone-900/80 rounded-3xl p-5 border border-amber-200/60 dark:border-amber-900/40 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-amber-950 dark:text-amber-100 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-amber-600" />
          <span>Sacred Gayatri Verses Collection</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {GAYATRI_QUOTES.map(quote => {
            const isSelected = selectedQuote.id === quote.id;

            return (
              <div
                key={quote.id}
                onClick={() => setSelectedQuote(quote)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-100/80 dark:bg-amber-950/80 border-amber-500 font-medium shadow-md'
                    : 'bg-stone-50 dark:bg-stone-800/60 border-amber-200/50 dark:border-amber-800/40 hover:bg-amber-50 dark:hover:bg-amber-950/40'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-xs font-bold text-amber-800 dark:text-amber-300">
                    {quote.source}
                  </span>
                  {isSelected && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-white">
                      Active
                    </span>
                  )}
                </div>
                <p className="text-sm font-serif font-bold text-stone-800 dark:text-stone-200 line-clamp-2">
                  {quote.sanskrit}
                </p>
                <p className="text-xs text-stone-600 dark:text-stone-400 mt-1 line-clamp-2">
                  "{quote.englishMeaning}"
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
