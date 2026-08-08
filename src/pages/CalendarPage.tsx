import React, { useState } from 'react';
import { useSadhana } from '../context/JapaContext';
import { CalendarDays, ChevronLeft, ChevronRight, Plus, Trash2, Clock, X } from 'lucide-react';
import { formatNumber, getLocalDateString } from '../utils/formatters';

export const CalendarPage: React.FC = () => {
  const { entries, sadhanas, deleteEntry, addChantSession } = useSadhana();
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDayStr, setSelectedDayStr] = useState<string>(getLocalDateString(new Date()));

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthName = currentDate.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Build calendar matrix for month
  const firstDayOfMonth = new Date(year, month, 1);
  const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Create date map for quick lookup
  const dateMap = new Map<string, number>();
  entries.forEach(e => {
    const dStr = getLocalDateString(new Date(e.timestamp));
    dateMap.set(dStr, (dateMap.get(dStr) || 0) + e.count);
  });

  const calendarCells = [];
  // Blank padding cells
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarCells.push(null);
  }
  // Days of month
  for (let day = 1; day <= daysInMonth; day++) {
    const d = new Date(year, month, day);
    const dStr = getLocalDateString(d);
    const count = dateMap.get(dStr) || 0;
    calendarCells.push({ day, dateStr: dStr, count });
  }

  // Selected Day Sessions
  const daySessions = entries.filter(e => getLocalDateString(new Date(e.timestamp)) === selectedDayStr);
  const selectedDayTotal = daySessions.reduce((s, e) => s + e.count, 0);

  // Heatmap intensity color generator
  const getIntensityClass = (count: number) => {
    if (count === 0) return 'bg-white/60 dark:bg-stone-800/60 text-stone-700 dark:text-stone-300';
    if (count < 108) return 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/60 dark:text-amber-200';
    if (count < 540) return 'bg-amber-300 text-amber-950 border-amber-400 font-bold';
    if (count < 1008) return 'bg-amber-500 text-white font-extrabold shadow-sm';
    return 'bg-gradient-to-tr from-amber-600 to-orange-600 text-white font-extrabold shadow-md';
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="glass-card p-6 flex items-center justify-between gap-4 border border-amber-300/70 dark:border-amber-900/50 shadow-xs">
        <div>
          <h2 className="text-2xl font-bold font-rozha text-amber-950 dark:text-amber-100 flex items-center gap-2 tracking-wide">
            <CalendarDays className="w-6 h-6 text-amber-600" />
            <span>Sadhana Calendar Heatmap</span>
          </h2>
          <p className="text-xs text-stone-600 dark:text-stone-300 mt-1">
            View daily chant history, session details, and activity intensity across the month.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Calendar Grid Column */}
        <div className="lg:col-span-8 glass-card p-6 border border-amber-200/60">
          {/* Calendar Controls */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold font-cinzel text-amber-950 dark:text-amber-100">
              {monthName}
            </h3>

            <div className="flex items-center gap-2">
              <button
                onClick={prevMonth}
                className="p-2 rounded-xl bg-amber-100 dark:bg-stone-800 hover:bg-amber-200 text-amber-900 dark:text-amber-200"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextMonth}
                className="p-2 rounded-xl bg-amber-100 dark:bg-stone-800 hover:bg-amber-200 text-amber-900 dark:text-amber-200"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Weekday Labels */}
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-stone-500 mb-2">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Calendar Day Grid */}
          <div className="grid grid-cols-7 gap-2">
            {calendarCells.map((cell, idx) => {
              if (!cell) {
                return <div key={`blank-${idx}`} className="h-16 rounded-2xl bg-transparent" />;
              }

              const isSelected = cell.dateStr === selectedDayStr;
              const isToday = cell.dateStr === getLocalDateString(new Date());

              return (
                <div
                  key={cell.dateStr}
                  onClick={() => setSelectedDayStr(cell.dateStr)}
                  className={`h-16 rounded-2xl p-2 cursor-pointer transition-all border flex flex-col justify-between ${getIntensityClass(
                    cell.count
                  )} ${isSelected ? 'ring-2 ring-amber-600 scale-105 z-10 shadow-lg' : ''} ${
                    isToday ? 'border-2 border-orange-500' : 'border-amber-200/40 dark:border-stone-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span>{cell.day}</span>
                    {isToday && <span className="text-[9px] uppercase tracking-tighter">Today</span>}
                  </div>

                  {cell.count > 0 && (
                    <span className="text-[10px] font-mono font-extrabold truncate">
                      +{formatNumber(cell.count)}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Day Inspector Panel */}
        <div className="lg:col-span-4 glass-card p-6 border border-amber-200/60 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-amber-200/50 mb-4">
              <div>
                <p className="text-[10px] font-bold text-amber-800 dark:text-amber-300 uppercase tracking-widest">
                  Day Inspector
                </p>
                <h3 className="text-base font-bold font-cinzel text-amber-950 dark:text-amber-100">
                  {selectedDayStr}
                </h3>
              </div>

              <span className="px-3 py-1 rounded-full bg-amber-500 text-white font-mono font-extrabold text-xs">
                {formatNumber(selectedDayTotal)} Chants
              </span>
            </div>

            {daySessions.length === 0 ? (
              <p className="text-xs text-stone-500 py-8 text-center">
                No sessions recorded on {selectedDayStr}.
              </p>
            ) : (
              <div className="space-y-2 max-h-80 overflow-y-auto no-scrollbar pr-1">
                {daySessions.map(session => {
                  const sadhana = sadhanas.find(s => s.id === session.sadhanaId);

                  return (
                    <div
                      key={session.id}
                      className="p-3 rounded-2xl bg-white/80 dark:bg-stone-800/80 border border-amber-200/50 flex items-center justify-between gap-2 text-xs"
                    >
                      <div>
                        <p className="font-bold text-amber-950 dark:text-amber-100">
                          {sadhana?.name || 'Sadhana'}
                        </p>
                        <p className="text-[10px] text-stone-500">
                          {session.timeOfDay} {session.notes ? `• "${session.notes}"` : ''}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="font-mono font-extrabold text-amber-700 dark:text-amber-300 text-sm">
                          +{session.count}
                        </span>
                        <button
                          onClick={() => deleteEntry(session.id)}
                          className="p-1 text-stone-400 hover:text-rose-600"
                          title="Delete Session"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-amber-200/50">
            <button
              onClick={() => {
                addChantSession(108, sadhanas[0]?.id, 'Morning', 'Logged from calendar');
              }}
              className="w-full btn-saffron py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1"
            >
              <Plus className="w-4 h-4" />
              <span>Log +108 Chants on This Day</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
