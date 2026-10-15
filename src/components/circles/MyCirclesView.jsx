import React, { useState } from 'react';
import { usePeerBridge } from '../../context/PeerBridgeContext';
import CircleCard from './CircleCard';
import { Plus, Compass, Target } from 'lucide-react';

export default function MyCirclesView() {
  const { myJoinedCircles, activePersona, setActiveTab, setIsCreateModalOpen } = usePeerBridge();
  const [filter, setFilter] = useState('all'); // 'all' | 'active' | 'completed'

  const activeCount = myJoinedCircles.filter(c => c.status !== 'Completed').length;
  const completedCount = myJoinedCircles.filter(c => c.status === 'Completed').length;

  const filteredCircles = myJoinedCircles.filter(circle => {
    if (filter === 'active') return circle.status !== 'Completed';
    if (filter === 'completed') return circle.status === 'Completed';
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            My Peer Circles
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Active temporary circles working collaboratively towards specific goals with <strong className="text-slate-800">{activePersona.name}</strong>
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 bg-white border border-slate-200 p-1 rounded-xl shadow-xs">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              filter === 'all' ? 'bg-brand-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({myJoinedCircles.length})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              filter === 'active' ? 'bg-brand-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Active ({activeCount})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              filter === 'completed' ? 'bg-brand-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Accomplished ({completedCount})
          </button>
        </div>
      </div>

      {/* Core Principle Callout */}
      <div className="text-xs text-slate-700 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-softBlue text-brand-600 flex items-center justify-center flex-shrink-0 border border-brand-200">
          <Target className="w-4 h-4" />
        </div>
        <div>
          <span className="font-bold text-slate-900">PeerBridge Lifecycle:</span>
          <span className="text-slate-600 ml-1">
            Peer circles are temporary and outcome-bound. When you finish the shared checklist, mark the goal accomplished to celebrate!
          </span>
        </div>
      </div>

      {/* Circles List or Empty State */}
      {filteredCircles.length === 0 ? (
        <div className="py-12 px-6 text-center border border-dashed border-slate-300 rounded-2xl bg-white max-w-lg mx-auto shadow-card">
          <p className="text-sm font-bold text-slate-900">
            {filter === 'completed' ? 'No accomplished circles yet.' : 'You are not in any peer circles yet.'}
          </p>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {filter === 'completed'
              ? 'Complete tasks in an active circle to mark the mission accomplished.'
              : 'Browse active campus missions to join a group, or post your own mission.'}
          </p>
          <div className="mt-5 flex items-center justify-center gap-2.5">
            <button
              onClick={() => setActiveTab('explore')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Explore Missions</span>
            </button>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Mission</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCircles.map(circle => (
            <CircleCard key={circle.id} mission={circle} />
          ))}
        </div>
      )}

    </div>
  );
}
