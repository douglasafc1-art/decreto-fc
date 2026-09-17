import { CalendarDays, Trophy } from 'lucide-react';
import type { Match, ScorerRow, StandingsRow } from '../types';
import { formatDatePt } from '../utils/datetime';

interface StatusStripProps {
  nextMatch: Match | null;
  decretoRow: StandingsRow | null;
  decretoPosition: number | null;
  groupName: string | null;
  topScorer: ScorerRow | null;
}

export function StatusStrip({ nextMatch, decretoRow, decretoPosition, groupName, topScorer }: StatusStripProps) {
  const items = [
    {
      icon: CalendarDays,
      imageUrl: null,
      imageAlt: '',
      fallback: '',
      kicker: 'Próximo jogo',
      value: nextMatch ? formatDatePt(nextMatch.match_date).slice(0, 5) : 'A DEFINIR',
      detail: nextMatch ? `${nextMatch.home_team?.short_name ?? ''} × ${nextMatch.away_team?.short_name ?? ''}` : 'Aguardando tabela',
      href: '#proximo-jogo',
    },
    {
      icon: Trophy,
      imageUrl: null,
      imageAlt: '',
      fallback: '',
      kicker: groupName ?? 'Classificação',
      value: decretoPosition ? `${decretoPosition}º LUGAR` : '—',
      detail: decretoRow ? `${decretoRow.points} pts · ${decretoRow.played} ${decretoRow.played === 1 ? 'jogo' : 'jogos'}` : 'Sem jogos válidos',
      href: '#classificacao',
    },
    {
      icon: null,
      imageUrl: topScorer?.player.photo_url ?? null,
      imageAlt: topScorer ? `Foto de ${topScorer.player.display_name ?? topScorer.player.name}` : '',
      fallback: topScorer?.player.number != null ? String(topScorer.player.number) : '—',
      kicker: 'Artilheiro do Decreto',
      value: topScorer ? (topScorer.player.display_name ?? topScorer.player.name).toUpperCase() : '—',
      detail: topScorer ? `${topScorer.goals} ${topScorer.goals === 1 ? 'gol' : 'gols'}` : 'Artilharia zerada',
      href: '#artilharia',
    },
  ];

  return (
    <section className="relative z-20 -mt-px border-y border-decreto-cyan/[0.15] bg-[#061126]/95 backdrop-blur-xl" aria-label="Resumo da participação do Decreto">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3">
        {items.map(({ icon: Icon, imageUrl, imageAlt, fallback, kicker, value, detail, href }, index) => (
          <a
            key={kicker}
            href={href}
            className={`group relative px-5 py-4 md:px-7 md:py-5 flex items-center gap-4 hover:bg-decreto-electric/[0.08] transition-colors ${index > 0 ? 'sm:border-l sm:border-decreto-cyan/10' : ''}`}
          >
            <div className="h-11 w-11 shrink-0 rounded-sm border border-decreto-cyan/20 bg-decreto-electric/10 overflow-hidden grid place-items-center text-decreto-cyan shadow-[0_0_22px_rgba(62,216,240,0.06)]">
              {imageUrl ? (
                <img src={imageUrl} alt={imageAlt} className="h-full w-full object-cover object-top" loading="lazy" />
              ) : Icon ? (
                <Icon size={19} />
              ) : (
                <span className="font-display text-sm text-decreto-white/50">{fallback}</span>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-[9px] md:text-[10px] uppercase tracking-[0.22em] text-decreto-white/[0.45]">{kicker}</p>
              <p className="font-display text-xl md:text-2xl uppercase tracking-wide text-decreto-white group-hover:text-decreto-cyan transition-colors truncate">{value}</p>
              <p className="text-[11px] text-decreto-white/[0.45] truncate">{detail}</p>
            </div>
            <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-decreto-cyan to-decreto-electric group-hover:w-full transition-all duration-300" aria-hidden="true" />
          </a>
        ))}
      </div>
    </section>
  );
}
