import { supabase } from '../lib/supabase';
import type { SiteSettings } from '../types';

export async function getSiteSettings(): Promise<SiteSettings | null> {
  const { data, error } = await supabase.from('site_settings').select('*').limit(1).maybeSingle();
  if (error) throw error;
  return data as SiteSettings | null;
}

export async function updateSiteSettings(id: string, settings: Partial<SiteSettings>): Promise<SiteSettings> {
  const { data, error } = await supabase.from('site_settings').update(settings).eq('id', id).select().single();
  if (error) throw error;
  return data as SiteSettings;
}
