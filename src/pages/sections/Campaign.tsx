import { CalendarDays, CheckCircle2, Clock3, MapPin } from 'lucide-react';
import { SectionTitle } from '../../components/SectionTitle';
import { TeamBadge } from '../../components/TeamBadge';
import { EmptyState } from '../../components/EmptyState';
import { formatDatePt, formatTimePt } from '../../utils/datetime';
import type { Match } from '../../types';

interface CampaignProps {
  matches: Match[];
}

function getDecretoPerspective(match: Match) {
  const decretoHome = Boolean(match.home_team?.is_decreto);
  const decretoScore = decretoHome ? match.home_score : match.away_score;
  const rivalScore = decretoHome ? match.away_score : match.home_score;
  const rival = decretoHome ? match.away_team : match.home_team;
  let status = 'Próximo';
  let tone = 'text-decreto-cyan';
  if (match.status === 'finalizado' && decretoScore != null && rivalScore != null) {
    if (decretoScore > rivalScore) { status = 'Vitória'; tone = 'text-decreto-cyan'; }
    else if (decretoScore < rivalScore) { status = 'Derrota'; tone = 'text-red-300'; }
    else { status = 'Empate'; tone = 'text-decreto-gold'; }
  } else if (match.status === 'adiado') { status = 'Adiado'; tone = 'text-decreto-gold'; }
  else if (match.status === 'cancelado') { status = 'Cancelado'; tone = 'text-red-300'; }
  return { decretoScore, rivalScore, rival, status, tone };
}

export function Campaign({ matches }: CampaignProps) {
  const ordered = [...matches].sort((a, b) => new Date(a.match_date).getTime() - new Date(b.match_date).getTime());
  const compactJourney = ordered.length <= 2;

  return (
    <section id="campanha" className="relative py-16 md:py-20 px-4 overflow-hidden bg-[#030916] border-b border-decreto-electric/10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_40%,rgba(62,216,240,.05),transparent_28%),radial-gradient(circle_at_90%_60%,rgba(46,107,255,.08),transparent_32%)]" aria-hidden="true" />

      <div className="relative max-w-6xl mx-auto">
        <SectionTitle eyebrow="Nossa jornada na Copa" title="Nossa Campanha" />

        {ordered.length === 0 ? (
          <div className="mt-10"><EmptyState title="Nenhuma partida cadastrada ainda" description="Assim que os jogos do Decreto forem cadastrados, eles aparecerão aqui em ordem cronológica." /></div>
        ) : (
          <div className={`relative mt-9 ${compactJourney ? 'md:max-w-4xl md:mx-auto' : ''}`}>
            <div className="hidden md:block absolute left-[3%] right-[3%] top-[27px] h-px bg-gradient-to-r from-transparent via-decreto-cyan/30 to-transparent" aria-hidden="true" />
            <div className="md:hidden absolute left-[22px] top-0 bottom-0 w-px bg-gradient-to-b from-decreto-cyan/[0.35] via-decreto-electric/20 to-transparent" aria-hidden="true" />

            <div className={`grid gap-5 md:gap-6 ${compactJourney ? 'md:grid-cols-2' : 'md:grid-cols-2 lg:grid-cols-3'}`}>
              {ordered.map((match, index) => {
                const view = getDecretoPerspective(match);
                return (
                  <article key={match.id} className="relative pl-14 md:pl-0 md:pt-14">
                    <div className="absolute left-0 md:left-1/2 md:-translate-x-1/2 top-0 h-11 w-11 rounded-full bg-[#07152f] border border-decreto-cyan/28 grid place-items-center shadow-[0_0_22px_rgba(62,216,240,.08)] z-10">
                      {match.status === 'finalizado' ? (
                        <CheckCircle2 size={18} className="text-decreto-cyan" />
                      ) : (
                        <span className="font-display text-decreto-white/75">{String(index + 1).padStart(2, '0')}</span>
                      )}
                    </div>

                    <div className="relative h-full min-h-[258px] overflow-hidden border border-decreto-electric/[0.2] bg-[#07142e]/84 p-5 md:p-6 shadow-[0_18px_44px_rgba(0,0,0,.2)]">
                      <div className="absolute right-0 top-0 h-full w-28 -skew-x-12 bg-decreto-electric/[0.04]" aria-hidden="true" />
                      <div className="absolute -right-16 -top-20 h-48 w-48 rounded-full bg-decreto-electric/[0.07] blur-[70px]" aria-hidden="true" />

                      <div className="relative flex items-center justify-between gap-3">
                        <span className="text-[9px] uppercase tracking-[0.22em] text-decreto-white/[0.42]">{match.phase === 'grupos' && match.round != null ? `Rodada ${match.round}` : match.phase}</span>
                        <span className={`font-display uppercase tracking-wider text-lg ${view.tone}`}>{view.status}</span>
                      </div>

                      <div className="relative mt-5 flex items-center gap-4">
                        <TeamBadge team={view.rival} size="md" />
                        <div className="min-w-0 flex-1">
                          <p className="text-[9px] uppercase tracking-[0.2em] text-decreto-white/[0.36]">Adversário</p>
                          <p className="font-display uppercase text-xl md:text-2xl truncate">{view.rival?.name}</p>
                        </div>
                        <div className="text-right shrink-0">
                          {match.status === 'finalizado' ? (
                            <p className="font-display text-3xl md:text-4xl text-decreto-white"><span className="text-decreto-cyan">{view.decretoScore}</span><span className="mx-1.5 text-decreto-white/20">×</span>{view.rivalScore}</p>
                          ) : (
                            <p className="font-display text-2xl md:text-3xl text-decreto-white/30">VS</p>
                          )}
                        </div>
                      </div>

                      <div className="relative mt-5 pt-4 border-t border-decreto-electric/10 flex flex-wrap gap-x-4 gap-y-2 text-[10px] text-decreto-white/[0.5]">
                        <span className="flex items-center gap-1.5"><CalendarDays size={12} /> {formatDatePt(match.match_date)}</span>
                        <span className="flex items-center gap-1.5"><Clock3 size={12} /> {formatTimePt(match.match_date)}</span>
                        {match.venue && <span className="flex items-center gap-1.5"><MapPin size={12} /> {match.venue}</span>}
                      </div>

                      {match.status === 'finalizado' && (match.scorers ?? []).length > 0 && (
                        <div className="relative mt-4 pt-4 border-t border-decreto-electric/10">
                          <p className="text-[9px] uppercase tracking-[0.2em] text-decreto-cyan/[0.72] mb-2">Gols do Decreto</p>
                          <p className="text-xs text-decreto-white/[0.72] leading-relaxed">
                            {(match.scorers ?? []).filter((s) => s.goals > 0).map((s) => `${s.player?.display_name ?? s.player?.name}${s.goals > 1 ? ` ${s.goals}×` : ''}`).join(' · ')}
                          </p>
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
