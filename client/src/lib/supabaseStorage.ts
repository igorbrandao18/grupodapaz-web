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

const DEPENDENT_PHOTOS_BUCKET = 'dependent-photos';
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

export async function uploadDependentPhoto(file: File, dependentId?: number): Promise<string> {
  // Validar tamanho do arquivo
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('A foto deve ter no máximo 2MB');
  }
  
  // Validar tipo do arquivo
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Formato inválido. Use PNG, JPEG ou WebP');
  }
  
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
  const filePath = dependentId ? `${dependentId}/${fileName}` : `temp/${fileName}`;

  await uploadFile(DEPENDENT_PHOTOS_BUCKET, filePath, file);
  const publicUrl = await getPublicUrl(DEPENDENT_PHOTOS_BUCKET, filePath);
  
  return publicUrl;
}

export async function deleteDependentPhoto(photoUrl: string): Promise<void> {
  // Extrair path da URL, removendo query strings
  const urlParts = photoUrl.split(`${DEPENDENT_PHOTOS_BUCKET}/`);
  if (urlParts.length < 2) return;
  
  // Remover query strings (como ?t=timestamp) do path
  const pathWithQuery = urlParts[1];
  const path = pathWithQuery.split('?')[0];
  
  if (!path) return;
  
  await deleteFile(DEPENDENT_PHOTOS_BUCKET, path);
}
