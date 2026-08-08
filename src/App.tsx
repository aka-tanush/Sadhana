import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SadhanaProvider, useSadhana } from './context/JapaContext';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { FloatingLotus } from './components/FloatingLotus';
import { MilestoneCelebrationModal } from './components/MilestoneCelebrationModal';
import { WelcomeOnboardingModal } from './components/WelcomeOnboardingModal';
import { DashboardPage } from './pages/DashboardPage';
import { SadhanasPage } from './pages/SadhanasPage';
import { SadhanaDetailPage } from './pages/SadhanaDetailPage';
import { AnusthanaPage } from './pages/AnusthanaPage';
import { CalendarPage } from './pages/CalendarPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { MilestonesPage } from './pages/MilestonesPage';
import { PanchangaPage } from './pages/PanchangaPage';
import { HistoryPage } from './pages/HistoryPage';
import { DailyInspirationPage } from './pages/DailyInspirationPage';
import { SettingsPage } from './pages/SettingsPage';

function MainLayout() {
  const { activeTab } = useSadhana();
  const { showWelcomeModal, completeOnboarding } = useAuth();

  const renderActivePage = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardPage />;
      case 'sadhanas':
        return <SadhanasPage />;
      case 'detail':
        return <SadhanaDetailPage />;
      case 'anusthana':
        return <AnusthanaPage />;
      case 'calendar':
        return <CalendarPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'milestones':
        return <MilestonesPage />;
      case 'panchanga':
        return <PanchangaPage />;
      case 'history':
        return <HistoryPage />;
      case 'quotes':
        return <DailyInspirationPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 font-sans transition-colors relative selection:bg-amber-500 selection:text-white pb-20 sm:pb-8">
      {/* Background Floating Lotus Effect */}
      <FloatingLotus />

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header with Om Icon */}
        <Header />

        {/* Top/Bottom Navigation Tabs */}
        <Navigation />

        {/* Page Content View */}
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 pt-6">
          {renderActivePage()}
        </main>

        {/* Milestone Celebration Modal Popup */}
        <MilestoneCelebrationModal />

        {/* Onboarding Tour Modal */}
        <WelcomeOnboardingModal
          isOpen={showWelcomeModal}
          onClose={() => completeOnboarding()}
        />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SadhanaProvider>
        <MainLayout />
      </SadhanaProvider>
    </AuthProvider>
  );
}
