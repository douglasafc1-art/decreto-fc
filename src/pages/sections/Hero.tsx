import { ArrowDown, MapPin, Sparkles } from 'lucide-react';
import type { SiteSettings } from '../../types';

interface HeroProps {
  settings: SiteSettings | null;
  logoUrl?: string | null;
}

export function Hero({ settings, logoUrl }: HeroProps) {
  return (
    <section
      id="hero"
      className="relative min-h-[78svh] md:min-h-[82svh] lg:min-h-[86svh] flex items-center overflow-hidden bg-decreto-dark isolate"
    >
      <div className="absolute inset-0 bg-[#020711]" aria-hidden="true" />
      <div className="absolute inset-0 bg-grain opacity-[0.14] mix-blend-overlay" aria-hidden="true" />

      <div className="absolute -left-[8vw] bottom-[9%] h-px w-[64vw] bg-gradient-to-r from-transparent via-decreto-cyan/60 to-transparent shadow-[0_0_24px_rgba(62,216,240,0.42)]" aria-hidden="true" />
      <div className="absolute left-[7%] top-[35%] h-1 w-1 rounded-full bg-decreto-cyan shadow-[105px_62px_0_rgba(62,216,240,.5),285px_-70px_0_rgba(46,107,255,.42),470px_105px_0_rgba(62,216,240,.28)]" aria-hidden="true" />

      {/* Mascote integrada ao cenário — sem painel ou recorte retangular. */}
      <div
        className="absolute pointer-events-none select-none z-[4] inset-y-0 right-[-24%] sm:right-[-10%] md:right-[8%] lg:right-[18%] xl:right-[20%] w-[100%] sm:w-[80%] md:w-[61%] lg:w-[54%] xl:w-[49%] opacity-[0.24] sm:opacity-45 md:opacity-100"
        aria-hidden="true"
      >
        <img
          src="/mascote-decreto.png"
          alt=""
          className="relative ml-auto h-full w-full object-contain object-right-bottom saturate-[1.03] contrast-[1.02]"
        />
      </div>


      <div className="absolute inset-x-0 bottom-0 z-[6] h-24 bg-gradient-to-t from-decreto-dark via-decreto-dark/65 to-transparent pointer-events-none" aria-hidden="true" />

      <div className="relative z-10 max-w-6xl mx-auto w-full px-4 pt-24 pb-16 md:pt-24 md:pb-20 lg:pt-24 lg:pb-20">
        <div className="max-w-[720px] lg:max-w-[760px] flex flex-col items-start text-left">
          <div className="flex items-center gap-3 mb-5">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-decreto-cyan/15 blur-xl" />
              <img
                src={logoUrl || '/decreto-logo.webp'}
                alt="Escudo Decreto FC"
                className="relative h-14 w-14 sm:h-16 sm:w-16 object-contain drop-shadow-[0_0_18px_rgba(62,216,240,0.24)]"
              />
            </div>
            <div className="border-l border-decreto-cyan/25 pl-3">
              <p className="text-[10px] sm:text-xs uppercase tracking-[0.28em] text-decreto-white/[0.62]">Desde 2017</p>
              <p className="text-xs sm:text-sm uppercase tracking-[0.18em] text-decreto-cyan flex items-center gap-1 mt-1"><MapPin size={12} /> Açucena · MG</p>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 border-l-2 border-decreto-cyan pl-3">
            <Sparkles size={13} className="text-decreto-cyan" />
            <p className="uppercase tracking-[0.25em] text-decreto-cyan text-[9px] sm:text-[11px] font-bold leading-relaxed">
              {settings?.competition_name ?? '3ª Copa Verão de Futsal Amador de Açucena'}
            </p>
          </div>

          <h1 className="font-display uppercase text-[clamp(4.1rem,11.6vw,8.4rem)] leading-[0.79] text-decreto-white mt-4 tracking-[-0.035em] drop-shadow-[0_12px_36px_rgba(0,0,0,0.82)]">
            {settings?.hero_title ?? 'Decreto FC'}
          </h1>

          <div className="mt-4 max-w-2xl">
            <p className="font-script text-[1.72rem] sm:text-[2.2rem] md:text-[2.55rem] text-decreto-cyan leading-[0.95] drop-shadow-[0_0_18px_rgba(62,216,240,.2)]">
              {settings?.hero_subtitle ?? 'Nossa primeira batalha nas quadras.'}
            </p>
            <p className="text-sm sm:text-[15px] text-decreto-white/[0.68] mt-3 max-w-[535px] leading-relaxed">
              Um novo capítulo na história do clube. A mesma camisa, a mesma organização e a mesma fome de competir.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-6">
            <a href="#proximo-jogo" className="btn-primary uppercase tracking-[0.12em] text-xs sm:text-sm clip-button">Próximo jogo</a>
            <a href="#classificacao" className="inline-flex items-center gap-2 border border-decreto-electric/40 bg-decreto-dark/40 backdrop-blur text-decreto-white/90 hover:border-decreto-cyan hover:text-decreto-cyan font-semibold px-5 py-3 transition-colors uppercase tracking-[0.12em] text-xs sm:text-sm clip-button">Ver classificação</a>
          </div>
        </div>
      </div>

      <a href="#proximo-jogo" className="absolute z-30 bottom-4 left-1/2 -translate-x-1/2 text-decreto-white/40 hover:text-decreto-cyan transition-colors" aria-label="Ir para o próximo jogo">
        <ArrowDown className="animate-bounce" size={21} />
      </a>
    </section>
  );
}
