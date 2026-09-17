import { useMemo, useState, type FormEvent } from 'react';
import { Plus, Trash2, Pencil, AlertTriangle } from 'lucide-react';
import { useAsync } from '../hooks/useAsync';
import { getActiveTeams } from '../services/teams';
import {
  getAllMatches,
  createMatch,
  updateMatch,
  deleteMatch,
  setMatchScorers,
} from '../services/matches';
import { getActivePlayers } from '../services/players';
import type { Match, MatchPhase, MatchStatus } from '../types';
import { fromBrasiliaToISO, formatDateTimePt, toBrasiliaInputValue } from '../utils/datetime';
import { validateScorersSum } from '../utils/scorers';
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

const STATUS_LABEL: Record<MatchStatus, string> = {
  agendado: 'Agendado',
  finalizado: 'Finalizado',
  adiado: 'Adiado',
  cancelado: 'Cancelado',
};

const PHASE_LABEL: Record<MatchPhase, string> = {
  grupos: 'Fase de grupos',
  semifinal: 'Semifinal',
  final: 'Final',
  outro: 'Outra fase',
};

const emptyForm = {
  home_team_id: '',
  away_team_id: '',
  round: '',
  phase: 'grupos' as MatchPhase,
  counts_for_standings: true,
  match_date: '',
  venue: '',
  status: 'agendado' as MatchStatus,
  home_score: '',
  away_score: '',
};

export function AdminMatches() {
  const { data: teams, loading: teamsLoading } = useAsync(() => getActiveTeams(), []);
  const { data: matches, loading: matchesLoading, refetch } = useAsync(() => getAllMatches(), []);
  const { data: players } = useAsync(() => getActivePlayers('jogador'), []);

  const [editing, setEditing] = useState<Match | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [scorers, setScorers] = useState<Array<{ player_id: string; goals: number }>>([]);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const decretoTeam = useMemo(() => teams?.find((t) => t.is_decreto), [teams]);
  const homeTeam = useMemo(() => teams?.find((t) => t.id === form.home_team_id), [teams, form.home_team_id]);
  const awayTeam = useMemo(() => teams?.find((t) => t.id === form.away_team_id), [teams, form.away_team_id]);

  const involvesDecreto =
    !!decretoTeam && (form.home_team_id === decretoTeam.id || form.away_team_id === decretoTeam.id);

  const decretoScore =
    decretoTeam && form.home_team_id === decretoTeam.id
      ? Number(form.home_score || 0)
      : Number(form.away_score || 0);

  const scorersValidation = validateScorersSum(decretoScore, scorers.filter((s) => s.player_id));
  const sameGroupGroupStage =
    form.phase === 'grupos' &&
    !!homeTeam?.group_name &&
    !!awayTeam?.group_name &&
    homeTeam.group_name === awayTeam.group_name;

  function startEdit(match: Match) {
    setEditing(match);
    setForm({
      home_team_id: match.home_team_id,
      away_team_id: match.away_team_id,
      round: match.round?.toString() ?? '',
      phase: match.phase ?? 'grupos',
      counts_for_standings: match.counts_for_standings !== false,
      match_date: toBrasiliaInputValue(match.match_date),
      venue: match.venue ?? '',
      status: match.status,
      home_score: match.home_score?.toString() ?? '',
      away_score: match.away_score?.toString() ?? '',
    });
    setScorers((match.scorers ?? []).map((s) => ({ player_id: s.player_id, goals: s.goals })));
    setError(null);
  }

  function resetForm() {
    setEditing(null);
    setForm(emptyForm);
    setScorers([]);
    setError(null);
  }

  function changePhase(phase: MatchPhase) {
    setForm((current) => ({
      ...current,
      phase,
      counts_for_standings: phase === 'grupos' ? current.counts_for_standings : false,
    }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (form.home_team_id === form.away_team_id) {
      setError('O time mandante e o visitante não podem ser o mesmo.');
      return;
    }
    if (form.status === 'finalizado' && (form.home_score === '' || form.away_score === '')) {
      setError('Um jogo finalizado precisa ter o placar preenchido.');
      return;
    }
    if (
      (form.home_score !== '' && Number(form.home_score) < 0) ||
      (form.away_score !== '' && Number(form.away_score) < 0)
    ) {
      setError('O placar não pode ser negativo.');
      return;
    }

    const selectedScorers = scorers.filter((s) => s.player_id && s.goals > 0);
    const uniquePlayers = new Set(selectedScorers.map((s) => s.player_id));
    if (uniquePlayers.size !== selectedScorers.length) {
      setError('O mesmo jogador foi informado mais de uma vez nos autores dos gols. Some os gols em uma única linha.');
      return;
    }

    setSaving(true);
    try {
      const isFinished = form.status === 'finalizado';
      const payload = {
        home_team_id: form.home_team_id,
        away_team_id: form.away_team_id,
        round: form.round ? Number(form.round) : null,
        phase: form.phase,
        counts_for_standings: sameGroupGroupStage ? false : form.counts_for_standings,
        match_date: fromBrasiliaToISO(form.match_date),
        venue: form.venue || null,
        status: form.status,
        home_score: isFinished ? Number(form.home_score) : null,
        away_score: isFinished ? Number(form.away_score) : null,
      };

      let match: Match;
      if (editing) {
        match = await updateMatch(editing.id, payload);
      } else {
        match = await createMatch(payload);
      }

      // Sempre sincroniza os artilheiros. Se o jogo deixar de ser finalizado ou
      // deixar de envolver o Decreto, os registros antigos são removidos.
      await setMatchScorers(
        match.id,
        involvesDecreto && isFinished ? selectedScorers : []
      );

      resetForm();
      refetch();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar a partida.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(match: Match) {
    if (!confirm('Excluir esta partida? Isso também remove os artilheiros vinculados.')) return;
    try {
      await deleteMatch(match.id);
      refetch();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível excluir a partida.');
    }
  }

  function addScorerRow() {
    setScorers([...scorers, { player_id: '', goals: 1 }]);
  }

  function updateScorerRow(index: number, patch: Partial<{ player_id: string; goals: number }>) {
    setScorers(scorers.map((s, i) => (i === index ? { ...s, ...patch } : s)));
  }

  function removeScorerRow(index: number) {
    setScorers(scorers.filter((_, i) => i !== index));
  }

  const loading = teamsLoading || matchesLoading;

  return (
    <div>
      <AdminPageHeader title="Jogos" />

      <div className="grid xl:grid-cols-2 gap-6">
        <AdminCard>
          <h2 className="text-sm font-semibold text-white mb-4">{editing ? 'Editar partida' : 'Nova partida'}</h2>
          {error && (
            <p className="text-xs text-red-400 mb-3 flex items-start gap-1">
              <AlertTriangle size={13} className="shrink-0 mt-0.5" /> {error}
            </p>
          )}
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="grid sm:grid-cols-2 gap-3">
              <AdminLabel>
                Mandante
                <AdminSelect required value={form.home_team_id} onChange={(e) => setForm({ ...form, home_team_id: e.target.value })}>
                  <option value="">Selecione</option>
                  {teams?.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </AdminSelect>
              </AdminLabel>
              <AdminLabel>
                Visitante
                <AdminSelect required value={form.away_team_id} onChange={(e) => setForm({ ...form, away_team_id: e.target.value })}>
                  <option value="">Selecione</option>
                  {teams?.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </AdminSelect>
              </AdminLabel>
            </div>

            <div className="grid sm:grid-cols-3 gap-3">
              <AdminLabel>
                Rodada
                <AdminInput type="number" min={1} value={form.round} onChange={(e) => setForm({ ...form, round: e.target.value })} />
              </AdminLabel>
              <AdminLabel>
                Fase
                <AdminSelect value={form.phase} onChange={(e) => changePhase(e.target.value as MatchPhase)}>
                  {Object.entries(PHASE_LABEL).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </AdminSelect>
              </AdminLabel>
              <AdminLabel>
                Status
                <AdminSelect value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as MatchStatus })}>
                  {Object.entries(STATUS_LABEL).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </AdminSelect>
              </AdminLabel>
            </div>

            <label className="flex items-start gap-2 text-sm text-slate-300 bg-slate-950/50 border border-slate-800 rounded-md px-3 py-2.5">
              <input
                type="checkbox"
                className="mt-0.5"
                checked={form.counts_for_standings && !sameGroupGroupStage}
                disabled={sameGroupGroupStage}
                onChange={(e) => setForm({ ...form, counts_for_standings: e.target.checked })}
              />
              <span>
                <strong className="text-slate-200 font-medium">Contabilizar na classificação</strong>
                <span className="block text-xs text-slate-500 mt-0.5">Deixe marcado nos jogos da fase de grupos. Desmarque em semifinal, final ou amistosos.</span>
              </span>
            </label>

            {sameGroupGroupStage && (
              <p className="text-xs text-amber-300 bg-amber-950/30 border border-amber-900/60 rounded-md px-3 py-2 flex gap-2">
                <AlertTriangle size={14} className="shrink-0" /> Na fase de grupos, os jogos são realizados entre times de grupos diferentes. Esta partida não será contabilizada na classificação.
              </p>
            )}

            <AdminLabel>
              Data e horário (horário de Brasília)
              <AdminInput type="datetime-local" required value={form.match_date} onChange={(e) => setForm({ ...form, match_date: e.target.value })} />
            </AdminLabel>

            <AdminLabel>
              Local
              <AdminInput value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} placeholder="Ginásio Municipal de Açucena" />
            </AdminLabel>

            {form.status === 'finalizado' && (
              <div className="grid grid-cols-2 gap-3">
                <AdminLabel>
                  Placar mandante
                  <AdminInput type="number" min={0} required value={form.home_score} onChange={(e) => setForm({ ...form, home_score: e.target.value })} />
                </AdminLabel>
                <AdminLabel>
                  Placar visitante
                  <AdminInput type="number" min={0} required value={form.away_score} onChange={(e) => setForm({ ...form, away_score: e.target.value })} />
                </AdminLabel>
              </div>
            )}

            {involvesDecreto && form.status === 'finalizado' && (
              <div className="border border-slate-800 rounded-md p-3">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <p className="text-xs uppercase tracking-wide text-slate-400">Autores dos gols do Decreto</p>
                  <AdminButton type="button" variant="ghost" onClick={addScorerRow}>
                    <Plus size={13} className="inline mr-1" /> Adicionar
                  </AdminButton>
                </div>
                <div className="flex flex-col gap-2">
                  {scorers.map((s, i) => (
                    <div key={i} className="grid grid-cols-[1fr_72px_40px] gap-2 items-center">
                      <AdminSelect
                        value={s.player_id}
                        onChange={(e) => updateScorerRow(i, { player_id: e.target.value })}
                      >
                        <option value="">Jogador</option>
                        {players?.map((p) => (
                          <option key={p.id} value={p.id}>{p.display_name ?? p.name}</option>
                        ))}
                      </AdminSelect>
                      <AdminInput
                        type="number"
                        min={1}
                        value={s.goals}
                        aria-label="Quantidade de gols"
                        onChange={(e) => updateScorerRow(i, { goals: Number(e.target.value) })}
                      />
                      <AdminButton type="button" variant="danger" onClick={() => removeScorerRow(i)} aria-label="Remover artilheiro">
                        <Trash2 size={13} />
                      </AdminButton>
                    </div>
                  ))}
                </div>
                <p className={`text-xs mt-2 ${scorersValidation.valid ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {scorersValidation.valid
                    ? `Soma dos gols confere: ${scorersValidation.assigned}.`
                    : scorersValidation.missing > 0
                      ? `Atenção: faltam atribuir ${scorersValidation.missing} gol(s) do Decreto.`
                      : `Atenção: foram atribuídos ${Math.abs(scorersValidation.missing)} gol(s) a mais que o placar do Decreto.`}
                </p>
              </div>
            )}

            <div className="flex flex-wrap gap-2 mt-2">
              <AdminButton type="submit" disabled={saving}>
                {saving ? 'Salvando...' : editing ? 'Salvar alterações' : 'Adicionar partida'}
              </AdminButton>
              {editing && (
                <AdminButton type="button" variant="ghost" onClick={resetForm}>Cancelar</AdminButton>
              )}
            </div>
          </form>
        </AdminCard>

        <div>
          {loading ? (
            <Loading />
          ) : (
            <div className="flex flex-col gap-2 xl:max-h-[780px] xl:overflow-y-auto xl:pr-1">
              {(matches ?? []).map((match) => (
                <AdminCard key={match.id}>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm text-white font-medium">
                        {match.home_team?.short_name ?? '—'} {match.status === 'finalizado' ? `${match.home_score} x ${match.away_score}` : 'x'} {match.away_team?.short_name ?? '—'}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {formatDateTimePt(match.match_date)} {match.round ? `· Rodada ${match.round}` : ''} · {PHASE_LABEL[match.phase ?? 'grupos']}
                      </p>
                      <p className="text-[11px] mt-1 text-slate-500">
                        {match.counts_for_standings ? 'Conta para a classificação' : 'Não conta para a classificação'}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <AdminBadge tone={match.status === 'finalizado' ? 'success' : match.status === 'cancelado' ? 'danger' : 'default'}>
                        {STATUS_LABEL[match.status]}
                      </AdminBadge>
                      <AdminButton variant="ghost" onClick={() => startEdit(match)} aria-label="Editar partida"><Pencil size={14} /></AdminButton>
                      <AdminButton variant="danger" onClick={() => handleDelete(match)} aria-label="Excluir partida"><Trash2 size={14} /></AdminButton>
                    </div>
                  </div>
                </AdminCard>
              ))}
              {(matches ?? []).length === 0 && <p className="text-sm text-slate-500">Nenhuma partida cadastrada ainda.</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
