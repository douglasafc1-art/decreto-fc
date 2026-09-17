import { useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Shield, Swords, Users, Handshake, Settings, LogOut, Menu, X } from 'lucide-react';
import { signOut } from '../services/auth';

const NAV = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/teams', label: 'Times', icon: Shield },
  { to: '/admin/matches', label: 'Jogos', icon: Swords },
  { to: '/admin/squad', label: 'Elenco/Comissão', icon: Users },
  { to: '/admin/sponsors', label: 'Patrocinadores', icon: Handshake },
  { to: '/admin/settings', label: 'Configurações', icon: Settings },
];

function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const navigate = useNavigate();

  async function handleLogout() {
    await signOut();
    navigate('/admin');
  }

  return (
    <div className="h-full flex flex-col bg-slate-950">
      <div className="px-5 py-5 border-b border-slate-800">
        <p className="font-semibold text-white">Decreto FC</p>
        <p className="text-xs text-slate-500">Painel Administrativo</p>
      </div>

      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {NAV.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2.5 rounded-md text-sm transition-colors ${
                isActive ? 'bg-blue-600/20 text-blue-300' : 'text-slate-300 hover:bg-slate-900'
              }`
            }
          >
            <Icon size={16} /> {label}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={handleLogout}
        className="m-3 flex items-center gap-2 px-3 py-2.5 rounded-md text-sm text-slate-400 hover:bg-slate-900 hover:text-red-400 transition-colors"
      >
        <LogOut size={16} /> Sair
      </button>
    </div>
  );
}

export function AdminLayout() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const currentLabel = NAV.find((item) => item.to === location.pathname)?.label ?? 'Admin';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 md:flex">
      <aside className="hidden md:block w-60 shrink-0 border-r border-slate-800 min-h-screen sticky top-0">
        <Sidebar />
      </aside>

      <header className="md:hidden sticky top-0 z-40 h-14 border-b border-slate-800 bg-slate-950/95 backdrop-blur flex items-center justify-between px-4">
        <div>
          <p className="text-xs text-slate-500">Decreto FC · Admin</p>
          <p className="text-sm font-semibold text-white">{currentLabel}</p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="h-10 w-10 rounded-md bg-slate-900 border border-slate-800 flex items-center justify-center"
          aria-label="Abrir menu administrativo"
        >
          <Menu size={20} />
        </button>
      </header>

      {open && (
        <div className="md:hidden fixed inset-0 z-50">
          <button
            className="absolute inset-0 bg-black/70"
            onClick={() => setOpen(false)}
            aria-label="Fechar menu"
          />
          <aside className="absolute inset-y-0 left-0 w-[82vw] max-w-72 border-r border-slate-800 shadow-2xl">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 z-10 h-9 w-9 rounded-md bg-slate-900 border border-slate-800 flex items-center justify-center"
              aria-label="Fechar menu"
            >
              <X size={18} />
            </button>
            <Sidebar onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      )}

      <main className="flex-1 min-w-0 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 sm:py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
