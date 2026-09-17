import { CalendarDays, Clock3, MapPin } from 'lucide-react';
import { SectionTitle } from '../../components/SectionTitle';
import { TeamBadge } from '../../components/TeamBadge';
import { EmptyState } from '../../components/EmptyState';
import { formatDatePt, formatTimePt } from '../../utils/datetime';
import type { Match } from '../../types';

interface LastMatchProps {
  match: Match | null;
}

function resultLabel(match: Match) {
  if (match.home_score == null || match.away_score == null) return { text: 'Fim de jogo', tone: 'text-decreto-cyan' };
  const decretoHome = Boolean(match.home_team?.is_decreto);
  const decretoScore = decretoHome ? match.home_score : match.away_score;
  const rivalScore = decretoHome ? match.away_score : match.home_score;
  if (decretoScore > rivalScore) return { text: 'Vitória do Decreto', tone: 'text-decreto-cyan' };
  if (decretoScore < rivalScore) return { text: 'Derrota', tone: 'text-red-300' };
  return { text: 'Empate', tone: 'text-decreto-gold' };
}

export function LastMatch({ match }: LastMatchProps) {
  const result = match ? resultLabel(match) : null;

  return (
    <section id="ultimo-jogo" className="relative py-16 md:py-20 px-4 overflow-hidden bg-[#030916] border-b border-decreto-electric/10">
      <div className="absolute inset-0 bg-[linear-gradient(115deg,transparent_0%,rgba(46,107,255,.055)_48%,transparent_70%)]" aria-hidden="true" />
      <div className="absolute left-0 top-0 bottom-0 w-[36%] bg-grain opacity-[0.06]" aria-hidden="true" />

      <div className="relative max-w-5xl mx-auto">
        <SectionTitle eyebrow="Como foi" title="Último Jogo" align="center" />

        <div className="mt-8 flex justify-center">
          {!match ? (
            <EmptyState title="Ainda não disputamos nenhuma partida" description="O resultado do último jogo do Decreto aparecerá aqui." />
          ) : (
            <article className="relative w-full max-w-4xl overflow-hidden border border-decreto-electric/20 bg-[#07132a]/75">
              <div className="absolute inset-0 bg-grain opacity-[0.07] mix-blend-overlay" />
              <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-decreto-electric/10 blur-[90px]" aria-hidden="true" />

              <div className="relative px-5 sm:px-8 py-5 border-b border-decreto-electric/[0.12] flex flex-wrap items-center justify-between gap-3">
                <span className={`font-display uppercase tracking-[0.15em] text-lg sm:text-xl ${result?.tone}`}>{result?.text}</span>
                <span className="text-[9px] uppercase tracking-[0.24em] text-decreto-white/[0.48]">
                  {match.phase === 'grupos' && match.round != null ? `Rodada ${match.round}` : match.phase}
                </span>
              </div>

              <div className="relative grid grid-cols-[1fr_auto_1fr] items-center px-3 sm:px-8 md:px-14 py-8 sm:py-10 gap-2 sm:gap-6">
                <div className="flex flex-col items-center gap-3">
                  <TeamBadge team={match.home_team} size="lg" />
                  <p className={`font-display uppercase text-base sm:text-xl text-center ${match.home_team?.is_decreto ? 'text-decreto-cyan' : 'text-decreto-white'}`}>
                    {match.home_team?.name}
                  </p>
                </div>

                <div className="flex items-center gap-2 sm:gap-4 px-1">
                  <span className="font-display text-[3.5rem] sm:text-[5rem] md:text-[6.7rem] leading-none text-decreto-white drop-shadow-[0_0_22px_rgba(255,255,255,.06)]">{match.home_score}</span>
                  <span className="font-display text-2xl sm:text-4xl text-decreto-white/[0.18]">×</span>
                  <span className="font-display text-[3.5rem] sm:text-[5rem] md:text-[6.7rem] leading-none text-decreto-white drop-shadow-[0_0_22px_rgba(255,255,255,.06)]">{match.away_score}</span>
                </div>

                <div className="flex flex-col items-center gap-3">
                  <TeamBadge team={match.away_team} size="lg" />
                  <p className={`font-display uppercase text-base sm:text-xl text-center ${match.away_team?.is_decreto ? 'text-decreto-cyan' : 'text-decreto-white'}`}>
                    {match.away_team?.name}
                  </p>
                </div>
              </div>

              <div className="relative border-t border-decreto-electric/[0.12] bg-decreto-dark/[0.35] px-5 sm:px-8 py-5">
                <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-decreto-white/[0.58]">
                  <span className="flex items-center gap-1.5"><CalendarDays size={14} /> {formatDatePt(match.match_date)}</span>
                  <span className="flex items-center gap-1.5"><Clock3 size={14} /> {formatTimePt(match.match_date)}</span>
                  {match.venue && <span className="flex items-center gap-1.5"><MapPin size={14} /> {match.venue}</span>}
                </div>

                {(match.scorers ?? []).length > 0 && (
                  <div className="mt-5 flex flex-wrap justify-center gap-2">
                    {(match.scorers ?? []).filter((s) => s.goals > 0).map((scorer) => (
                      <span key={scorer.id} className="inline-flex items-center gap-2 border border-decreto-cyan/[0.15] bg-decreto-cyan/[0.045] px-3 py-2 text-xs text-decreto-white/80">
                        <span className="font-semibold">{scorer.player?.display_name ?? scorer.player?.name}</span>
                        <span className="font-display text-decreto-cyan">{scorer.goals > 1 ? `${scorer.goals}×` : '⚽'}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </article>
          )}
        </div>
      </div>
    </section>
  );
}
