// The nine brands for the calendar's brand filter, in the owner's order (BRAND_ORDER in
// brandStyle.js, copied from the tracker). Names come from the data when it has them; this list
// is the fallback, so the filter always shows all nine. Short names as on the tracker's chips.
import { BRAND_ORDER } from './brandStyle.js';

const NAMES = {
  behomy: 'Behomy',
  behomy_group: 'Behomy Group',
  homy8: 'Homy8',
  beefix: 'Beefix',
  purnava: 'Purnava',
  hoteru: 'Hoteru',
  corvel: 'Corvel',
  kedai_makmoer_88: 'Kedai Makmoer 88',
  lahap: 'Lahap',
};

// the tracker's brandShort() (lib/fields.js)
const SHORT = { kedai_makmoer_88: 'Makmoer' };

/** [{ id, name }] in the owner's order, plus any brand the data has that isn't listed yet. */
export function brandList(items = []) {
  const names = { ...NAMES };
  for (const i of items) if (i.brand_id && i.brand_name) names[i.brand_id] = i.brand_name;
  const extra = Object.keys(names).filter((id) => !BRAND_ORDER.includes(id)).sort();
  return [...BRAND_ORDER, ...extra].map((id) => ({ id, name: names[id] }));
}

export function brandShortName(id, name) {
  return SHORT[id] ?? name ?? NAMES[id] ?? id;
}
