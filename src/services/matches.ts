import { supabase } from '../lib/supabase';
import type { Match, MatchScorer, MatchStatus } from '../types';

const MATCH_SELECT = `
  *,
  home_team:teams!matches_home_team_id_fkey(*),
  away_team:teams!matches_away_team_id_fkey(*),
  scorers:match_scorers(*, player:players(*))
`;

export async function getAllMatches(): Promise<Match[]> {
  const { data, error } = await supabase
    .from('matches')
    .select(MATCH_SELECT)
    .order('match_date', { ascending: true });
  if (error) throw error;
  return data as unknown as Match[];
}

/** Jogos públicos: apenas partidas envolvendo o Decreto FC */
export async function getDecretoMatches(decretoTeamId: string): Promise<Match[]> {
  const { data, error } = await supabase
    .from('matches')
    .select(MATCH_SELECT)
    .or(`home_team_id.eq.${decretoTeamId},away_team_id.eq.${decretoTeamId}`)
    .order('match_date', { ascending: true });
  if (error) throw error;
  return data as unknown as Match[];
}

export async function getNextDecretoMatch(decretoTeamId: string): Promise<Match | null> {
  const nowIso = new Date().toISOString();
  const { data, error } = await supabase
    .from('matches')
    .select(MATCH_SELECT)
    .or(`home_team_id.eq.${decretoTeamId},away_team_id.eq.${decretoTeamId}`)
    .eq('status', 'agendado')
    .gte('match_date', nowIso)
    .order('match_date', { ascending: true })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data as unknown as Match | null;
}

export async function getLastDecretoMatch(decretoTeamId: string): Promise<Match | null> {
  const { data, error } = await supabase
    .from('matches')
    .select(MATCH_SELECT)
    .or(`home_team_id.eq.${decretoTeamId},away_team_id.eq.${decretoTeamId}`)
    .eq('status', 'finalizado')
    .order('match_date', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data as unknown as Match | null;
}

export async function createMatch(match: Partial<Match>): Promise<Match> {
  const { data, error } = await supabase.from('matches').insert(match).select().single();
  if (error) throw error;
  return data as Match;
}

export async function updateMatch(id: string, match: Partial<Match>): Promise<Match> {
  const { data, error } = await supabase.from('matches').update(match).eq('id', id).select().single();
  if (error) throw error;
  return data as Match;
}

export async function updateMatchStatus(id: string, status: MatchStatus): Promise<void> {
  const { error } = await supabase.from('matches').update({ status }).eq('id', id);
  if (error) throw error;
}

export async function deleteMatch(id: string): Promise<void> {
  const { error } = await supabase.from('matches').delete().eq('id', id);
  if (error) throw error;
}

/** Substitui os artilheiros de uma partida (apaga e insere novamente, em transação lógica simples) */
export async function setMatchScorers(matchId: string, scorers: Array<{ player_id: string; goals: number }>): Promise<void> {
  const { error: delError } = await supabase.from('match_scorers').delete().eq('match_id', matchId);
  if (delError) throw delError;

  if (scorers.length === 0) return;

  const rows = scorers
    .filter((s) => s.goals > 0)
    .map((s) => ({ match_id: matchId, player_id: s.player_id, goals: s.goals }));

  if (rows.length === 0) return;

  const { error } = await supabase.from('match_scorers').insert(rows);
  if (error) throw error;
}

export type { MatchScorer };
