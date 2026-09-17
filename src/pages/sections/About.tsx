import { Flag, Footprints, Sparkles } from 'lucide-react';
import { SectionTitle } from '../../components/SectionTitle';
import type { SiteSettings } from '../../types';

interface AboutProps {
  settings: SiteSettings | null;
}

export function About({ settings }: AboutProps) {
  return (
    <section id="sobre" className="relative py-16 md:py-20 px-4 overflow-hidden bg-[#061027] border-b border-decreto-electric/10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_55%,rgba(46,107,255,.12),transparent_35%)]" aria-hidden="true" />

      <div className="relative max-w-5xl mx-auto">
        <div className="grid lg:grid-cols-[.85fr_1.15fr] gap-10 lg:gap-16 items-start">
          <div>
            <SectionTitle eyebrow="Nossa história" title="Desde 2017" />
            <p className="mt-6 text-decreto-white/[0.58] leading-relaxed max-w-xl text-sm sm:text-[15px]">
              {settings?.about_text ?? 'O Decreto FC nasceu em Açucena/MG em 2017, criado entre amigos, e ficou conhecido pela organização e pela formação de bons elencos nas competições municipais. Tradicionalmente ligado ao futebol de campo, em 2026 o clube inicia um novo capítulo ao disputar pela primeira vez uma competição de futsal: a 3ª Copa Verão de Futsal Amador de Açucena.'}
            </p>
            <p className="font-script text-decreto-cyan text-2xl sm:text-3xl mt-7">A história continua nas quadras.</p>
          </div>

          <div className="relative pl-8 sm:pl-10">
            <div className="absolute left-[15px] sm:left-[19px] top-5 bottom-5 w-px bg-gradient-to-b from-decreto-cyan via-decreto-electric/[0.35] to-decreto-cyan" aria-hidden="true" />
            {[
              { year: '2017', title: 'Nasce o Decreto', text: 'Um clube criado entre amigos em Açucena, com identidade própria e vontade de competir.', icon: Flag },
              { year: 'CAMPO', title: 'Nossa base', text: 'O Decreto construiu sua história no futebol de campo, especialmente nas competições municipais.', icon: Footprints },
              { year: '2026', title: 'Um novo capítulo', text: 'Primeira participação do clube no futsal: 3ª Copa Verão de Futsal Amador de Açucena.', icon: Sparkles },
            ].map(({ year, title, text, icon: Icon }, index) => (
              <div key={year} className={`relative pb-8 last:pb-0 ${index === 2 ? 'text-decreto-cyan' : ''}`}>
                <div className="absolute -left-8 sm:-left-10 top-0 h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-[#07152f] border border-decreto-cyan/25 grid place-items-center shadow-[0_0_20px_rgba(62,216,240,.08)]">
                  <Icon size={15} />
                </div>
                <p className="text-[9px] uppercase tracking-[0.24em] text-decreto-cyan/70">{year}</p>
                <h3 className="font-display uppercase text-2xl sm:text-3xl text-decreto-white mt-1">{title}</h3>
                <p className="text-xs sm:text-sm text-decreto-white/[0.42] mt-2 leading-relaxed max-w-lg">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
