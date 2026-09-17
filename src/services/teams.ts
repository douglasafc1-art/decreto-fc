import { supabase } from '../lib/supabase';
import type { Team } from '../types';
import { removePublicStorageObject } from '../utils/storage';

export async function getTeams(): Promise<Team[]> {
  const { data, error } = await supabase.from('teams').select('*').order('name');
  if (error) throw error;
  return data as Team[];
}

export async function getActiveTeams(): Promise<Team[]> {
  const { data, error } = await supabase.from('teams').select('*').eq('active', true).order('name');
  if (error) throw error;
  return data as Team[];
}

export async function getDecretoTeam(): Promise<Team | null> {
  const { data, error } = await supabase.from('teams').select('*').eq('is_decreto', true).maybeSingle();
  if (error) throw error;
  return data as Team | null;
}

export async function createTeam(team: Partial<Team>): Promise<Team> {
  const { data, error } = await supabase.from('teams').insert(team).select().single();
  if (error) throw error;
  return data as Team;
}

export async function updateTeam(id: string, team: Partial<Team>): Promise<Team> {
  const { data, error } = await supabase.from('teams').update(team).eq('id', id).select().single();
  if (error) throw error;
  return data as Team;
}

export async function deactivateTeam(id: string): Promise<void> {
  const { error } = await supabase.from('teams').update({ active: false }).eq('id', id);
  if (error) throw error;
}

export async function deleteTeam(team: Team): Promise<void> {
  const { error } = await supabase.from('teams').delete().eq('id', team.id);
  if (error) throw error;
  try {
    await removePublicStorageObject('team-logos', team.logo_url);
  } catch {
    // O registro já foi removido. Falha na limpeza do Storage não deve recriar o time.
  }
}

export async function uploadTeamLogo(file: File, teamId: string): Promise<string> {
  const ext = file.name.split('.').pop()?.toLowerCase() || 'png';
  const path = `${teamId}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from('team-logos').upload(path, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type || undefined,
  });
  if (error) throw error;
  const { data } = supabase.storage.from('team-logos').getPublicUrl(path);
  return data.publicUrl;
}

export async function replaceTeamLogo(team: Team, file: File): Promise<string> {
  const url = await uploadTeamLogo(file, team.id);
  await updateTeam(team.id, { logo_url: url });
  try {
    await removePublicStorageObject('team-logos', team.logo_url);
  } catch {
    // A troca já foi concluída; uma falha de limpeza pode ser corrigida manualmente.
  }
  return url;
}
