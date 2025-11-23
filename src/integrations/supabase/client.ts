import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate required environment variables
function validateSupabaseConfig() {
  const isDev = import.meta.env.DEV;

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    const errorMessage = 'Supabase configuration error: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is missing. Check your .env files.';

    if (isDev) {
      // In development, throw a clear error
      throw new Error(errorMessage);
    } else {
      // In production, log error and let the app show error UI
      console.error(errorMessage);
      console.error('Expected env vars:', {
        VITE_SUPABASE_URL: SUPABASE_URL ? 'present' : 'missing',
        VITE_SUPABASE_ANON_KEY: SUPABASE_ANON_KEY ? 'present' : 'missing',
      });
    }
  }
}

validateSupabaseConfig();

// Create Supabase client with safe defaults
export const supabase = createClient<Database>(
  SUPABASE_URL || 'https://placeholder.supabase.co',
  SUPABASE_ANON_KEY || 'placeholder-key',
  {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    storageKey: 'salatracker-auth',
  },
  global: {
    headers: {
      'X-Client-Info': 'salatracker-web',
    },
  },
});

// Export a helper to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return Boolean(
    SUPABASE_URL &&
    SUPABASE_ANON_KEY &&
    SUPABASE_URL !== 'https://placeholder.supabase.co' &&
    SUPABASE_ANON_KEY !== 'placeholder-key'
  );
};