import React, { useState, useRef } from 'react';
import { useSadhana } from '../context/JapaContext';
import { ThemeMode, FontSize } from '../types';
import {
  Settings,
  Moon,
  Sun,
  Monitor,
  Download,
  Upload,
  Trash2,
  Volume2,
  VolumeX,
  Bell,
  Sparkles,
  AlertTriangle,
  Check
} from 'lucide-react';
import { RippleButton } from '../components/RippleButton';
import { formatNumber } from '../utils/formatters';

export const SettingsPage: React.FC = () => {
  const {
    settings,
    updateSettings,
    exportJSON,
    exportCSV,
    importData,
    clearAllData,
    totalOverallCount
  } = useSadhana();

  const [customTargetInput, setCustomTargetInput] = useState<string>(
    (settings.targetCount || 100000).toString()
  );
  const [importMessage, setImportMessage] = useState<{
    text: string;
    isError: boolean;
  } | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTargetChange = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(customTargetInput, 10);
    if (!isNaN(val) && val > 0) {
      updateSettings({ targetCount: val });
    }
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      const content = event.target?.result as string;
      if (content) {
        const result = importData(content);
        setImportMessage({
          text: result.message,
          isError: !result.success
        });
        setTimeout(() => setImportMessage(null), 4000);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6 pb-20 sm:pb-8">
      {/* Page Header */}
      <div className="glass-card p-5 border border-amber-300/70 dark:border-amber-900/50 shadow-xs">
        <h2 className="text-xl font-bold font-rozha text-amber-950 dark:text-amber-100 flex items-center gap-2 tracking-wide">
          <Settings className="w-5 h-5 text-amber-600" />
          <span>Sadhana Settings & Preferences</span>
        </h2>
        <p className="text-xs text-stone-600 dark:text-stone-300 mt-1">
          Customize target goals, themes, audio feedback, and data backups
        </p>
      </div>

      {/* Section 1: Target Count Customization */}
      <div className="bg-white/80 dark:bg-stone-900/80 rounded-3xl p-5 border border-amber-200/60 dark:border-amber-900/40 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-amber-900 dark:text-amber-200">
          Target Japa Goal
        </h3>
        <p className="text-xs text-stone-500 dark:text-stone-400">
          Standard Mahā-Sankalpa is 100,000 (1 Lakh). You can adjust this for custom Anusthan.
        </p>

        <form onSubmit={handleTargetChange} className="flex gap-2 max-w-md">
          <input
            type="number"
            min="108"
            step="108"
            value={customTargetInput}
            onChange={e => setCustomTargetInput(e.target.value)}
            className="flex-1 px-4 py-2 text-sm rounded-xl border border-amber-200 dark:border-amber-800 bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <RippleButton variant="saffron" type="submit" className="px-4 py-2 text-xs font-bold">
            Update Target
          </RippleButton>
        </form>

        <div className="flex flex-wrap gap-2 pt-1">
          <button
            type="button"
            onClick={() => {
              setCustomTargetInput('100000');
              updateSettings({ targetCount: 100000 });
            }}
            className="px-3 py-1 rounded-lg text-xs bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-semibold"
          >
            Reset to 1 Lakh (100,000)
          </button>
          <button
            type="button"
            onClick={() => {
              setCustomTargetInput('125000');
              updateSettings({ targetCount: 125000 });
            }}
            className="px-3 py-1 rounded-lg text-xs bg-amber-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-medium"
          >
            1.25 Lakh (1,25,000)
          </button>
          <button
            type="button"
            onClick={() => {
              setCustomTargetInput('2400000');
              updateSettings({ targetCount: 2400000 });
            }}
            className="px-3 py-1 rounded-lg text-xs bg-amber-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-medium"
          >
            24 Lakh Mahapurashcharan
          </button>
        </div>
      </div>

      {/* Section 2: Theme & Visual Preferences */}
      <div className="bg-white/80 dark:bg-stone-900/80 rounded-3xl p-5 border border-amber-200/60 dark:border-amber-900/40 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-amber-900 dark:text-amber-200">
          Appearance & Theme
        </h3>

        <div className="grid grid-cols-3 gap-3 max-w-md">
          <button
            onClick={() => updateSettings({ theme: 'light' })}
            className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all ${
              settings.theme === 'light'
                ? 'border-amber-500 bg-amber-100/80 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 font-bold'
                : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400'
            }`}
          >
            <Sun className="w-5 h-5 text-amber-500" />
            <span className="text-xs">Light Mode</span>
          </button>

          <button
            onClick={() => updateSettings({ theme: 'dark' })}
            className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all ${
              settings.theme === 'dark'
                ? 'border-amber-500 bg-amber-100/80 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 font-bold'
                : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400'
            }`}
          >
            <Moon className="w-5 h-5 text-indigo-400" />
            <span className="text-xs">Dark Mode</span>
          </button>

          <button
            onClick={() => updateSettings({ theme: 'system' })}
            className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all ${
              settings.theme === 'system'
                ? 'border-amber-500 bg-amber-100/80 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 font-bold'
                : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400'
            }`}
          >
            <Monitor className="w-5 h-5 text-stone-500" />
            <span className="text-xs">System</span>
          </button>
        </div>

        {/* Ambient Lotus Toggle */}
        <div className="pt-2 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-stone-700 dark:text-stone-300">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Floating Lotus Particles</span>
          </div>
          <button
            onClick={() =>
              updateSettings({
                floatingLotusEnabled: !settings.floatingLotusEnabled
              })
            }
            className={`w-12 h-6 rounded-full transition-colors relative ${
              settings.floatingLotusEnabled ? 'bg-amber-500' : 'bg-stone-300 dark:bg-stone-700'
            }`}
          >
            <span
              className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                settings.floatingLotusEnabled ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Section 3: Audio & Feedback */}
      <div className="bg-white/80 dark:bg-stone-900/80 rounded-3xl p-5 border border-amber-200/60 dark:border-amber-900/40 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-amber-900 dark:text-amber-200">
          Audio & Haptic Feedback
        </h3>

        {/* Temple Bell Sound Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-stone-700 dark:text-stone-300">
            {settings.soundEnabled ? (
              <Volume2 className="w-4 h-4 text-amber-600" />
            ) : (
              <VolumeX className="w-4 h-4 text-stone-400" />
            )}
            <span>Temple Bell & Bead Click Sound</span>
          </div>
          <button
            onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
            className={`w-12 h-6 rounded-full transition-colors relative ${
              settings.soundEnabled ? 'bg-amber-500' : 'bg-stone-300 dark:bg-stone-700'
            }`}
          >
            <span
              className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                settings.soundEnabled ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Vibration Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-stone-700 dark:text-stone-300">
            <Bell className="w-4 h-4 text-amber-600" />
            <span>Haptic Vibration Feedback</span>
          </div>
          <button
            onClick={() =>
              updateSettings({ vibrationEnabled: !settings.vibrationEnabled })
            }
            className={`w-12 h-6 rounded-full transition-colors relative ${
              settings.vibrationEnabled ? 'bg-amber-500' : 'bg-stone-300 dark:bg-stone-700'
            }`}
          >
            <span
              className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                settings.vibrationEnabled ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Section 4: Data Backup & Restore */}
      <div className="bg-white/80 dark:bg-stone-900/80 rounded-3xl p-5 border border-amber-200/60 dark:border-amber-900/40 shadow-sm space-y-4">
        <div>
          <h3 className="text-sm font-bold text-amber-900 dark:text-amber-200">
            Backup & Data Management
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            Safely export your Japa records to JSON or CSV, or restore from a previous backup file.
          </p>
        </div>

        {importMessage && (
          <div
            className={`p-3 rounded-2xl text-xs font-semibold flex items-center gap-2 ${
              importMessage.isError
                ? 'bg-red-50 text-red-700 border border-red-200'
                : 'bg-green-50 text-green-700 border border-green-200'
            }`}
          >
            <Check className="w-4 h-4" />
            <span>{importMessage.text}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Export JSON */}
          <RippleButton
            variant="secondary"
            onClick={exportJSON}
            className="py-2.5 px-4 text-xs font-bold flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4 text-amber-600" />
            <span>Export Backup (JSON)</span>
          </RippleButton>

          {/* Export CSV */}
          <RippleButton
            variant="secondary"
            onClick={exportCSV}
            className="py-2.5 px-4 text-xs font-bold flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4 text-amber-600" />
            <span>Export Spreadsheet (CSV)</span>
          </RippleButton>

          {/* Import JSON */}
          <RippleButton
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="py-2.5 px-4 text-xs font-bold flex items-center justify-center gap-2"
          >
            <Upload className="w-4 h-4 text-amber-600" />
            <span>Import Backup</span>
          </RippleButton>
          <input
            type="file"
            ref={fileInputRef}
            accept=".json"
            onChange={handleFileImport}
            className="hidden"
          />
        </div>

        {/* Clear Data Danger Zone */}
        <div className="pt-4 border-t border-amber-200/50 dark:border-amber-900/30">
          {!showClearConfirm ? (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="text-xs font-semibold text-red-600 hover:underline flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All Local Storage Data</span>
            </button>
          ) : (
            <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900/60 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-red-800 dark:text-red-300">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span>Are you sure you want to reset all Japa logs?</span>
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-400">
                This will delete {formatNumber(totalOverallCount)} logged Gayatri Japa records from this device.
              </p>
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => {
                    clearAllData();
                    setShowClearConfirm(false);
                  }}
                  className="px-3 py-1.5 text-xs font-bold text-white bg-red-600 rounded-xl hover:bg-red-700"
                >
                  Yes, Clear All
                </button>
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="px-3 py-1.5 text-xs font-semibold text-stone-600 hover:bg-stone-200 rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
