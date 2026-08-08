import React, { useState } from 'react';
import { SadhanaSetuLogoSVG } from './SadhanaSetuLogoSVG';
import { X, Download, Copy, Check, Sparkles, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LogoViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LogoViewerModal: React.FC<LogoViewerModalProps> = ({ isOpen, onClose }) => {
  const [variant, setVariant] = useState<'primary' | 'goldOnBlack' | 'whiteOnIndigo' | 'monochrome' | 'circular'>('primary');
  const [showWordmark, setShowWordmark] = useState<boolean>(true);
  const [showTagline, setShowTagline] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleDownloadSvg = () => {
    const svgElement = document.getElementById('sadhanaSetuModalLogoSvg');
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SadhanaSetu_Logo_${variant}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopySvgCode = () => {
    const svgElement = document.getElementById('sadhanaSetuModalLogoSvg');
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    navigator.clipboard.writeText(svgData);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 10 }}
          className="relative w-full max-w-xl bg-gradient-to-b from-stone-900 via-stone-950 to-indigo-950 text-white rounded-3xl border border-amber-500/40 shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Top Control Bar */}
          <div className="flex items-center justify-between p-4 border-b border-stone-800 bg-stone-950/60">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-lg bg-amber-500/20 text-amber-300">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold font-rozha text-amber-100">SadhanaSetu Official Emblem</h3>
                <p className="text-[11px] text-stone-400 font-marcellus">High-Resolution Vector Logo Viewer</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
              aria-label="Close Logo Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main Logo Display Canvas */}
          <div className="p-8 flex flex-col items-center justify-center bg-[#0F0A1A]/80 relative overflow-hidden min-h-[320px]">
            {/* Background Ambient Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <div id="sadhanaSetuModalLogoSvg" className="relative z-10 transition-all duration-300 hover:scale-[1.02]">
              <SadhanaSetuLogoSVG
                size={280}
                variant={variant}
                showWordmark={showWordmark}
                showTagline={showTagline}
              />
            </div>
          </div>

          {/* Controls & Options Bar */}
          <div className="p-5 space-y-4 bg-stone-950 border-t border-stone-800">
            {/* Variant Switcher */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold font-marcellus text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                <span>Select Theme Style</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'primary', label: 'Primary Cosmic' },
                  { id: 'goldOnBlack', label: 'Luxury Gold' },
                  { id: 'whiteOnIndigo', label: 'White & Indigo' },
                  { id: 'monochrome', label: 'Monochrome' },
                  { id: 'circular', label: 'Circular Badge' }
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => setVariant(item.id as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-marcellus font-semibold transition-all ${
                      variant === item.id
                        ? 'bg-amber-500 text-stone-950 shadow-md font-bold'
                        : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Toggle Switchers */}
            <div className="flex items-center justify-between text-xs font-marcellus text-stone-300 pt-1 border-t border-stone-900">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={showWordmark}
                  onChange={(e) => setShowWordmark(e.target.checked)}
                  className="rounded accent-amber-500 w-4 h-4 cursor-pointer"
                />
                <span>Include Wordmark ("SadhanaSetu")</span>
              </label>

              {showWordmark && (
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={showTagline}
                    onChange={(e) => setShowTagline(e.target.checked)}
                    className="rounded accent-amber-500 w-4 h-4 cursor-pointer"
                  />
                  <span>Include Subtitle Tagline</span>
                </label>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={handleCopySvgCode}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-200 text-xs font-marcellus font-bold transition-all border border-stone-700 active:scale-95"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'SVG Copied!' : 'Copy SVG'}</span>
              </button>

              <button
                onClick={handleDownloadSvg}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 text-xs font-marcellus font-bold transition-all shadow-md active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>Download SVG Vector</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
