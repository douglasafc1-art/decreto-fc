import type { Match, MatchScorer, ScorerRow } from '../types';

/**
 * Artilharia do Decreto — somente gols de partidas finalizadas.
 * Se um jogo for adiado/cancelado/editado, seus registros antigos não entram
 * na artilharia pública mesmo antes de uma eventual limpeza administrativa.
 */
export function calculateDecretoScorers(matches: Match[]): ScorerRow[] {
  const totals = new Map<string, ScorerRow>();

  matches
    .filter((match) => match.status === 'finalizado')
    .forEach((match) => {
      (match.scorers ?? []).forEach((scorer: MatchScorer) => {
        if (!scorer.player || scorer.goals <= 0) return;
        const existing = totals.get(scorer.player_id);
        if (existing) {
          existing.goals += scorer.goals;
        } else {
          totals.set(scorer.player_id, { player: scorer.player, goals: scorer.goals });
        }
      });
    });

  return Array.from(totals.values()).sort(
    (a, b) => b.goals - a.goals || (a.player.display_name ?? a.player.name).localeCompare(b.player.display_name ?? b.player.name)
  );
}

/** Valida se a soma dos gols atribuídos bate com o placar do Decreto na partida. */
export function validateScorersSum(
  decretoScore: number,
  scorers: { goals: number }[]
): { valid: boolean; assigned: number; missing: number } {
  const assigned = scorers.reduce((sum, s) => sum + Math.max(0, s.goals || 0), 0);
  return { valid: assigned === decretoScore, assigned, missing: decretoScore - assigned };
}
