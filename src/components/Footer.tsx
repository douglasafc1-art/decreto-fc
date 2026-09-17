import { Instagram } from 'lucide-react';
import type { SiteSettings } from '../types';

interface FooterProps {
  settings: SiteSettings | null;
  logoUrl?: string | null;
}

export function Footer({ settings, logoUrl }: FooterProps) {
  return (
    <footer className="relative overflow-hidden border-t border-decreto-electric/[0.15] bg-[#020611] py-12">
      <div className="absolute inset-0 bg-grain opacity-[0.035]" aria-hidden="true" />
      <div className="absolute left-1/2 top-0 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-decreto-cyan/[0.35] to-transparent" aria-hidden="true" />
      <div className="relative max-w-6xl mx-auto px-4 flex flex-col items-center gap-3 text-center">
        <img src={logoUrl || '/decreto-logo.webp'} alt="Escudo Decreto FC" className="h-20 w-20 object-contain drop-shadow-[0_0_20px_rgba(62,216,240,.12)]" onError={(e) => (e.currentTarget.style.display = 'none')} />
        <p className="font-display uppercase text-2xl tracking-[0.12em]">Decreto Futebol Clube</p>
        <p className="text-decreto-cyan text-[10px] uppercase tracking-[0.28em]">Desde 2017</p>
        <p className="text-decreto-white/[0.42] text-sm">{settings?.city ?? 'Açucena — Minas Gerais'}</p>

        {settings?.instagram_url && (
          <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-decreto-white/[0.55] hover:text-decreto-cyan mt-2 text-sm transition-colors">
            <Instagram size={17} /> Instagram
          </a>
        )}

        <p className="font-script text-decreto-cyan text-2xl sm:text-3xl mt-4">Fechado com o Decreto.</p>
        <p className="text-[9px] uppercase tracking-[0.22em] text-decreto-white/20 mt-4">Açucena · MG · Brasil</p>
      </div>
    </footer>
  );
}
