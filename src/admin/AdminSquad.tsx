import { useState, type FormEvent } from 'react';
import { Plus, Trash2, Pencil, Upload, Star } from 'lucide-react';
import { useAsync } from '../hooks/useAsync';
import { getAllPlayers, createPlayer, updatePlayer, deletePlayer, uploadPlayerPhoto, replacePlayerPhoto } from '../services/players';
import type { Player, PlayerType } from '../types';
import {
  AdminButton,
  AdminCard,
  AdminInput,
  AdminLabel,
  AdminPageHeader,
  AdminSelect,
  AdminBadge,
} from './AdminUI';
import { Loading } from '../components/Loading';

const emptyForm = {
  name: '',
  display_name: '',
  number: '',
  position: '',
  role: '',
  type: 'jogador' as PlayerType,
  is_captain: false,
  active: true,
  display_order: '0',
};

export function AdminSquad() {
  const { data: players, loading, refetch } = useAsync(() => getAllPlayers(), []);
  const [editing, setEditing] = useState<Player | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function startEdit(player: Player) {
    setEditing(player);
    setForm({
      name: player.name,
      display_name: player.display_name ?? '',
      number: player.number?.toString() ?? '',
      position: player.position ?? '',
      role: player.role ?? '',
      type: player.type,
      is_captain: player.is_captain,
      active: player.active,
      display_order: player.display_order?.toString() ?? '0',
    });
  }

  function resetForm() {
    setEditing(null);
    setForm(emptyForm);
    setPhotoFile(null);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    let createdPlayer: Player | null = null;
    try {
      const payload = {
        name: form.name,
        display_name: form.display_name || null,
        number: form.type === 'jogador' && form.number !== '' ? Number(form.number) : null,
        position: form.type === 'jogador' ? form.position || null : null,
        role: form.type === 'comissao' ? form.role || null : null,
        type: form.type,
        is_captain: form.type === 'jogador' ? form.is_captain : false,
        active: form.active,
        display_order: Number(form.display_order) || 0,
      };

      let player: Player;
      if (editing) {
        player = await updatePlayer(editing.id, payload);
      } else {
        player = await createPlayer(payload);
        createdPlayer = player;
      }
      if (photoFile) {
        if (editing) {
          await replacePlayerPhoto({ ...editing, ...player }, photoFile);
        } else {
          const url = await uploadPlayerPhoto(photoFile, player.id);
          await updatePlayer(player.id, { photo_url: url });
        }
      }
      resetForm();
      await refetch();
    } catch (err) {
      if (createdPlayer) {
        try { await deletePlayer(createdPlayer); } catch { /* evita cadastro parcial quando o upload falha */ }
      }
      setError(err instanceof Error ? err.message : 'Erro ao salvar.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(player: Player) {
    if (!confirm(`Remover "${player.name}"? Prefira desativar se ele já tiver gols cadastrados.`)) return;
    try {
      await deletePlayer(player);
      refetch();
    } catch {
      alert('Não foi possível excluir. Talvez existam gols vinculados — considere desativar.');
    }
  }

  async function handleToggleActive(player: Player) {
    await updatePlayer(player.id, { active: !player.active });
    refetch();
  }

  return (
    <div>
      <AdminPageHeader title="Elenco e Comissão Técnica" />

      <div className="grid md:grid-cols-3 gap-6">
        <AdminCard>
          <h2 className="text-sm font-semibold text-white mb-4">{editing ? 'Editar' : 'Novo cadastro'}</h2>
          {error && <p className="text-xs text-red-400 mb-3">{error}</p>}
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <AdminLabel>
              Tipo
              <AdminSelect value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as PlayerType })}>
                <option value="jogador">Jogador</option>
                <option value="comissao">Comissão técnica</option>
              </AdminSelect>
            </AdminLabel>

            <AdminLabel>
              Nome completo
              <AdminInput required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </AdminLabel>

            <AdminLabel>
              Apelido / nome esportivo
              <AdminInput value={form.display_name} onChange={(e) => setForm({ ...form, display_name: e.target.value })} />
            </AdminLabel>

            {form.type === 'jogador' ? (
              <div className="grid grid-cols-2 gap-3">
                <AdminLabel>
                  Número
                  <AdminInput type="number" min={0} value={form.number} onChange={(e) => setForm({ ...form, number: e.target.value })} />
                </AdminLabel>
                <AdminLabel>
                  Posição
                  <AdminInput value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} placeholder="Fixo, Ala, Pivô, Goleiro" />
                </AdminLabel>
              </div>
            ) : (
              <AdminLabel>
                Função
                <AdminInput value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="Treinador, Auxiliar, Diretor" />
              </AdminLabel>
            )}

            <AdminLabel>
              Ordem de exibição
              <AdminInput type="number" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: e.target.value })} />
            </AdminLabel>

            <AdminLabel>
              Foto
              <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-300 border border-dashed border-slate-700 rounded-md px-3 py-2 hover:border-blue-500">
                <Upload size={14} /> {photoFile ? photoFile.name : 'Selecionar imagem'}
                <input type="file" accept="image/*" className="hidden" onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)} />
              </label>
            </AdminLabel>

            {form.type === 'jogador' && (
              <label className="flex items-center gap-2 text-sm text-slate-300">
                <input type="checkbox" checked={form.is_captain} onChange={(e) => setForm({ ...form, is_captain: e.target.checked })} />
                Capitão
              </label>
            )}

            <div className="flex gap-2 mt-2">
              <AdminButton type="submit" disabled={saving}>
                <Plus size={14} className="inline mr-1" /> {saving ? 'Salvando...' : editing ? 'Salvar alterações' : 'Adicionar'}
              </AdminButton>
              {editing && <AdminButton type="button" variant="ghost" onClick={resetForm}>Cancelar</AdminButton>}
            </div>
          </form>
        </AdminCard>

        <div className="md:col-span-2">
          {loading ? (
            <Loading />
          ) : (
            <div className="flex flex-col gap-2">
              {(players ?? []).map((player) => (
                <AdminCard key={player.id}>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    {player.photo_url ? (
                      <img src={player.photo_url} alt="" className="h-10 w-10 rounded-full object-cover" />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-slate-800" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white flex items-center gap-2 text-sm">
                        {player.display_name ?? player.name}
                        {player.is_captain && <Star size={13} className="text-amber-400" />}
                        {!player.active && <AdminBadge tone="warning">Inativo</AdminBadge>}
                      </p>
                      <p className="text-xs text-slate-400">
                        {player.type === 'jogador' ? `${player.position ?? '—'} · #${player.number ?? '-'}` : player.role ?? 'Comissão técnica'}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2 sm:justify-end">
                      <AdminButton variant="ghost" onClick={() => startEdit(player)} aria-label="Editar cadastro"><Pencil size={14} /></AdminButton>
                      <AdminButton variant="ghost" onClick={() => handleToggleActive(player)}>
                        {player.active ? 'Desativar' : 'Ativar'}
                      </AdminButton>
                      <AdminButton variant="danger" onClick={() => handleDelete(player)} aria-label="Excluir cadastro"><Trash2 size={14} /></AdminButton>
                    </div>
                  </div>
                </AdminCard>
              ))}
              {(players ?? []).length === 0 && <p className="text-sm text-slate-500">Ninguém cadastrado ainda.</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
