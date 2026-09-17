import { ExternalLink, Handshake } from 'lucide-react';
import { SectionTitle } from '../../components/SectionTitle';
import type { Sponsor, SponsorTier } from '../../types';

interface SponsorsProps {
  sponsors: Sponsor[];
  instagramUrl?: string | null;
}

const TIER_META: Record<SponsorTier, { label: string; order: number }> = {
  master: { label: 'Master', order: 0 },
  ouro: { label: 'Ouro', order: 1 },
  prata: { label: 'Prata', order: 2 },
  apoio: { label: 'Apoio', order: 3 },
};

function SponsorLogo({ sponsor }: { sponsor: Sponsor }) {
  const isMaster = sponsor.tier === 'master';

  const content = (
    <div
      className={`group relative h-full min-h-[145px] sm:min-h-[165px] overflow-hidden border bg-[#07142d]/80 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_50px_-26px_rgba(62,216,240,.28)] ${
        isMaster
          ? 'border-decreto-cyan/30 hover:border-decreto-cyan/60'
          : 'border-decreto-electric/[0.16] hover:border-decreto-cyan/35'
      }`}
    >
      <div
        className={`absolute inset-0 ${
          isMaster
            ? 'bg-[radial-gradient(circle_at_50%_15%,rgba(62,216,240,.12),transparent_52%)]'
            : 'bg-[radial-gradient(circle_at_50%_15%,rgba(46,107,255,.10),transparent_52%)]'
        }`}
        aria-hidden="true"
      />

      <div className="absolute right-3 top-3 z-10">
        <span
          className={`text-[8px] sm:text-[9px] uppercase tracking-[0.16em] border px-2 py-1 ${
            isMaster
              ? 'text-decreto-cyan border-decreto-cyan/25 bg-decreto-cyan/[0.04]'
              : 'text-decreto-white/[0.38] border-decreto-white/[0.08] bg-decreto-dark/25'
          }`}
        >
          {TIER_META[sponsor.tier].label}
        </span>
      </div>

      <div className="relative h-full flex flex-col items-center justify-center gap-3 px-4 py-6 pt-9">
        <div className="w-full h-[72px] sm:h-[82px] flex items-center justify-center">
          <img
            src={sponsor.logo_url}
            alt={`Logo ${sponsor.name}`}
            loading="lazy"
            className="max-h-full max-w-[84%] object-contain"
          />
        </div>

        <div className="flex items-center justify-center gap-2 max-w-full">
          <p className="font-semibold text-xs sm:text-sm text-decreto-white/[0.78] truncate text-center">
            {sponsor.name}
          </p>
          {sponsor.link_url && (
            <ExternalLink
              size={12}
              className="text-decreto-cyan/50 shrink-0 group-hover:text-decreto-cyan transition-colors"
            />
          )}
        </div>
      </div>
    </div>
  );

  if (!sponsor.link_url) return content;

  return (
    <a
      href={sponsor.link_url}
      target="_blank"
      rel="noreferrer"
      aria-label={`Visitar ${sponsor.name}`}
      className="block h-full"
    >
      {content}
    </a>
  );
}

export function Sponsors({ sponsors, instagramUrl }: SponsorsProps) {
  const orderedSponsors = [...sponsors].sort((a, b) => {
    const tierDifference = TIER_META[a.tier].order - TIER_META[b.tier].order;
    if (tierDifference !== 0) return tierDifference;
    return (a.display_order ?? 0) - (b.display_order ?? 0);
  });

  return (
    <section
      id="patrocinadores"
      className="relative py-16 md:py-20 px-4 overflow-hidden bg-[#030916] border-b border-decreto-electric/10"
    >
      <div className="absolute inset-0 bg-grain opacity-[0.035]" aria-hidden="true" />
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_72%_32%,rgba(46,107,255,.09),transparent_36%)]"
        aria-hidden="true"
      />

      <div className="relative max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
          <div>
            <SectionTitle eyebrow="Quem fortalece o Decreto" title="Patrocinadores" />
            <p className="mt-4 max-w-2xl text-sm text-decreto-white/[0.48] leading-relaxed">
              Marcas que acreditam no projeto e fazem parte da nossa caminhada dentro e fora das quadras.
            </p>
          </div>

          {orderedSponsors.length > 0 && (
            <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-decreto-white/[0.38]">
              <Handshake size={15} className="text-decreto-cyan" />
              {orderedSponsors.length} {orderedSponsors.length === 1 ? 'parceiro' : 'parceiros'}
            </div>
          )}
        </div>

        {orderedSponsors.length === 0 ? (
          <div className="relative mt-10 min-h-[190px] border border-dashed border-decreto-cyan/[0.18] bg-decreto-electric/[0.025] grid place-items-center text-center px-6">
            <div
              className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(46,107,255,.09),transparent_42%)]"
              aria-hidden="true"
            />
            <div className="relative max-w-xl">
              <Handshake className="mx-auto text-decreto-cyan/60" size={28} />
              <h3 className="font-display uppercase text-2xl text-decreto-white mt-4">
                Sua marca pode fazer parte desta história
              </h3>
              <p className="text-sm text-decreto-white/[0.48] mt-2 leading-relaxed">
                Este espaço é dedicado às empresas que apoiam o Decreto FC.
              </p>
              {instagramUrl && (
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex mt-5 text-xs uppercase tracking-[0.14em] text-decreto-cyan hover:text-white transition-colors"
                >
                  Fale com o Decreto
                </a>
              )}
            </div>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 items-stretch">
            {orderedSponsors.map((sponsor) => (
              <SponsorLogo key={sponsor.id} sponsor={sponsor} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
