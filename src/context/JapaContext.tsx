import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { doc, collection, setDoc, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './AuthContext';
import {
  Sadhana,
  SessionEntry,
  Anusthana,
  ParayanaBook,
  UserSettings,
  NavigationTab,
  Milestone,
  DailyStat,
  HeatmapDay,
  TimeOfDay,
  SadhanaCategory
} from '../types';
import { SADHANA_PRESETS } from '../data/sadhanaPresets';
import { INITIAL_PARAYANA_BOOKS } from '../data/parayanaData';
import { getPanchangaForDate } from '../data/panchangaData';
import { getLocalDateString } from '../utils/formatters';
import { soundManager } from '../utils/audio';

const LOCAL_STORAGE_SADHANAS_KEY = 'sadhana_tracker_sadhanas_v2';
const LOCAL_STORAGE_ENTRIES_KEY = 'sadhana_tracker_entries_v2';
const LOCAL_STORAGE_ANUSTHANAS_KEY = 'sadhana_tracker_anusthanas_v2';
const LOCAL_STORAGE_PARAYANA_KEY = 'sadhana_tracker_parayana_v2';
const LOCAL_STORAGE_SETTINGS_KEY = 'sadhana_tracker_settings_v2';

export const MILESTONES_LIST: Milestone[] = [
  {
    targetCount: 108,
    title: 'Aṣṭottara Śata (108)',
    sanskritTitle: 'अष्टोत्तर शतम् (१०८)',
    description: 'First auspicious cycle of 108 sacred chants completed. Mind aligns with cosmic resonance!'
  },
  {
    targetCount: 1008,
    title: 'Sahasra Japa (1,008)',
    sanskritTitle: 'सहस्र जपः (१,००८)',
    description: '1008 sacred invocations! Divine calmness settles into deep meditation.'
  },
  {
    targetCount: 10000,
    title: 'Prathama Siddhi (10,000)',
    sanskritTitle: 'प्रथमा सिद्धिः (१०,०००)',
    description: '10,000 Sadhana completed! Inner energy and spiritual concentration awakened.'
  },
  {
    targetCount: 24000,
    title: 'Gayatri Purascharana Step (24,000)',
    sanskritTitle: 'चतुर्विंशति सहस्रम् (२४,०००)',
    description: '24,000 chants corresponding to the 24 divine syllables of Gayatri!'
  },
  {
    targetCount: 50000,
    title: 'ArDha Lakṣa (50,000)',
    sanskritTitle: 'अर्ध लक्षम् (५०,०००)',
    description: 'Halfway to 1 Lakh! Radiating profound spiritual vibrations.'
  },
  {
    targetCount: 100000,
    title: 'Lakṣa Japa (100,000 / 1 Lakh)',
    sanskritTitle: 'लक्ष जपः (१ लाख)',
    description: 'Major Purascharana Milestone! 1 Lakh chants offered to the Divine.'
  },
  {
    targetCount: 125000,
    title: 'Maha Purascharana (125,000)',
    sanskritTitle: 'महा पुरश्चरणम् (१.२५ लाख)',
    description: 'Complete classical 1.25 Lakh Anusthana Mahayajna accomplished!'
  },
  {
    targetCount: 1000000,
    title: 'Koti Siddhi (1,000,000 / 10 Lakhs)',
    sanskritTitle: 'कोटी सिद्धिः (१० लाख)',
    description: 'Supreme Divine Mastery! 1 Million sacred chants completed.'
  }
];

const DEFAULT_SETTINGS: UserSettings = {
  theme: 'light',
  accentColor: 'saffron',
  fontSize: 'normal',
  language: 'English',
  notificationsEnabled: true,
  soundEnabled: true,
  vibrationEnabled: true,
  floatingLotusEnabled: true,
  selectedSadhanaId: null,
  dailyReminderTime: '06:00',
  activeProfile: 'Devotee',
  userProfiles: ['Devotee', 'Family']
};

interface SadhanaContextType {
  sadhanas: Sadhana[];
  entries: SessionEntry[];
  anusthanas: Anusthana[];
  parayanaBooks: ParayanaBook[];
  settings: UserSettings;
  activeTab: NavigationTab;
  selectedSadhana: Sadhana | null;
  lastAddedEntry: SessionEntry | null;
  celebratingMilestone: Milestone | null;
  searchQuery: string;
  categoryFilter: string;
  statusFilter: string;

  // Actions
  createSadhana: (data: Omit<Sadhana, 'id' | 'createdAt'>) => Sadhana;
  editSadhana: (id: string, data: Partial<Sadhana>) => void;
  deleteSadhana: (id: string) => void;
  archiveSadhana: (id: string) => void;
  setSelectedSadhanaId: (id: string | null) => void;

  addChantSession: (count: number, sadhanaId?: string, timeOfDay?: TimeOfDay, notes?: string) => void;
  undoLastSession: () => boolean;
  deleteEntry: (id: string) => void;
  editEntry: (id: string, count: number, timeOfDay: TimeOfDay, notes?: string) => void;

  createAnusthana: (data: Omit<Anusthana, 'id'>) => Anusthana;
  deleteAnusthana: (id: string) => void;

  toggleParayanaUnit: (bookId: string, unitNumber: number) => void;
  resetParayanaBook: (bookId: string) => void;

  updateSettings: (newSettings: Partial<UserSettings>) => void;
  setActiveTab: (tab: NavigationTab) => void;
  setSearchQuery: (query: string) => void;
  setCategoryFilter: (category: string) => void;
  setStatusFilter: (status: string) => void;
  dismissMilestoneCelebration: () => void;
  clearAllData: () => void;
  importData: (jsonData: string) => { success: boolean; message: string };
  exportJSON: () => void;
  exportCSV: () => void;

  // Computed & Aggregated Stats
  filteredSadhanas: Sadhana[];
  totalOverallCount: number;
  todayOverallCount: number;
  currentStreak: number;
  longestStreak: number;
  todayPanchanga: ReturnType<typeof getPanchangaForDate>;
  activeAnusthanasCalculated: Array<Anusthana & {
    currentCount: number;
    remainingCount: number;
    daysRemaining: number;
    dailyRequiredCount: number;
    isOnTrack: boolean;
    todayChanted: number;
  }>;
  milestonesStatus: (Milestone & { isAchieved: boolean; achievedAt?: number })[];

  // Chart datasets
  dailyChartData: DailyStat[];
  weeklyChartData: { label: string; count: number }[];
  monthlyChartData: { label: string; count: number }[];
  categoryDistribution: { name: string; value: number; color: string }[];
  heatmapData: HeatmapDay[];
}

const SadhanaContext = createContext<SadhanaContextType | undefined>(undefined);

export const SadhanaProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load Sadhanas
  const [sadhanas, setSadhanas] = useState<Sadhana[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_SADHANAS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse sadhanas from localStorage', e);
    }
    // Initial Seed Sadhanas
    const now = Date.now();
    return [
      {
        id: 'sadhana-gayatri',
        name: 'Gayatri Mantra',
        sanskritName: 'ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात्॥',
        category: 'Mantra',
        targetCount: 100000,
        dailyGoal: 1008,
        startDate: getLocalDateString(new Date(now - 14 * 24 * 60 * 60 * 1000)),
        description: 'Supreme Vedic Gayatri Mantra for divine wisdom and spiritual light.',
        colorTheme: 'saffron',
        icon: 'Sun',
        createdAt: now - 14 * 24 * 60 * 60 * 1000
      },
      {
        id: 'sadhana-hanuman',
        name: 'Hanuman Chalisa',
        sanskritName: 'हनुमान चालीसा',
        category: 'Stotra',
        targetCount: 108,
        dailyGoal: 3,
        startDate: getLocalDateString(new Date(now - 7 * 24 * 60 * 60 * 1000)),
        description: '40 sacred verses praising Lord Hanuman for courage and devotion.',
        colorTheme: 'saffron',
        icon: 'Flame',
        createdAt: now - 7 * 24 * 60 * 60 * 1000
      },
      {
        id: 'sadhana-sahasranama',
        name: 'Vishnu Sahasranama',
        sanskritName: 'विष्णु सहस्रनाम',
        category: 'Sahasranama',
        targetCount: 108,
        dailyGoal: 1,
        startDate: getLocalDateString(new Date(now - 5 * 24 * 60 * 60 * 1000)),
        description: '1000 divine names of Bhagavan Vishnu from Mahabharata.',
        colorTheme: 'gold',
        icon: 'Rosary',
        createdAt: now - 5 * 24 * 60 * 60 * 1000
      }
    ];
  });

  // Load Session Entries
  const [entries, setEntries] = useState<SessionEntry[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_ENTRIES_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse entries from localStorage', e);
    }
    const now = Date.now();
    const day = 24 * 60 * 60 * 1000;
    return [
      { id: 'se-1', sadhanaId: 'sadhana-gayatri', timestamp: now - 3 * day, count: 1008, timeOfDay: 'Morning', notes: 'Brahma Muhurta japa' },
      { id: 'se-2', sadhanaId: 'sadhana-gayatri', timestamp: now - 2 * day, count: 1008, timeOfDay: 'Morning', notes: 'Sunrise meditation' },
      { id: 'se-3', sadhanaId: 'sadhana-hanuman', timestamp: now - 2 * day, count: 3, timeOfDay: 'Evening', notes: 'Tuesday evening prayers' },
      { id: 'se-4', sadhanaId: 'sadhana-gayatri', timestamp: now - 1 * day, count: 1008, timeOfDay: 'Morning', notes: 'Daily Gayatri Sadhana' },
      { id: 'se-5', sadhanaId: 'sadhana-sahasranama', timestamp: now - 1 * day, count: 1, timeOfDay: 'Evening', notes: 'Night Sahasranama recitation' },
      { id: 'se-6', sadhanaId: 'sadhana-gayatri', timestamp: now - 3 * 3600 * 1000, count: 108, timeOfDay: 'Morning', notes: 'Quick morning beads' }
    ];
  });

  // Load Anusthanas
  const [anusthanas, setAnusthanas] = useState<Anusthana[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_ANUSTHANAS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse anusthanas from localStorage', e);
    }
    const today = new Date();
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + 30);
    return [
      {
        id: 'anu-1',
        sadhanaId: 'sadhana-gayatri',
        title: 'Gayatri Purascharana Anusthana',
        sanskritTitle: 'गायत्री पुरश्चरण अनुष्ठानम्',
        startDate: getLocalDateString(today),
        endDate: getLocalDateString(endDate),
        targetCount: 24000,
        numberOfDays: 30,
        notes: '30-day sacred Gayatri discipline toward 24,000 target.'
      }
    ];
  });

  // Load Parayana Books
  const [parayanaBooks, setParayanaBooks] = useState<ParayanaBook[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_PARAYANA_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse parayana books from localStorage', e);
    }
    return INITIAL_PARAYANA_BOOKS;
  });

  // Load User Settings
  const [settings, setSettings] = useState<UserSettings>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_SETTINGS_KEY);
      if (saved) return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    } catch (e) {
      console.error('Failed to parse settings from localStorage', e);
    }
    return DEFAULT_SETTINGS;
  });

  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [selectedSadhanaId, setSelectedSadhanaIdState] = useState<string | null>(null);
  const [lastAddedEntry, setLastAddedEntry] = useState<SessionEntry | null>(null);
  const [celebratingMilestone, setCelebratingMilestone] = useState<Milestone | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('Active');

  // Real-time Firestore Synchronization when User is logged in
  useEffect(() => {
    if (!user) return;

    // Listen to Sadhanas
    const sadhanasRef = collection(db, 'users', user.uid, 'sadhanas');
    const unsubSadhanas = onSnapshot(sadhanasRef, snapshot => {
      if (!snapshot.empty) {
        const docs = snapshot.docs.map(d => d.data() as Sadhana);
        setSadhanas(docs);
      }
    });

    // Listen to Session Entries
    const sessionsRef = collection(db, 'users', user.uid, 'sessions');
    const unsubSessions = onSnapshot(sessionsRef, snapshot => {
      if (!snapshot.empty) {
        const docs = snapshot.docs.map(d => d.data() as SessionEntry);
        setEntries(docs.sort((a, b) => b.timestamp - a.timestamp));
      }
    });

    // Listen to Anusthanas
    const anusthanasRef = collection(db, 'users', user.uid, 'anusthanas');
    const unsubAnusthanas = onSnapshot(anusthanasRef, snapshot => {
      if (!snapshot.empty) {
        const docs = snapshot.docs.map(d => d.data() as Anusthana);
        setAnusthanas(docs);
      }
    });

    return () => {
      unsubSadhanas();
      unsubSessions();
      unsubAnusthanas();
    };
  }, [user]);

  // Firestore Write Helpers
  const syncSadhanaToCloud = async (sadhana: Sadhana) => {
    if (!user) return;
    try {
      await setDoc(doc(db, 'users', user.uid, 'sadhanas', sadhana.id), sadhana);
    } catch (e) {
      console.warn('Firestore sadhana write:', e);
    }
  };

  const deleteSadhanaFromCloud = async (id: string) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'sadhanas', id));
    } catch (e) {
      console.warn('Firestore sadhana delete:', e);
    }
  };

  const syncSessionToCloud = async (entry: SessionEntry) => {
    if (!user) return;
    try {
      await setDoc(doc(db, 'users', user.uid, 'sessions', entry.id), entry);
    } catch (e) {
      console.warn('Firestore session write:', e);
    }
  };

  const deleteSessionFromCloud = async (id: string) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'sessions', id));
    } catch (e) {
      console.warn('Firestore session delete:', e);
    }
  };

  const syncAnusthanaToCloud = async (anusthana: Anusthana) => {
    if (!user) return;
    try {
      await setDoc(doc(db, 'users', user.uid, 'anusthanas', anusthana.id), anusthana);
    } catch (e) {
      console.warn('Firestore anusthana write:', e);
    }
  };

  const deleteAnusthanaFromCloud = async (id: string) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'anusthanas', id));
    } catch (e) {
      console.warn('Firestore anusthana delete:', e);
    }
  };

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_SADHANAS_KEY, JSON.stringify(sadhanas));
  }, [sadhanas]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_ENTRIES_KEY, JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_ANUSTHANAS_KEY, JSON.stringify(anusthanas));
  }, [anusthanas]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_PARAYANA_KEY, JSON.stringify(parayanaBooks));
  }, [parayanaBooks]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  // Handle dark mode DOM sync
  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === 'dark') {
      root.classList.add('dark');
    } else if (settings.theme === 'light') {
      root.classList.remove('dark');
    } else {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [settings.theme]);

  // Selected Sadhana instance
  const selectedSadhana = useMemo(() => {
    if (selectedSadhanaId) {
      return sadhanas.find(s => s.id === selectedSadhanaId) || sadhanas[0] || null;
    }
    return sadhanas[0] || null;
  }, [sadhanas, selectedSadhanaId]);

  const setSelectedSadhanaId = (id: string | null) => {
    setSelectedSadhanaIdState(id);
  };

  // Sadhana CRUD
  const createSadhana = (data: Omit<Sadhana, 'id' | 'createdAt'>): Sadhana => {
    const newSadhana: Sadhana = {
      ...data,
      id: 'sadhana-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      createdAt: Date.now()
    };
    setSadhanas(prev => [newSadhana, ...prev]);
    setSelectedSadhanaIdState(newSadhana.id);
    syncSadhanaToCloud(newSadhana);
    return newSadhana;
  };

  const editSadhana = (id: string, data: Partial<Sadhana>) => {
    setSadhanas(prev => prev.map(s => {
      if (s.id === id) {
        const updated = { ...s, ...data };
        syncSadhanaToCloud(updated);
        return updated;
      }
      return s;
    }));
  };

  const deleteSadhana = (id: string) => {
    setSadhanas(prev => prev.filter(s => s.id !== id));
    setEntries(prev => prev.filter(e => e.sadhanaId !== id));
    setAnusthanas(prev => prev.filter(a => a.sadhanaId !== id));
    if (selectedSadhanaId === id) {
      setSelectedSadhanaIdState(null);
    }
    deleteSadhanaFromCloud(id);
  };

  const archiveSadhana = (id: string) => {
    setSadhanas(prev => prev.map(s => {
      if (s.id === id) {
        const updated = { ...s, isArchived: !s.isArchived };
        syncSadhanaToCloud(updated);
        return updated;
      }
      return s;
    }));
  };

  // Computed Overall Totals
  const totalOverallCount = useMemo(() => {
    return entries.reduce((acc, curr) => acc + curr.count, 0);
  }, [entries]);

  const todayOverallCount = useMemo(() => {
    const todayStr = getLocalDateString(new Date());
    return entries.reduce((sum, entry) => {
      const entryDateStr = getLocalDateString(new Date(entry.timestamp));
      return entryDateStr === todayStr ? sum + entry.count : sum;
    }, 0);
  }, [entries]);

  // Milestone check helper
  const checkMilestones = (newTotal: number, prevTotal: number) => {
    for (const milestone of MILESTONES_LIST) {
      if (prevTotal < milestone.targetCount && newTotal >= milestone.targetCount) {
        setCelebratingMilestone(milestone);
        soundManager.playTempleBell(settings.soundEnabled);
        break;
      }
    }
  };

  // Chant Session Logging
  const addChantSession = (
    count: number,
    sadhanaId?: string,
    timeOfDay?: TimeOfDay,
    notes?: string
  ) => {
    if (count <= 0) return;
    const targetSadhanaId = sadhanaId || selectedSadhana?.id || sadhanas[0]?.id;
    if (!targetSadhanaId) return;

    // Infer time of day if not explicitly passed
    let computedTime: TimeOfDay = timeOfDay || 'Morning';
    if (!timeOfDay) {
      const hour = new Date().getHours();
      if (hour >= 4 && hour < 12) computedTime = 'Morning';
      else if (hour >= 12 && hour < 17) computedTime = 'Afternoon';
      else if (hour >= 17 && hour < 21) computedTime = 'Evening';
      else computedTime = 'Night';
    }

    const prevTotal = totalOverallCount;
    const newEntry: SessionEntry = {
      id: 'se-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      sadhanaId: targetSadhanaId,
      timestamp: Date.now(),
      count,
      timeOfDay: computedTime,
      notes: notes?.trim() ? notes.trim() : undefined
    };

    setEntries(prev => [newEntry, ...prev]);
    setLastAddedEntry(newEntry);
    syncSessionToCloud(newEntry);

    // Audio & tactile feedback
    if (count >= 108) {
      soundManager.playTempleBell(settings.soundEnabled);
    } else {
      soundManager.playBeadClick(settings.soundEnabled);
    }
    soundManager.triggerVibration(settings.vibrationEnabled, count >= 108 ? [50, 100, 150] : 30);

    // Check milestone trigger
    checkMilestones(prevTotal + count, prevTotal);
  };

  const undoLastSession = (): boolean => {
    if (!lastAddedEntry) return false;
    deleteSessionFromCloud(lastAddedEntry.id);
    setEntries(prev => prev.filter(e => e.id !== lastAddedEntry.id));
    setLastAddedEntry(null);
    soundManager.triggerVibration(settings.vibrationEnabled, 40);
    return true;
  };

  const deleteEntry = (id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id));
    if (lastAddedEntry?.id === id) setLastAddedEntry(null);
    deleteSessionFromCloud(id);
  };

  const editEntry = (id: string, count: number, timeOfDay: TimeOfDay, notes?: string) => {
    if (count <= 0) return;
    setEntries(prev =>
      prev.map(e => {
        if (e.id === id) {
          const updated = { ...e, count, timeOfDay, notes: notes?.trim() || undefined };
          syncSessionToCloud(updated);
          return updated;
        }
        return e;
      })
    );
  };

  // Anusthana Management
  const createAnusthana = (data: Omit<Anusthana, 'id'>): Anusthana => {
    const newAnu: Anusthana = {
      ...data,
      id: 'anu-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6)
    };
    setAnusthanas(prev => [newAnu, ...prev]);
    syncAnusthanaToCloud(newAnu);
    return newAnu;
  };

  const deleteAnusthana = (id: string) => {
    setAnusthanas(prev => prev.filter(a => a.id !== id));
    deleteAnusthanaFromCloud(id);
  };

  // Parayana Management
  const toggleParayanaUnit = (bookId: string, unitNumber: number) => {
    setParayanaBooks(prev =>
      prev.map(b => {
        if (b.id !== bookId) return b;
        const updatedUnits = b.units.map(u => {
          if (u.number === unitNumber) {
            const nextCompleted = !u.isCompleted;
            return {
              ...u,
              isCompleted: nextCompleted,
              completedAt: nextCompleted ? Date.now() : undefined
            };
          }
          return u;
        });
        const completedCount = updatedUnits.filter(u => u.isCompleted).length;
        const nextUncompleted = updatedUnits.find(u => !u.isCompleted);
        return {
          ...b,
          units: updatedUnits,
          currentUnit: nextUncompleted ? nextUncompleted.number : b.totalUnits
        };
      })
    );
  };

  const resetParayanaBook = (bookId: string) => {
    setParayanaBooks(prev =>
      prev.map(b => {
        if (b.id !== bookId) return b;
        return {
          ...b,
          currentUnit: 1,
          units: b.units.map(u => ({ ...u, isCompleted: false, completedAt: undefined }))
        };
      })
    );
  };

  // Settings & Navigation
  const updateSettings = (newSettings: Partial<UserSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const dismissMilestoneCelebration = () => {
    setCelebratingMilestone(null);
  };

  const clearAllData = () => {
    setEntries([]);
    setSadhanas([]);
    setAnusthanas([]);
    setLastAddedEntry(null);
    localStorage.removeItem(LOCAL_STORAGE_SADHANAS_KEY);
    localStorage.removeItem(LOCAL_STORAGE_ENTRIES_KEY);
    localStorage.removeItem(LOCAL_STORAGE_ANUSTHANAS_KEY);
    localStorage.removeItem(LOCAL_STORAGE_PARAYANA_KEY);
  };

  // Search & Filtered Sadhanas
  const filteredSadhanas = useMemo(() => {
    return sadhanas.filter(s => {
      // Category filter
      if (categoryFilter !== 'All' && s.category !== categoryFilter) {
        return false;
      }
      // Status filter
      if (statusFilter === 'Active' && s.isArchived) return false;
      if (statusFilter === 'Archived' && !s.isArchived) return false;
      if (statusFilter === 'Completed' && !s.isCompleted) return false;

      // Text query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchName = s.name.toLowerCase().includes(query);
        const matchSanskrit = s.sanskritName?.toLowerCase().includes(query);
        const matchCategory = s.category.toLowerCase().includes(query);
        return matchName || matchSanskrit || matchCategory;
      }
      return true;
    });
  }, [sadhanas, categoryFilter, statusFilter, searchQuery]);

  // Panchanga for current day
  const todayPanchanga = useMemo(() => {
    return getPanchangaForDate(new Date());
  }, []);

  // Streaks calculation
  const { currentStreak, longestStreak } = useMemo(() => {
    if (entries.length === 0) return { currentStreak: 0, longestStreak: 0 };

    const activeDates = new Set<string>();
    entries.forEach(e => {
      activeDates.add(getLocalDateString(new Date(e.timestamp)));
    });

    const todayStr = getLocalDateString(new Date());
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterdayStr = getLocalDateString(yesterdayDate);

    let streak = 0;
    let checkDate = new Date();

    if (activeDates.has(todayStr)) {
      checkDate = new Date();
    } else if (activeDates.has(yesterdayStr)) {
      checkDate = yesterdayDate;
    } else {
      streak = 0;
    }

    if (activeDates.has(todayStr) || activeDates.has(yesterdayStr)) {
      while (true) {
        const dStr = getLocalDateString(checkDate);
        if (activeDates.has(dStr)) {
          streak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }
    }

    // Max streak calculation
    let maxStreak = 0;
    let tempStreak = 0;
    const ascDates = Array.from(activeDates).sort();
    let prevD: Date | null = null;

    for (const dStr of ascDates) {
      const currentD = new Date(dStr + 'T00:00:00');
      if (!prevD) {
        tempStreak = 1;
      } else {
        const diffDays = Math.round((currentD.getTime() - prevD.getTime()) / (1000 * 3600 * 24));
        if (diffDays === 1) tempStreak++;
        else tempStreak = 1;
      }
      if (tempStreak > maxStreak) maxStreak = tempStreak;
      prevD = currentD;
    }

    return {
      currentStreak: streak,
      longestStreak: Math.max(streak, maxStreak)
    };
  }, [entries]);

  // Calculated Anusthanas
  const activeAnusthanasCalculated = useMemo(() => {
    const todayStr = getLocalDateString(new Date());

    return anusthanas.map(a => {
      // Find all session entries for this sadhana
      const sadhanaEntries = entries.filter(e => e.sadhanaId === a.sadhanaId);
      const currentCount = sadhanaEntries.reduce((acc, e) => acc + e.count, 0);
      const remainingCount = Math.max(0, a.targetCount - currentCount);

      const endD = new Date(a.endDate + 'T23:59:59');
      const todayD = new Date();
      const diffMs = endD.getTime() - todayD.getTime();
      const daysRemaining = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));

      const dailyRequiredCount = Math.ceil(remainingCount / daysRemaining);

      const todayChanted = sadhanaEntries.reduce((sum, e) => {
        return getLocalDateString(new Date(e.timestamp)) === todayStr ? sum + e.count : sum;
      }, 0);

      const isOnTrack = todayChanted >= dailyRequiredCount || remainingCount === 0;

      return {
        ...a,
        currentCount,
        remainingCount,
        daysRemaining,
        dailyRequiredCount,
        isOnTrack,
        todayChanted
      };
    });
  }, [anusthanas, entries]);

  // Milestones status calculation
  const milestonesStatus = useMemo(() => {
    return MILESTONES_LIST.map(m => {
      const isAchieved = totalOverallCount >= m.targetCount;
      let runningSum = 0;
      let achievedAt: number | undefined = undefined;
      const ascEntries = [...entries].sort((a, b) => a.timestamp - b.timestamp);
      for (const e of ascEntries) {
        runningSum += e.count;
        if (runningSum >= m.targetCount) {
          achievedAt = e.timestamp;
          break;
        }
      }
      return {
        ...m,
        isAchieved,
        achievedAt
      };
    });
  }, [totalOverallCount, entries]);

  // Chart datasets
  const dailyChartData = useMemo(() => {
    const days: DailyStat[] = [];
    const dateMap = new Map<string, number>();

    entries.forEach(e => {
      const dateStr = getLocalDateString(new Date(e.timestamp));
      dateMap.set(dateStr, (dateMap.get(dateStr) || 0) + e.count);
    });

    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = getLocalDateString(d);
      const displayDate = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
      days.push({
        date: dateStr,
        displayDate,
        count: dateMap.get(dateStr) || 0
      });
    }

    return days;
  }, [entries]);

  const weeklyChartData = useMemo(() => {
    const result = [];
    for (let i = 5; i >= 0; i--) {
      const end = new Date();
      end.setDate(end.getDate() - i * 7);
      const start = new Date(end);
      start.setDate(start.getDate() - 6);

      const label = `${start.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}`;

      const startTime = new Date(start.setHours(0, 0, 0, 0)).getTime();
      const endTime = new Date(end.setHours(23, 59, 59, 999)).getTime();

      const count = entries.reduce((acc, e) => {
        if (e.timestamp >= startTime && e.timestamp <= endTime) return acc + e.count;
        return acc;
      }, 0);

      result.push({ label, count });
    }
    return result;
  }, [entries]);

  const monthlyChartData = useMemo(() => {
    const result = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const year = d.getFullYear();
      const month = d.getMonth();
      const label = d.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' });

      const count = entries.reduce((acc, e) => {
        const ed = new Date(e.timestamp);
        if (ed.getFullYear() === year && ed.getMonth() === month) return acc + e.count;
        return acc;
      }, 0);

      result.push({ label, count });
    }
    return result;
  }, [entries]);

  // Category distribution for Analytics
  const categoryDistribution = useMemo(() => {
    const map = new Map<string, number>();
    entries.forEach(e => {
      const sadhana = sadhanas.find(s => s.id === e.sadhanaId);
      const cat = sadhana?.category || 'Other';
      map.set(cat, (map.get(cat) || 0) + e.count);
    });

    const colors: Record<string, string> = {
      Mantra: '#F59E0B',
      Stotra: '#EF4444',
      Sahasranama: '#10B981',
      Kavacha: '#6366F1',
      Parayana: '#8B5CF6',
      Japa: '#EC4899',
      Vrata: '#14B8A6',
      Other: '#6B7280'
    };

    return Array.from(map.entries()).map(([name, value]) => ({
      name,
      value,
      color: colors[name] || '#F59E0B'
    }));
  }, [entries, sadhanas]);

  // Heatmap dataset
  const heatmapData = useMemo(() => {
    const countMap = new Map<string, number>();
    entries.forEach(e => {
      const dStr = getLocalDateString(new Date(e.timestamp));
      countMap.set(dStr, (countMap.get(dStr) || 0) + e.count);
    });

    const result: HeatmapDay[] = [];
    const today = new Date();

    for (let i = 364; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateStr = getLocalDateString(d);
      const count = countMap.get(dateStr) || 0;

      let intensity = 0;
      if (count > 0 && count < 108) intensity = 1;
      else if (count >= 108 && count < 540) intensity = 2;
      else if (count >= 540 && count < 1008) intensity = 3;
      else if (count >= 1008) intensity = 4;

      result.push({ date: dateStr, count, intensity });
    }

    return result;
  }, [entries]);

  // Export handlers
  const exportJSON = () => {
    const backup = {
      appName: 'Sadhana Tracker',
      version: '2.0',
      exportedAt: new Date().toISOString(),
      sadhanas,
      entries,
      anusthanas,
      parayanaBooks,
      settings
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Sadhana_Tracker_Backup_${getLocalDateString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportCSV = () => {
    let csv = 'EntryID,SadhanaName,Category,Date,Time,TimeOfDay,Count,Notes\n';
    entries.forEach(e => {
      const sadhana = sadhanas.find(s => s.id === e.sadhanaId);
      const name = sadhana ? `"${sadhana.name.replace(/"/g, '""')}"` : 'General';
      const cat = sadhana ? sadhana.category : 'Other';
      const d = new Date(e.timestamp);
      const dateStr = d.toISOString().split('T')[0];
      const timeStr = d.toTimeString().split(' ')[0];
      const note = e.notes ? `"${e.notes.replace(/"/g, '""')}"` : '';
      csv += `${e.id},${name},${cat},${dateStr},${timeStr},${e.timeOfDay},${e.count},${note}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Sadhana_History_${getLocalDateString()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (jsonData: string): { success: boolean; message: string } => {
    try {
      const parsed = JSON.parse(jsonData);
      if (parsed.sadhanas && Array.isArray(parsed.sadhanas)) {
        setSadhanas(parsed.sadhanas);
      }
      if (parsed.entries && Array.isArray(parsed.entries)) {
        setEntries(parsed.entries);
      }
      if (parsed.anusthanas && Array.isArray(parsed.anusthanas)) {
        setAnusthanas(parsed.anusthanas);
      }
      if (parsed.parayanaBooks && Array.isArray(parsed.parayanaBooks)) {
        setParayanaBooks(parsed.parayanaBooks);
      }
      if (parsed.settings) {
        setSettings(prev => ({ ...prev, ...parsed.settings }));
      }
      return { success: true, message: 'Successfully imported Sadhana backup data!' };
    } catch {
      return { success: false, message: 'Invalid backup file format.' };
    }
  };

  return (
    <SadhanaContext.Provider
      value={{
        sadhanas,
        entries,
        anusthanas,
        parayanaBooks,
        settings,
        activeTab,
        selectedSadhana,
        lastAddedEntry,
        celebratingMilestone,
        searchQuery,
        categoryFilter,
        statusFilter,

        createSadhana,
        editSadhana,
        deleteSadhana,
        archiveSadhana,
        setSelectedSadhanaId,

        addChantSession,
        undoLastSession,
        deleteEntry,
        editEntry,

        createAnusthana,
        deleteAnusthana,

        toggleParayanaUnit,
        resetParayanaBook,

        updateSettings,
        setActiveTab,
        setSearchQuery,
        setCategoryFilter,
        setStatusFilter,
        dismissMilestoneCelebration,
        clearAllData,
        importData,
        exportJSON,
        exportCSV,

        filteredSadhanas,
        totalOverallCount,
        todayOverallCount,
        currentStreak,
        longestStreak,
        todayPanchanga,
        activeAnusthanasCalculated,
        milestonesStatus,

        dailyChartData,
        weeklyChartData,
        monthlyChartData,
        categoryDistribution,
        heatmapData
      }}
    >
      {children}
    </SadhanaContext.Provider>
  );
};

export const useSadhana = (): SadhanaContextType => {
  const context = useContext(SadhanaContext);
  if (!context) {
    throw new Error('useSadhana must be used within a SadhanaProvider');
  }
  return context;
};

// Backward compatibility hook alias
export const useJapa = useSadhana;
export const JapaProvider = SadhanaProvider;
