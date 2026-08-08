import React, { useState } from 'react';
import { useSadhana } from '../context/JapaContext';
import { getPanchangaForDate } from '../data/panchangaData';
import { Sun, Calendar as CalendarIcon, Sparkles, Bell, HeartHandshake, ChevronLeft, ChevronRight, Moon } from 'lucide-react';

export const PanchangaPage: React.FC = () => {
  const { setActiveTab } = useSadhana();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const panchanga = getPanchangaForDate(selectedDate);
  const formattedDate = selectedDate.toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const handlePrevDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    setSelectedDate(d);
  };

  const handleNextDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    setSelectedDate(d);
  };

  const handleToday = () => {
    setSelectedDate(new Date());
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="glass-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-amber-300/70 dark:border-amber-900/50 shadow-xs">
        <div>
          <h2 className="text-2xl font-bold font-rozha text-amber-950 dark:text-amber-100 flex items-center gap-2 tracking-wide">
            <Sun className="w-6 h-6 text-amber-600 animate-spin-slow" />
            <span>Vedic Panchanga & Tithi Calendar</span>
          </h2>
          <p className="text-xs text-stone-600 dark:text-stone-300 mt-1">
            Align your daily Japa and Parayana with lunar phases, Ekadashi Vratas, and auspicious Tithis.
          </p>
        </div>

        {/* Date Selector Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevDay}
            className="p-2 rounded-xl bg-amber-100/80 dark:bg-stone-800 hover:bg-amber-200 text-amber-950 dark:text-amber-200 border border-amber-300/50"
            title="Previous Day"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={handleToday}
            className="px-3.5 py-1.5 rounded-xl bg-amber-600 text-white text-xs font-marcellus font-bold shadow-xs hover:bg-amber-700"
          >
            Today
          </button>

          <button
            onClick={handleNextDay}
            className="p-2 rounded-xl bg-amber-100/80 dark:bg-stone-800 hover:bg-amber-200 text-amber-950 dark:text-amber-200 border border-amber-300/50"
            title="Next Day"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Panchanga Card */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-7 glass-card p-6 border border-amber-200/60 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-amber-200/50 pb-4 mb-4">
              <div>
                <span className="text-xs font-bold text-amber-700 dark:text-amber-400 tracking-wider uppercase">
                  Panchanga Overview
                </span>
                <h3 className="text-lg font-bold font-cinzel text-amber-950 dark:text-amber-100">
                  {formattedDate}
                </h3>
              </div>

              <span className="px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 font-bold text-xs border border-amber-300 dark:border-amber-800">
                {panchanga.paksha}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 my-6">
              <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-stone-800/60 border border-amber-200/50">
                <div className="flex items-center gap-2 mb-1">
                  <Moon className="w-4 h-4 text-amber-600" />
                  <span className="text-xs font-bold text-stone-500">Tithi</span>
                </div>
                <p className="text-base font-extrabold text-amber-950 dark:text-amber-100">
                  {panchanga.tithi}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-stone-800/60 border border-amber-200/50">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span className="text-xs font-bold text-stone-500">Nakshatra</span>
                </div>
                <p className="text-base font-extrabold text-amber-950 dark:text-amber-100">
                  {panchanga.nakshatra}
                </p>
              </div>
            </div>

            {/* Special Observances & Festival Banner */}
            {panchanga.festivalName ? (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md space-y-1 mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-100 animate-bounce" />
                  <h4 className="font-bold text-sm">{panchanga.festivalName}</h4>
                </div>
                {panchanga.fastingInfo && (
                  <p className="text-xs text-amber-50 leading-relaxed">
                    {panchanga.fastingInfo}
                  </p>
                )}
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-stone-800/40 border border-amber-200/40 text-stone-600 dark:text-stone-300 text-xs">
                ✨ <span className="font-semibold">Regular Sadhana Day:</span> Maintain steady Japa routines during Brahma Muhurta (4:00 AM - 6:00 AM) or Evening Sandhya.
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-amber-200/50 flex items-center justify-between">
            <button
              onClick={() => setActiveTab('detail')}
              className="btn-saffron py-2.5 px-6 rounded-xl text-xs font-bold flex items-center gap-2"
            >
              <HeartHandshake className="w-4 h-4" />
              <span>Perform Today's Japa</span>
            </button>
          </div>
        </div>

        {/* Spiritual Guidance & Fasting Recommendations */}
        <div className="md:col-span-5 space-y-4">
          <div className="glass-card p-6 border border-amber-200/60 space-y-4">
            <h3 className="text-sm font-bold font-cinzel text-amber-950 dark:text-amber-100 flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-600" />
              <span>Tithi Sadhana Guidance</span>
            </h3>

            <div className="space-y-3 text-xs text-stone-700 dark:text-stone-300">
              {panchanga.isEkadashi && (
                <div className="p-3 rounded-xl bg-amber-100/80 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800">
                  <p className="font-bold text-amber-900 dark:text-amber-200 mb-1">
                    🌿 Ekadashi Vrata Observance
                  </p>
                  <p>Chanting Vishnu Sahasranama or Hare Krishna / Gayatri Mantra on Ekadashi yields multi-fold spiritual merit.</p>
                </div>
              )}

              {panchanga.isPurnima && (
                <div className="p-3 rounded-xl bg-amber-100/80 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800">
                  <p className="font-bold text-amber-900 dark:text-amber-200 mb-1">
                    🌕 Full Moon (Purnima) Energy
                  </p>
                  <p>Ideal for Sri Satyanarayan Puja, Sri Vidya Sadhana, Lalitha Sahasranama, and extended meditation.</p>
                </div>
              )}

              {panchanga.isAmavasya && (
                <div className="p-3 rounded-xl bg-amber-100/80 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800">
                  <p className="font-bold text-amber-900 dark:text-amber-200 mb-1">
                    🌑 New Moon (Amavasya) Introspection
                  </p>
                  <p>Powerful time for intense introspective Japa, Pitru Tarpanam, and Mahamrityunjaya Mantra chanting.</p>
                </div>
              )}

              {panchanga.isShivaratri && (
                <div className="p-3 rounded-xl bg-amber-100/80 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800">
                  <p className="font-bold text-amber-900 dark:text-amber-200 mb-1">
                    🔱 Masa Shivaratri
                  </p>
                  <p>Offer Bilva leaves and perform 108 or 1008 chants of Om Namah Shivaya.</p>
                </div>
              )}

              {!panchanga.isEkadashi && !panchanga.isPurnima && !panchanga.isAmavasya && !panchanga.isShivaratri && (
                <div className="p-3 rounded-xl bg-stone-100 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
                  <p className="font-bold text-amber-900 dark:text-amber-200 mb-1">
                    📿 Steady Nitya Karma
                  </p>
                  <p>Consistency in your daily Japa builds unbreakable spiritual strength (Sankalpa-Siddhi).</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Nav to Parayana */}
          <div className="glass-card p-5 border border-amber-200/60 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-amber-950 dark:text-amber-100">
                Scripture Parayana
              </p>
              <p className="text-[11px] text-stone-500">
                Read Bhagavad Gita or Sundara Kanda today
              </p>
            </div>
            <button
              onClick={() => setActiveTab('parayana')}
              className="px-3 py-1.5 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 text-xs font-bold hover:bg-amber-200"
            >
              Open Books
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
