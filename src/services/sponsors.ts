import { supabase } from '../lib/supabase';
import type { Sponsor } from '../types';
import { removePublicStorageObject } from '../utils/storage';

export async function getActiveSponsors(): Promise<Sponsor[]> {
  const { data, error } = await supabase
    .from('sponsors')
    .select('*')
    .eq('active', true)
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data as Sponsor[];
}

export async function getAllSponsors(): Promise<Sponsor[]> {
  const { data, error } = await supabase
    .from('sponsors')
    .select('*')
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data as Sponsor[];
}

export async function createSponsor(sponsor: Partial<Sponsor>): Promise<Sponsor> {
  const { data, error } = await supabase.from('sponsors').insert(sponsor).select().single();
  if (error) throw error;
  return data as Sponsor;
}

export async function updateSponsor(id: string, sponsor: Partial<Sponsor>): Promise<Sponsor> {
  const { data, error } = await supabase.from('sponsors').update(sponsor).eq('id', id).select().single();
  if (error) throw error;
  return data as Sponsor;
}

export async function deleteSponsor(sponsor: Sponsor): Promise<void> {
  const { error } = await supabase.from('sponsors').delete().eq('id', sponsor.id);
  if (error) throw error;
  try {
    await removePublicStorageObject('sponsors', sponsor.logo_url);
  } catch {
    // Se a limpeza falhar, o arquivo pode ser removido manualmente no Storage.
  }
}

export async function uploadSponsorLogo(file: File): Promise<string> {
  const ext = file.name.split('.').pop()?.toLowerCase() || 'png';
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from('sponsors').upload(path, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type || undefined,
  });
  if (error) throw error;
  const { data } = supabase.storage.from('sponsors').getPublicUrl(path);
  return data.publicUrl;
}
