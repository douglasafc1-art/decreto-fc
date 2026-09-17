import { CalendarDays, Clock3, MapPin, Swords } from 'lucide-react';
import type { Match } from '../../types';
import { TeamBadge } from '../../components/TeamBadge';
import { SectionTitle } from '../../components/SectionTitle';
import { EmptyState } from '../../components/EmptyState';
import { useCountdown } from '../../hooks/useCountdown';
import { formatDatePt, formatTimePt } from '../../utils/datetime';

interface NextMatchProps {
  match: Match | null;
}

function TeamSide({ match, side }: { match: Match; side: 'home' | 'away' }) {
  const team = side === 'home' ? match.home_team : match.away_team;
  const decreto = Boolean(team?.is_decreto);

  return (
    <div className={`relative flex-1 min-w-0 py-1 md:py-2 flex flex-col items-center ${decreto ? 'match-decreto-side' : ''}`}>
      <span className={`text-[8px] sm:text-[9px] uppercase tracking-[0.28em] mb-2.5 ${decreto ? 'text-decreto-cyan' : 'text-decreto-white/[0.42]'}`}>
        {decreto ? 'O Decreto' : 'Adversário'}
      </span>
      <TeamBadge team={team} size="lg" framed />
      <p className="font-display uppercase text-lg sm:text-xl md:text-2xl text-center mt-3 leading-tight max-w-[230px]">
        {team?.name}
      </p>
      <p className={`mt-1 text-[9px] uppercase tracking-[0.2em] ${decreto ? 'text-decreto-cyan/80' : 'text-decreto-white/[0.4]'}`}>
        {team?.short_name}
      </p>
    </div>
  );
}

export function NextMatch({ match }: NextMatchProps) {
  const countdown = useCountdown(match?.match_date ?? null);

  return (
    <section id="proximo-jogo" className="decreto-section relative py-14 md:py-16 px-4 overflow-hidden border-b border-decreto-electric/10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_43%,rgba(46,107,255,.12),transparent_38%)]" aria-hidden="true" />

      <div className="relative max-w-4xl mx-auto flex flex-col items-center gap-6">
        <SectionTitle eyebrow="Fica ligado" title="Próximo Jogo" align="center" />

        {!match ? (
          <EmptyState title="Nenhum próximo jogo confirmado" description="Assim que a próxima partida do Decreto for agendada, ela aparecerá aqui." />
        ) : (
          <article className="relative w-full overflow-hidden border border-decreto-electric/25 bg-[#07132b]/90 shadow-[0_24px_72px_rgba(0,0,0,.30),0_0_52px_rgba(46,107,255,.07)]">
            <div className="absolute inset-0 bg-grain opacity-[0.07] mix-blend-overlay" aria-hidden="true" />
            <div className="absolute inset-y-0 left-0 w-1/2 bg-[radial-gradient(circle_at_45%_42%,rgba(62,216,240,.065),transparent_48%)]" aria-hidden="true" />
            <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_58%_43%,rgba(46,107,255,.18),transparent_52%)]" aria-hidden="true" />
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-decreto-cyan/15 to-transparent" aria-hidden="true" />

            <div className="relative px-4 sm:px-6 pt-4 flex items-center justify-between gap-3">
              <span className="inline-flex items-center gap-2 text-[9px] sm:text-[10px] uppercase tracking-[0.24em] text-decreto-cyan font-bold">
                <Swords size={13} /> {match.phase === 'grupos' && match.round != null ? `Rodada ${match.round}` : match.phase}
              </span>
              <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.23em] text-decreto-white/[0.38]">3ª Copa Verão · 2026</span>
            </div>

            <div className="relative grid grid-cols-[1fr_auto_1fr] items-center gap-1 sm:gap-5 px-2 sm:px-7 md:px-9 py-4 md:py-5">
              <TeamSide match={match} side="home" />

              <div className="relative flex flex-col items-center justify-center px-1 sm:px-3">
                <span className="font-display text-[2rem] sm:text-[2.8rem] md:text-[3.6rem] leading-none text-decreto-white/[0.2]">VS</span>
                <span className="absolute h-14 md:h-20 w-px bg-gradient-to-b from-transparent via-decreto-cyan/[0.38] to-transparent" aria-hidden="true" />
              </div>

              <TeamSide match={match} side="away" />
            </div>

            <div className="relative border-t border-decreto-electric/[0.15] bg-decreto-dark/[0.42] px-4 sm:px-6 py-3.5">
              <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2.5 text-decreto-white/[0.68] text-xs sm:text-[13px]">
                <span className="flex items-center gap-2"><CalendarDays size={15} className="text-decreto-cyan" /> {formatDatePt(match.match_date)}</span>
                <span className="flex items-center gap-2"><Clock3 size={15} className="text-decreto-cyan" /> {formatTimePt(match.match_date)}</span>
                {match.venue && <span className="flex items-center gap-2"><MapPin size={15} className="text-decreto-cyan" /> {match.venue}</span>}
              </div>

              {countdown && !countdown.isPast && (
                <div className="mt-3 max-w-lg mx-auto grid grid-cols-4 border border-decreto-cyan/10 bg-decreto-electric/[0.035] divide-x divide-decreto-cyan/10">
                  {[
                    { label: 'Dias', value: countdown.days },
                    { label: 'Horas', value: countdown.hours },
                    { label: 'Min', value: countdown.minutes },
                    { label: 'Seg', value: countdown.seconds },
                  ].map((item) => (
                    <div key={item.label} className="py-2 sm:py-2.5 flex flex-col items-center">
                      <span className="font-display text-2xl sm:text-3xl text-decreto-cyan leading-none">
                        {String(item.value).padStart(2, '0')}
                      </span>
                      <span className="mt-1 text-[7px] sm:text-[8px] uppercase tracking-[0.2em] text-decreto-white/[0.42]">{item.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </article>
        )}
      </div>
    </section>
  );
}
