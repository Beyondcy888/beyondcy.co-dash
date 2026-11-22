// Who may enter (update v5, file 01 §2). The dashboard has no login page of its own.
//   not signed in                    → the tracker's login, ?next=dashboard
//   an active stakeholder or admin   → the dashboard
//   anyone else (staff, no role, inactive) → the tracker (which explains, e.g. "inactive")
// A profile that failed to load gets "Try again", never a redirect (no ping-pong).
import { useEffect } from 'react';
import { useAuth } from './AuthContext.js';
import { canUseDashboard } from '../lib/roles.js';
import { siteLink } from '../siteLinks.js';
import { PageSkeleton } from '../layout/PageSkeleton.jsx';
import { Notice } from '../layout/Notice.jsx';

const MOCK = import.meta.env.MODE === 'mock';

/**
 * Goes to another site (replacing this page in the history). Never loops: if this page already
 * IS that address (the other site isn't served here, so this app answered), it stays and says so.
 * The dev mock never leaves; it shows where the live site would go.
 */
export function Leave({ to, why }) {
  const here = typeof window !== 'undefined' && window.location.href.startsWith(to.split('?')[0]);
  const stay = MOCK || here;
  useEffect(() => {
    if (!stay) window.location.replace(to);
  }, [stay, to]);
  if (!stay) return <PageSkeleton label="Opening the sign-in page" />;
  return (
    <Notice title={MOCK ? why : 'This page isn’t available here'}>
      <p className="notice-url">{to}</p>
    </Notice>
  );
}

export function AccessGate({ children }) {
  const { ready, session, profile, profileStatus, reloadProfile, signOut, leaving } = useAuth();

  if (!ready || leaving) return <PageSkeleton />;
  if (!session) return <Leave to={siteLink('track', 'login?next=dashboard')} why="Signed out: the live dashboard opens the tracker's login page here." />;
  if (profileStatus === 'idle' || profileStatus === 'loading') return <PageSkeleton />;
  if (profileStatus === 'error') {
    return (
      <Notice title="We couldn't load your account" tone="danger">
        <p>Check your connection and try again.</p>
        <div className="notice-actions">
          <button type="button" className="btn btn-primary" onClick={reloadProfile}>
            Try again
          </button>
          <button type="button" className="btn btn-ghost" onClick={signOut}>
            Log out
          </button>
        </div>
      </Notice>
    );
  }
  if (!canUseDashboard(profile)) return <Leave to={siteLink('track')} why="This account isn't a stakeholder or an admin: the live dashboard sends it to the tracker." />;
  return children;
}
