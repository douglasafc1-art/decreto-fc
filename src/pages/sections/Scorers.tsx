import { Medal } from 'lucide-react';
import { SectionTitle } from '../../components/SectionTitle';
import { EmptyState } from '../../components/EmptyState';
import type { ScorerRow } from '../../types';

interface ScorersProps {
  rows: ScorerRow[];
}

export function Scorers({ rows }: ScorersProps) {
  const leader = rows[0];
  const rest = rows.slice(1, 10);

  return (
    <section id="artilharia" className="relative py-16 md:py-20 px-4 overflow-hidden bg-[#061027] border-b border-decreto-electric/10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_45%,rgba(46,107,255,.14),transparent_30%),linear-gradient(105deg,transparent_50%,rgba(62,216,240,.025)_50%,transparent_75%)]" aria-hidden="true" />

      <div className="relative max-w-5xl mx-auto">
        <SectionTitle eyebrow="Só o Decreto conta" title="Artilharia do Decreto" />
        <p className="text-decreto-white/[0.42] text-xs sm:text-sm mt-3 max-w-xl leading-relaxed">
          Ranking baseado apenas nos gols dos nossos jogadores. Não representa a artilharia oficial da competição.
        </p>

        <div className="mt-8">
          {rows.length === 0 ? (
            <EmptyState title="Artilharia ainda não iniciada" description="Os gols aparecerão aqui após os primeiros jogos do Decreto." />
          ) : (
            <div className="grid md:grid-cols-[1.05fr_.95fr] gap-5">
              <article className="relative overflow-hidden min-h-[270px] border border-decreto-cyan/20 bg-[radial-gradient(circle_at_65%_35%,rgba(46,107,255,.28),transparent_38%),linear-gradient(135deg,#0a2453_0%,#07142d_58%,#030816_100%)] p-6 md:p-8 flex items-end">
                <div className="absolute inset-0 bg-grain opacity-[0.07]" aria-hidden="true" />
                {leader.player.photo_url && (
                  <img src={leader.player.photo_url} alt="" className="absolute right-0 bottom-0 h-[92%] w-[48%] object-cover object-top opacity-45 [mask-image:linear-gradient(to_left,black_58%,transparent_100%)]" loading="lazy" />
                )}
                <div className="relative z-10 max-w-[70%]">
                  <div className="inline-flex items-center gap-2 text-decreto-gold text-[10px] uppercase tracking-[0.22em] mb-4"><Medal size={15} /> Artilheiro</div>
                  <p className="font-display uppercase text-4xl md:text-5xl leading-[0.92] text-decreto-white">{leader.player.display_name ?? leader.player.name}</p>
                  <p className="mt-3"><span className="font-display text-5xl md:text-6xl text-decreto-cyan">{leader.goals}</span> <span className="text-decreto-white/[0.45] uppercase tracking-[0.16em] text-xs">{leader.goals === 1 ? 'gol' : 'gols'}</span></p>
                </div>
              </article>

              <ol className="border border-decreto-electric/[0.18] bg-[#08152f]/75 divide-y divide-decreto-electric/10">
                {rest.length === 0 ? (
                  <li className="h-full min-h-[150px] grid place-items-center text-sm text-decreto-white/[0.35]">Aguardando os próximos gols.</li>
                ) : rest.map((row, i) => (
                  <li key={row.player.id} className="flex items-center gap-4 px-4 sm:px-5 py-4 hover:bg-decreto-electric/[0.04]">
                    <span className="font-display text-2xl w-8 text-decreto-cyan/75 text-center">{i + 2}º</span>
                    {row.player.photo_url ? (
                      <img src={row.player.photo_url} alt="" loading="lazy" className="h-11 w-11 object-cover border border-decreto-cyan/10" />
                    ) : (
                      <div className="h-11 w-11 bg-decreto-electric/[0.08] border border-decreto-cyan/10 flex items-center justify-center font-display text-decreto-white/[0.35]">{row.player.number ?? '#'}</div>
                    )}
                    <span className="flex-1 font-semibold truncate">{row.player.display_name ?? row.player.name}</span>
                    <span className="font-display text-xl text-decreto-white/75">{row.goals} <span className="text-xs font-body text-decreto-white/[0.35]">{row.goals === 1 ? 'gol' : 'gols'}</span></span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
