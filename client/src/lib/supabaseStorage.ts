import { getSupabaseClient } from './supabaseClient';

export async function uploadFile(bucket: string, path: string, file: File) {
  const supabase = getSupabaseClient();
  if (!supabase) throw new Error('Supabase not initialized');
  
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file);
  
  if (error) throw error;
  return data;
}

export async function getPublicUrl(bucket: string, path: string) {
  const supabase = getSupabaseClient();
  if (!supabase) throw new Error('Supabase not initialized');
  
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);
  
  return data.publicUrl;
}

export async function deleteFile(bucket: string, path: string) {
  const supabase = getSupabaseClient();
  if (!supabase) throw new Error('Supabase not initialized');
  
  const { error } = await supabase.storage
    .from(bucket)
    .remove([path]);
  
  if (error) throw error;
}

export async function listFiles(bucket: string, folder?: string) {
  const supabase = getSupabaseClient();
  if (!supabase) throw new Error('Supabase not initialized');
  
  const { data, error } = await supabase.storage
    .from(bucket)
    .list(folder);
  
  if (error) throw error;
  return data;
}
