// Everything the dashboard reads (update v5, file 05). Read-only: the dashboard never writes.
// Every function returns { data, error } like supabase-js.
import { supabase } from '../lib/supabase.js';

const PROFILE_SELECT = 'id, display_name, avatar_path, avatar_updated_at, role_id, is_active, role:roles(is_admin)';
const MAINTENANCE_SELECT = 'site, is_on, starts_at, ends_at, updated_at';
const AVATARS = 'avatars';

export const supabaseApi = {
  // ------------------------------------------------------------ session (shared with the tracker)
  getSession: () => supabase.auth.getSession(),
  /** onChange(session | null); returns an unsubscribe function */
  onAuthChange(onChange) {
    const { data } = supabase.auth.onAuthStateChange((_event, session) => onChange(session ?? null));
    return () => data.subscription.unsubscribe();
  },
  /** Signs out of this browser: the tracker shares the session, so it is signed out too. */
  async signOut() {
    await supabase.removeAllChannels();
    return supabase.auth.signOut({ scope: 'local' });
  },

  // ------------------------------------------------------------ you
  /** Your own row (stakeholders can only read their own profile). */
  getProfile: (id) => supabase.from('profiles').select(PROFILE_SELECT).eq('id', id).maybeSingle(),

  // ------------------------------------------------------------ the Content Calendar (all brands)
  /** Content with a publish date in [start, end) ('YYYY-MM-DD'). */
  listContent: (start, end) => supabase.from('dashboard_content').select('*').gte('publish_date', start).lt('publish_date', end),
  /** Targets per brand for one month ('YYYY-MM-01'). */
  listTargets: (month) => supabase.from('dashboard_targets').select('*').eq('month', month),
  /** Names and photos (no emails). */
  listPeople: () => supabase.from('people').select('id, display_name, avatar_path, avatar_updated_at'),
  /** Signed photo URLs for avatar paths: { path: url }. Missing ones are left out (letter fallback). */
  async avatarUrls(paths) {
    if (!paths.length) return { data: {}, error: null };
    const { data, error } = await supabase.storage.from(AVATARS).createSignedUrls(paths, 3600);
    if (error) return { data: null, error };
    const urls = {};
    for (const row of data ?? []) if (row.signedUrl && !row.error) urls[row.path] = row.signedUrl;
    return { data: urls, error: null };
  },

  // ------------------------------------------------------------ maintenance (readable by everyone)
  getMaintenance: () => supabase.from('site_maintenance').select(MAINTENANCE_SELECT).eq('site', 'dashboard').maybeSingle(),
  /** Live changes to the dashboard's row; onChange(row). Returns an unsubscribe function. */
  subscribeMaintenance(onChange) {
    const channel = supabase
      .channel(`dash-maintenance-${Math.random().toString(36).slice(2, 8)}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'site_maintenance', filter: 'site=eq.dashboard' }, (p) =>
        onChange(p.new && Object.keys(p.new).length ? p.new : p.old),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  },
  /** True only for the Admin Beyondcy account. Signed-in only. */
  isMaintenanceExempt: () => supabase.rpc('is_maintenance_exempt'),
};
