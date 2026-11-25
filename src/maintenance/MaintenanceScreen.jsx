// The maintenance page: a thin React wrapper around the shared, framework-free module in ./page/.
// ./page/maintenance.js and ./page/maintenance.css are BYTE-IDENTICAL copies of the tracker repo's
// src/maintenance/page/ files: change them there, then copy both here (keep them identical).
import { useEffect, useRef } from 'react';
import { mountMaintenance } from './page/maintenance.js';
import './page/maintenance.css';
import { loginLink } from '../siteLinks.js';

const BASE = import.meta.env.BASE_URL;

/** endsAt · state: 'counting' | 'finishing' | 'back' · signIn: show the quiet "Sign in" link */
export function MaintenanceScreen({ endsAt = null, state = 'counting', signIn = false, onCountdownEnd }) {
  const ref = useRef(null);
  const page = useRef(null);
  const endRef = useRef(onCountdownEnd);
  endRef.current = onCountdownEnd;
  // signed-out visitors: the login page (in the portfolio), coming back to this page afterwards
  const signInOption = signIn ? { href: loginLink(typeof window !== 'undefined' ? window.location.href : '') } : null;

  useEffect(() => {
    page.current = mountMaintenance(ref.current, {
      site: 'Dashboard',
      endsAt,
      state,
      logoSrc: `${BASE}logo-beyondcy.png`,
      signIn: signInOption,
      onCountdownEnd: () => endRef.current?.(),
    });
    const title = document.title;
    document.title = 'Maintenance · Beyond 360° Dashboard';
    return () => {
      page.current?.destroy();
      page.current = null;
      document.title = title;
    };
    // mounted once; changes go through update() below
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    page.current?.update({ endsAt, state, signIn: signInOption });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endsAt, state, signIn]);

  return <div ref={ref} className="maintenance-host" />;
}
