import { useState, type FormEvent } from 'react';
import { Handshake, Save, Trash2, Upload } from 'lucide-react';
import { useAsync } from '../hooks/useAsync';
import { createSponsor, deleteSponsor, getAllSponsors, updateSponsor, uploadSponsorLogo } from '../services/sponsors';
import type { Sponsor, SponsorTier } from '../types';
import { removePublicStorageObject } from '../utils/storage';
import { Loading } from '../components/Loading';
import { AdminButton, AdminCard, AdminInput, AdminLabel, AdminPageHeader, AdminSelect } from './AdminUI';

interface SponsorDraft {
  name: string;
  link_url: string;
  tier: SponsorTier;
  active: boolean;
  display_order: string;
}

const TIER_OPTIONS: Array<{ value: SponsorTier; label: string }> = [
  { value: 'master', label: 'Master' },
  { value: 'ouro', label: 'Ouro' },
  { value: 'prata', label: 'Prata' },
  { value: 'apoio', label: 'Apoio' },
];

function toDraft(sponsor: Sponsor): SponsorDraft {
  return {
    name: sponsor.name,
    link_url: sponsor.link_url ?? '',
    tier: sponsor.tier,
    active: sponsor.active,
    display_order: String(sponsor.display_order ?? 0),
  };
}

export function AdminSponsors() {
  const { data: sponsors, loading, error: loadError, refetch } = useAsync(() => getAllSponsors(), []);
  const [name, setName] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [tier, setTier] = useState<SponsorTier>('apoio');
  const [active, setActive] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [drafts, setDrafts] = useState<Record<string, SponsorDraft>>({});
  const [replacementFiles, setReplacementFiles] = useState<Record<string, File | null>>({});
  const [busyId, setBusyId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function getDraft(sponsor: Sponsor): SponsorDraft {
    return drafts[sponsor.id] ?? toDraft(sponsor);
  }

  function patchDraft(sponsor: Sponsor, patch: Partial<SponsorDraft>) {
    setDrafts((current) => ({ ...current, [sponsor.id]: { ...(current[sponsor.id] ?? toDraft(sponsor)), ...patch } }));
  }

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || !file) return;
    setCreating(true);
    setError(null);
    let logoUrl: string | null = null;
    try {
      logoUrl = await uploadSponsorLogo(file);
      const maxOrder = Math.max(-1, ...(sponsors ?? []).map((sponsor) => sponsor.display_order ?? 0));
      await createSponsor({ name: name.trim(), logo_url: logoUrl, link_url: linkUrl.trim() || null, tier, active, display_order: maxOrder + 1 });
      setName(''); setLinkUrl(''); setTier('apoio'); setActive(true); setFile(null);
      await refetch();
    } catch (err) {
      if (logoUrl) { try { await removePublicStorageObject('sponsors', logoUrl); } catch { /* opcional */ } }
      setError(err instanceof Error ? err.message : 'Não foi possível cadastrar o patrocinador.');
    } finally { setCreating(false); }
  }

  async function handleSave(sponsor: Sponsor) {
    const draft = getDraft(sponsor);
    const replacement = replacementFiles[sponsor.id] ?? null;
    setBusyId(sponsor.id); setError(null);
    let newLogoUrl: string | null = null;
    try {
      if (replacement) newLogoUrl = await uploadSponsorLogo(replacement);
      await updateSponsor(sponsor.id, {
        name: draft.name.trim(), link_url: draft.link_url.trim() || null, tier: draft.tier,
        active: draft.active, display_order: Number(draft.display_order) || 0,
        ...(newLogoUrl ? { logo_url: newLogoUrl } : {}),
      });
      if (newLogoUrl) { try { await removePublicStorageObject('sponsors', sponsor.logo_url); } catch { /* opcional */ } }
      setDrafts((current) => { const next = { ...current }; delete next[sponsor.id]; return next; });
      setReplacementFiles((current) => { const next = { ...current }; delete next[sponsor.id]; return next; });
      await refetch();
    } catch (err) {
      if (newLogoUrl) { try { await removePublicStorageObject('sponsors', newLogoUrl); } catch { /* opcional */ } }
      setError(err instanceof Error ? err.message : 'Não foi possível atualizar o patrocinador.');
    } finally { setBusyId(null); }
  }

  async function handleDelete(sponsor: Sponsor) {
    if (!confirm(`Excluir o patrocinador "${sponsor.name}" e o logo correspondente?`)) return;
    setBusyId(sponsor.id); setError(null);
    try { await deleteSponsor(sponsor); await refetch(); }
    catch (err) { setError(err instanceof Error ? err.message : 'Não foi possível excluir o patrocinador.'); }
    finally { setBusyId(null); }
  }

  return (
    <div>
      <AdminPageHeader title="Patrocinadores" />
      <AdminCard>
        <div className="flex items-center gap-2 mb-4"><Handshake size={17} className="text-blue-400" /><h2 className="text-sm font-semibold text-white">Cadastrar patrocinador</h2></div>
        {(error || loadError) && <p className="text-xs text-red-400 mb-3">{error ?? loadError}</p>}
        <form onSubmit={handleCreate} className="grid sm:grid-cols-2 xl:grid-cols-4 gap-3 items-end">
          <AdminLabel>Nome da empresa<AdminInput value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex.: Ecoferros" required /></AdminLabel>
          <AdminLabel>Categoria<AdminSelect value={tier} onChange={(e) => setTier(e.target.value as SponsorTier)}>{TIER_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</AdminSelect></AdminLabel>
          <AdminLabel>Link / Instagram / site<AdminInput type="url" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="https://..." /></AdminLabel>
          <label className="flex items-center gap-2 text-sm text-slate-300 pb-2"><input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />Exibir no site</label>
          <div className="sm:col-span-2 xl:col-span-3">
            <label className="flex items-center justify-center gap-2 cursor-pointer text-sm text-slate-300 border border-dashed border-slate-700 rounded-md px-3 py-3 hover:border-blue-500">
              <Upload size={15} /> {file ? file.name : 'Selecionar logo do patrocinador'}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
            </label>
            <p className="mt-2 text-[11px] text-slate-500">
              Padrão recomendado: 1200 × 720 px, PNG ou WebP, fundo transparente e logo centralizada.
            </p>
          </div>
          <AdminButton type="submit" disabled={creating || !name.trim() || !file}>{creating ? 'Cadastrando...' : 'Cadastrar'}</AdminButton>
        </form>
      </AdminCard>

      <div className="mt-6">
        {loading ? <Loading /> : (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {(sponsors ?? []).map((sponsor) => {
              const draft = getDraft(sponsor);
              const changed = !!drafts[sponsor.id] || !!replacementFiles[sponsor.id];
              return (
                <AdminCard key={sponsor.id}>
                  <div className="h-36 border border-slate-800 rounded-lg bg-slate-950 flex items-center justify-center p-5 mb-4 overflow-hidden"><img src={sponsor.logo_url} alt={`Logo ${sponsor.name}`} className="max-h-full max-w-full object-contain" /></div>
                  <div className="grid gap-2">
                    <AdminLabel>Nome<AdminInput value={draft.name} onChange={(e) => patchDraft(sponsor, { name: e.target.value })} /></AdminLabel>
                    <div className="grid grid-cols-2 gap-2">
                      <AdminLabel>Categoria<AdminSelect value={draft.tier} onChange={(e) => patchDraft(sponsor, { tier: e.target.value as SponsorTier })}>{TIER_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</AdminSelect></AdminLabel>
                      <AdminLabel>Ordem<AdminInput type="number" value={draft.display_order} onChange={(e) => patchDraft(sponsor, { display_order: e.target.value })} /></AdminLabel>
                    </div>
                    <AdminLabel>Link<AdminInput type="url" value={draft.link_url} onChange={(e) => patchDraft(sponsor, { link_url: e.target.value })} placeholder="https://..." /></AdminLabel>
                    <label className="flex items-center gap-2 text-sm text-slate-300 py-1"><input type="checkbox" checked={draft.active} onChange={(e) => patchDraft(sponsor, { active: e.target.checked })} />Exibir no site</label>
                    <label className="flex items-center justify-center gap-2 cursor-pointer text-xs text-slate-400 border border-dashed border-slate-700 rounded-md px-3 py-2 hover:border-blue-500">
                      <Upload size={13} /> {replacementFiles[sponsor.id] ? replacementFiles[sponsor.id]?.name : 'Trocar logo'}
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => setReplacementFiles((current) => ({ ...current, [sponsor.id]: e.target.files?.[0] ?? null }))} />
                    </label>
                    <div className="flex gap-2 pt-1">
                      <AdminButton variant="primary" disabled={!changed || busyId === sponsor.id || !draft.name.trim()} onClick={() => handleSave(sponsor)}><Save size={14} className="inline mr-1" /> Salvar</AdminButton>
                      <AdminButton variant="danger" disabled={busyId === sponsor.id} onClick={() => handleDelete(sponsor)}><Trash2 size={14} className="inline mr-1" /> Excluir</AdminButton>
                    </div>
                  </div>
                </AdminCard>
              );
            })}
            {(sponsors ?? []).length === 0 && !loadError && <p className="text-sm text-slate-500 col-span-full">Nenhum patrocinador cadastrado ainda.</p>}
          </div>
        )}
      </div>
    </div>
  );
}
