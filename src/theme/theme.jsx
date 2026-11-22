// Dark (default) and light themes (update v5, file 01 §3), as designed in the mock.
// Remembered per browser (localStorage 'byc.dash.theme'); index.html applies it before the
// first paint. Storage can be blocked (private windows): every access is wrapped.
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const KEY = 'byc.dash.theme';
const ThemeContext = createContext({ theme: 'dark', toggle() {} });

function readTheme() {
  try {
    const t = localStorage.getItem(KEY);
    if (t === 'light' || t === 'dark') return t;
  } catch {
    /* storage blocked */
  }
  return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(readTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'light' ? '#f3f3f5' : '#070708');
  }, [theme]);

  const toggle = useCallback(() => {
    setTheme((t) => {
      const next = t === 'light' ? 'dark' : 'light';
      try {
        localStorage.setItem(KEY, next);
      } catch {
        /* storage blocked: the switch still works for this visit */
      }
      return next;
    });
  }, []);

  const value = useMemo(() => ({ theme, toggle, isLight: theme === 'light' }), [theme, toggle]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
