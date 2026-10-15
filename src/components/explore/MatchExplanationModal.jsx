import React from 'react';
import { usePeerBridge } from '../../context/PeerBridgeContext';
import { calculateMissionMatch } from '../../services/matchingService';
import { X, Check, Target, Calendar, Award, Info } from 'lucide-react';

export default function MatchExplanationModal() {
  const { inspectMatchMission, setInspectMatchMissionId, activePersona } = usePeerBridge();

  if (!inspectMatchMission) return null;

  const match = calculateMissionMatch(inspectMatchMission, activePersona);

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-modal overflow-hidden my-6">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-brand-600 font-semibold mb-1">
              <Info className="w-3.5 h-3.5" />
              <span>Transparent Heuristic Matching</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 leading-snug">
              Compatibility Breakdown
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Comparing <strong className="text-slate-800">{activePersona.name}</strong> with <strong className="text-slate-800">"{inspectMatchMission.title}"</strong>
            </p>
          </div>

          <button
            onClick={() => setInspectMatchMissionId(null)}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Score Banner */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide block">
              Deterministic Compatibility Score
            </span>
            <span className="text-sm font-bold text-slate-900">
              {match.summaryText}
            </span>
          </div>

          <div className="px-3.5 py-1.5 rounded-xl text-xl font-extrabold bg-brand-600 text-white shadow-xs">
            {match.percentage}%
          </div>
        </div>

        {/* 3 Weighted Dimensions */}
        <div className="p-6 space-y-3.5 text-xs">
          
          {/* Dimension 1: Goal/Topic (50%) */}
          <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
            <div className="flex items-center justify-between font-semibold mb-1.5">
              <span className="text-slate-900 flex items-center gap-1.5">
                <Target className="w-4 h-4 text-brand-600" />
                1. Goal & Topic Similarity (50% max)
              </span>
              <span className="bg-softBlue text-brand-700 px-2.5 py-0.5 rounded-md font-bold">
                {match.goalScore} / 50 pts
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mb-2">
              <div 
                className="h-full bg-brand-600 rounded-full" 
                style={{ width: `${(match.goalScore / 50) * 100}%` }}
              />
            </div>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              Compares mission topic (<strong className="text-slate-800">{inspectMatchMission.subject || inspectMatchMission.title}</strong>) with student goals (<strong className="text-slate-800">{activePersona.goals?.join(', ')}</strong>).
            </p>
          </div>

          {/* Dimension 2: Availability (30%) */}
          <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
            <div className="flex items-center justify-between font-semibold mb-1.5">
              <span className="text-slate-900 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-brand-600" />
                2. Availability Overlap (30% max)
              </span>
              <span className="bg-softBlue text-brand-700 px-2.5 py-0.5 rounded-md font-bold">
                {match.availScore} / 30 pts
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mb-2">
              <div 
                className="h-full bg-brand-600 rounded-full" 
                style={{ width: `${(match.availScore / 30) * 100}%` }}
              />
            </div>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              Mission schedule: <strong className="text-slate-800">{inspectMatchMission.availability}</strong> vs Student preference: <strong className="text-slate-800">{activePersona.preferredAvailability}</strong>.
            </p>
          </div>

          {/* Dimension 3: Commitment (20%) */}
          <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
            <div className="flex items-center justify-between font-semibold mb-1.5">
              <span className="text-slate-900 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-brand-600" />
                3. Commitment Compatibility (20% max)
              </span>
              <span className="bg-softBlue text-brand-700 px-2.5 py-0.5 rounded-md font-bold">
                {match.commitScore} / 20 pts
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mb-2">
              <div 
                className="h-full bg-brand-600 rounded-full" 
                style={{ width: `${(match.commitScore / 20) * 100}%` }}
              />
            </div>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              Mission pace: <strong className="text-slate-800">{inspectMatchMission.commitment || 'Regular'}</strong> vs Student style: <strong className="text-slate-800">{activePersona.commitment}</strong>.
            </p>
          </div>

          {/* Contributing Reasons */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <span className="font-semibold text-slate-900 block mb-1.5">
              Contributing Factors:
            </span>
            <ul className="space-y-1 text-slate-700">
              {match.explanations.map((exp, i) => (
                <li key={i} className="flex items-start gap-1.5 text-[11px]">
                  <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span>{exp}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={() => setInspectMatchMissionId(null)}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            Close Breakdown
          </button>
        </div>

      </div>
    </div>
  );
}
