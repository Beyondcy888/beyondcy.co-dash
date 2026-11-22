// The Content Calendar's data (update v5, files 02 §1 and 05): read-only, all brands.
//   dashboard_content  the month's items (links only when Uploaded; no internal fields)
//   dashboard_targets  the month's targets per brand
//   people             names + photos (signed URLs from the avatars bucket; letters if not allowed)
// Views have no realtime: re-read every 60 seconds and when the tab regains focus.
// While another month loads, the previous one stays on screen (marked stale), no flash.
import { useCallback, useEffect, useRef, useState } from 'react';
import { useApi } from '../data/ApiContext.js';
import { monthStart, shiftMonth } from '../lib/time.js';

const REFRESH = 60 * 1000;
const FOCUS_THROTTLE = 10 * 1000;

export function useCalendarData(month) {
  const api = useApi();
  const [state, setState] = useState({ status: 'loading', month: null, items: [], targets: [], error: null, syncedAt: null });
  const [people, setPeople] = useState({ byId: {}, photos: {} });
  const ticket = useRef(0);
  const lastLoad = useRef(0);

  const load = useCallback(
    async (quiet = false) => {
      const mine = ++ticket.current;
      lastLoad.current = Date.now();
      if (!quiet) setState((s) => ({ ...s, status: s.month ? 'ready' : 'loading', loadingMonth: month }));
      const start = monthStart(month);
      const end = monthStart(shiftMonth(month, 1));
      const [c, t] = await Promise.all([api.listContent(start, end), api.listTargets(start)]);
      if (mine !== ticket.current) return;
      const error = c.error || t.error;
      if (error) {
        // a failed refresh keeps what's on screen; a failed first load says so
        setState((s) => (s.month ? { ...s, loadingMonth: null } : { ...s, status: 'error', error: "We couldn't load the calendar." }));
        return;
      }
      setState({ status: 'ready', month, loadingMonth: null, items: c.data ?? [], targets: t.data ?? [], error: null, syncedAt: Date.now() });
    },
    [api, month],
  );

  const loadPeople = useCallback(async () => {
    const r = await api.listPeople();
    if (r.error || !r.data) return; // names fall back to pic_name, photos to letters
    const byId = Object.fromEntries(r.data.map((p) => [p.id, p]));
    const paths = [...new Set(r.data.map((p) => p.avatar_path).filter(Boolean))];
    let urls = {};
    if (paths.length) {
      const u = await api.avatarUrls(paths);
      urls = u.data ?? {};
    }
    const photos = {};
    for (const p of r.data) if (p.avatar_path && urls[p.avatar_path]) photos[p.id] = urls[p.avatar_path];
    setPeople({ byId, photos });
  }, [api]);

  useEffect(() => {
    load();
    const timer = setInterval(() => load(true), REFRESH);
    return () => clearInterval(timer);
  }, [load]);

  useEffect(() => {
    loadPeople();
    const timer = setInterval(loadPeople, 50 * 60 * 1000); // photo URLs last an hour
    return () => clearInterval(timer);
  }, [loadPeople]);

  useEffect(() => {
    const onBack = () => {
      if (document.visibilityState !== 'visible') return;
      if (Date.now() - lastLoad.current < FOCUS_THROTTLE) return;
      load(true);
      loadPeople();
    };
    window.addEventListener('focus', onBack);
    document.addEventListener('visibilitychange', onBack);
    return () => {
      window.removeEventListener('focus', onBack);
      document.removeEventListener('visibilitychange', onBack);
    };
  }, [load, loadPeople]);

  return { ...state, stale: state.status === 'ready' && state.month !== month, people, reload: () => load() };
}
