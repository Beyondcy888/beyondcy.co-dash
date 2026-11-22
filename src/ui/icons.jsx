// Line icons from the mock (24 × 24, stroke = currentColor). Decorative: aria-hidden.
const base = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true, focusable: 'false' };

export function IconCalendar({ size = 16 }) {
  return (
    <svg width={size} height={size} strokeWidth="1.8" {...base}>
      <rect x="3" y="5" width="18" height="16" rx="3" />
      <path d="M16 3v4M8 3v4M3 10h18" />
    </svg>
  );
}

export function IconChevronDown({ size = 14, strokeWidth = 2 }) {
  return (
    <svg width={size} height={size} strokeWidth={strokeWidth} {...base}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export function IconChevronLeft({ size = 16 }) {
  return (
    <svg width={size} height={size} strokeWidth="2" {...base}>
      <path d="M15 6l-6 6 6 6" />
    </svg>
  );
}

export function IconChevronRight({ size = 16 }) {
  return (
    <svg width={size} height={size} strokeWidth="2" {...base}>
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

export function IconDownload({ size = 16 }) {
  return (
    <svg width={size} height={size} strokeWidth="1.8" {...base}>
      <path d="M12 4v11" />
      <path d="M7 10l5 5 5-5" />
      <path d="M5 20h14" />
    </svg>
  );
}

export function IconCheck({ size = 14 }) {
  return (
    <svg width={size} height={size} strokeWidth="2.4" {...base}>
      <path d="M5 12l5 5 9-10" />
    </svg>
  );
}

export function IconSun({ size = 18 }) {
  return (
    <svg width={size} height={size} strokeWidth="1.8" {...base}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4L6 18M18 6l1.4-1.4" />
    </svg>
  );
}

export function IconMoon({ size = 18 }) {
  return (
    <svg width={size} height={size} strokeWidth="1.8" {...base}>
      <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />
    </svg>
  );
}

export function IconExternal({ size = 14 }) {
  return (
    <svg width={size} height={size} strokeWidth="2" {...base}>
      <path d="M7 17L17 7" />
      <path d="M8 7h9v9" />
    </svg>
  );
}

export function IconX({ size = 18 }) {
  return (
    <svg width={size} height={size} strokeWidth="2" {...base}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

/** The tracker's content-type icons: Reels = ▶ (orange), Feed = 2×2 grid (violet). */
export function TypeIcon({ type, size = 11 }) {
  if (type === 'reels') {
    return (
      <svg width={size} height={size} viewBox="0 0 12 12" aria-hidden="true" focusable="false" className="type-icon type-icon--reels">
        <path d="M2.5 1.6v8.8L10.2 6z" fill="currentColor" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      </svg>
    );
  }
  if (type === 'feed') {
    return (
      <svg width={size} height={size} viewBox="0 0 12 12" aria-hidden="true" focusable="false" className="type-icon type-icon--feed">
        <rect x="1" y="1" width="4.2" height="4.2" rx="1" fill="currentColor" />
        <rect x="6.8" y="1" width="4.2" height="4.2" rx="1" fill="currentColor" />
        <rect x="1" y="6.8" width="4.2" height="4.2" rx="1" fill="currentColor" />
        <rect x="6.8" y="6.8" width="4.2" height="4.2" rx="1" fill="currentColor" />
      </svg>
    );
  }
  return null;
}
