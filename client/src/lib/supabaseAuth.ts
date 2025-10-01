import { getSupabaseClient } from './supabaseClient';

export async function signInWithEmail(email: string, password: string) {
  const supabase = getSupabaseClient();
  if (!supabase) throw new Error('Supabase not initialized');
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw error;
  return data;
}

export async function signUpWithEmail(email: string, password: string) {
  const supabase = getSupabaseClient();
  if (!supabase) throw new Error('Supabase not initialized');
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  
  if (error) throw error;
  return data;
}

export async function signOut() {
  const supabase = getSupabaseClient();
  if (!supabase) throw new Error('Supabase not initialized');
  
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser() {
  const supabase = getSupabaseClient();
  if (!supabase) return null;
  
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export function onAuthStateChange(callback: (user: any) => void) {
  const supabase = getSupabaseClient();
  if (!supabase) return () => {};
  
  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ?? null);
  });
  
  return () => subscription.unsubscribe();
}
