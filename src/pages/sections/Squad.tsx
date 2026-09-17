import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Pause, ShieldCheck } from 'lucide-react';
import { SectionTitle } from '../../components/SectionTitle';
import { PlayerCard } from '../../components/PlayerCard';
import { EmptyState } from '../../components/EmptyState';
import type { Player } from '../../types';

interface SquadProps {
  players: Player[];
  staff: Player[];
}

export function Squad({ players, staff }: SquadProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const interactionPauseUntil = useRef(0);

  function cardStep() {
    const scroller = scrollerRef.current;
    if (!scroller) return 300;
    const first = scroller.querySelector<HTMLElement>('[data-player-card]');
    return first ? first.offsetWidth + 20 : Math.min(320, scroller.clientWidth * 0.82);
  }

  function nudge(direction: -1 | 1) {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    interactionPauseUntil.current = Date.now() + 5000;
    const max = scroller.scrollWidth - scroller.clientWidth;
    const next = scroller.scrollLeft + direction * cardStep();
    if (direction > 0 && next >= max - 8) {
      scroller.scrollTo({ left: 0, behavior: 'smooth' });
    } else if (direction < 0 && scroller.scrollLeft <= 8) {
      scroller.scrollTo({ left: max, behavior: 'smooth' });
    } else {
      scroller.scrollBy({ left: direction * cardStep(), behavior: 'smooth' });
    }
  }

  useEffect(() => {
    if (players.length < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = window.setInterval(() => {
      if (!paused && Date.now() > interactionPauseUntil.current) nudge(1);
    }, 3600);
    return () => window.clearInterval(timer);
  }, [paused, players.length]);

  return (
    <section id="elenco" className="relative py-16 md:py-20 overflow-hidden bg-[#061027] border-y border-decreto-electric/10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_92%_18%,rgba(46,107,255,.16),transparent_28%),linear-gradient(120deg,transparent_0%,rgba(62,216,240,.025)_45%,transparent_70%)]" aria-hidden="true" />
      <div className="absolute inset-0 bg-grain opacity-[0.045]" aria-hidden="true" />

      <div className="relative max-w-6xl mx-auto px-4 flex items-end justify-between gap-4">
        <div>
          <SectionTitle eyebrow="Quem veste a camisa" title="Nosso Elenco" />
          <p className="mt-3 max-w-lg text-xs sm:text-sm text-decreto-white/55">Os nomes que representam o Decreto na nossa primeira campanha no futsal.</p>
        </div>
        {players.length > 1 && (
          <div className="hidden sm:flex items-center gap-2" aria-label="Controles do carrossel do elenco">
            <button onClick={() => nudge(-1)} className="carousel-control" aria-label="Jogadores anteriores"><ChevronLeft size={20} /></button>
            <button onClick={() => nudge(1)} className="carousel-control" aria-label="Próximos jogadores"><ChevronRight size={20} /></button>
          </div>
        )}
      </div>

      <div className="relative mt-10">
        {players.length === 0 ? (
          <div className="px-4"><EmptyState title="Elenco em cadastro" description="Os jogadores aparecerão aqui assim que forem cadastrados no painel administrativo." /></div>
        ) : (
          <>
            <div className="absolute inset-y-0 left-0 w-8 md:w-16 bg-gradient-to-r from-[#061027] to-transparent z-10 pointer-events-none" aria-hidden="true" />
            <div className="absolute inset-y-0 right-0 w-8 md:w-16 bg-gradient-to-l from-[#061027] to-transparent z-10 pointer-events-none" aria-hidden="true" />
            <div
              ref={scrollerRef}
              className="flex overflow-x-auto overscroll-x-contain scroll-smooth pb-4 scrollbar-thin snap-x snap-mandatory px-[max(1rem,calc((100vw-72rem)/2))]"
              role="list"
              aria-label="Elenco do Decreto FC. Deslize para navegar."
              tabIndex={0}
              onPointerEnter={() => setPaused(true)}
              onPointerLeave={() => setPaused(false)}
              onPointerDown={() => { setPaused(true); interactionPauseUntil.current = Date.now() + 5000; }}
              onPointerUp={() => { setPaused(false); interactionPauseUntil.current = Date.now() + 5000; }}
              onFocus={() => setPaused(true)}
              onBlur={() => setPaused(false)}
            >
              <div className="flex w-max gap-5 pr-4">
                {players.map((player) => (
                  <div role="listitem" key={player.id} className="snap-start" data-player-card>
                    <PlayerCard player={player} />
                  </div>
                ))}
              </div>
            </div>
            <p className="max-w-6xl mx-auto px-4 mt-2 text-[11px] text-decreto-white/[0.5] flex items-center gap-1.5 sm:hidden">
              <Pause size={11} /> Toque e deslize para navegar pelo elenco.
            </p>
          </>
        )}
      </div>

      {staff.length > 0 && (
        <div className="relative max-w-6xl mx-auto px-4 mt-16 md:mt-20">
          <div className="flex items-center gap-3 mb-6">
            <ShieldCheck className="text-decreto-cyan" size={20} />
            <h3 className="font-display uppercase text-2xl text-decreto-cyan tracking-wide">Comissão Técnica</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl">
            {staff.map((member) => (
              <article key={member.id} className="relative overflow-hidden border border-decreto-electric/[0.18] bg-[#08152f]/75 p-4 flex items-center gap-4">
                <div className="absolute right-0 inset-y-0 w-24 -skew-x-12 bg-decreto-electric/[0.04]" aria-hidden="true" />
                {member.photo_url ? (
                  <img src={member.photo_url} alt={member.display_name ?? member.name} loading="lazy" className="relative h-20 w-20 object-cover border border-decreto-cyan/[0.15]" />
                ) : (
                  <div className="relative h-20 w-20 bg-decreto-electric/[0.08] border border-decreto-cyan/10 grid place-items-center"><img src="/decreto-logo.webp" alt="" className="h-9 w-9 opacity-35" /></div>
                )}
                <div className="relative min-w-0">
                  <p className="font-display uppercase text-lg truncate">{member.display_name ?? member.name}</p>
                  <p className="text-[10px] text-decreto-cyan/80 uppercase tracking-[0.18em] mt-1">{member.role ?? 'Comissão Técnica'}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
