import React from 'react';
import { useSadhana } from '../context/JapaContext';
import { NavigationTab } from '../types';
import {
  LayoutDashboard,
  Flame,
  PlusCircle,
  ShieldCheck,
  CalendarDays,
  BarChart3,
  Award,
  Sun,
  Settings
} from 'lucide-react';

interface NavItem {
  id: NavigationTab;
  label: string;
  icon: React.FC<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'sadhanas', label: 'Sadhanas', icon: Flame },
  { id: 'detail', label: 'Add Chant', icon: PlusCircle },
  { id: 'anusthana', label: 'Anusthana', icon: ShieldCheck },
  { id: 'calendar', label: 'Calendar', icon: CalendarDays },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'milestones', label: 'Milestones', icon: Award },
  { id: 'panchanga', label: 'Panchanga', icon: Sun },
  { id: 'settings', label: 'Settings', icon: Settings }
];

export const Navigation: React.FC = () => {
  const { activeTab, setActiveTab } = useSadhana();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-amber-50/95 dark:bg-stone-950/95 backdrop-blur-xl border-t border-amber-300/60 dark:border-amber-900/50 sm:relative sm:border-t-0 sm:border-b sm:bg-amber-100/40 sm:dark:bg-stone-900/60 shadow-md">
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        <ul className="flex items-center overflow-x-auto no-scrollbar py-2 sm:py-2 justify-between sm:justify-center gap-1 sm:gap-1.5">
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <li key={item.id} className="shrink-0">
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-marcellus font-bold tracking-wide transition-all ${
                    isActive
                      ? 'text-amber-950 dark:text-amber-100 bg-amber-200/80 dark:bg-amber-950/90 shadow-xs border border-amber-400/80 dark:border-amber-700'
                      : 'text-stone-600 dark:text-stone-400 hover:text-amber-800 dark:hover:text-amber-200 hover:bg-amber-100/50 dark:hover:bg-amber-950/40'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 sm:w-4 sm:h-4 ${
                      isActive ? 'text-amber-700 dark:text-amber-300 scale-110' : ''
                    } transition-transform`}
                  />
                  <span className="whitespace-nowrap">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};
