import type { ScorerRow } from '../types';

interface ScorersListProps {
  rows: ScorerRow[];
}

export function ScorersList({ rows }: ScorersListProps) {
  return (
    <ol className="card-surface divide-y divide-decreto-electric/10">
      {rows.map((row, i) => (
        <li key={row.player.id} className="flex items-center gap-4 px-4 py-3">
          <span className="font-display text-2xl w-8 text-decreto-cyan text-center">{i + 1}º</span>
          {row.player.photo_url ? (
            <img src={row.player.photo_url} alt="" loading="lazy" className="h-10 w-10 rounded-full object-cover" />
          ) : (
            <div className="h-10 w-10 rounded-full bg-decreto-navy flex items-center justify-center text-xs">
              {row.player.number ?? '#'}
            </div>
          )}
          <span className="flex-1 font-semibold">{row.player.display_name ?? row.player.name}</span>
          <span className="font-display text-lg text-decreto-white/80">{row.goals} {row.goals === 1 ? 'gol' : 'gols'}</span>
        </li>
      ))}
    </ol>
  );
}
