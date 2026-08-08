export type SadhanaCategory =
  | 'Mantra'
  | 'Stotra'
  | 'Sahasranama'
  | 'Kavacha'
  | 'Parayana'
  | 'Japa'
  | 'Vrata'
  | 'Other';

export type TimeOfDay = 'Morning' | 'Afternoon' | 'Evening' | 'Night';

export type ColorTheme =
  | 'saffron'
  | 'gold'
  | 'rudraksha'
  | 'emerald'
  | 'ruby'
  | 'lotus'
  | 'indigo';

export type SadhanaIcon =
  | 'Om'
  | 'Lotus'
  | 'Sun'
  | 'Flame'
  | 'Book'
  | 'Sparkles'
  | 'Bell'
  | 'Moon'
  | 'Rosary';

export interface Sadhana {
  id: string;
  name: string;
  sanskritName?: string;
  category: SadhanaCategory;
  targetCount: number;
  dailyGoal: number;
  startDate: string; // YYYY-MM-DD
  endDate?: string;  // YYYY-MM-DD
  description?: string;
  colorTheme: ColorTheme;
  icon: SadhanaIcon;
  isArchived?: boolean;
  isCompleted?: boolean;
  createdAt: number;
}

export interface SessionEntry {
  id: string;
  sadhanaId: string;
  timestamp: number; // Unix timestamp in ms
  count: number;
  timeOfDay: TimeOfDay;
  notes?: string;
}

export interface Anusthana {
  id: string;
  sadhanaId: string;
  title: string;
  sanskritTitle?: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  targetCount: number;
  numberOfDays: number;
  notes?: string;
}

export interface ParayanaUnit {
  number: number;
  title: string;
  subTitle?: string;
  isCompleted: boolean;
  completedAt?: number;
}

export interface ParayanaBook {
  id: string;
  sadhanaId?: string;
  title: string;
  sanskritTitle?: string;
  unitType: 'Chapter' | 'Skandha' | 'Kanda' | 'Adhyaya' | 'Section';
  totalUnits: number;
  units: ParayanaUnit[];
  currentUnit: number;
  description?: string;
}

export interface Milestone {
  targetCount: number;
  title: string;
  sanskritTitle?: string;
  description: string;
  achievedAt?: number;
}

export type ThemeMode = 'light' | 'dark' | 'system';
export type FontSize = 'normal' | 'large' | 'xlarge';
export type AccentColor = 'saffron' | 'gold' | 'rudraksha' | 'emerald' | 'rose';

export interface UserSettings {
  theme: ThemeMode;
  accentColor: AccentColor;
  fontSize: FontSize;
  language: 'English' | 'Hindi' | 'Sanskrit' | 'Tamil' | 'Telugu';
  notificationsEnabled: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  floatingLotusEnabled: boolean;
  selectedSadhanaId: string | null;
  dailyReminderTime: string; // e.g. "06:00"
  activeProfile: string;
  userProfiles: string[];
  userName?: string;
  targetCount?: number;
}

export type JapaEntry = SessionEntry;

export interface DailyQuote {
  id: string;
  sanskrit: string;
  transliteration: string;
  englishMeaning: string;
  source: string;
  reflection: string;
}

export interface PanchangaDay {
  date: string; // YYYY-MM-DD
  tithi: string;
  nakshatra: string;
  paksha: 'Shukla Paksha' | 'Krishna Paksha';
  isEkadashi: boolean;
  isPurnima: boolean;
  isAmavasya: boolean;
  isPradosham: boolean;
  isShivaratri: boolean;
  festivalName?: string;
  fastingInfo?: string;
}

export type NavigationTab =
  | 'dashboard'
  | 'sadhanas'
  | 'detail'
  | 'anusthana'
  | 'parayana'
  | 'calendar'
  | 'analytics'
  | 'milestones'
  | 'panchanga'
  | 'settings'
  | 'history'
  | 'quotes';

export interface DailyStat {
  date: string; // YYYY-MM-DD
  displayDate: string;
  count: number;
}

export interface HeatmapDay {
  date: string; // YYYY-MM-DD
  count: number;
  intensity: number; // 0 to 4
}
