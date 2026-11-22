// The dashboard logo: green wordmark on dark, purple wordmark on light (the mock's logos/).
import { useTheme } from '../theme/theme.jsx';

const BASE = import.meta.env.BASE_URL;

export function BrandLogo() {
  const { isLight } = useTheme();
  return isLight ? (
    <img src={`${BASE}logos/logo-wordmark-purple.png`} alt="Beyondcy" width="112" height="24" decoding="async" />
  ) : (
    <img src={`${BASE}logos/logo-wordmark-green.png`} alt="Beyondcy" width="100" height="21" decoding="async" />
  );
}

/** The purple "b" icon the light footer shows. */
export function BrandIcon() {
  return <img src={`${BASE}logos/logo-icon-purple.png`} alt="" width="36" height="24" decoding="async" />;
}
