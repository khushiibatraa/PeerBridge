import React, { useState } from 'react';
import HeroWelcome from './HeroWelcome';
import QuickStats from './QuickStats';
import JoinedCirclesSummary from './JoinedCirclesSummary';
import ActiveMissionsList from './ActiveMissionsList';

export default function DashboardView({ onSelectCategory }) {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    if (onSelectCategory) {
      onSelectCategory(cat);
    }
  };

  return (
    <div className="space-y-8">
      {/* Soft Blue Hero with 4 Pastel Category Cards */}
      <HeroWelcome 
        selectedCategory={selectedCategory} 
        onSelectCategory={handleCategoryChange} 
      />

      {/* Metrics Row Inspired by Reference 2 */}
      <QuickStats />

      {/* User's Active Circles & Shared Progress */}
      <JoinedCirclesSummary />

      {/* Active Missions Grid */}
      <ActiveMissionsList 
        selectedCategory={selectedCategory} 
        onSelectCategory={handleCategoryChange} 
      />
    </div>
  );
}
