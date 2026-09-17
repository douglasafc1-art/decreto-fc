import { supabase } from '../lib/supabase';

/** Extrai o caminho interno de uma URL pública gerada pelo Supabase Storage. */
export function storagePathFromPublicUrl(url: string | null | undefined, bucket: string): string | null {
  if (!url) return null;
  const marker = `/storage/v1/object/public/${bucket}/`;
  const index = url.indexOf(marker);
  if (index === -1) return null;
  return decodeURIComponent(url.slice(index + marker.length).split('?')[0]);
}

export async function removePublicStorageObject(bucket: string, url: string | null | undefined): Promise<void> {
  const path = storagePathFromPublicUrl(url, bucket);
  if (!path) return;
  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) throw error;
}
