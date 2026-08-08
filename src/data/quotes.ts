import { DailyQuote } from '../types';

export const GAYATRI_QUOTES: DailyQuote[] = [
  {
    id: 'quote-1',
    sanskrit: 'ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात्॥',
    transliteration: 'Oṁ Bhūr Bhuvaḥ Svaḥ Tat Savitur Vareṇyaṁ Bhargo Devasya Dhīmahi Dhiyo Yo Naḥ Pracodayāt',
    englishMeaning: 'May the Divine Light of the Supreme Being illuminate our intellect and inspire our minds toward righteousness.',
    source: 'Rigveda (3.62.10)',
    reflection: 'The Gayatri Mantra is the essence of light. As you chant today, feel the inner illumination dispelling all darkness and ignorance.'
  },
  {
    id: 'quote-2',
    sanskrit: 'गायत्री वै प्राणाः। गायत्री वा इदं सर्वं भूतं यदिदं किंच।',
    transliteration: 'Gāyatrī vai prāṇāḥ; Gāyatrī vā idaṁ sarvaṁ bhūtaṁ yadidaṁ kiṁca',
    englishMeaning: 'Gayatri is verily the vital life force (Prana). Gayatri indeed is everything that exists in this cosmos.',
    source: 'Chandogya Upanishad (3.12.1)',
    reflection: 'Every Japa reconnects your individual breath with the universal life stream. Chant with reverence and calm mindfulness.'
  },
  {
    id: 'quote-3',
    sanskrit: 'गायत्री छन्दसां माता ब्रह्मसत्यं सनातनम्।',
    transliteration: 'Gāyatrī chandasāṁ mātā brahma-satyaṁ sanātanam',
    englishMeaning: 'Gayatri is the mother of all Vedic metres, revealing the eternal truth of the Brahman.',
    source: 'Mahanarayana Upanishad',
    reflection: 'Like a compassionate mother, the Gayatri Mantra nourishes the soul with peace, clarity, and unyielding strength.'
  },
  {
    id: 'quote-4',
    sanskrit: 'न गायत्र्याः परं जप्यम्।',
    transliteration: 'Na Gāyatyāḥ paraṁ japyam',
    englishMeaning: 'There is no higher mantra for meditation and repetition than the sacred Gayatri Mantra.',
    source: 'Devi Bhagavata Purana',
    reflection: 'Continuous Gayatri Japa purifies the subtlest channels of the mind and instills deep spiritual joy.'
  },
  {
    id: 'quote-5',
    sanskrit: 'सविता वै देवतानां मन्दिरात्मका गायत्री।',
    transliteration: 'Savitā vai devatānāṁ mandirātmakā Gāyatrī',
    englishMeaning: 'The Divine Sun (Savitur) is the sanctuary of divine wisdom, embodied in the sacred syllables of Gayatri.',
    source: 'Yajurveda Taittiriya Samhita',
    reflection: 'Visualize the golden brilliance of the rising sun in your heart while repeating each syllable.'
  },
  {
    id: 'quote-6',
    sanskrit: 'मननात् त्रायते इति मन्त्रः।',
    transliteration: 'Mananāt trāyate iti mantraḥ',
    englishMeaning: 'A Mantra is that which protects and releases the mind when reflected upon repeatedly.',
    source: 'Spiritual Wisdom',
    reflection: 'With every mala of Japa, your mind becomes steady, resilient against stress, and grounded in bliss.'
  },
  {
    id: 'quote-7',
    sanskrit: 'एकः शब्दः सम्यग्ज्ञातः सुप्रयुक्तः स्वर्गे लोके कामधुग्भवति।',
    transliteration: 'Ekaḥ śabdaḥ samyag-jñātaḥ suprayuktaḥ svarge loke kāmadhug-bhavati',
    englishMeaning: 'Even a single divine syllable, when known deeply and chanted with clarity, fulfills the highest aspirations of the soul.',
    source: 'Mahabhashya of Patanjali',
    reflection: 'Quality of devotion during Japa elevates the mind far beyond mere numerical repetition.'
  }
];

export function getTodayQuote(): DailyQuote {
  const now = new Date();
  const startYear = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - startYear.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  
  const index = dayOfYear % GAYATRI_QUOTES.length;
  return GAYATRI_QUOTES[index];
}
