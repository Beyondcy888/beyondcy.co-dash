// Who may use the dashboard (update v5, files 01 §2 and 03). The exact complement of the
// tracker's rule (tracker src/auth/routing.jsx): the tracker sends an ACTIVE stakeholder (and an
// admin who asked for the dashboard) here; this sends everyone else back. Nobody bounces.
export const STAKEHOLDER = 'stakeholder';

/** An active stakeholder or an active admin. */
export function canUseDashboard(profile) {
  return Boolean(profile?.is_active && (profile.role_id === STAKEHOLDER || profile.role?.is_admin));
}
