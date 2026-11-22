import { createContext, useContext } from 'react';

/**
 * {
 *   ready,                 // the first session check finished
 *   session, user,
 *   profile: { id, display_name, avatar_path, avatar_updated_at, role_id, is_active, role: { is_admin } } | null,
 *   profileStatus: 'idle' | 'loading' | 'ready' | 'error',
 *   photoUrl,              // signed URL of your photo, or null (letter fallback)
 *   leaving,               // logging out: the page is about to go to the tracker's login
 *   reloadProfile(), signOut(),
 * }
 */
export const AuthContext = createContext(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside an AuthProvider');
  return ctx;
}
