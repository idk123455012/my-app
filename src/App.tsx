import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { loadLocal } from './lib/storage';
import AuthScreen from './components/AuthScreen';
import Onboarding from './components/Onboarding';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Results from './pages/Results';
import Favorites from './pages/Favorites';
import Search from './pages/Search';
import Tracker from './pages/Tracker';
import More from './pages/More';
import ComingSoon from './pages/ComingSoon';

function AppShell() {
  const { user } = useAuth();
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(() => !!loadLocal<boolean>('hasSeenOnboarding'));

  if (!user) return <AuthScreen />;
  if (!hasSeenOnboarding) return <Onboarding onComplete={() => setHasSeenOnboarding(true)} />;

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-surface max-w-md mx-auto relative">
        <BottomNav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/results" element={<Results />} />
          <Route path="/tracker" element={<Tracker />} />
          <Route path="/more" element={<More />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/compare" element={<ComingSoon title="Compare Colleges" icon="🔀" />} />
          <Route path="/scholarships" element={<ComingSoon title="Scholarships" icon="⭐" />} />
          <Route path="/net-price" element={<ComingSoon title="Net Price Calculator" icon="💲" />} />
          <Route path="/outcomes" element={<ComingSoon title="My Outcomes" icon="✅" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </ThemeProvider>
  );
}
