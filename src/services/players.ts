import { supabase } from '../lib/supabase';
import type { Player, PlayerType } from '../types';
import { removePublicStorageObject } from '../utils/storage';

export async function getActivePlayers(type?: PlayerType): Promise<Player[]> {
  let query = supabase.from('players').select('*').eq('active', true).order('display_order');
  if (type) query = query.eq('type', type);
  const { data, error } = await query;
  if (error) throw error;
  return data as Player[];
}

export async function getAllPlayers(): Promise<Player[]> {
  const { data, error } = await supabase.from('players').select('*').order('display_order');
  if (error) throw error;
  return data as Player[];
}

export async function createPlayer(player: Partial<Player>): Promise<Player> {
  const { data, error } = await supabase.from('players').insert(player).select().single();
  if (error) throw error;
  return data as Player;
}

export async function updatePlayer(id: string, player: Partial<Player>): Promise<Player> {
  const { data, error } = await supabase.from('players').update(player).eq('id', id).select().single();
  if (error) throw error;
  return data as Player;
}

export async function deactivatePlayer(id: string): Promise<void> {
  const { error } = await supabase.from('players').update({ active: false }).eq('id', id);
  if (error) throw error;
}

export async function deletePlayer(player: Player): Promise<void> {
  const { error } = await supabase.from('players').delete().eq('id', player.id);
  if (error) throw error;
  try {
    await removePublicStorageObject('players', player.photo_url);
  } catch {
    // Evita falhar a exclusão lógica por causa de limpeza de arquivo.
  }
}

export async function uploadPlayerPhoto(file: File, playerId: string): Promise<string> {
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const path = `${playerId}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from('players').upload(path, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type || undefined,
  });
  if (error) throw error;
  const { data } = supabase.storage.from('players').getPublicUrl(path);
  return data.publicUrl;
}

export async function replacePlayerPhoto(player: Player, file: File): Promise<string> {
  const url = await uploadPlayerPhoto(file, player.id);
  await updatePlayer(player.id, { photo_url: url });
  try {
    await removePublicStorageObject('players', player.photo_url);
  } catch {
    // A foto nova já foi salva; limpeza do arquivo antigo é secundária.
  }
  return url;
}
