import { Calendar, Clock, MapPin } from 'lucide-react';
import type { Match } from '../types';
import { TeamBadge } from './TeamBadge';
import { formatDatePt, formatTimePt } from '../utils/datetime';

interface MatchCardProps {
  match: Match;
  round?: boolean;
}

export function MatchCard({ match, round = true }: MatchCardProps) {
  const finished = match.status === 'finalizado';
  const decretoScorers = (match.scorers ?? []).filter((s) => s.goals > 0);
  const phaseLabel = match.phase === 'semifinal' ? 'Semifinal' : match.phase === 'final' ? 'Final' : match.phase === 'outro' ? 'Outra fase' : null;

  return (
    <article className="card-surface glow-border p-5 md:p-6 flex flex-col gap-4 min-w-[280px]">
      <div className="flex items-center gap-2 min-h-5">
        {round && match.round != null && (
          <span className="text-xs uppercase tracking-widest text-decreto-cyan font-semibold">
            Rodada {match.round}
          </span>
        )}
        {phaseLabel && <span className="text-[10px] uppercase tracking-widest text-decreto-white/[0.55] border border-decreto-electric/20 px-2 py-0.5 rounded-full">{phaseLabel}</span>}
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-col items-center gap-2 flex-1">
          <TeamBadge team={match.home_team} />
          <span className="text-sm text-center font-semibold">{match.home_team?.short_name ?? match.home_team?.name}</span>
        </div>

        <div className="flex flex-col items-center px-2">
          {finished ? (
            <span className="font-display text-3xl md:text-4xl">
              {match.home_score} <span className="text-decreto-white/40">x</span> {match.away_score}
            </span>
          ) : (
            <span className="font-display text-2xl text-decreto-white/50">VS</span>
          )}
          {match.status === 'adiado' && <span className="text-xs text-decreto-gold mt-1">Adiado</span>}
          {match.status === 'cancelado' && <span className="text-xs text-red-400 mt-1">Cancelado</span>}
        </div>

        <div className="flex flex-col items-center gap-2 flex-1">
          <TeamBadge team={match.away_team} />
          <span className="text-sm text-center font-semibold">{match.away_team?.short_name ?? match.away_team?.name}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-decreto-white/60 justify-center border-t border-decreto-electric/10 pt-3">
        <span className="flex items-center gap-1"><Calendar size={14} /> {formatDatePt(match.match_date)}</span>
        <span className="flex items-center gap-1"><Clock size={14} /> {formatTimePt(match.match_date)}</span>
        {match.venue && <span className="flex items-center gap-1"><MapPin size={14} /> {match.venue}</span>}
      </div>

      {finished && decretoScorers.length > 0 && (
        <div className="border-t border-decreto-electric/10 pt-3">
          <p className="text-xs uppercase text-decreto-cyan/80 mb-1 tracking-widest">Gols do Decreto</p>
          <ul className="text-sm space-y-0.5">
            {decretoScorers.map((s) => (
              <li key={s.id}>
                {s.player?.display_name ?? s.player?.name} {'⚽'.repeat(s.goals)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}
