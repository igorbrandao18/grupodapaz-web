import { supabaseAdmin } from './supabaseServer';

export async function uploadFileServer(bucket: string, path: string, file: Buffer, contentType?: string) {
  const { data, error } = await supabaseAdmin.storage
    .from(bucket)
    .upload(path, file, {
      contentType: contentType || 'application/octet-stream',
      upsert: false
    });
  
  if (error) throw error;
  return data;
}

export async function getSignedUrl(bucket: string, path: string, expiresIn: number = 3600) {
  const { data, error } = await supabaseAdmin.storage
    .from(bucket)
    .createSignedUrl(path, expiresIn);
  
  if (error) throw error;
  return data.signedUrl;
}

export async function deleteFileServer(bucket: string, paths: string[]) {
  const { error } = await supabaseAdmin.storage
    .from(bucket)
    .remove(paths);
  
  if (error) throw error;
}
