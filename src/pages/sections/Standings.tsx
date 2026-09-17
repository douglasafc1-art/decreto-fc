import { SectionTitle } from '../../components/SectionTitle';
import { StandingsTable } from '../../components/StandingsTable';
import { EmptyState } from '../../components/EmptyState';
import type { StandingsRow } from '../../types';

interface StandingsProps {
  grouped: Record<string, StandingsRow[]>;
  decretoTeamId?: string;
}

export function Standings({ grouped, decretoTeamId }: StandingsProps) {
  const groups = Object.entries(grouped);

  return (
    <section id="classificacao" className="decreto-section relative py-16 md:py-20 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(46,107,255,.08),transparent_34%),radial-gradient(circle_at_84%_70%,rgba(62,216,240,.04),transparent_32%)]" aria-hidden="true" />

      <div className="relative max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <SectionTitle eyebrow="Como estamos" title="Classificação" />
          <p className="max-w-md text-xs sm:text-sm text-decreto-white/55 md:text-right leading-relaxed">
            Tabela calculada automaticamente a partir dos resultados válidos da fase de grupos.
          </p>
        </div>

        {groups.length === 0 ? (
          <div className="mt-8"><EmptyState title="Classificação ainda não disponível" description="A tabela aparece assim que os primeiros resultados forem cadastrados." /></div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-6 md:gap-8 mt-8">
            {groups.map(([groupName, rows]) => (
              <div key={groupName} className="relative">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-display uppercase text-2xl text-decreto-cyan tracking-wide">{groupName}</h3>
                  <span className="text-[9px] uppercase tracking-[0.2em] text-decreto-white/45">{rows.length} equipes</span>
                </div>
                <StandingsTable rows={rows} highlightTeamId={decretoTeamId} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
