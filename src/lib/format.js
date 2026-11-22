// Numbers in Indonesian format (update v5, file 01 §3): 89.200 · 35,5% · Rp30,2 Mio.
// The tracker keeps its own (English) format; only the formatting differs, the maths is the
// tracker's own (progress.js, copied whole).

const nf = new Intl.NumberFormat('id-ID');

/** 1250 → '1.250' */
export function fmtNum(n) {
  return nf.format(Number(n) || 0);
}

/** 35.5 → '35,5%', 100 → '100%', null → '–' (one decimal at most, like the tracker's achievement) */
export function fmtPct(value) {
  if (value == null) return '–';
  const text = Number.isInteger(value) ? String(value) : value.toFixed(1).replace('.', ',');
  return `${text}%`;
}
