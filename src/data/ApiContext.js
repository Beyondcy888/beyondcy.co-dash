import { createContext, useContext } from 'react';

/** The data layer: the real Supabase one (./api.js) or the dev mock (dev/mock). */
export const ApiContext = createContext(null);

export function useApi() {
  const api = useContext(ApiContext);
  if (!api) throw new Error('useApi must be used inside ApiContext');
  return api;
}
