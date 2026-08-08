import React, { useState } from 'react';
import { useSadhana } from '../context/JapaContext';
import { SADHANA_PRESETS, SadhanaPreset } from '../data/sadhanaPresets';
import { SadhanaCategory, ColorTheme, SadhanaIcon, Sadhana } from '../types';
import {
  Plus,
  Search,
  Archive,
  Trash2,
  Edit2,
  Sparkles,
  Flame,
  CheckCircle2,
  BookOpen,
  X
} from 'lucide-react';
import { formatNumber, getLocalDateString } from '../utils/formatters';

export const SadhanasPage: React.FC = () => {
  const {
    sadhanas,
    createSadhana,
    editSadhana,
    deleteSadhana,
    archiveSadhana,
    setSelectedSadhanaId,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    statusFilter,
    setStatusFilter,
    filteredSadhanas,
    entries,
    setActiveTab
  } = useSadhana();

  const [showModal, setShowModal] = useState(false);
  const [editingSadhanaId, setEditingSadhanaId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [sanskritName, setSanskritName] = useState('');
  const [category, setCategory] = useState<SadhanaCategory>('Mantra');
  const [targetCount, setTargetCount] = useState<number>(108);
  const [dailyGoal, setDailyGoal] = useState<number>(3);
  const [startDate, setStartDate] = useState<string>(getLocalDateString(new Date()));
  const [endDate, setEndDate] = useState<string>('');
  const [description, setDescription] = useState('');
  const [colorTheme, setColorTheme] = useState<ColorTheme>('saffron');
  const [icon, setIcon] = useState<SadhanaIcon>('Om');

  const CATEGORIES: SadhanaCategory[] = [
    'Mantra',
    'Stotra',
    'Sahasranama',
    'Kavacha',
    'Parayana',
    'Japa',
    'Vrata',
    'Other'
  ];

  const TARGET_PRESETS = [108, 1008, 10000, 24000, 125000, 1000000];

  const handleApplyPreset = (preset: SadhanaPreset) => {
    setName(preset.name);
    setSanskritName(preset.sanskritName);
    setCategory(preset.category);
    setTargetCount(preset.defaultTargetCount);
    setDailyGoal(preset.defaultDailyGoal);
    setDescription(preset.description);
    setColorTheme(preset.colorTheme);
    setIcon(preset.icon);
  };

  const handleOpenCreateModal = () => {
    setEditingSadhanaId(null);
    setName('');
    setSanskritName('');
    setCategory('Mantra');
    setTargetCount(108);
    setDailyGoal(3);
    setStartDate(getLocalDateString(new Date()));
    setEndDate('');
    setDescription('');
    setColorTheme('saffron');
    setIcon('Om');
    setShowModal(true);
  };

  const handleOpenEditModal = (sadhana: Sadhana) => {
    setEditingSadhanaId(sadhana.id);
    setName(sadhana.name);
    setSanskritName(sadhana.sanskritName || '');
    setCategory(sadhana.category);
    setTargetCount(sadhana.targetCount);
    setDailyGoal(sadhana.dailyGoal);
    setStartDate(sadhana.startDate);
    setEndDate(sadhana.endDate || '');
    setDescription(sadhana.description || '');
    setColorTheme(sadhana.colorTheme);
    setIcon(sadhana.icon);
    setShowModal(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingSadhanaId) {
      editSadhana(editingSadhanaId, {
        name,
        sanskritName,
        category,
        targetCount,
        dailyGoal,
        startDate,
        endDate: endDate || undefined,
        description,
        colorTheme,
        icon
      });
    } else {
      createSadhana({
        name,
        sanskritName,
        category,
        targetCount,
        dailyGoal,
        startDate,
        endDate: endDate || undefined,
        description,
        colorTheme,
        icon
      });
    }

    setShowModal(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Row */}
      <div className="glass-card p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-amber-300/70 dark:border-amber-900/50 shadow-xs">
        <div>
          <h2 className="text-2xl font-bold font-rozha text-amber-950 dark:text-amber-100 flex items-center gap-2 tracking-wide">
            <span>🕉️</span> Sadhana Directory
          </h2>
          <p className="text-xs text-stone-600 dark:text-stone-300 mt-1">
            Manage your spiritual practices, mantras, stotras, and anusthanas.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="btn-saffron px-5 py-3 rounded-xl text-xs font-marcellus font-bold flex items-center gap-2 shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Sadhana</span>
        </button>
      </div>

      {/* Search & Filter Controls */}
      <div className="glass-card p-4 space-y-3 border border-amber-200/60">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search by Sadhana name or category..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-amber-200 dark:border-amber-800 bg-white/80 dark:bg-stone-800 text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1 bg-amber-100/60 dark:bg-stone-800/80 p-1 rounded-xl border border-amber-200/60 dark:border-stone-700">
            {['Active', 'Completed', 'Archived'].map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  statusFilter === st
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'text-stone-600 dark:text-stone-300 hover:text-amber-800'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
          {['All', ...CATEGORIES].map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all border ${
                categoryFilter === cat
                  ? 'bg-amber-800 text-amber-50 border-amber-800'
                  : 'bg-white/60 dark:bg-stone-800/60 text-stone-700 dark:text-stone-300 border-amber-200 dark:border-stone-700 hover:bg-amber-100/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Sadhanas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredSadhanas.length === 0 ? (
          <div className="col-span-full glass-card p-12 text-center">
            <p className="text-stone-500 text-sm mb-4">No Sadhanas match your filters.</p>
            <button
              onClick={handleOpenCreateModal}
              className="btn-saffron px-4 py-2 text-xs font-bold rounded-xl inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Your First Sadhana</span>
            </button>
          </div>
        ) : (
          filteredSadhanas.map(sadhana => {
            const currentCount = entries
              .filter(e => e.sadhanaId === sadhana.id)
              .reduce((s, e) => s + e.count, 0);
            const percentage = Math.min(100, (currentCount / sadhana.targetCount) * 100);

            return (
              <div
                key={sadhana.id}
                className="glass-card p-6 flex flex-col justify-between border border-amber-200/60 dark:border-amber-900/40 relative hover:shadow-2xl transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 border border-amber-300/50">
                      {sadhana.category}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEditModal(sadhana)}
                        className="p-1.5 rounded-lg text-stone-500 hover:text-amber-800 hover:bg-amber-100/60 transition-colors"
                        title="Edit Sadhana"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => archiveSadhana(sadhana.id)}
                        className="p-1.5 rounded-lg text-stone-500 hover:text-amber-800 hover:bg-amber-100/60 transition-colors"
                        title={sadhana.isArchived ? 'Unarchive' : 'Archive'}
                      >
                        <Archive className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteSadhana(sadhana.id)}
                        className="p-1.5 rounded-lg text-stone-500 hover:text-rose-600 hover:bg-rose-100/60 transition-colors"
                        title="Delete Sadhana"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-amber-950 dark:text-amber-100 font-cinzel">
                    {sadhana.name}
                  </h3>

                  {sadhana.sanskritName && (
                    <p className="text-xs font-devanagari text-amber-800 dark:text-amber-300 my-1">
                      {sadhana.sanskritName}
                    </p>
                  )}

                  <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-2 my-2">
                    {sadhana.description || 'Sacred Sadhana practice.'}
                  </p>
                </div>

                {/* Progress & Actions */}
                <div className="mt-4 pt-3 border-t border-amber-200/40">
                  <div className="flex items-center justify-between text-xs font-bold text-stone-700 dark:text-stone-300 font-mono mb-1">
                    <span>{formatNumber(currentCount)}</span>
                    <span>/ {formatNumber(sadhana.targetCount)} ({percentage.toFixed(1)}%)</span>
                  </div>

                  <div className="w-full h-2 rounded-full bg-amber-100 dark:bg-stone-800 overflow-hidden mb-4">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedSadhanaId(sadhana.id);
                        setActiveTab('detail');
                      }}
                      className="flex-1 btn-saffron py-2 px-3 text-xs font-bold rounded-xl flex items-center justify-center gap-1"
                    >
                      <Flame className="w-3.5 h-3.5" />
                      <span>Chant Session</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Create / Edit Sadhana Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative max-w-xl w-full glass-card p-6 border-2 border-amber-300 dark:border-amber-800 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-amber-200/50 mb-4">
              <h3 className="text-lg font-bold font-cinzel text-amber-950 dark:text-amber-100">
                {editingSadhanaId ? 'Edit Sadhana' : 'Create New Sadhana'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg text-stone-500 hover:text-amber-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Presets Quick Picker (Only when creating new) */}
            {!editingSadhanaId && (
              <div className="mb-5">
                <p className="text-xs font-bold text-amber-800 dark:text-amber-300 mb-2 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Popular Sacred Presets (Click to Auto-fill)</span>
                </p>

                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
                  {SADHANA_PRESETS.map(preset => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleApplyPreset(preset)}
                      className="px-3 py-1.5 rounded-xl bg-amber-100/80 dark:bg-amber-950/80 hover:bg-amber-200 text-amber-900 dark:text-amber-200 text-xs font-bold whitespace-nowrap border border-amber-300/50"
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Sadhana Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Gayatri Mantra, Mahamrityunjaya, Hanuman Chalisa"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-amber-200 dark:border-amber-800 bg-white/80 dark:bg-stone-800 text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Sanskrit Name / Mantra Shloka Text
                </label>
                <input
                  type="text"
                  placeholder="e.g. ॐ भूर्भुवः स्वः..."
                  value={sanskritName}
                  onChange={e => setSanskritName(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-amber-200 dark:border-amber-800 bg-white/80 dark:bg-stone-800 text-stone-800 dark:text-stone-100 font-devanagari focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as SadhanaCategory)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-amber-200 dark:border-amber-800 bg-white/80 dark:bg-stone-800 text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Target Count Goal
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={targetCount}
                    onChange={e => setTargetCount(parseInt(e.target.value, 10) || 108)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-amber-200 dark:border-amber-800 bg-white/80 dark:bg-stone-800 text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Target presets */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                <span className="text-[10px] font-bold text-stone-500">Presets:</span>
                {TARGET_PRESETS.map(tp => (
                  <button
                    key={tp}
                    type="button"
                    onClick={() => setTargetCount(tp)}
                    className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200 hover:bg-amber-200"
                  >
                    {tp.toLocaleString('en-IN')}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Daily Goal
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={dailyGoal}
                    onChange={e => setDailyGoal(parseInt(e.target.value, 10) || 1)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-amber-200 dark:border-amber-800 bg-white/80 dark:bg-stone-800 text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-amber-200 dark:border-amber-800 bg-white/80 dark:bg-stone-800 text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Description / Intention / Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Dedicated for peace, good health, and spiritual realization."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-amber-200 dark:border-amber-800 bg-white/80 dark:bg-stone-800 text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 text-xs font-bold rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-saffron py-2.5 text-xs font-bold rounded-xl"
                >
                  {editingSadhanaId ? 'Save Changes' : 'Create Sadhana'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
