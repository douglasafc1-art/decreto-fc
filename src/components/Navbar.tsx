import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';

const LINKS = [
  { href: '#hero', label: 'Início' },
  { href: '#proximo-jogo', label: 'Próximo Jogo' },
  { href: '#classificacao', label: 'Classificação' },
  { href: '#elenco', label: 'Elenco' },
  { href: '#campanha', label: 'Jogos' },
  { href: '#artilharia', label: 'Artilharia' },
  { href: '#patrocinadores', label: 'Patrocinadores' },
];

export function Navbar({ logoUrl }: { logoUrl?: string | null }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('#hero');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 35);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const ids = LINKS.map((link) => link.href.slice(1));
    const elements = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(`#${visible.target.id}`);
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: [0.05, 0.2, 0.45] }
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
        scrolled ? 'bg-[#030815]/92 backdrop-blur-xl border-b border-decreto-cyan/[0.12] shadow-[0_12px_40px_rgba(0,0,0,.18)]' : 'bg-gradient-to-b from-decreto-dark/80 to-transparent'
      }`}
    >
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3" aria-label="Navegação principal">
        <a href="#hero" className="group flex items-center gap-3 font-display uppercase tracking-wider text-lg">
          <span className="relative">
            <span className="absolute inset-0 rounded-full bg-decreto-cyan/10 blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
            <img src={logoUrl || '/decreto-logo.webp'} alt="Escudo Decreto FC" className="relative h-10 w-10 object-contain" onError={(e) => (e.currentTarget.style.display = 'none')} />
          </span>
          <span className="leading-none">Decreto <span className="text-decreto-cyan">FC</span></span>
        </a>

        <ul className="hidden md:flex items-center gap-5 lg:gap-6 text-[11px] lg:text-xs uppercase tracking-[0.08em]">
          {LINKS.map((link) => {
            const isActive = active === link.href;
            return (
              <li key={link.href}>
                <a href={link.href} className={`relative py-2 transition-colors ${isActive ? 'text-decreto-cyan' : 'text-decreto-white/[0.68] hover:text-decreto-white'}`}>
                  {link.label}
                  <span className={`absolute left-0 right-0 -bottom-0.5 h-px bg-decreto-cyan transition-transform origin-left ${isActive ? 'scale-x-100' : 'scale-x-0'}`} aria-hidden="true" />
                </a>
              </li>
            );
          })}
        </ul>

        <button
          className="md:hidden h-10 w-10 border border-decreto-electric/20 grid place-items-center text-decreto-white"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {open && (
        <ul className="md:hidden bg-[#030815]/98 border-t border-decreto-electric/[0.15] px-4 py-3 flex flex-col text-sm uppercase">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href} onClick={() => setOpen(false)} className={`block py-3 border-b border-decreto-electric/[0.08] last:border-0 ${active === link.href ? 'text-decreto-cyan' : 'text-decreto-white/[0.72]'}`}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
