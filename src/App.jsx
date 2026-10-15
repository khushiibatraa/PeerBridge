import React, { useState } from 'react';
import { PeerBridgeProvider, usePeerBridge } from './context/PeerBridgeContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import NotificationToast from './components/layout/NotificationToast';
import DashboardView from './components/dashboard/DashboardView';
import ExploreView from './components/explore/ExploreView';
import MyCirclesView from './components/circles/MyCirclesView';
import MyMissionsView from './components/circles/MyMissionsView';
import CreateMissionModal from './components/mission/CreateMissionModal';
import MissionDetailsModal from './components/mission/MissionDetailsModal';
import MatchExplanationModal from './components/explore/MatchExplanationModal';

function MainContent() {
  const { activeTab, setActiveTab } = usePeerBridge();
  const [exploreCategory, setExploreCategory] = useState('All');

  const handleSelectCategory = (cat) => {
    setExploreCategory(cat);
    setActiveTab('explore');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <DashboardView onSelectCategory={handleSelectCategory} />
        )}
        {activeTab === 'explore' && (
          <ExploreView initialCategory={exploreCategory} />
        )}
        {activeTab === 'my-circles' && (
          <MyCirclesView />
        )}
        {activeTab === 'my-missions' && (
          <MyMissionsView />
        )}
      </main>

      <Footer />

      {/* Global Interactive Modals & Toast alerts */}
      <CreateMissionModal />
      <MissionDetailsModal />
      <MatchExplanationModal />
      <NotificationToast />
    </div>
  );
}

export default function App() {
  return (
    <PeerBridgeProvider>
      <MainContent />
    </PeerBridgeProvider>
  );
}
