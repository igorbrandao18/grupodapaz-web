import { createClient } from '@supabase/supabase-js';

let supabaseInstance: ReturnType<typeof createClient> | null = null;

export async function initializeSupabase() {
  if (supabaseInstance) {
    return supabaseInstance;
  }

  try {
    const response = await fetch('/api/config/supabase');
    const data = await response.json();
    
    if (!data.url || !data.anonKey) {
      console.warn('Supabase credentials not configured. Some features may not work.');
      supabaseInstance = createClient('https://placeholder.supabase.co', 'placeholder');
      return supabaseInstance;
    }
    
    supabaseInstance = createClient(data.url, data.anonKey);
    return supabaseInstance;
  } catch (error) {
    console.error('Failed to load Supabase config:', error);
    supabaseInstance = createClient('https://placeholder.supabase.co', 'placeholder');
    return supabaseInstance;
  }
}

export function getSupabaseClient() {
  return supabaseInstance;
}
