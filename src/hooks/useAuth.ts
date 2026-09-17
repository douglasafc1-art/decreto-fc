import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { isCurrentUserAdmin } from '../services/auth';

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function syncAuth(nextSession: Session | null) {
      if (!active) return;
      setSession(nextSession);
      if (!nextSession) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        const allowed = await isCurrentUserAdmin();
        if (active) setIsAdmin(allowed);
      } catch {
        if (active) setIsAdmin(false);
      } finally {
        if (active) setLoading(false);
      }
    }

    supabase.auth.getSession().then(({ data }) => syncAuth(data.session));

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setLoading(true);
      // Adia a consulta de autorização até o callback do Auth terminar.
      // Isso evita disputar o lock interno de sessão do Supabase.
      window.setTimeout(() => void syncAuth(newSession), 0);
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  return { session, loading, isAuthenticated: !!session, isAdmin };
}
