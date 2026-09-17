import { useState, type FormEvent } from 'react';
import { Plus, Trash2, Pencil, Upload } from 'lucide-react';
import { useAsync } from '../hooks/useAsync';
import { getTeams, createTeam, updateTeam, deleteTeam, uploadTeamLogo, replaceTeamLogo } from '../services/teams';
import type { Team } from '../types';
import { AdminButton, AdminCard, AdminInput, AdminLabel, AdminPageHeader, AdminBadge } from './AdminUI';
import { Loading } from '../components/Loading';

const emptyForm = { name: '', short_name: '', group_name: '', is_decreto: false, active: true };

export function AdminTeams() {
  const { data: teams, loading, refetch } = useAsync(() => getTeams(), []);
  const [editing, setEditing] = useState<Team | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function startEdit(team: Team) {
    setEditing(team);
    setForm({
      name: team.name,
      short_name: team.short_name,
      group_name: team.group_name ?? '',
      is_decreto: team.is_decreto,
      active: team.active,
    });
  }

  function resetForm() {
    setEditing(null);
    setForm(emptyForm);
    setLogoFile(null);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    let createdTeam: Team | null = null;
    try {
      let team: Team;
      if (editing) {
        team = await updateTeam(editing.id, form);
      } else {
        team = await createTeam(form);
        createdTeam = team;
      }
      if (logoFile) {
        if (editing) {
          await replaceTeamLogo({ ...editing, ...team }, logoFile);
        } else {
          const url = await uploadTeamLogo(logoFile, team.id);
          await updateTeam(team.id, { logo_url: url });
        }
      }
      resetForm();
      await refetch();
    } catch (err) {
      if (createdTeam) {
        try { await deleteTeam(createdTeam); } catch { /* evita cadastro parcial quando o upload falha */ }
      }
      setError(err instanceof Error ? err.message : 'Erro ao salvar time.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(team: Team) {
    if (!confirm(`Excluir o time "${team.name}"? Essa ação não pode ser desfeita.`)) return;
    try {
      await deleteTeam(team);
      refetch();
    } catch {
      alert('Não foi possível excluir. Talvez existam jogos vinculados — considere desativar o time.');
    }
  }

  async function handleToggleActive(team: Team) {
    await updateTeam(team.id, { active: !team.active });
    refetch();
  }

  return (
    <div>
      <AdminPageHeader title="Times" />

      <div className="grid md:grid-cols-3 gap-6">
        <AdminCard>
          <h2 className="text-sm font-semibold text-white mb-4">{editing ? 'Editar time' : 'Novo time'}</h2>
          {error && <p className="text-xs text-red-400 mb-3">{error}</p>}
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <AdminLabel>
              Nome
              <AdminInput required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </AdminLabel>
            <AdminLabel>
              Sigla / Nome curto
              <AdminInput required maxLength={12} value={form.short_name} onChange={(e) => setForm({ ...form, short_name: e.target.value })} />
            </AdminLabel>
            <AdminLabel>
              Grupo
              <AdminInput value={form.group_name} onChange={(e) => setForm({ ...form, group_name: e.target.value })} placeholder="Grupo 1" />
            </AdminLabel>
            <AdminLabel>
              Escudo
              <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-300 border border-dashed border-slate-700 rounded-md px-3 py-2 hover:border-blue-500">
                <Upload size={14} /> {logoFile ? logoFile.name : 'Selecionar imagem'}
                <input type="file" accept="image/*" className="hidden" onChange={(e) => setLogoFile(e.target.files?.[0] ?? null)} />
              </label>
            </AdminLabel>
            <label className="flex items-center gap-2 text-sm text-slate-300">
              <input type="checkbox" checked={form.is_decreto} onChange={(e) => setForm({ ...form, is_decreto: e.target.checked })} />
              Este é o Decreto FC
            </label>

            <div className="flex gap-2 mt-2">
              <AdminButton type="submit" disabled={saving}>
                <Plus size={14} className="inline mr-1" /> {saving ? 'Salvando...' : editing ? 'Salvar alterações' : 'Adicionar time'}
              </AdminButton>
              {editing && (
                <AdminButton type="button" variant="ghost" onClick={resetForm}>
                  Cancelar
                </AdminButton>
              )}
            </div>
          </form>
        </AdminCard>

        <div className="md:col-span-2">
          {loading ? (
            <Loading />
          ) : (
            <div className="flex flex-col gap-2">
              {(teams ?? []).map((team) => (
                <AdminCard key={team.id}>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    {team.logo_url ? (
                      <img src={team.logo_url} alt="" className="h-10 w-10 object-contain" />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-slate-800" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white flex items-center gap-2">
                        {team.name}
                        {team.is_decreto && <AdminBadge tone="success">Decreto</AdminBadge>}
                        {!team.active && <AdminBadge tone="warning">Inativo</AdminBadge>}
                      </p>
                      <p className="text-xs text-slate-400">{team.short_name} · {team.group_name || 'Sem grupo'}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 sm:justify-end">
                      <AdminButton variant="ghost" onClick={() => startEdit(team)} aria-label="Editar time"><Pencil size={14} /></AdminButton>
                      <AdminButton variant="ghost" onClick={() => handleToggleActive(team)}>
                        {team.active ? 'Desativar' : 'Ativar'}
                      </AdminButton>
                      <AdminButton variant="danger" onClick={() => handleDelete(team)} aria-label="Excluir time"><Trash2 size={14} /></AdminButton>
                    </div>
                  </div>
                </AdminCard>
              ))}
              {(teams ?? []).length === 0 && <p className="text-sm text-slate-500">Nenhum time cadastrado ainda.</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
