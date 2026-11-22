import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/tokens.css';
import './styles/base.css';
import './styles/shell.css';
import './styles/skeleton.css';
import './styles/overview.css';
import './styles/content.css';
import './styles/audience.css';
import './styles/ads.css';
import './styles/calendar.css';

const root = createRoot(document.getElementById('root'));

if (import.meta.env.MODE === 'mock') {
  // `npm run mock`: dev-only preview on sample data, no Supabase. Removed from production builds.
  import('./dev/mock/MockApp.jsx').then(({ MockApp }) =>
    root.render(
      <StrictMode>
        <MockApp />
      </StrictMode>,
    ),
  );
} else {
  import('./App.jsx').then(({ default: App }) =>
    root.render(
      <StrictMode>
        <App />
      </StrictMode>,
    ),
  );
}
