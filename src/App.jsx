import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AccessGate } from './auth/AccessGate.jsx';
import { AuthProvider } from './auth/AuthProvider.jsx';
import { ApiContext } from './data/ApiContext.js';
import { supabaseApi } from './data/api.js';
import { Shell } from './layout/Shell.jsx';
import { MaintenanceGate } from './maintenance/MaintenanceGate.jsx';
import { MaintenanceProvider } from './maintenance/MaintenanceProvider.jsx';
import { Audience } from './pages/Audience.jsx';
import { CalendarPage } from './calendar/CalendarPage.jsx';
import { ContentPerformance } from './pages/ContentPerformance.jsx';
import { Overview } from './pages/Overview.jsx';
import { PaidAds } from './pages/PaidAds.jsx';
import { ThemeProvider } from './theme/theme.jsx';

// Maintenance is read first (signed-out visitors see the maintenance page too, with a quiet
// "Sign in"); then the access check (stakeholders and admins in, everyone else to the tracker);
// then the five sections, each its own route (update v5, file 01).
export function AppRoutes() {
  return (
    <MaintenanceProvider>
      <MaintenanceGate>
        <AccessGate>
          <Routes>
            <Route element={<Shell />}>
              <Route index element={<Overview />} />
              <Route path="calendar" element={<CalendarPage />} />
              <Route path="content" element={<ContentPerformance />} />
              <Route path="audience" element={<Audience />} />
              <Route path="ads" element={<PaidAds />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </AccessGate>
      </MaintenanceGate>
    </MaintenanceProvider>
  );
}

/** The providers both the real app and the dev mock use. */
export function AppFrame({ api, children }) {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <ApiContext.Provider value={api}>
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </ApiContext.Provider>
    </BrowserRouter>
  );
}

// The router lives under the app's base path (import.meta.env.BASE_URL): "/beyondcy.co-dash/"
// on github.io, "/" locally and on the domain. In-app links use router paths; never hard-code it.
export default function App() {
  return (
    <AppFrame api={supabaseApi}>
      <AppRoutes />
    </AppFrame>
  );
}
