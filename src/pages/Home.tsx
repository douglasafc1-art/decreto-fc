import { useMemo } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { StatusStrip } from '../components/StatusStrip';
import { Loading } from '../components/Loading';
import { ErrorState } from '../components/ErrorState';
import { Hero } from './sections/Hero';
import { NextMatch } from './sections/NextMatch';
import { LastMatch } from './sections/LastMatch';
import { Standings } from './sections/Standings';
import { Squad } from './sections/Squad';
import { Campaign } from './sections/Campaign';
import { Scorers } from './sections/Scorers';
import { Sponsors } from './sections/Sponsors';
import { About } from './sections/About';

import { useAsync } from '../hooks/useAsync';
import { getActiveTeams, getDecretoTeam } from '../services/teams';
import { getAllMatches, getDecretoMatches, getNextDecretoMatch, getLastDecretoMatch } from '../services/matches';
import { getActivePlayers } from '../services/players';
import { getActiveSponsors } from '../services/sponsors';
import { getSiteSettings } from '../services/settings';

import { calculateStandings, groupStandings } from '../utils/standings';
import { calculateDecretoScorers } from '../utils/scorers';

export function Home() {
  const settingsQuery = useAsync(() => getSiteSettings(), []);
  const decretoQuery = useAsync(() => getDecretoTeam(), []);
  const teamsQuery = useAsync(() => getActiveTeams(), []);
  const allMatchesQuery = useAsync(() => getAllMatches(), []);
  const playersQuery = useAsync(() => getActivePlayers('jogador'), []);
  const staffQuery = useAsync(() => getActivePlayers('comissao'), []);
  const sponsorsQuery = useAsync(() => getActiveSponsors(), []);

  const decretoId = decretoQuery.data?.id;

  const nextMatchQuery = useAsync(() => (decretoId ? getNextDecretoMatch(decretoId) : Promise.resolve(null)), [decretoId]);
  const lastMatchQuery = useAsync(() => (decretoId ? getLastDecretoMatch(decretoId) : Promise.resolve(null)), [decretoId]);
  const decretoMatchesQuery = useAsync(() => (decretoId ? getDecretoMatches(decretoId) : Promise.resolve([])), [decretoId]);

  const standingsGrouped = useMemo(() => {
    if (!teamsQuery.data || !allMatchesQuery.data) return {};
    const rows = calculateStandings(teamsQuery.data, allMatchesQuery.data);
    return groupStandings(rows);
  }, [teamsQuery.data, allMatchesQuery.data]);

  const decretoStanding = useMemo(() => {
    if (!decretoId) return { row: null, position: null, groupName: null };
    for (const [groupName, rows] of Object.entries(standingsGrouped)) {
      const index = rows.findIndex((row) => row.team.id === decretoId);
      if (index >= 0) return { row: rows[index], position: index + 1, groupName };
    }
    return { row: null, position: null, groupName: decretoQuery.data?.group_name ?? null };
  }, [decretoId, decretoQuery.data?.group_name, standingsGrouped]);

  const scorers = useMemo(() => {
    if (!decretoMatchesQuery.data) return [];
    return calculateDecretoScorers(decretoMatchesQuery.data);
  }, [decretoMatchesQuery.data]);

  const loading = settingsQuery.loading || decretoQuery.loading || teamsQuery.loading || allMatchesQuery.loading;
  const hasError = settingsQuery.error || teamsQuery.error || allMatchesQuery.error;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-decreto-dark">
        <Loading label="Carregando Decreto FC..." />
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-decreto-dark">
        <ErrorState onRetry={() => window.location.reload()} />
      </div>
    );
  }

  const campaignMatches = [...(decretoMatchesQuery.data ?? [])];

  return (
    <div className="bg-decreto-dark min-h-screen overflow-x-hidden">
      <Navbar logoUrl={decretoQuery.data?.logo_url} />
      <Hero settings={settingsQuery.data} logoUrl={decretoQuery.data?.logo_url} />
      <StatusStrip
        nextMatch={nextMatchQuery.data ?? null}
        decretoRow={decretoStanding.row}
        decretoPosition={decretoStanding.position}
        groupName={decretoStanding.groupName}
        topScorer={scorers[0] ?? null}
      />
      <NextMatch match={nextMatchQuery.data ?? null} />
      <LastMatch match={lastMatchQuery.data ?? null} />
      <Standings grouped={standingsGrouped} decretoTeamId={decretoId} />
      <Squad players={playersQuery.data ?? []} staff={staffQuery.data ?? []} />
      <Campaign matches={campaignMatches} />
      <Scorers rows={scorers} />
      <Sponsors sponsors={sponsorsQuery.data ?? []} instagramUrl={settingsQuery.data?.instagram_url} />
      <About settings={settingsQuery.data} />
      <Footer settings={settingsQuery.data} logoUrl={decretoQuery.data?.logo_url} />
    </div>
  );
}
