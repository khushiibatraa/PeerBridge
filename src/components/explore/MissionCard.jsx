import React from 'react';
import { usePeerBridge } from '../../context/PeerBridgeContext';
import { calculateMissionMatch } from '../../services/matchingService';
import { Calendar, Users, Check, Lock, Sparkles, HelpCircle, ArrowRight, Tag } from 'lucide-react';

export default function MissionCard({ mission }) {
  const { 
    activePersona, 
    setSelectedMissionId, 
    joinMission, 
    setInspectMatchMissionId 
  } = usePeerBridge();

  const match = calculateMissionMatch(mission, activePersona);
  const isJoined = mission.members.some(m => m.id === activePersona.id);
  const isFull = mission.members.length >= mission.groupSize;

  // Category tags using centralized tokens
  const categoryStyles = {
    Study: 'text-blue-700 bg-blue-50 border-blue-200',
    Hackathon: 'text-purple-700 bg-purple-50 border-purple-200',
    Career: 'text-amber-800 bg-amber-50 border-amber-200',
    Projects: 'text-emerald-800 bg-emerald-50 border-emerald-200',
  };

  const tagStyle = categoryStyles[mission.category] || 'text-slate-700 bg-slate-50 border-slate-200';

  // Match score pill with Emerald for high matches
  let matchBadgeClass = 'text-slate-700 bg-slate-100 border-slate-200';
  if (match.percentage >= 80) {
    matchBadgeClass = 'text-emerald-700 bg-emerald-50 border-emerald-200 font-bold';
  } else if (match.percentage >= 60) {
    matchBadgeClass = 'text-brand-700 bg-softBlue border-brand-200 font-bold';
  }

  const spotsLeft = Math.max(0, mission.groupSize - mission.members.length);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-card hover:border-slate-300 hover:shadow-card-hover transition-all flex flex-col justify-between group">
      
      <div>
        {/* Top Badges: Category, Spots Open & Match Score */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-md border ${tagStyle}`}>
              {mission.category}
            </span>
            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md border ${
              isFull 
                ? 'bg-rose-50 text-rose-700 border-rose-200' 
                : 'bg-slate-50 text-slate-600 border-slate-200'
            }`}>
              {isFull ? 'Full' : `${spotsLeft} ${spotsLeft === 1 ? 'seat' : 'seats'} left`}
            </span>
          </div>

          <button
            onClick={() => setInspectMatchMissionId(mission.id)}
            className={`text-xs font-semibold px-2.5 py-0.5 rounded-md border flex items-center gap-1 hover:opacity-90 transition-opacity cursor-pointer ${matchBadgeClass}`}
            title="Click to view transparent match algorithm breakdown"
          >
            <span>{match.percentage}% Match</span>
            <HelpCircle className="w-3 h-3 opacity-70" />
          </button>
        </div>

        {/* Title in Slate-900 */}
        <h3 
          onClick={() => setSelectedMissionId(mission.id)}
          className="text-base font-bold text-slate-900 hover:text-brand-600 cursor-pointer transition-colors leading-snug mb-1"
        >
          {mission.title}
        </h3>

        {/* Focus / Skill Tag */}
        {mission.subject && (
          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200 text-[11px] font-medium text-slate-700 mb-2.5">
            <Tag className="w-3 h-3 text-brand-600" />
            <span>Focus: <strong>{mission.subject}</strong></span>
          </div>
        )}

        {/* Goal Description */}
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
          {mission.description}
        </p>

        {/* Creator Info */}
        {mission.createdBy && (
          <div className="flex items-center gap-2 mb-3 text-xs text-slate-500">
            <img 
              src={mission.createdBy.avatar} 
              alt={mission.createdBy.name}
              className="w-5 h-5 rounded-full object-cover border border-slate-200"
            />
            <span className="truncate">
              Posted by <strong className="text-slate-700 font-semibold">{mission.createdBy.name}</strong>
              {mission.createdBy.year && ` (${mission.createdBy.year})`}
            </span>
          </div>
        )}

        {/* Schedule & Capacity Details */}
        <div className="space-y-1.5 text-xs text-slate-500 mb-3 pt-2.5 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-brand-600 flex-shrink-0" />
            <span className="text-slate-700 font-medium">{mission.availability}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-brand-600 flex-shrink-0" />
              <span>
                <strong className="text-slate-900">{mission.members.length}</strong> of {mission.groupSize} students
                {isFull && <span className="text-rose-600 font-semibold ml-1.5">(Circle Full)</span>}
              </span>
            </div>

            {mission.commitment && (
              <span className="text-[10px] uppercase font-semibold text-slate-400">
                {mission.commitment} Pace
              </span>
            )}
          </div>
        </div>

        {/* Plain-English Match Rationale */}
        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-[11px] text-slate-600 mb-4">
          <span className="font-semibold text-slate-900">Why matched: </span>
          <span>{match.explanations[0] || 'Compatible university focus area.'}</span>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
        <button
          onClick={() => setSelectedMissionId(mission.id)}
          className="flex-1 py-2 px-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors text-center cursor-pointer"
        >
          Details
        </button>

        {isJoined ? (
          <button
            disabled
            className="flex-1 py-2 px-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center justify-center gap-1 cursor-default"
          >
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span>Joined Circle</span>
          </button>
        ) : isFull ? (
          <button
            disabled
            className="flex-1 py-2 px-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-400 text-xs font-semibold flex items-center justify-center gap-1 cursor-not-allowed"
          >
            <Lock className="w-3 h-3" />
            <span>Circle Full</span>
          </button>
        ) : (
          <button
            onClick={() => joinMission(mission.id)}
            className="flex-1 py-2 px-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold transition-colors text-center shadow-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-1"
          >
            Join Mission
          </button>
        )}
      </div>

    </div>
  );
}
