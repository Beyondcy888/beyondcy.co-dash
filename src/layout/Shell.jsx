// The frame of every dashboard page: background glows, the maintenance bar (Admin Beyondcy),
// the navbar and the greeting; the page itself renders below, with its own footer.
import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.js';
import { MaintenanceBar } from '../maintenance/MaintenanceBar.jsx';
import { useTheme } from '../theme/theme.jsx';
import { BrandIcon } from './BrandLogo.jsx';
import { Navbar } from './Navbar.jsx';

/** "Hi {display_name}, Welcome to Beyond 360° Dashboard!" (real name, every page). */
export function Greeting() {
  const { profile } = useAuth();
  const name = profile?.display_name?.trim() || 'there';
  return (
    <section className="b360-hello" aria-label="Welcome">
      <h1 className="b360-h1">
        Hi {name}, Welcome to <span className="b360-grad">Beyond 360° Dashboard!</span>
      </h1>
      <p>The Beyond 360 Dashboard is where strategy meets execution. Review, refine, and approve your content in a single, streamlined workspace.</p>
    </section>
  );
}

/** The page footer, as in the mock (the purple "b" shows on the light theme). */
export function Footer({ children }) {
  const { isLight } = useTheme();
  return (
    <footer className="b360-foot">
      {isLight && <BrandIcon />}
      <span>{children}</span>
    </footer>
  );
}

// the third background glow, per page, as each mock places it
const GLOW_C = {
  '/': ['1100px', '1000px', '-380px', '1250px'],
  '/calendar': ['1100px', '1000px', '-380px', '1000px'],
  '/content': ['1200px', '1100px', '-420px', '1300px'],
  '/audience': ['1100px', '1000px', '-380px', '950px'],
  '/ads': ['1200px', '1100px', '-420px', '1300px'],
};

export function Shell() {
  const { pathname } = useLocation();
  const [w, h, r, t] = GLOW_C[pathname] ?? GLOW_C['/'];
  return (
    <div className="b360">
      <div className="b360-glows" aria-hidden="true" style={{ '--gc-w': w, '--gc-h': h, '--gc-r': r, '--gc-t': t }}>
        <span className="glow-a" />
        <span className="glow-b" />
        <span className="glow-c" />
      </div>
      <MaintenanceBar />
      <div className="b360-wrap">
        <Navbar />
        <Greeting />
        <Outlet />
      </div>
    </div>
  );
}
