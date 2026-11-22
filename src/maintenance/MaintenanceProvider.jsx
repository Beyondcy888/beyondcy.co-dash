// Dashboard maintenance (update v4, now inside the app: update v5, file 01 §5).
//   - read site_maintenance for 'dashboard' before routing, follow it live (realtime) and
//     re-check every 60 s and when the tab comes back
//   - "active" = is_on and now < ends_at
//   - only the Admin Beyondcy account is exempt (rpc is_maintenance_exempt); the dashboard has
//     logins now, so the exemption applies here too
//   - a failed check never locks anyone out
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '../auth/AuthContext.js';
import { useApi } from '../data/ApiContext.js';

const MaintenanceContext = createContext(null);
const POLL = 60 * 1000;
const FIRST_READ_LIMIT = 4000; // never hold the page back longer than this on a slow network

/**
 * A working copy on this computer (npm run dev, the local preview) ignores maintenance and shows
 * a note instead, so the agent doing the updates can still open and check it, like the tracker.
 * Add ?maintenance-check to the address to see the maintenance page locally. The live site is
 * never on localhost. The dev mock (npm run mock) always enforces it, so it can be tested there.
 */
export const LOCAL_BYPASS =
  typeof window !== 'undefined' &&
  ['localhost', '127.0.0.1', '[::1]'].includes(window.location.hostname) &&
  import.meta.env.MODE !== 'mock' &&
  !new URLSearchParams(window.location.search).has('maintenance-check');

/** is_on and the end is still ahead. */
export function isActive(row, now = Date.now()) {
  return Boolean(row?.is_on && row.ends_at && now < Date.parse(row.ends_at));
}

export function MaintenanceProvider({ children }) {
  const api = useApi();
  const { session, user } = useAuth();
  const userId = user?.id ?? null;
  const [row, setRow] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [exempt, setExempt] = useState(null); // null = unknown or signed out
  const alive = useRef(true);

  const read = useCallback(async () => {
    const r = await api.getMaintenance();
    if (!alive.current) return;
    if (!r.error) setRow(r.data ?? null);
    setLoaded(true); // a failed check still lets the page open
  }, [api]);

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  useEffect(() => {
    read();
    const fallback = setTimeout(() => setLoaded(true), FIRST_READ_LIMIT);
    const timer = setInterval(read, POLL);
    const onBack = () => {
      if (document.visibilityState === 'visible') read();
    };
    document.addEventListener('visibilitychange', onBack);
    window.addEventListener('focus', onBack);
    return () => {
      clearTimeout(fallback);
      clearInterval(timer);
      document.removeEventListener('visibilitychange', onBack);
      window.removeEventListener('focus', onBack);
    };
  }, [read]);

  // live updates; subscribed again after signing in or out (signing out removes every channel)
  useEffect(() => {
    const unsubscribe = api.subscribeMaintenance((next) => {
      if (next?.site === 'dashboard') setRow(next);
    });
    read();
    return () => unsubscribe();
  }, [api, read, userId]);

  useEffect(() => {
    if (!session) {
      setExempt(null);
      return undefined;
    }
    let live = true;
    setExempt(null);
    api.isMaintenanceExempt().then((r) => {
      if (live) setExempt(r.error ? false : Boolean(r.data));
    });
    return () => {
      live = false;
    };
  }, [api, session, userId]);

  const value = useMemo(() => ({ row, loaded, exempt, signedIn: Boolean(session), refresh: read }), [row, loaded, exempt, session, read]);
  return <MaintenanceContext.Provider value={value}>{children}</MaintenanceContext.Provider>;
}

export function useMaintenance() {
  const ctx = useContext(MaintenanceContext);
  if (!ctx) throw new Error('useMaintenance must be used inside MaintenanceProvider');
  return ctx;
}
