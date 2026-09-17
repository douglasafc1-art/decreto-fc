import type { Team } from '../types';

interface TeamBadgeProps {
  team: Team | undefined;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  framed?: boolean;
}

const sizes = { sm: 'h-8 w-8', md: 'h-14 w-14', lg: 'h-24 w-24', xl: 'h-28 w-28 md:h-36 md:w-36' };

export function TeamBadge({ team, size = 'md', framed = false }: TeamBadgeProps) {
  const dimension = sizes[size];
  const content = !team ? (
    <div className={`${dimension} rounded-full bg-decreto-navy border border-decreto-electric/20`} aria-hidden="true" />
  ) : team.logo_url ? (
    <img
      src={team.logo_url}
      alt={`Escudo do ${team.name}`}
      className={`${dimension} object-contain drop-shadow-[0_0_16px_rgba(46,107,255,0.4)]`}
      loading="lazy"
    />
  ) : (
    <div
      className={`${dimension} rounded-full bg-decreto-navy border border-decreto-electric/30 flex items-center justify-center font-display text-decreto-cyan text-lg md:text-2xl`}
      aria-label={`Escudo do ${team.name}`}
    >
      {team.short_name?.slice(0, 3).toUpperCase()}
    </div>
  );

  if (!framed) return content;

  return (
    <div className={`relative grid place-items-center ${size === 'xl' ? 'p-4 md:p-5' : 'p-3'} rounded-[1.6rem] border border-decreto-electric/25 bg-decreto-dark/[0.45] backdrop-blur-sm shadow-[inset_0_0_32px_rgba(46,107,255,0.07)]`}>
      <div className="absolute inset-2 rounded-[1.25rem] border border-decreto-cyan/10" aria-hidden="true" />
      {content}
    </div>
  );
}
