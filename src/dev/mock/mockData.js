// DEV ONLY (npm run mock): sample people and Content Calendar data shaped like the v5 views
// (dashboard_content, dashboard_targets, people). Deterministic, so screenshots are stable.
// MOCK_DATA_MARKER: the deploy workflow fails if this text ever reaches a production build.
import { addDays, currentMonthWIB, daysInMonth, monthStart, shiftMonth, todayWIB } from '../../lib/time.js';

export const MOCK_DATA_MARKER = 'MOCK_DATA_MARKER';

export const BRANDS = [
  ['behomy', 'Behomy'],
  ['behomy_group', 'Behomy Group'],
  ['homy8', 'Homy8'],
  ['beefix', 'Beefix'],
  ['purnava', 'Purnava'],
  ['hoteru', 'Hoteru'],
  ['corvel', 'Corvel'],
  ['kedai_makmoer_88', 'Kedai Makmoer 88'],
  ['lahap', 'Lahap'],
];

export const PEOPLE = [
  { id: 'u-arum', display_name: 'Arum' },
  { id: 'u-ilyas', display_name: 'Ilyas' },
  { id: 'u-anne', display_name: 'Anne' },
  { id: 'u-dika', display_name: 'Dika' },
  { id: 'u-zaki', display_name: 'Zaki' },
  { id: 'u-excel', display_name: 'Excel' },
].map((p) => ({ ...p, avatar_path: null, avatar_updated_at: null }));

const PIC_OF = {
  behomy: ['u-arum', 'u-ilyas', 'u-anne'],
  behomy_group: ['u-arum', 'u-anne'],
  homy8: ['u-zaki'],
  beefix: ['u-dika'],
  purnava: ['u-ilyas'],
  hoteru: ['u-anne'],
  corvel: ['u-arum'],
  kedai_makmoer_88: ['u-excel'],
  lahap: ['u-excel'],
};

const TITLES = [
  'Deep Clean Ep. 2', 'Before & after kamar kos', 'Tips dapur mungil', 'Promo akhir bulan', 'Behind the scenes',
  'Menu baru minggu ini', 'Q&A bersama tim', 'Room tour lantai 3', 'Testimoni penghuni', 'Cara pesan via DM',
  'Rekap event Sabtu', 'Hari Pahlawan: cerita tim', 'Carousel 5 ide ruang kerja', 'Daftar menu catering', 'Video ASMR potong sayur',
];

const CAPTIONS = [
  'Bersih-bersih kamar nggak harus ribet! Episode kedua ini kami tunjukkan cara cepat merapikan kamar dalam 15 menit.\n\nSimpan post ini buat nanti ya! #tipsbersih #behomy',
  'Siapa yang sudah coba? Datang langsung ke outlet terdekat dan rasakan sendiri. Promo berlaku sampai akhir bulan, jangan sampai kelewatan ya!',
  '',
  'Tiga hal yang bikin hunian terasa lebih luas:\n1. Cermin besar\n2. Warna terang\n3. Furnitur multifungsi\n\nMana yang sudah kamu coba?',
];

// a small deterministic random generator
function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function monthItems(month, today) {
  const rand = rng(Number(month.replace('-', '')));
  const items = [];
  const days = daysInMonth(month);
  let n = 0;
  for (let d = 1; d <= days; d += 1) {
    const date = `${month}-${String(d).padStart(2, '0')}`;
    const count = Math.floor(rand() * 6) + (d % 7 === 0 ? 0 : 1);
    for (let i = 0; i < count; i += 1) {
      const [brandId, brandName] = BRANDS[Math.floor(rand() * BRANDS.length)];
      const pics = PIC_OF[brandId];
      const noPic = rand() < 0.04;
      const picId = noPic ? null : pics[Math.floor(rand() * pics.length)];
      const past = date < today;
      const r = rand();
      let status;
      if (past) status = r < 0.7 ? 'uploaded' : r < 0.82 ? 'done' : r < 0.9 ? 'revision' : 'planned';
      else if (date === today) status = r < 0.4 ? 'uploaded' : r < 0.6 ? 'done' : 'planned';
      else status = r < 0.55 ? 'planned' : r < 0.85 ? 'not_started' : 'revision';
      n += 1;
      items.push({
        id: `${month}-${n}`,
        brand_id: brandId,
        brand_name: brandName,
        title: TITLES[Math.floor(rand() * TITLES.length)],
        type: rand() < 0.6 ? 'reels' : 'feed',
        status,
        publish_date: date,
        caption: CAPTIONS[Math.floor(rand() * CAPTIONS.length)],
        links: status === 'uploaded' ? [`https://www.instagram.com/p/mock${n}/`] : [],
        pic_id: picId,
        pic_name: picId ? PEOPLE.find((p) => p.id === picId).display_name : null,
        updated_at: `${date}T03:00:00Z`,
      });
    }
  }
  return items;
}

const TARGETS = {
  behomy: [18, 12], behomy_group: [6, 6], homy8: [10, 6], beefix: [8, 6], purnava: [6, 4],
  hoteru: [6, 4], corvel: [6, 4], kedai_makmoer_88: [8, 4], lahap: [6, 4],
};

export function createMockData() {
  const today = todayWIB();
  const cache = new Map();
  const itemsFor = (month) => {
    if (!cache.has(month)) cache.set(month, monthItems(month, today));
    return cache.get(month);
  };
  const thisMonth = currentMonthWIB();
  return {
    content(start, end) {
      const months = new Set([start.slice(0, 7), addDays(end, -1).slice(0, 7)]);
      return [...months].flatMap(itemsFor).filter((i) => i.publish_date >= start && i.publish_date < end);
    },
    targets(month) {
      // no targets two months ahead (an "empty" month to look at)
      if (month.slice(0, 7) > shiftMonth(thisMonth, 1)) return [];
      return Object.entries(TARGETS).map(([brand_id, [r, f]]) => ({
        month: monthStart(month.slice(0, 7)),
        brand_id,
        target_reels: r,
        target_feed: f,
        target_total: r + f,
      }));
    },
  };
}
