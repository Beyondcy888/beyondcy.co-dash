// The slim "Dashboard maintenance is on" bar (update v5, file 01 §5): for the Admin Beyondcy
// account, who can still use the dashboard, and on a working copy on this computer.
import { useEffect, useState } from 'react';
import { isActive, LOCAL_BYPASS, useMaintenance } from './MaintenanceProvider.jsx';
import { siteLink } from '../siteLinks.js';

function shortCountdown(ms) {
  const min = Math.max(0, Math.ceil(ms / 60000));
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  return `${h} h ${String(min % 60).padStart(2, '0')} min`;
}

export function MaintenanceBar() {
  const m = useMaintenance();
  const [now, setNow] = useState(() => Date.now());
  const exempt = m.exempt === true;
  const on = isActive(m.row, now) && (exempt || LOCAL_BYPASS);

  useEffect(() => {
    if (!m.row?.is_on) return undefined;
    const timer = setInterval(() => setNow(Date.now()), 15000);
    return () => clearInterval(timer);
  }, [m.row?.is_on]);

  if (!on) return null;
  return (
    <p className="mbar" role="status">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4z" />
      </svg>
      <span>
        <strong>Dashboard maintenance is on.</strong> Everyone else sees the maintenance page
        {!exempt && LOCAL_BYPASS ? '; this copy on your computer is not affected.' : '.'} Ends in{' '}
        <strong>{shortCountdown(Date.parse(m.row.ends_at) - now)}</strong>
      </span>
      {exempt && (
        <a className="mbar-link" href={siteLink('track', 'admin/maintenance')} target="_blank" rel="noopener noreferrer">
          Manage ↗
        </a>
      )}
    </p>
  );
}
