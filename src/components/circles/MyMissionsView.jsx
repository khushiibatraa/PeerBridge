import React, { useState, useMemo } from 'react';
import { usePeerBridge } from '../../context/PeerBridgeContext';
import CircleCard from './CircleCard';
import { Plus, Compass, Sparkles, FolderCheck, CheckCircle2, Users } from 'lucide-react';

export default function MyMissionsView() {
  const { 
    myCreatedMissions, 
    myJoinedCircles, 
    activePersona, 
    setIsCreateModalOpen, 
    setActiveTab 
  } = usePeerBridge();

  const [segment, setSegment] = useState('all'); // 'all' | 'created' | 'joined'
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'active' | 'completed'

  // Combine unique missions for 'all'
  const allMissions = useMemo(() => {
    const map = new Map();
    myCreatedMissions.forEach(m => map.set(m.id, m));
    myJoinedCircles.forEach(m => map.set(m.id, m));
    return Array.from(map.values());
  }, [myCreatedMissions, myJoinedCircles]);

  // Filter based on segment and status
  const displayedMissions = useMemo(() => {
    let list = [];
    if (segment === 'created') {
      list = myCreatedMissions;
    } else if (segment === 'joined') {
      list = myJoinedCircles;
    } else {
      list = allMissions;
    }

    if (statusFilter === 'active') {
      return list.filter(m => m.status !== 'Completed');
    }
    if (statusFilter === 'completed') {
      return list.filter(m => m.status === 'Completed');
    }
    return list;
  }, [segment, statusFilter, myCreatedMissions, myJoinedCircles, allMissions]);

  const activeCount = allMissions.filter(m => m.status !== 'Completed').length;
  const completedCount = allMissions.filter(m => m.status === 'Completed').length;

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            My Missions & Circles
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage goals created by and joined by <strong className="text-slate-800">{activePersona.name}</strong>
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-1"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Create Mission</span>
        </button>
      </div>

      {/* Reference 3 Inspired Segmented Navigation & Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-card flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        
        {/* Segmented Tabs: All, Created, Joined */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setSegment('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              segment === 'all' 
                ? 'bg-white text-slate-900 shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Missions ({allMissions.length})
          </button>
          <button
            onClick={() => setSegment('created')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              segment === 'created' 
                ? 'bg-white text-slate-900 shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Created by You ({myCreatedMissions.length})
          </button>
          <button
            onClick={() => setSegment('joined')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              segment === 'joined' 
                ? 'bg-white text-slate-900 shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Joined Circles ({myJoinedCircles.length})
          </button>
        </div>

        {/* Status Filter Pills */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1">Status:</span>
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-brand-50 text-brand-700 border border-brand-200'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setStatusFilter('active')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              statusFilter === 'active'
                ? 'bg-brand-50 text-brand-700 border border-brand-200'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Active ({activeCount})
          </button>
          <button
            onClick={() => setStatusFilter('completed')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              statusFilter === 'completed'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Accomplished ({completedCount})
          </button>
        </div>

      </div>

      {/* List or Empty State */}
      {displayedMissions.length === 0 ? (
        <div className="py-12 px-6 text-center border border-dashed border-slate-300 rounded-2xl bg-white max-w-lg mx-auto shadow-card">
          <div className="w-12 h-12 rounded-full bg-softBlue text-brand-600 flex items-center justify-center mx-auto mb-3 border border-brand-200">
            {segment === 'created' ? <Plus className="w-6 h-6" /> : <Users className="w-6 h-6" />}
          </div>
          <p className="text-base font-bold text-slate-900">
            {segment === 'created'
              ? 'You haven\'t posted any missions yet.'
              : segment === 'joined'
              ? 'You haven\'t joined any peer circles yet.'
              : 'No missions found matching your filter.'}
          </p>
          <p className="text-xs text-slate-500 mt-1.5 max-w-sm mx-auto">
            {segment === 'created'
              ? 'Post an exam study goal, hackathon sprint, or mock interview session with your availability.'
              : 'Browse active campus missions to discover compatible university peers and collaborate.'}
          </p>
          <div className="mt-5 flex items-center justify-center gap-2.5">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Post a Mission</span>
            </button>
            <button
              onClick={() => setActiveTab('explore')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Explore Missions</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {displayedMissions.map(mission => (
            <CircleCard key={mission.id} mission={mission} />
          ))}
        </div>
      )}

    </div>
  );
}
