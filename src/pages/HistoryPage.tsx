import React, { useState, useMemo } from 'react';
import { useJapa } from '../context/JapaContext';
import { JapaEntry } from '../types';
import { formatDateTime, formatNumber } from '../utils/formatters';
import { Search, Calendar, Trash2, Edit2, Check, X, Filter } from 'lucide-react';
import { RippleButton } from '../components/RippleButton';

export const HistoryPage: React.FC = () => {
  const { entries, deleteEntry, editEntry } = useJapa();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  
  // Edit State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editCount, setEditCount] = useState<string>('');
  const [editNotes, setEditNotes] = useState<string>('');

  // Delete Confirmation State
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Filtered entries
  const filteredEntries = useMemo(() => {
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;

    return entries.filter(entry => {
      // Date filter
      if (dateFilter === 'today') {
        const d = new Date(entry.timestamp);
        const today = new Date();
        if (
          d.getDate() !== today.getDate() ||
          d.getMonth() !== today.getMonth() ||
          d.getFullYear() !== today.getFullYear()
        ) {
          return false;
        }
      } else if (dateFilter === 'week') {
        if (entry.timestamp < now - 7 * oneDay) return false;
      } else if (dateFilter === 'month') {
        if (entry.timestamp < now - 30 * oneDay) return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const notesMatch = entry.notes?.toLowerCase().includes(q) || false;
        const countMatch = entry.count.toString().includes(q);
        const { fullStr } = formatDateTime(entry.timestamp);
        const dateMatch = fullStr.toLowerCase().includes(q);
        return notesMatch || countMatch || dateMatch;
      }

      return true;
    });
  }, [entries, searchQuery, dateFilter]);

  const handleStartEdit = (entry: JapaEntry) => {
    setEditingId(entry.id);
    setEditCount(entry.count.toString());
    setEditNotes(entry.notes || '');
  };

  const handleSaveEdit = (entry: JapaEntry) => {
    const c = parseInt(editCount, 10);
    if (!isNaN(c) && c > 0) {
      editEntry(entry.id, c, entry.timeOfDay, editNotes);
      setEditingId(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  return (
    <div className="space-y-6 pb-20 sm:pb-8">
      {/* Header & Controls */}
      <div className="bg-white/80 dark:bg-stone-900/80 rounded-3xl p-5 border border-amber-200/60 dark:border-amber-900/40 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-amber-950 dark:text-amber-100 flex items-center gap-2">
              <span>📜</span> Japa Sadhana History
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Showing {filteredEntries.length} of {entries.length} total entries
            </p>
          </div>

          {/* Quick Date Presets */}
          <div className="flex items-center gap-1 bg-amber-50 dark:bg-stone-800 p-1 rounded-xl border border-amber-200/50 dark:border-amber-800/50 text-xs">
            <button
              onClick={() => setDateFilter('all')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                dateFilter === 'all'
                  ? 'bg-amber-500 text-white font-bold shadow-sm'
                  : 'text-stone-600 dark:text-stone-300 hover:text-amber-600'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setDateFilter('today')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                dateFilter === 'today'
                  ? 'bg-amber-500 text-white font-bold shadow-sm'
                  : 'text-stone-600 dark:text-stone-300 hover:text-amber-600'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setDateFilter('week')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                dateFilter === 'week'
                  ? 'bg-amber-500 text-white font-bold shadow-sm'
                  : 'text-stone-600 dark:text-stone-300 hover:text-amber-600'
              }`}
            >
              This Week
            </button>
            <button
              onClick={() => setDateFilter('month')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                dateFilter === 'month'
                  ? 'bg-amber-500 text-white font-bold shadow-sm'
                  : 'text-stone-600 dark:text-stone-300 hover:text-amber-600'
              }`}
            >
              This Month
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            placeholder="Search notes, counts, or dates..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-amber-200 dark:border-amber-800 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-600"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Entry List */}
      {filteredEntries.length === 0 ? (
        <div className="text-center py-12 bg-white/50 dark:bg-stone-900/50 rounded-3xl border border-dashed border-amber-200 dark:border-amber-900/50 p-6">
          <span className="text-4xl block mb-2">📿</span>
          <h3 className="text-base font-bold text-amber-950 dark:text-amber-200">
            No Japa Entries Found
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            {searchQuery || dateFilter !== 'all'
              ? 'Try adjusting your search query or date filter.'
              : 'Add your first Gayatri Japa count from the Dashboard page.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredEntries.map(entry => {
            const { dateStr, timeStr } = formatDateTime(entry.timestamp);
            const isEditing = editingId === entry.id;

            return (
              <div
                key={entry.id}
                className="bg-white/80 dark:bg-stone-900/80 rounded-2xl p-4 border border-amber-200/60 dark:border-amber-900/40 shadow-sm transition-all hover:shadow-md"
              >
                {!isEditing ? (
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {/* Count Badge */}
                      <div className="flex flex-col items-center justify-center w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-950/80 border border-amber-300/50 dark:border-amber-800 text-amber-900 dark:text-amber-200">
                        <span className="text-base font-bold font-mono">
                          +{entry.count}
                        </span>
                        <span className="text-[10px] uppercase font-semibold text-amber-700/80 dark:text-amber-400">
                          Japa
                        </span>
                      </div>

                      {/* Date & Notes */}
                      <div>
                        <div className="flex items-center gap-2 text-xs font-semibold text-stone-600 dark:text-stone-300">
                          <Calendar className="w-3.5 h-3.5 text-amber-600" />
                          <span>{dateStr}</span>
                          <span className="text-stone-400">•</span>
                          <span>{timeStr}</span>
                        </div>

                        {entry.notes ? (
                          <p className="text-sm font-medium text-amber-950 dark:text-amber-100 mt-1">
                            "{entry.notes}"
                          </p>
                        ) : (
                          <p className="text-xs italic text-stone-400 mt-1">
                            No notes added
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                      {confirmDeleteId === entry.id ? (
                        <div className="flex items-center gap-1 bg-red-50 dark:bg-red-950/60 p-1 rounded-xl border border-red-200">
                          <button
                            onClick={() => {
                              deleteEntry(entry.id);
                              setConfirmDeleteId(null);
                            }}
                            className="px-2 py-1 text-xs font-bold text-white bg-red-600 rounded-lg hover:bg-red-700"
                          >
                            Confirm Delete
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(null)}
                            className="p-1 text-stone-500 hover:text-stone-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <button
                            onClick={() => handleStartEdit(entry)}
                            className="p-2 text-stone-400 hover:text-amber-600 dark:hover:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950 rounded-xl transition-colors"
                            title="Edit entry"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(entry.id)}
                            className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950 rounded-xl transition-colors"
                            title="Delete entry"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ) : (
                  /* Editing Mode */
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs text-stone-500 block mb-1">
                          Count
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={editCount}
                          onChange={e => setEditCount(e.target.value)}
                          className="w-full px-3 py-1.5 text-sm rounded-xl border border-amber-300 dark:border-amber-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-stone-500 block mb-1">
                          Notes
                        </label>
                        <input
                          type="text"
                          value={editNotes}
                          onChange={e => setEditNotes(e.target.value)}
                          className="w-full px-3 py-1.5 text-sm rounded-xl border border-amber-300 dark:border-amber-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <button
                        onClick={handleCancelEdit}
                        className="px-3 py-1.5 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl"
                      >
                        Cancel
                      </button>
                      <RippleButton
                        variant="saffron"
                        onClick={() => handleSaveEdit(entry)}
                        className="px-4 py-1.5 text-xs font-bold"
                      >
                        Save Changes
                      </RippleButton>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
