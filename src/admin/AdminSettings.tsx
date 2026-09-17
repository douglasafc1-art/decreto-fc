import { useEffect, useState, type FormEvent } from 'react';
import { useAsync } from '../hooks/useAsync';
import { getSiteSettings, updateSiteSettings } from '../services/settings';
import { AdminButton, AdminCard, AdminInput, AdminLabel, AdminPageHeader, AdminTextarea } from './AdminUI';
import { Loading } from '../components/Loading';

export function AdminSettings() {
  const { data: settings, loading, refetch } = useAsync(() => getSiteSettings(), []);
  const [form, setForm] = useState({
    competition_name: '',
    season: '',
    hero_title: '',
    hero_subtitle: '',
    instagram_url: '',
    city: '',
    about_text: '',
    default_venue: '',
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (settings) {
      setForm({
        competition_name: settings.competition_name,
        season: settings.season,
        hero_title: settings.hero_title,
        hero_subtitle: settings.hero_subtitle,
        instagram_url: settings.instagram_url ?? '',
        city: settings.city,
        about_text: settings.about_text,
        default_venue: settings.default_venue ?? '',
      });
    }
  }, [settings]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    setSaved(false);
    setError(null);
    try {
      await updateSiteSettings(settings.id, form);
      setSaved(true);
      await refetch();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível salvar as configurações.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <Loading />;

  return (
    <div>
      <AdminPageHeader title="Configurações" />
      <AdminCard>
        {error && <p className="text-sm text-red-400 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4 max-w-3xl">
          <AdminLabel>
            Nome da competição
            <AdminInput value={form.competition_name} onChange={(e) => setForm({ ...form, competition_name: e.target.value })} />
          </AdminLabel>
          <AdminLabel>
            Temporada
            <AdminInput value={form.season} onChange={(e) => setForm({ ...form, season: e.target.value })} />
          </AdminLabel>
          <AdminLabel>
            Título do Hero
            <AdminInput value={form.hero_title} onChange={(e) => setForm({ ...form, hero_title: e.target.value })} />
          </AdminLabel>
          <AdminLabel>
            Subtítulo do Hero
            <AdminInput value={form.hero_subtitle} onChange={(e) => setForm({ ...form, hero_subtitle: e.target.value })} />
          </AdminLabel>
          <AdminLabel>
            Instagram (URL)
            <AdminInput value={form.instagram_url} onChange={(e) => setForm({ ...form, instagram_url: e.target.value })} />
          </AdminLabel>
          <AdminLabel>
            Cidade
            <AdminInput value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
          </AdminLabel>
          <AdminLabel>
            Local padrão dos jogos
            <AdminInput value={form.default_venue} onChange={(e) => setForm({ ...form, default_venue: e.target.value })} />
          </AdminLabel>
          <AdminLabel className="md:col-span-2">
            Texto institucional
            <AdminTextarea rows={4} value={form.about_text} onChange={(e) => setForm({ ...form, about_text: e.target.value })} />
          </AdminLabel>

          <div className="md:col-span-2 flex items-center gap-3">
            <AdminButton type="submit" disabled={saving}>{saving ? 'Salvando...' : 'Salvar configurações'}</AdminButton>
            {saved && <span className="text-xs text-emerald-400">Salvo com sucesso.</span>}
          </div>
        </form>
      </AdminCard>
    </div>
  );
}
