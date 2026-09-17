import { Shield, Swords, Users, Handshake } from 'lucide-react';
import { useAsync } from '../hooks/useAsync';
import { getTeams } from '../services/teams';
import { getAllMatches } from '../services/matches';
import { getAllPlayers } from '../services/players';
import { getAllSponsors } from '../services/sponsors';
import { AdminCard, AdminPageHeader } from './AdminUI';
import { Loading } from '../components/Loading';

export function AdminDashboard() {
  const teams = useAsync(() => getTeams(), []);
  const matches = useAsync(() => getAllMatches(), []);
  const players = useAsync(() => getAllPlayers(), []);
  const sponsors = useAsync(() => getAllSponsors(), []);

  const loading = teams.loading || matches.loading || players.loading || sponsors.loading;

  const stats = [
    { label: 'Times cadastrados', value: teams.data?.length ?? 0, icon: Shield },
    { label: 'Jogos cadastrados', value: matches.data?.length ?? 0, icon: Swords },
    { label: 'Jogadores/Comissão', value: players.data?.length ?? 0, icon: Users },
    { label: 'Patrocinadores', value: sponsors.data?.length ?? 0, icon: Handshake },
  ];

  return (
    <div>
      <AdminPageHeader title="Dashboard" />
      {loading ? (
        <Loading />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map(({ label, value, icon: Icon }) => (
            <AdminCard key={label}>
              <Icon className="text-blue-400 mb-2" size={20} />
              <p className="text-2xl font-semibold text-white">{value}</p>
              <p className="text-xs text-slate-400 mt-1">{label}</p>
            </AdminCard>
          ))}
        </div>
      )}

      <div className="mt-8 text-sm text-slate-400 space-y-1">
        <p>Use o menu à esquerda para cadastrar times, jogos, elenco, comissão, patrocinadores e configurações do site.</p>
        <p>A classificação e a artilharia do Decreto são calculadas automaticamente — não precisam ser editadas aqui.</p>
      </div>
    </div>
  );
}
