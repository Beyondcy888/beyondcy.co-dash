// The navbar (update v5, file 01 §3): logo · the five sections · your photo and display name,
// the theme switch and Log out. On a phone (< 640px) the mock folds everything into a menu
// behind the burger (design-reference: "0 Menu open"); the theme switch is in there too.
import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.js';
import { useTheme } from '../theme/theme.jsx';
import { Avatar } from '../ui/Avatar.jsx';
import { IconMoon, IconSun } from '../ui/icons.jsx';
import { useDismiss } from '../ui/useDismiss.js';
import { BrandLogo } from './BrandLogo.jsx';

export const SECTIONS = [
  { to: '/', label: 'Overview', end: true },
  { to: '/calendar', label: 'Content Calendar' },
  { to: '/content', label: 'Content Performance' },
  { to: '/audience', label: 'Audience' },
  { to: '/ads', label: 'Paid Ads' },
];

function ThemeSwitch() {
  const { isLight, toggle } = useTheme();
  const label = isLight ? 'Switch to the dark theme' : 'Switch to the light theme';
  return (
    <button type="button" className="b360-theme" onClick={toggle} aria-label={label} title={label}>
      {isLight ? <IconMoon /> : <IconSun />}
    </button>
  );
}

export function Navbar() {
  const { profile, photoUrl, signOut } = useAuth();
  const { isLight, toggle } = useTheme();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const burgerRef = useRef(null);
  const location = useLocation();
  const close = useCallback(() => setOpen(false), []);
  useDismiss(menuRef, open, close, burgerRef);
  useEffect(() => setOpen(false), [location.pathname]);

  const name = profile?.display_name ?? '';
  const who = <Avatar id={profile?.id} name={name} src={photoUrl} size={34} />;

  return (
    <header className="b360-nav">
      <Link to="/" className="b360-logo" aria-label="Beyond 360° Dashboard: Overview">
        <BrandLogo />
      </Link>

      <nav className="b360-tabs" aria-label="Dashboard sections">
        {SECTIONS.map((s) => (
          <NavLink key={s.to} to={s.to} end={s.end} className="b360-tab">
            {s.label}
          </NavLink>
        ))}
      </nav>

      <div className="b360-acct">
        <span className="b360-name">
          {who}
          <span className="b360-name-text">{name}</span>
        </span>
        <ThemeSwitch />
        <button type="button" className="b360-logout" onClick={signOut}>
          Log out
        </button>
      </div>

      <div ref={menuRef} className="b360-menu-wrap">
        <button
          ref={burgerRef}
          type="button"
          className="b360-burger"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="b360-menu"
          aria-label="Menu"
        >
          <span className="b360-burger-bars" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        </button>
        {open && (
          <div id="b360-menu" className="b360-menu">
            <nav aria-label="Dashboard menu">
              {SECTIONS.map((s) => (
                <NavLink key={s.to} to={s.to} end={s.end} className="b360-menu-link">
                  {s.label}
                </NavLink>
              ))}
            </nav>
            <div className="b360-menu-sep" />
            <div className="b360-menu-who">
              <Avatar id={profile?.id} name={name} src={photoUrl} size={32} />
              <span className="b360-name-text">{name}</span>
            </div>
            <button type="button" className="b360-menu-theme" onClick={toggle}>
              {isLight ? <IconMoon /> : <IconSun />}
              {isLight ? 'Dark theme' : 'Light theme'}
            </button>
            <button type="button" className="b360-logout" onClick={signOut}>
              Log out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
