import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { NavShell } from './components/NavShell';
import { Onboarding } from './pages/Onboarding';
import { Discover } from './pages/Discover';
import { ForYou } from './pages/ForYou';
import { Search } from './pages/Search';
import { Watchlist } from './pages/Watchlist';
import { TitleDetail } from './pages/TitleDetail';

function HomeGate() {
  const { profile } = useApp();
  return <Navigate to={profile.onboarded ? '/discover' : '/onboarding'} replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomeGate />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route element={<NavShell />}>
        <Route path="/discover" element={<Discover />} />
        <Route path="/for-you" element={<ForYou />} />
        <Route path="/search" element={<Search />} />
        <Route path="/watchlist" element={<Watchlist />} />
        <Route path="/title/:mediaType/:id" element={<TitleDetail />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
