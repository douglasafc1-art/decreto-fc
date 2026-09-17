import type { StandingsRow } from '../types';
import { TeamBadge } from './TeamBadge';

interface StandingsTableProps {
  rows: StandingsRow[];
  highlightTeamId?: string;
}

export function StandingsTable({ rows, highlightTeamId }: StandingsTableProps) {
  return (
    <div className="overflow-hidden border border-decreto-electric/[0.18] bg-[#08152f]/72 shadow-[0_16px_42px_rgba(0,0,0,.18)]">
      <table className="w-full text-xs sm:text-sm table-fixed">
        <colgroup>
          <col className="w-[34px] sm:w-[42px]" />
          <col />
          <col className="w-[42px] sm:w-[48px]" />
          <col className="w-[36px] sm:w-[42px]" />
          <col className="hidden sm:table-column w-[36px] sm:w-[42px]" />
          <col className="hidden sm:table-column w-[36px] sm:w-[42px]" />
          <col className="hidden sm:table-column w-[36px] sm:w-[42px]" />
          <col className="w-[40px] sm:w-[46px]" />
        </colgroup>
        <thead>
          <tr className="text-decreto-cyan/70 uppercase text-[9px] sm:text-[10px] tracking-wider border-b border-decreto-electric/[0.18] bg-decreto-dark/25">
            <th className="text-center px-1 py-3">#</th>
            <th className="text-left px-2 py-3">Time</th>
            <th className="px-1 py-3" title="Pontos">PTS</th>
            <th className="px-1 py-3" title="Jogos">J</th>
            <th className="hidden sm:table-cell px-1 py-3" title="Vitórias">V</th>
            <th className="hidden sm:table-cell px-1 py-3" title="Empates">E</th>
            <th className="hidden sm:table-cell px-1 py-3" title="Derrotas">D</th>
            <th className="px-1 py-3" title="Saldo de Gols">SG</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => {
            const highlighted = row.team.id === highlightTeamId;
            return (
              <tr
                key={row.team.id}
                className={`relative border-b border-decreto-electric/10 last:border-0 ${highlighted ? 'bg-gradient-to-r from-decreto-electric/20 via-decreto-electric/[0.08] to-transparent shadow-[inset_3px_0_0_#3ED8F0]' : 'hover:bg-decreto-electric/[0.035]'}`}
              >
                <td className={`px-1 py-3 text-center font-display text-base ${highlighted ? 'text-decreto-cyan' : 'text-decreto-white/[0.45]'}`}>{i + 1}</td>
                <td className="px-2 py-3 min-w-0">
                  <div className="flex items-center gap-2 font-semibold min-w-0">
                    <TeamBadge team={row.team} size="sm" />
                    <div className="min-w-0">
                      <span className={`block truncate ${highlighted ? 'text-decreto-white' : 'text-decreto-white/[0.85]'}`}>{row.team.short_name || row.team.name}</span>
                      {highlighted && <span className="block text-[8px] uppercase tracking-[0.18em] text-decreto-cyan/70">Decreto FC</span>}
                    </div>
                  </div>
                </td>
                <td className="px-1 py-3 text-center font-display text-lg text-decreto-cyan">{row.points}</td>
                <td className="px-1 py-3 text-center text-decreto-white/75">{row.played}</td>
                <td className="hidden sm:table-cell px-1 py-3 text-center text-decreto-white/75">{row.wins}</td>
                <td className="hidden sm:table-cell px-1 py-3 text-center text-decreto-white/75">{row.draws}</td>
                <td className="hidden sm:table-cell px-1 py-3 text-center text-decreto-white/75">{row.losses}</td>
                <td className={`px-1 py-3 text-center font-semibold ${row.goalDiff > 0 ? 'text-decreto-cyan' : row.goalDiff < 0 ? 'text-red-300/80' : 'text-decreto-white/70'}`}>
                  {row.goalDiff > 0 ? `+${row.goalDiff}` : row.goalDiff}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
