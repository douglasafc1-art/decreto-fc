import { useState, type FormEvent } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { isCurrentUserAdmin, signIn, signOut } from '../services/auth';
import { useAuth } from '../hooks/useAuth';
import { isSupabaseConfigured } from '../lib/supabase';

export function AdminLogin() {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(
    searchParams.get('denied') ? 'Esta conta não possui permissão de administrador.' : null
  );
  const [submitting, setSubmitting] = useState(false);

  if (!loading && isAuthenticated && isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await signIn(email, password);
      const allowed = await isCurrentUserAdmin();
      if (!allowed) {
        await signOut();
        setError('Login válido, mas este usuário não foi autorizado como administrador do Decreto FC.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível entrar. Verifique seus dados.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-xl p-8 flex flex-col gap-4 shadow-2xl">
        <div className="flex flex-col items-center gap-2 mb-2">
          <div className="relative h-16 w-16 flex items-center justify-center">
            <div className="absolute inset-1 rounded-full bg-blue-500/10 blur-xl" aria-hidden="true" />
            <img
              src="/decreto-logo.webp"
              alt="Escudo Decreto FC"
              className="relative h-16 w-16 object-contain drop-shadow-[0_0_14px_rgba(59,130,246,0.24)]"
            />
          </div>
          <h1 className="text-lg font-semibold text-white">Painel Administrativo</h1>
          <p className="text-xs text-slate-400">Decreto FC</p>
        </div>

        {!isSupabaseConfigured && (
          <p className="text-sm text-amber-300 bg-amber-950/30 border border-amber-900/60 rounded-md px-3 py-2">
            Supabase ainda não configurado. Preencha o arquivo <code>.env</code> antes de usar o painel.
          </p>
        )}

        {error && (
          <p className="text-sm text-red-300 bg-red-950/40 border border-red-900 rounded-md px-3 py-2 flex gap-2 items-start">
            <ShieldAlert size={16} className="shrink-0 mt-0.5" /> {error}
          </p>
        )}

        <label className="text-sm text-slate-300">
          E-mail
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-md bg-slate-800 border border-slate-700 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>

        <label className="text-sm text-slate-300">
          Senha
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-md bg-slate-800 border border-slate-700 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>

        <button
          type="submit"
          disabled={submitting || loading || !isSupabaseConfigured}
          className="mt-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-semibold rounded-md py-2.5 transition-colors"
        >
          {submitting ? 'Verificando acesso...' : 'Entrar'}
        </button>

        <p className="text-xs text-slate-500 text-center mt-1">
          O usuário precisa existir no Supabase Auth e também estar autorizado na tabela de administradores.
        </p>
      </form>
    </div>
  );
}
