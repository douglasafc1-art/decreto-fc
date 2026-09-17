export type PlayerType = 'jogador' | 'comissao';
export type MatchStatus = 'agendado' | 'finalizado' | 'adiado' | 'cancelado';
export type MatchPhase = 'grupos' | 'semifinal' | 'final' | 'outro';

export interface Team {
  id: string;
  name: string;
  short_name: string;
  group_name: string | null;
  logo_url: string | null;
  is_decreto: boolean;
  active: boolean;
  created_at: string;
}

export interface Match {
  id: string;
  home_team_id: string;
  away_team_id: string;
  round: number | null;
  phase: MatchPhase;
  counts_for_standings: boolean;
  match_date: string;
  venue: string | null;
  status: MatchStatus;
  home_score: number | null;
  away_score: number | null;
  created_at: string;
  home_team?: Team;
  away_team?: Team;
  scorers?: MatchScorer[];
}

export interface Player {
  id: string;
  name: string;
  display_name: string | null;
  number: number | null;
  position: string | null;
  photo_url: string | null;
  type: PlayerType;
  role: string | null;
  is_captain: boolean;
  active: boolean;
  display_order: number;
  created_at: string;
}

export interface MatchScorer {
  id: string;
  match_id: string;
  player_id: string;
  goals: number;
  created_at: string;
  player?: Player;
}

export type SponsorTier = 'master' | 'ouro' | 'prata' | 'apoio';

export interface Sponsor {
  id: string;
  name: string;
  logo_url: string;
  link_url: string | null;
  tier: SponsorTier;
  active: boolean;
  display_order: number;
  created_at: string;
}

export interface SiteSettings {
  id: string;
  competition_name: string;
  season: string;
  hero_title: string;
  hero_subtitle: string;
  instagram_url: string | null;
  city: string;
  about_text: string;
  default_venue: string | null;
  updated_at: string;
}

export interface StandingsRow {
  team: Team;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDiff: number;
  points: number;
}

export interface ScorerRow {
  player: Player;
  goals: number;
}
