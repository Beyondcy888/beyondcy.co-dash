// A plain full-page message (an account that couldn't load; the dev mock's "would go to…").
import { BrandLogo } from './BrandLogo.jsx';

export function Notice({ title, children, tone = 'info' }) {
  return (
    <div className="notice-screen">
      <div className={`notice-card notice-card--${tone}`} role={tone === 'danger' ? 'alert' : 'status'}>
        <BrandLogo />
        <h1>{title}</h1>
        {children}
      </div>
    </div>
  );
}
