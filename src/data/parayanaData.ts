import { ParayanaBook } from '../types';

export const INITIAL_PARAYANA_BOOKS: ParayanaBook[] = [
  {
    id: 'gita-18',
    title: 'Srimad Bhagavad Gita',
    sanskritTitle: 'श्रीमद्भगवद्गीता',
    unitType: 'Chapter',
    totalUnits: 18,
    currentUnit: 1,
    description: '18 Chapters of divine discourse spoken by Bhagavan Sri Krishna to Arjuna on the battlefield of Kurukshetra.',
    units: [
      { number: 1, title: 'Chapter 1: Arjuna Vishada Yoga', subTitle: 'The Yoga of Arjuna’s Despondency', isCompleted: false },
      { number: 2, title: 'Chapter 2: Sankhya Yoga', subTitle: 'The Yoga of Knowledge & Self-Realization', isCompleted: false },
      { number: 3, title: 'Chapter 3: Karma Yoga', subTitle: 'The Yoga of Selfless Action', isCompleted: false },
      { number: 4, title: 'Chapter 4: Jnana Karma Sanyasa Yoga', subTitle: 'The Yoga of Wisdom and Renunciation of Action', isCompleted: false },
      { number: 5, title: 'Chapter 5: Karma Sanyasa Yoga', subTitle: 'The Yoga of Renunciation', isCompleted: false },
      { number: 6, title: 'Chapter 6: Dhyana Yoga', subTitle: 'The Yoga of Meditation', isCompleted: false },
      { number: 7, title: 'Chapter 7: Jnana Vijnana Yoga', subTitle: 'The Yoga of Wisdom and Realization', isCompleted: false },
      { number: 8, title: 'Chapter 8: Akshara Brahma Yoga', subTitle: 'The Yoga of Eternal Brahman', isCompleted: false },
      { number: 9, title: 'Chapter 9: Raja Vidya Raja Guhya Yoga', subTitle: 'The Yoga of Sovereign Science & Mystery', isCompleted: false },
      { number: 10, title: 'Chapter 10: Vibhuti Yoga', subTitle: 'The Yoga of Divine Glories', isCompleted: false },
      { number: 11, title: 'Chapter 11: Vishwarupa Darshana Yoga', subTitle: 'The Vision of the Cosmic Form', isCompleted: false },
      { number: 12, title: 'Chapter 12: Bhakti Yoga', subTitle: 'The Yoga of Pure Devotion', isCompleted: false },
      { number: 13, title: 'Chapter 13: Kshetra Kshetrajna Vibhaga Yoga', subTitle: 'The Field & Knower of the Field', isCompleted: false },
      { number: 14, title: 'Chapter 14: Gunatraya Vibhaga Yoga', subTitle: 'The Three Gunas of Nature', isCompleted: false },
      { number: 15, title: 'Chapter 15: Purushottama Yoga', subTitle: 'The Supreme Divine Person', isCompleted: false },
      { number: 16, title: 'Chapter 16: Daivasura Sampad Vibhaga Yoga', subTitle: 'Divine & Demonic Natures', isCompleted: false },
      { number: 17, title: 'Chapter 17: Shraddhatraya Vibhaga Yoga', subTitle: 'Threefold Division of Faith', isCompleted: false },
      { number: 18, title: 'Chapter 18: Moksha Sanyasa Yoga', subTitle: 'The Yoga of Liberation & Surrender', isCompleted: false }
    ]
  },
  {
    id: 'ramayana-7',
    title: 'Valmiki Ramayana',
    sanskritTitle: 'वाल्मीकि रामायणम्',
    unitType: 'Kanda',
    totalUnits: 7,
    currentUnit: 1,
    description: 'The epic story of Lord Rama’s life, righteousness, and victory in 7 major Kandas.',
    units: [
      { number: 1, title: 'Bala Kanda', subTitle: 'The Book of Youth & Divine Incarnation', isCompleted: false },
      { number: 2, title: 'Ayodhya Kanda', subTitle: 'The Book of Ayodhya & Exile', isCompleted: false },
      { number: 3, title: 'Aranya Kanda', subTitle: 'The Book of Forest Life', isCompleted: false },
      { number: 4, title: 'Kishkindha Kanda', subTitle: 'The Book of Kishkindha & Sugriva Alliance', isCompleted: false },
      { number: 5, title: 'Sundara Kanda', subTitle: 'The Book of Beauty & Hanuman’s Heroic Search', isCompleted: false },
      { number: 6, title: 'Yuddha Kanda', subTitle: 'The Book of War & Victory over Ravana', isCompleted: false },
      { number: 7, title: 'Uttara Kanda', subTitle: 'The Concluding Book of Coronation & Glory', isCompleted: false }
    ]
  },
  {
    id: 'saptashati-13',
    title: 'Durga Saptashati (Devi Mahatmyam)',
    sanskritTitle: 'दुर्गा सप्तशती',
    unitType: 'Chapter',
    totalUnits: 13,
    currentUnit: 1,
    description: '13 sacred chapters depicting Goddess Chandi destroying Madhu-Kaitabha, Mahishasura, and Shumbha-Nishumbha.',
    units: [
      { number: 1, title: 'Prathama Adhyaya', subTitle: 'Slaying of Madhu and Kaitabha', isCompleted: false },
      { number: 2, title: 'Dwitiya Adhyaya', subTitle: 'Slaughter of the Armies of Mahishasura', isCompleted: false },
      { number: 3, title: 'Tritiya Adhyaya', subTitle: 'Slaying of Mahishasura', isCompleted: false },
      { number: 4, title: 'Chaturtha Adhyaya', subTitle: 'Devi Stuti by Indra & Gods', isCompleted: false },
      { number: 5, title: 'Panchama Adhyaya', subTitle: 'Devi Conversations & Embassy of Sugriva', isCompleted: false },
      { number: 6, title: 'Shashta Adhyaya', subTitle: 'Slaying of Dhumralochana', isCompleted: false },
      { number: 7, title: 'Saptama Adhyaya', subTitle: 'Slaying of Chanda and Munda by Kali', isCompleted: false },
      { number: 8, title: 'Ashtama Adhyaya', subTitle: 'Slaying of Raktabija', isCompleted: false },
      { number: 9, title: 'Navama Adhyaya', subTitle: 'Slaying of Nishumbha', isCompleted: false },
      { number: 10, title: 'Dashama Adhyaya', subTitle: 'Slaying of Shumbha', isCompleted: false },
      { number: 11, title: 'Ekadasha Adhyaya', subTitle: 'Hymn to Narayani', isCompleted: false },
      { number: 12, title: 'Dwadasha Adhyaya', subTitle: 'Eulogy of the Merits of Durga Saptashati', isCompleted: false },
      { number: 13, title: 'Trayodasha Adhyaya', subTitle: 'Granting of Boons to King Suratha and Samadhi', isCompleted: false }
    ]
  },
  {
    id: 'bhagavatam-12',
    title: 'Srimad Bhagavatam (Maha Purana)',
    sanskritTitle: 'श्रीमद्भागवतम्',
    unitType: 'Skandha',
    totalUnits: 12,
    currentUnit: 1,
    description: '12 Cantos (Skandhas) depicting the avatars of Vishnu, devotion of Prahlada and Dhruva, and Krishna’s divine pastimes.',
    units: [
      { number: 1, title: 'Canto 1: Creation', subTitle: 'Questions by Sages & Departure of Lord Krishna', isCompleted: false },
      { number: 2, title: 'Canto 2: The Cosmic Manifestation', subTitle: 'Meditation on the Universal Form', isCompleted: false },
      { number: 3, title: 'Canto 3: The Status Quo', subTitle: 'Appearance of Varaha & Teachings of Kapila', isCompleted: false },
      { number: 4, title: 'Canto 4: The Creation of Fourth Order', subTitle: 'Stories of Dhruva, Prithu & Daksha Yajna', isCompleted: false },
      { number: 5, title: 'Canto 5: The Planetary Systems', subTitle: 'Geography of Cosmos & Rishabhadeva', isCompleted: false },
      { number: 6, title: 'Canto 6: Prescribed Duties for Mankind', subTitle: 'Deliverance of Ajamila & Vritrasura', isCompleted: false },
      { number: 7, title: 'Canto 7: The Science of God', subTitle: 'Narasimha Avatar & Prahlada’s Devotion', isCompleted: false },
      { number: 8, title: 'Canto 8: Withdrawal of Cosmic Creations', subTitle: 'Gajendra Moksha, Churning of Ocean & Vamana', isCompleted: false },
      { number: 9, title: 'Canto 9: Liberation', subTitle: 'Dynasties of Sun & Moon & Story of Lord Rama', isCompleted: false },
      { number: 10, title: 'Canto 10: The Summum Bonum', subTitle: 'Advent & Divine Leelas of Bhagavan Sri Krishna', isCompleted: false },
      { number: 11, title: 'Canto 11: General History', subTitle: 'Uddhava Gita & Philosophy of Abiding Devotion', isCompleted: false },
      { number: 12, title: 'Canto 12: Age of Deterioration (Kali Yuga)', subTitle: 'Prophecies of Kali Yuga & Markandeya Prayers', isCompleted: false }
    ]
  }
];
