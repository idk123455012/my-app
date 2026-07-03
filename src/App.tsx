import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ArrowLeftRight, DollarSign, BadgeCheck } from 'lucide-react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { loadLocal } from './lib/storage';
import AuthScreen from './components/AuthScreen';
import Onboarding from './components/Onboarding';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Results from './pages/Results';
import Favorites from './pages/Favorites';
import Search from './pages/Search';
import Tracker from './pages/Tracker';
import ComingSoon from './pages/ComingSoon';
import Advisor from './pages/Advisor';
import EssayReview from './pages/EssayReview';
import Scholarships from './pages/Scholarships';
import CollegeDetail from './pages/CollegeDetail';

function AppShell() {
  const { user } = useAuth();
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(() => !!loadLocal<boolean>('hasSeenOnboarding'));

  if (!user) return <AuthScreen />;
  if (!hasSeenOnboarding) return <Onboarding onComplete={() => setHasSeenOnboarding(true)} />;

  return (
    <BrowserRouter>
      <Sidebar>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/college/:id" element={<CollegeDetail />} />
          <Route path="/results" element={<Results />} />
          <Route path="/tracker" element={<Tracker />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/advisor" element={<Advisor />} />
          <Route path="/essay-review" element={<EssayReview />} />
          <Route path="/scholarships" element={<Scholarships />} />
          <Route path="/compare" element={<ComingSoon title="Compare Colleges" Icon={ArrowLeftRight} />} />
          <Route path="/net-price" element={<ComingSoon title="Net Price Calculator" Icon={DollarSign} />} />
          <Route path="/outcomes" element={<ComingSoon title="My Outcomes" Icon={BadgeCheck} />} />
        </Routes>
      </Sidebar>
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
