import { Star } from 'lucide-react';
import type { Player } from '../types';

interface PlayerCardProps {
  player: Player;
}

export function PlayerCard({ player }: PlayerCardProps) {
  const name = player.display_name ?? player.name;

  return (
    <article className="relative w-[250px] sm:w-[270px] lg:w-[285px] shrink-0 overflow-hidden border border-decreto-electric/[0.22] bg-[#08152f] group shadow-[0_18px_48px_rgba(0,0,0,.22)]">
      <div className="relative h-[340px] sm:h-[370px] lg:h-[390px] overflow-hidden bg-[radial-gradient(circle_at_50%_20%,rgba(46,107,255,.34),transparent_48%),linear-gradient(165deg,#0a2455_0%,#07142f_55%,#030816_100%)]">
        <div className="absolute inset-0 bg-grain opacity-[0.09] mix-blend-overlay" aria-hidden="true" />
        <div className="absolute -right-14 top-0 h-[110%] w-28 rotate-[11deg] bg-decreto-cyan/[0.035] border-l border-decreto-cyan/10" aria-hidden="true" />
        <div className="absolute left-5 top-14 font-display text-[9rem] leading-none text-decreto-electric/[0.12] tracking-tighter select-none" aria-hidden="true">
          {player.number ?? 'DFC'}
        </div>

        {player.photo_url ? (
          <img
            src={player.photo_url}
            alt={name}
            loading="lazy"
            className="relative z-[2] h-full w-full object-cover object-top group-hover:scale-[1.025] transition duration-500 saturate-[.92] group-hover:saturate-100"
          />
        ) : (
          <div className="relative z-[2] h-full w-full flex items-center justify-center">
            <div className="flex flex-col items-center gap-3 opacity-70">
              <img src="/decreto-logo.webp" alt="" aria-hidden="true" className="h-14 w-14 object-contain opacity-55" />
              <span className="font-display text-[6.5rem] leading-none text-decreto-electric/[0.28]">{player.number ?? '#'}</span>
            </div>
          </div>
        )}

        <div className="absolute z-[3] inset-0 bg-gradient-to-t from-[#030816] via-transparent via-55% to-[#07152a]/20" />
        <div className="absolute z-[4] left-0 right-0 bottom-0 h-1 bg-gradient-to-r from-decreto-electric via-decreto-cyan to-transparent" aria-hidden="true" />

        {player.number != null && (
          <span className="absolute z-[5] top-3 left-4 font-display text-4xl sm:text-5xl text-decreto-cyan drop-shadow-[0_0_12px_rgba(62,216,240,0.5)]">
            {player.number}
          </span>
        )}
        {player.is_captain && (
          <span className="absolute z-[5] top-3 right-3 bg-decreto-gold text-decreto-dark rounded-full p-2 shadow-lg" title="Capitão" aria-label="Capitão">
            <Star size={14} fill="currentColor" />
          </span>
        )}
      </div>

      <div className="relative px-5 py-4 bg-[linear-gradient(110deg,#07142f_0%,#0d2860_62%,#07142f_100%)]">
        <img src="/decreto-logo.webp" alt="" aria-hidden="true" className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 object-contain opacity-18" />
        <p className="font-display uppercase text-xl text-decreto-white truncate tracking-wide pr-9">{name}</p>
        <p className="text-[10px] text-decreto-cyan/80 uppercase tracking-[0.22em] mt-1">{player.position ?? 'Decreto FC'}</p>
      </div>
    </article>
  );
}
