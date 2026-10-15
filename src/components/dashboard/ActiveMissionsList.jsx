import React from 'react';
import { usePeerBridge } from '../../context/PeerBridgeContext';
import { calculateMissionMatch } from '../../services/matchingService';
import MissionCard from '../explore/MissionCard';
import { ArrowRight, Info } from 'lucide-react';

export default function ActiveMissionsList({ selectedCategory = 'All', onSelectCategory }) {
  const { missions, activePersona, setActiveTab } = usePeerBridge();

  // Filter and sort missions by rule-based match score for active persona
  const filteredMissions = missions
    .filter(m => selectedCategory === 'All' || m.category === selectedCategory)
    .map(m => ({
      ...m,
      calculatedScore: calculateMissionMatch(m, activePersona).percentage
    }))
    .sort((a, b) => b.calculatedScore - a.calculatedScore);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Active Missions on Campus
          </h2>
          <p className="text-xs text-slate-500">
            Ranked by compatibility with <strong className="text-slate-900">{activePersona.name}</strong> ({activePersona.primaryCategory} • {activePersona.commitment})
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-brand-700 bg-brand-50 px-3 py-1 rounded-xl border border-brand-200 font-medium">
          <Info className="w-3.5 h-3.5 text-brand-600" />
          <span>Demo Data • Deterministic Heuristic Matching</span>
        </div>
      </div>

      {filteredMissions.length === 0 ? (
        <div className="py-8 text-center border border-dashed border-slate-200 rounded-2xl bg-white text-slate-500 text-xs">
          No active missions in this category right now.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMissions.slice(0, 6).map(mission => (
            <MissionCard key={mission.id} mission={mission} />
          ))}
        </div>
      )}

      {missions.length > 6 && (
        <div className="mt-6 text-center">
          <button
            onClick={() => setActiveTab('explore')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700 transition-colors cursor-pointer"
          >
            <span>View all {missions.length} missions in directory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
