import type { Match, StandingsRow, Team } from '../types';

/**
 * Classificação derivada dos jogos finalizados que estão marcados para
 * contabilizar na tabela. Isso permite cadastrar semifinal/final sem alterar
 * a classificação da fase de grupos.
 *
 * Critérios de desempate (nesta ordem). Ajuste livremente quando o regulamento
 * oficial da Copa for disponibilizado.
 */
export const TIEBREAK_CRITERIA: Array<(a: StandingsRow, b: StandingsRow) => number> = [
  (a, b) => b.points - a.points,
  (a, b) => b.wins - a.wins,
  (a, b) => b.goalDiff - a.goalDiff,
  (a, b) => b.goalsFor - a.goalsFor,
];

export function calculateStandings(teams: Team[], matches: Match[]): StandingsRow[] {
  const rows = new Map<string, StandingsRow>();

  teams
    .filter((t) => t.active)
    .forEach((team) => {
      rows.set(team.id, {
        team,
        played: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDiff: 0,
        points: 0,
      });
    });

  matches
    .filter(
      (m) =>
        m.status === 'finalizado' &&
        m.counts_for_standings !== false &&
        m.home_score !== null &&
        m.away_score !== null
    )
    .forEach((match) => {
      const home = rows.get(match.home_team_id);
      const away = rows.get(match.away_team_id);
      if (!home || !away) return;

      // Na fase de grupos, a competição usa chaves cruzadas: somente jogos
      // entre times de grupos diferentes são válidos para a classificação.
      if (
        match.phase === 'grupos' &&
        home.team.group_name &&
        away.team.group_name &&
        home.team.group_name === away.team.group_name
      ) {
        return;
      }

      const hs = match.home_score as number;
      const as = match.away_score as number;

      home.played += 1;
      away.played += 1;
      home.goalsFor += hs;
      home.goalsAgainst += as;
      away.goalsFor += as;
      away.goalsAgainst += hs;

      if (hs > as) {
        home.wins += 1;
        home.points += 3;
        away.losses += 1;
      } else if (hs < as) {
        away.wins += 1;
        away.points += 3;
        home.losses += 1;
      } else {
        home.draws += 1;
        away.draws += 1;
        home.points += 1;
        away.points += 1;
      }
    });

  rows.forEach((row) => {
    row.goalDiff = row.goalsFor - row.goalsAgainst;
  });

  return Array.from(rows.values()).sort((a, b) => {
    for (const criterion of TIEBREAK_CRITERIA) {
      const result = criterion(a, b);
      if (result !== 0) return result;
    }
    return a.team.name.localeCompare(b.team.name);
  });
}

export function groupStandings(rows: StandingsRow[]): Record<string, StandingsRow[]> {
  return rows.reduce((acc, row) => {
    const group = row.team.group_name ?? 'Sem grupo';
    if (!acc[group]) acc[group] = [];
    acc[group].push(row);
    return acc;
  }, {} as Record<string, StandingsRow[]>);
}
