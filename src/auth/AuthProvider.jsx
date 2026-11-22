// The session comes from the tracker's login (update v5, file 03): both sites live on the same
// address now, so the browser shares it. Your name and photo refresh when the tab regains
// focus, so a change made in the tracker shows up here.
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useApi } from '../data/ApiContext.js';
import { siteLink } from '../siteLinks.js';
import { AuthContext } from './AuthContext.js';

const FOCUS_THROTTLE = 15 * 1000;
const PHOTO_RENEW = 50 * 60 * 1000; // signed URLs last an hour

export function AuthProvider({ children }) {
  const api = useApi();
  const [session, setSession] = useState(undefined); // undefined = still checking
  const [state, setState] = useState({ status: 'idle', profile: null });
  const [photo, setPhoto] = useState({ key: null, url: null });
  const [leaving, setLeaving] = useState(false);
  const ticket = useRef(0);
  const lastLoad = useRef(0);

  useEffect(() => {
    let alive = true;
    api.getSession().then(({ data }) => {
      if (alive) setSession(data?.session ?? null);
    });
    const off = api.onAuthChange((next) => setSession(next ?? null));
    return () => {
      alive = false;
      off();
    };
  }, [api]);

  const userId = session?.user?.id ?? null;

  const load = useCallback(
    async (id, { quiet = false } = {}) => {
      const mine = ++ticket.current;
      lastLoad.current = Date.now();
      if (!quiet) setState((s) => (s.profile?.id === id ? s : { status: 'loading', profile: null }));
      const { data, error } = await api.getProfile(id);
      if (mine !== ticket.current) return;
      if (error) {
        if (!quiet) setState({ status: 'error', profile: null }); // a quiet refresh keeps what's on screen
        return;
      }
      setState({ status: 'ready', profile: data ?? null });
    },
    [api],
  );

  useEffect(() => {
    if (!userId) {
      ticket.current += 1;
      setState({ status: 'idle', profile: null });
      return;
    }
    load(userId);
  }, [userId, load]);

  // a name or photo change in the tracker: re-read when the tab comes back
  useEffect(() => {
    if (!userId) return undefined;
    const onBack = () => {
      if (document.visibilityState !== 'visible') return;
      if (Date.now() - lastLoad.current < FOCUS_THROTTLE) return;
      load(userId, { quiet: true });
    };
    window.addEventListener('focus', onBack);
    document.addEventListener('visibilitychange', onBack);
    return () => {
      window.removeEventListener('focus', onBack);
      document.removeEventListener('visibilitychange', onBack);
    };
  }, [userId, load]);

  // your photo: a signed URL from the private avatars bucket (none, or not allowed → the letter)
  const path = state.profile?.avatar_path ?? null;
  const photoKey = path ? `${path}|${state.profile?.avatar_updated_at ?? ''}` : null;
  useEffect(() => {
    if (!photoKey) return undefined;
    let live = true;
    const sign = () =>
      api.avatarUrls([path]).then(({ data }) => {
        if (live) setPhoto({ key: photoKey, url: data?.[path] ?? null });
      });
    sign();
    const timer = setInterval(sign, PHOTO_RENEW);
    return () => {
      live = false;
      clearInterval(timer);
    };
  }, [api, path, photoKey]);

  const reloadProfile = useCallback(() => {
    if (userId) load(userId);
  }, [userId, load]);

  /** Log out → signed out of both sites → the tracker's login page. */
  const signOut = useCallback(async () => {
    setLeaving(true);
    await api.signOut();
    if (import.meta.env.MODE === 'mock') setLeaving(false);
    else window.location.replace(siteLink('track', 'login'));
  }, [api]);

  const value = useMemo(
    () => ({
      ready: session !== undefined,
      session: session ?? null,
      user: session?.user ?? null,
      profile: state.profile,
      profileStatus: state.status,
      photoUrl: photoKey && photo.key === photoKey ? photo.url : null,
      leaving,
      reloadProfile,
      signOut,
    }),
    [session, state, photo, photoKey, leaving, reloadProfile, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
