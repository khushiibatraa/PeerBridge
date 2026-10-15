import React, { useState, useMemo } from 'react';
import { usePeerBridge } from '../../context/PeerBridgeContext';
import { calculateMissionMatch } from '../../services/matchingService';
import MissionCard from './MissionCard';
import EmptyState from './EmptyState';
import { 
  Search, 
  ArrowUpDown, 
  Tag, 
  RotateCcw,
  Cpu
} from 'lucide-react';

export default function ExploreView({ initialCategory = 'All' }) {
  const { missions, activePersona } = usePeerBridge();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedAvailability, setSelectedAvailability] = useState('All');
  const [selectedCommitment, setSelectedCommitment] = useState('All');
  const [hideFullCircles, setHideFullCircles] = useState(false);
  const [sortBy, setSortBy] = useState('match'); // 'match' | 'newest' | 'capacity'

  const categories = ['All', 'Study', 'Hackathon', 'Career', 'Projects'];

  const availabilityOptions = [
    { label: 'All Schedules', value: 'All' },
    { label: 'Today, 7 PM (Tonight)', value: 'today_evening' },
    { label: 'This Weekend', value: 'this_weekend' },
    { label: 'Weekdays 6 PM', value: 'weekday_evenings' },
    { label: 'Flexible / Evenings', value: 'flexible' },
  ];

  const commitmentOptions = ['All', 'Focused', 'Regular', 'Casual'];

  // Filter and rank missions
  const filteredMissions = useMemo(() => {
    return missions
      .map(mission => {
        const matchInfo = calculateMissionMatch(mission, activePersona);
        return {
          ...mission,
          matchScore: matchInfo.percentage,
          matchInfo
        };
      })
      .filter(m => {
        // Search filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchTitle = m.title.toLowerCase().includes(q);
          const matchDesc = m.description.toLowerCase().includes(q);
          const matchSub = (m.subject || '').toLowerCase().includes(q);
          const matchCat = m.category.toLowerCase().includes(q);
          if (!matchTitle && !matchDesc && !matchSub && !matchCat) return false;
        }

        // Category filter
        if (selectedCategory !== 'All' && m.category !== selectedCategory) {
          return false;
        }

        // Availability filter
        if (selectedAvailability !== 'All') {
          if (m.availabilityKey !== selectedAvailability) return false;
        }

        // Commitment filter
        if (selectedCommitment !== 'All') {
          if (m.commitment !== selectedCommitment) return false;
        }

        // Capacity filter
        if (hideFullCircles && m.members.length >= m.groupSize) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'match') {
          return b.matchScore - a.matchScore;
        }
        if (sortBy === 'newest') {
          return new Date(b.createdAt) - new Date(a.createdAt);
        }
        if (sortBy === 'capacity') {
          const slotsA = a.groupSize - a.members.length;
          const slotsB = b.groupSize - b.members.length;
          return slotsB - slotsA;
        }
        return 0;
      });
  }, [
    missions, 
    activePersona, 
    searchQuery, 
    selectedCategory, 
    selectedAvailability, 
    selectedCommitment, 
    hideFullCircles, 
    sortBy
  ]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedAvailability('All');
    setSelectedCommitment('All');
    setHideFullCircles(false);
    setSortBy('match');
  };

  const hasActiveFilters = 
    searchQuery !== '' || 
    selectedCategory !== 'All' || 
    selectedAvailability !== 'All' || 
    selectedCommitment !== 'All' || 
    hideFullCircles;

  return (
    <div className="space-y-6">
      
      {/* Top Header & Context Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Explore Peer Missions
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Discover compatible university peers for study sessions, hackathons, and mock interviews.
          </p>
        </div>

        {/* Algorithm perspective badge */}
        <div className="flex items-center gap-2 bg-white border border-slate-200 px-3.5 py-2 rounded-xl text-xs shadow-xs">
          <Cpu className="w-4 h-4 text-brand-600 flex-shrink-0" />
          <div className="text-slate-600">
            Matching for: <strong className="text-slate-900 font-semibold">{activePersona.name}</strong>
            <span className="text-[11px] text-brand-600 font-medium ml-1">({activePersona.role})</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-card space-y-4">
        
        {/* Row 1: Search & Sort */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by topic, keyword, or exam (e.g., DBMS, React, System Design)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 hover:border-slate-300 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-medium"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium whitespace-nowrap flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5" />
              Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 cursor-pointer"
            >
              <option value="match">Highest Match %</option>
              <option value="newest">Recently Created</option>
              <option value="capacity">Most Open Slots</option>
            </select>
          </div>
        </div>

        {/* Row 2: Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-3 border-t border-slate-100">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-1 flex items-center gap-1">
            <Tag className="w-3 h-3" />
            Category:
          </span>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Row 3: Availability & Commitment Dropdowns & Capacity toggle */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Schedule Availability
            </label>
            <select
              value={selectedAvailability}
              onChange={(e) => setSelectedAvailability(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 cursor-pointer"
            >
              {availabilityOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Commitment Level
            </label>
            <select
              value={selectedCommitment}
              onChange={(e) => setSelectedCommitment(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 cursor-pointer"
            >
              {commitmentOptions.map(opt => (
                <option key={opt} value={opt}>{opt === 'All' ? 'All Commitment Levels' : opt}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end pb-1.5">
            <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-medium text-slate-700">
              <input
                type="checkbox"
                checked={hideFullCircles}
                onChange={(e) => setHideFullCircles(e.target.checked)}
                className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 border-slate-300 cursor-pointer"
              />
              <span>Hide circles that are full</span>
            </label>
          </div>
        </div>

        {/* Filter Summary & Reset Action */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
            <span>Showing {filteredMissions.length} filtered results</span>
            <button
              onClick={handleResetFilters}
              className="text-brand-600 hover:text-brand-700 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset all filters</span>
            </button>
          </div>
        )}

      </div>

      {/* Missions Grid or Empty State */}
      {filteredMissions.length === 0 ? (
        <EmptyState onResetFilters={hasActiveFilters ? handleResetFilters : null} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMissions.map(mission => (
            <MissionCard key={mission.id} mission={mission} />
          ))}
        </div>
      )}

    </div>
  );
}
