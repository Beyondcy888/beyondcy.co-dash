// DEV ONLY: `npm run mock` → the real dashboard UI on sample data, no Supabase.
// Pick who you are with ?as=stake|admin|admin2|dika|out (remembered for the tab):
//   stake  = a Stakeholder (Nadia)       admin  = Admin Beyondcy (maintenance-exempt)
//   admin2 = another Admin               dika   = staff (the live site sends them to the tracker)
//   out    = signed out (the live site sends them to the tracker's login)
// ?maint=1 turns Dashboard maintenance on for 2 hours (?maint=0 off). ?bar=0 hides the bar.
// ?tscale=0.3 scales the targets (e.g. to see uploads over the target); ?tscale=1 back to normal.
import { useMemo, useState } from 'react';
import { AppFrame, AppRoutes } from '../../App.jsx';
import { createMockData, MOCK_DATA_MARKER, PEOPLE } from './mockData.js';

const PERSONAS = {
  stake: { id: 'u-stake', display_name: 'Nadia', role_id: 'stakeholder', is_active: true, role: { is_admin: false } },
  admin: { id: 'u-admin', display_name: 'Admin Beyondcy', role_id: 'admin', is_active: true, role: { is_admin: true } },
  admin2: { id: 'u-admin2', display_name: 'Admin Ops', role_id: 'admin', is_active: true, role: { is_admin: true } },
  dika: { id: 'u-dika', display_name: 'Dika', role_id: 'beefix', is_active: true, role: { is_admin: false } },
  out: null,
};

function read(key, fallback) {
  try {
    return sessionStorage.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
}
function write(key, value) {
  try {
    sessionStorage.setItem(key, value);
  } catch {
    /* ignore */
  }
}

function initial() {
  const params = new URLSearchParams(window.location.search);
  if (params.get('as') in PERSONAS) write('dash-mock-as', params.get('as'));
  if (params.has('maint')) write('dash-mock-maint', params.get('maint'));
  if (params.has('bar')) write('dash-mock-bar', params.get('bar'));
  if (params.has('tscale')) write('dash-mock-tscale', params.get('tscale'));
  return read('dash-mock-as', 'stake');
}

const data = createMockData();
const delay = (v) => new Promise((r) => setTimeout(() => r(v), 120));

function createMockApi(persona, setPersona) {
  const person = PERSONAS[persona];
  const session = person ? { user: { id: person.id } } : null;
  const maintOn = read('dash-mock-maint', '0') === '1';
  const endsAt = new Date(Date.now() + 2 * 3600 * 1000).toISOString();
  return {
    marker: MOCK_DATA_MARKER,
    getSession: () => Promise.resolve({ data: { session } }),
    onAuthChange: () => () => {},
    async signOut() {
      write('dash-mock-as', 'out');
      setPersona('out');
      return { error: null };
    },
    getProfile: (id) => delay({ data: person && person.id === id ? { ...person, avatar_path: null, avatar_updated_at: null } : null, error: null }),
    listContent: (start, end) => delay({ data: data.content(start, end), error: null }),
    listTargets: (month) => {
      const k = Number(read('dash-mock-tscale', '1')) || 1;
      const rows = data.targets(month).map((r) => {
        const reels = Math.round(r.target_reels * k);
        const feed = Math.round(r.target_feed * k);
        return { ...r, target_reels: reels, target_feed: feed, target_total: reels + feed };
      });
      return delay({ data: rows, error: null });
    },
    listPeople: () => delay({ data: PEOPLE, error: null }),
    avatarUrls: () => Promise.resolve({ data: {}, error: null }),
    getMaintenance: () => delay({ data: { site: 'dashboard', is_on: maintOn, starts_at: null, ends_at: maintOn ? endsAt : null }, error: null }),
    subscribeMaintenance: () => () => {},
    isMaintenanceExempt: () => delay({ data: persona === 'admin', error: null }),
  };
}

export function MockApp() {
  const [persona, setPersona] = useState(initial);
  const api = useMemo(() => createMockApi(persona, setPersona), [persona]);
  const showBar = read('dash-mock-bar', '1') !== '0';
  return (
    <>
      <AppFrame key={persona} api={api}>
        <AppRoutes />
      </AppFrame>
      {showBar && (
        <div style={{ position: 'fixed', left: 12, bottom: 12, zIndex: 99, display: 'flex', gap: 8, alignItems: 'center', padding: '6px 10px', borderRadius: 999, background: '#2a1d2c', color: '#fff', font: '500 12px system-ui', border: '1px solid #c2459a' }}>
          <span>Mock data</span>
          <select
            value={persona}
            onChange={(e) => {
              write('dash-mock-as', e.target.value);
              setPersona(e.target.value);
            }}
          >
            {Object.keys(PERSONAS).map((k) => (
              <option key={k} value={k}>
                {k === 'out' ? 'signed out' : k}
              </option>
            ))}
          </select>
        </div>
      )}
    </>
  );
}
