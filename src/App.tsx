import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { AdminLogin } from './admin/AdminLogin';
import { AdminLayout } from './admin/AdminLayout';
import { AdminDashboard } from './admin/AdminDashboard';
import { AdminTeams } from './admin/AdminTeams';
import { AdminMatches } from './admin/AdminMatches';
import { AdminSquad } from './admin/AdminSquad';
import { AdminSponsors } from './admin/AdminSponsors';
import { AdminSettings } from './admin/AdminSettings';
import { RequireAuth } from './admin/RequireAuth';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/admin" element={<AdminLogin />} />

        <Route
          element={
            <RequireAuth>
              <AdminLayout />
            </RequireAuth>
          }
        >
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/teams" element={<AdminTeams />} />
          <Route path="/admin/matches" element={<AdminMatches />} />
          <Route path="/admin/squad" element={<AdminSquad />} />
          <Route path="/admin/sponsors" element={<AdminSponsors />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
        </Route>

        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}
