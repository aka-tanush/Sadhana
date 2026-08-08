import { SadhanaCategory, ColorTheme, SadhanaIcon } from '../types';

export interface SadhanaPreset {
  id: string;
  name: string;
  sanskritName: string;
  category: SadhanaCategory;
  defaultTargetCount: number;
  defaultDailyGoal: number;
  description: string;
  colorTheme: ColorTheme;
  icon: SadhanaIcon;
  suggestedAnusthanaDays?: number;
}

export const SADHANA_PRESETS: SadhanaPreset[] = [
  {
    id: 'preset-gayatri',
    name: 'Gayatri Mantra',
    sanskritName: 'गायत्री मन्त्रः',
    category: 'Mantra',
    defaultTargetCount: 100000,
    defaultDailyGoal: 1008,
    description: 'The supreme Vedic prayer for divine wisdom, spiritual awakening, and inner radiance.',
    colorTheme: 'saffron',
    icon: 'Sun',
    suggestedAnusthanaDays: 40
  },
  {
    id: 'preset-mahamrityunjaya',
    name: 'Mahamrityunjaya Mantra',
    sanskritName: 'महामृत्युञ्जय मन्त्रः',
    category: 'Mantra',
    defaultTargetCount: 125000,
    defaultDailyGoal: 1008,
    description: 'The great death-conquering mantra dedicated to Lord Shiva for health, longevity, and liberation.',
    colorTheme: 'rudraksha',
    icon: 'Flame',
    suggestedAnusthanaDays: 41
  },
  {
    id: 'preset-hanuman-chalisa',
    name: 'Hanuman Chalisa',
    sanskritName: 'हनुमान चालीसा',
    category: 'Stotra',
    defaultTargetCount: 108,
    defaultDailyGoal: 3,
    description: '40 sacred verses composed by Sant Tulsidas praising Lord Hanuman for strength, devotion, and protection.',
    colorTheme: 'saffron',
    icon: 'Flame',
    suggestedAnusthanaDays: 40
  },
  {
    id: 'preset-vishnu-sahasranama',
    name: 'Vishnu Sahasranama',
    sanskritName: 'विष्णु सहस्रनाम',
    category: 'Sahasranama',
    defaultTargetCount: 108,
    defaultDailyGoal: 1,
    description: '1000 holy names of Lord Vishnu from Mahabharata for supreme peace, prosperity, and cosmic order.',
    colorTheme: 'gold',
    icon: 'Rosary',
    suggestedAnusthanaDays: 48
  },
  {
    id: 'preset-lalitha-sahasranama',
    name: 'Lalitha Sahasranama',
    sanskritName: 'ललिता सहस्रनाम',
    category: 'Sahasranama',
    defaultTargetCount: 108,
    defaultDailyGoal: 1,
    description: '1000 divine names of the Divine Mother Lalitha Tripura Sundari from Brahmanda Purana.',
    colorTheme: 'lotus',
    icon: 'Lotus',
    suggestedAnusthanaDays: 48
  },
  {
    id: 'preset-aditya-hridayam',
    name: 'Aditya Hridayam',
    sanskritName: 'आदित्य हृदयम्',
    category: 'Stotra',
    defaultTargetCount: 108,
    defaultDailyGoal: 3,
    description: 'Sacred hymn imparted by Sage Agastya to Lord Rama before the battle for victory and vitality.',
    colorTheme: 'saffron',
    icon: 'Sun',
    suggestedAnusthanaDays: 21
  },
  {
    id: 'preset-sri-rudram',
    name: 'Sri Rudram',
    sanskritName: 'श्री रुद्रम्',
    category: 'Japa',
    defaultTargetCount: 108,
    defaultDailyGoal: 1,
    description: 'Vedic hymn from Yajurveda praising Lord Shiva in all manifestations of nature and cosmos.',
    colorTheme: 'rudraksha',
    icon: 'Flame',
    suggestedAnusthanaDays: 11
  },
  {
    id: 'preset-durga-saptashati',
    name: 'Durga Saptashati / Devi Mahatmyam',
    sanskritName: 'दुर्गा सप्तशती',
    category: 'Parayana',
    defaultTargetCount: 13,
    defaultDailyGoal: 1,
    description: '700 verses in 13 chapters celebrating the triumphs of Goddess Durga over negative forces.',
    colorTheme: 'ruby',
    icon: 'Book',
    suggestedAnusthanaDays: 9
  },
  {
    id: 'preset-lakshmi-ashtottara',
    name: 'Lakshmi Ashtottara Shatanamavali',
    sanskritName: 'लक्ष्मी अष्टोत्तरशतनामावली',
    category: 'Stotra',
    defaultTargetCount: 1008,
    defaultDailyGoal: 9,
    description: '108 holy names of Goddess Lakshmi for abundance, grace, and spiritual well-being.',
    colorTheme: 'gold',
    icon: 'Lotus',
    suggestedAnusthanaDays: 21
  }
];
