import { PanchangaDay } from '../types';

// Helper to determine lunar tithi approximate metadata for any given date
export function getPanchangaForDate(date: Date): PanchangaDay {
  const year = date.getFullYear();
  const month = date.getMonth(); // 0-indexed
  const day = date.getDate();

  const dateStr = date.toISOString().split('T')[0];

  // Ephemeris anchor approximation for lunar phase
  // Synodic lunar month = 29.530588 days
  const knownNewMoon = new Date('2026-01-18T18:00:00Z').getTime();
  const diffDays = (date.getTime() - knownNewMoon) / (1000 * 60 * 60 * 24);
  const lunarCycle = ((diffDays % 29.530588) + 29.530588) % 29.530588;

  // Tithi calculation (30 tithis in a synodic month, ~0.984 days each)
  const tithiNum = Math.floor((lunarCycle / 29.530588) * 30) + 1;

  let paksha: 'Shukla Paksha' | 'Krishna Paksha' = 'Shukla Paksha';
  let tithiName = 'Pratipada';

  if (tithiNum <= 15) {
    paksha = 'Shukla Paksha';
  } else {
    paksha = 'Krishna Paksha';
  }

  const tithiNames = [
    'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
    'Shashti', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
    'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi',
    tithiNum <= 15 ? 'Purnima' : 'Amavasya'
  ];

  const subIndex = ((tithiNum - 1) % 15);
  tithiName = tithiNames[subIndex];

  const isEkadashi = (subIndex === 10); // 11th tithi
  const isPurnima = (tithiNum === 15);
  const isAmavasya = (tithiNum === 30 || tithiNum === 0);
  const isPradosham = (subIndex === 12); // 13th tithi
  const isShivaratri = (paksha === 'Krishna Paksha' && subIndex === 13); // 14th tithi of Krishna Paksha

  // Special festival check table
  let festivalName: string | undefined = undefined;
  let fastingInfo: string | undefined = undefined;

  if (isEkadashi) {
    festivalName = paksha === 'Shukla Paksha' ? 'Shukla Ekadashi Vrata' : 'Krishna Ekadashi Vrata';
    fastingInfo = 'Sacred day for Lord Vishnu worship. Grain-free fasting recommended.';
  } else if (isPurnima) {
    festivalName = 'Purnima (Full Moon)';
    fastingInfo = 'Satyanarayan Vrata & Divine Mother Puja.';
  } else if (isAmavasya) {
    festivalName = 'Amavasya (New Moon)';
    fastingInfo = 'Auspicious day for Ancestral Tarpanam & Mantra Japa.';
  } else if (isShivaratri) {
    festivalName = 'Masa Shivaratri';
    fastingInfo = 'Sacred Shiva worship & night vigil Japa.';
  } else if (isPradosham) {
    festivalName = 'Pradosha Vratam';
    fastingInfo = 'Evening Bilva Archana & Rudra Chanting.';
  }

  // Major Annual Festivals overlay
  if (month === 2 && day === 8) { // March 8 approx
    festivalName = 'Maha Shivaratri 🕉️';
    fastingInfo = 'Great Night of Lord Shiva. Full night vigil with continuous Om Namah Shivaya Japa.';
  } else if (month === 3 && day === 17) {
    festivalName = 'Sri Rama Navami 🏹';
    fastingInfo = 'Celebration of Lord Rama’s Divine Incarnation. Ramayana Parayana & Nama Japa.';
  } else if (month === 3 && day === 23) {
    festivalName = 'Hanuman Jayanti 🚩';
    fastingInfo = 'Birth anniversary of Bhagavan Hanuman. Hanuman Chalisa & Sundara Kanda Parayana.';
  } else if (month === 7 && day === 15) {
    festivalName = 'Sri Krishna Janmashtami 🪶';
    fastingInfo = 'Divine Birth of Bhagavan Sri Krishna. Fasting until midnight with Gita Parayana.';
  } else if (month === 9 && day === 12) {
    festivalName = 'Sharad Navratri Begins 🌸';
    fastingInfo = '9 Divine Nights of Devi Worship. Durga Saptashati & Lalitha Sahasranama.';
  } else if (month === 10 && day === 1) {
    festivalName = 'Deepavali / Lakshmi Puja 🪔';
    fastingInfo = 'Festival of Lights. Lakshmi Ashtottara & Kanakadhara Stotra Parayana.';
  }

  const nakshatras = [
    'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashirsha', 'Ardra', 'Punarvasu',
    'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta',
    'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha', 'Mula', 'Purva Ashadha',
    'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha', 'Purva Bhadrapada',
    'Uttara Bhadrapada', 'Revati'
  ];
  const nakshatraIndex = Math.floor((day + month * 2) % 27);

  return {
    date: dateStr,
    tithi: `${paksha} ${tithiName}`,
    nakshatra: nakshatras[nakshatraIndex],
    paksha,
    isEkadashi,
    isPurnima,
    isAmavasya,
    isPradosham,
    isShivaratri,
    festivalName,
    fastingInfo
  };
}
