import { createClient } from '@supabase/supabase-js';

const configuredUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const configuredAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(configuredUrl && configuredAnonKey);

if (!isSupabaseConfigured) {
  // O fallback mantém a aplicação carregável para desenvolvimento/build, mas
  // nenhuma consulta real funcionará até o .env ser preenchido.
  console.warn(
    '[Decreto FC] Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no .env. Veja o README.md.'
  );
}

const supabaseUrl = configuredUrl || 'https://placeholder.supabase.co';
const supabaseAnonKey = configuredAnonKey || 'placeholder-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
