import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabaseConfigError =
  !url || !anonKey
    ? 'Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY at build time.'
    : null;

export const supabase = createClient(url ?? 'http://invalid', anonKey ?? 'invalid', {
  realtime: { params: { eventsPerSecond: 10 } },
});
