import React, { useState } from 'react';
import { useSadhana } from '../context/JapaContext';
import { BookOpen, CheckCircle, Circle, RotateCcw, Sparkles, Bookmark } from 'lucide-react';

export const ParayanaPage: React.FC = () => {
  const { parayanaBooks, toggleParayanaUnit, resetParayanaBook } = useSadhana();
  const [selectedBookId, setSelectedBookId] = useState<string>(parayanaBooks[0]?.id || 'gita-18');

  const selectedBook = parayanaBooks.find(b => b.id === selectedBookId) || parayanaBooks[0];

  if (!selectedBook) return null;

  const completedUnitsCount = selectedBook.units.filter(u => u.isCompleted).length;
  const percentage = Math.min(100, (completedUnitsCount / selectedBook.totalUnits) * 100);

  const nextUnitToRead = selectedBook.units.find(u => !u.isCompleted) || selectedBook.units[0];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="glass-card p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-amber-300/70 dark:border-amber-900/50 shadow-xs">
        <div>
          <div className="inline-block px-3 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-950 dark:text-amber-200 text-xs font-marcellus font-bold mb-1.5 border border-amber-300/60">
            📖 Sacred Parayana Recitation
          </div>
          <h2 className="text-2xl font-bold font-rozha text-amber-950 dark:text-amber-100 flex items-center gap-2 tracking-wide">
            <BookOpen className="w-6 h-6 text-amber-600" />
            <span>Parayana Tracker</span>
          </h2>
          <p className="text-xs text-stone-600 dark:text-stone-300 max-w-xl mt-1">
            Track your chapter-by-chapter reading and recitation of sacred scriptures like Bhagavad Gita, Ramayana, Durga Saptashati, and Bhagavatam.
          </p>
        </div>

        {/* Book Selector Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar max-w-full">
          {parayanaBooks.map(book => (
            <button
              key={book.id}
              onClick={() => setSelectedBookId(book.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-marcellus font-bold whitespace-nowrap transition-all border ${
                selectedBookId === book.id
                  ? 'bg-amber-800 text-white border-amber-800 shadow-sm'
                  : 'bg-amber-50/80 dark:bg-stone-900/80 text-stone-700 dark:text-stone-300 border-amber-300/60 dark:border-stone-800 hover:bg-amber-100'
              }`}
            >
              {book.title}
            </button>
          ))}
        </div>
      </div>

      {/* Scripture Overview Card */}
      <div className="glass-card p-6 border-2 border-amber-200/80 dark:border-amber-900/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-4 border-b border-amber-200/40">
          <div>
            <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-amber-500 text-white">
              {selectedBook.unitType} Parayana
            </span>
            <h3 className="text-2xl font-bold font-cinzel text-amber-950 dark:text-amber-100 mt-1">
              {selectedBook.title}
            </h3>
            {selectedBook.sanskritTitle && (
              <p className="text-sm font-devanagari text-amber-800 dark:text-amber-300">
                {selectedBook.sanskritTitle}
              </p>
            )}
            <p className="text-xs text-stone-600 dark:text-stone-400 mt-2">
              {selectedBook.description}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => resetParayanaBook(selectedBook.id)}
              className="p-2.5 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-300 text-xs font-bold hover:bg-stone-100 flex items-center gap-1"
              title="Reset Parayana Cycle"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Progress</span>
            </button>
          </div>
        </div>

        {/* Next Up / Resume Reading Card */}
        {nextUnitToRead && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-300/50 dark:bg-amber-950/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500 text-white shrink-0">
                <Bookmark className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider font-bold text-amber-800 dark:text-amber-300">
                  Next Reading Bookmark
                </p>
                <p className="text-sm font-bold text-amber-950 dark:text-amber-100">
                  {nextUnitToRead.title}
                </p>
                {nextUnitToRead.subTitle && (
                  <p className="text-xs text-stone-600 dark:text-stone-400">
                    {nextUnitToRead.subTitle}
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={() => toggleParayanaUnit(selectedBook.id, nextUnitToRead.number)}
              className="btn-saffron px-4 py-2 text-xs font-bold rounded-xl shrink-0 flex items-center gap-1.5"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Mark {selectedBook.unitType} Completed</span>
            </button>
          </div>
        )}

        {/* Progress Bar */}
        <div className="space-y-1 mb-6">
          <div className="flex justify-between text-xs font-bold text-amber-950 dark:text-amber-100 font-mono">
            <span>Overall Parayana Progress</span>
            <span>
              {completedUnitsCount} / {selectedBook.totalUnits} {selectedBook.unitType}s ({percentage.toFixed(0)}%)
            </span>
          </div>
          <div className="w-full h-3 rounded-full bg-amber-100 dark:bg-stone-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* Interactive Chapters List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {selectedBook.units.map(unit => {
            return (
              <div
                key={unit.number}
                onClick={() => toggleParayanaUnit(selectedBook.id, unit.number)}
                className={`p-4 rounded-2xl cursor-pointer transition-all border flex items-center justify-between gap-3 ${
                  unit.isCompleted
                    ? 'bg-amber-100/80 dark:bg-amber-950/80 border-amber-300/80 dark:border-amber-800'
                    : 'bg-white/70 dark:bg-stone-800/70 border-amber-200/50 dark:border-stone-700 hover:border-amber-400'
                }`}
              >
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    className="shrink-0 text-amber-600 dark:text-amber-400"
                  >
                    {unit.isCompleted ? (
                      <CheckCircle className="w-5 h-5 fill-amber-500 text-white" />
                    ) : (
                      <Circle className="w-5 h-5 text-amber-400" />
                    )}
                  </button>

                  <div>
                    <h4 className={`text-sm font-bold ${unit.isCompleted ? 'text-amber-950 dark:text-amber-100 line-through opacity-80' : 'text-amber-950 dark:text-amber-100'}`}>
                      {unit.title}
                    </h4>
                    {unit.subTitle && (
                      <p className="text-xs text-stone-500 dark:text-stone-400">
                        {unit.subTitle}
                      </p>
                    )}
                  </div>
                </div>

                <span className="text-xs font-bold font-mono text-amber-800 dark:text-amber-300 shrink-0">
                  #{unit.number}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
