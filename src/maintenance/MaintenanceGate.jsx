// Dashboard maintenance in force (update v5, file 01 §5). Sits around everything, before the
// sign-in check, so signed-out visitors see the maintenance page too (with a quiet "Sign in").
//   - before the first read: the skeleton (no flash of the dashboard)
//   - active and not exempt → the maintenance page; the Admin Beyondcy account sees the dashboard
//     with the slim "Dashboard maintenance is on" bar (MaintenanceBar, in the shell)
//   - when the countdown ends: re-read; still on (the timer job runs once a minute) → "Finishing
//     up…" and re-check every 15 s; off → "We're back!" for a moment, then the dashboard
import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '../auth/AuthContext.js';
import { PageSkeleton } from '../layout/PageSkeleton.jsx';
import { isActive, LOCAL_BYPASS, useMaintenance } from './MaintenanceProvider.jsx';
import { MaintenanceScreen } from './MaintenanceScreen.jsx';

const BACK_MS = 1600;
const FINISHING_RECHECK = 15000;

export function MaintenanceGate({ children }) {
  const m = useMaintenance();
  const { ready: authReady } = useAuth();
  const [now, setNow] = useState(() => Date.now());
  const [phase, setPhase] = useState(null); // null (the dashboard) · 'counting' · 'finishing' · 'back'
  const pageUp = useRef(false);

  const row = m.row;
  const active = isActive(row, now);
  const exempt = m.exempt === true;
  const checkingExempt = m.signedIn && m.exempt === null;
  const locked = active && !exempt && !LOCAL_BYPASS;

  // a clock while it's on, so the end time passing is noticed
  useEffect(() => {
    if (!row?.is_on) return undefined;
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [row?.is_on]);

  useEffect(() => {
    if (exempt) {
      pageUp.current = false;
      if (phase) setPhase(null);
      return;
    }
    if (locked) {
      if (checkingExempt) return;
      pageUp.current = true;
      if (phase !== 'counting') setPhase('counting');
      return;
    }
    if (!pageUp.current) return;
    if (row?.is_on) {
      if (phase !== 'finishing') setPhase('finishing'); // time's up; the timer job hasn't run yet
      return;
    }
    if (phase !== 'back') setPhase('back');
  }, [exempt, locked, checkingExempt, phase, row?.is_on]);

  useEffect(() => {
    if (phase !== 'back') return undefined;
    const timer = setTimeout(() => {
      pageUp.current = false;
      setPhase(null);
    }, BACK_MS);
    return () => clearTimeout(timer);
  }, [phase]);

  const { refresh } = m;
  useEffect(() => {
    if (phase !== 'finishing') return undefined;
    refresh();
    const timer = setInterval(refresh, FINISHING_RECHECK);
    return () => clearInterval(timer);
  }, [phase, refresh]);

  const onCountdownEnd = useCallback(() => {
    setNow(Date.now());
    refresh();
  }, [refresh]);

  if (!m.loaded || !authReady) return <PageSkeleton />;
  if (locked && checkingExempt) return <PageSkeleton label="Checking access" />;
  if (phase) return <MaintenanceScreen endsAt={row?.ends_at ?? null} state={phase} signIn={!m.signedIn} onCountdownEnd={onCountdownEnd} />;
  if (locked) return <MaintenanceScreen endsAt={row?.ends_at ?? null} state="counting" signIn={!m.signedIn} onCountdownEnd={onCountdownEnd} />;
  return children;
}
