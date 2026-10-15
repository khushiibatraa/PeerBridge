import React from 'react';
import { usePeerBridge } from '../../context/PeerBridgeContext';
import { calculateMissionMatch } from '../../services/matchingService';
import { 
  X, 
  Users, 
  Calendar, 
  Check, 
  Lock, 
  ArrowRight,
  ListTodo,
  Tag
} from 'lucide-react';

export default function MissionDetailsModal() {
  const { 
    selectedMission, 
    setSelectedMissionId, 
    activePersona, 
    joinMission, 
    leaveMission,
    setActiveTab,
    setInspectMatchMissionId 
  } = usePeerBridge();

  if (!selectedMission) return null;

  const match = calculateMissionMatch(selectedMission, activePersona);
  const isJoined = selectedMission.members.some(m => m.id === activePersona.id);
  const isFull = selectedMission.members.length >= selectedMission.groupSize;
  const isHost = selectedMission.createdBy?.id === activePersona.id;

  // Category tags using centralized tokens
  const categoryStyles = {
    Study: 'text-blue-700 bg-blue-50 border-blue-200',
    Hackathon: 'text-purple-700 bg-purple-50 border-purple-200',
    Career: 'text-amber-800 bg-amber-50 border-amber-200',
    Projects: 'text-emerald-800 bg-emerald-50 border-emerald-200',
  };

  const tagStyle = categoryStyles[selectedMission.category] || 'text-slate-700 bg-slate-50 border-slate-200';

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-modal overflow-hidden my-6">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-md border ${tagStyle}`}>
                {selectedMission.category}
              </span>
              {selectedMission.commitment && (
                <span className="text-[11px] font-medium text-slate-600 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-md">
                  {selectedMission.commitment} Pace
                </span>
              )}
            </div>
            <h2 className="text-xl font-bold text-slate-900 leading-snug">
              {selectedMission.title}
            </h2>
            {selectedMission.subject && (
              <p className="text-xs text-brand-600 font-semibold mt-1 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5" />
                <span>Focus: <strong>{selectedMission.subject}</strong></span>
              </p>
            )}
          </div>

          <button
            onClick={() => setSelectedMissionId(null)}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          
          {/* Mission Objective */}
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
              Goal & Objective
            </h4>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
              {selectedMission.description}
            </p>
          </div>

          {/* Explainable Compatibility Section */}
          <div className="bg-softBlue p-4 rounded-xl border border-brand-200">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-slate-900">
                Compatibility with {activePersona.name}
              </span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-brand-600 text-white">
                {match.percentage}% Match
              </span>
            </div>

            <p className="text-xs text-brand-700 font-semibold mb-2">
              {match.summaryText}
            </p>

            <ul className="space-y-1.5 text-xs text-slate-700 mb-2.5">
              {match.explanations.map((exp, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-brand-600 font-bold">•</span>
                  <span>{exp}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => {
                setSelectedMissionId(null);
                setInspectMatchMissionId(selectedMission.id);
              }}
              className="text-[11px] text-brand-600 hover:text-brand-700 font-semibold underline flex items-center gap-1 cursor-pointer"
            >
              <span>View transparent 50/30/20 algorithm breakdown</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Logistics */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
              <span className="text-slate-400 block mb-0.5 text-[11px]">Schedule Availability</span>
              <span className="font-semibold text-slate-900 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-brand-600" />
                <span>{selectedMission.availability}</span>
              </span>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
              <span className="text-slate-400 block mb-0.5 text-[11px]">Circle Capacity</span>
              <span className="font-semibold text-slate-900 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-brand-600" />
                <span>{selectedMission.members.length} of {selectedMission.groupSize} students</span>
                {isFull && <span className="text-rose-600 text-[11px] font-bold">(Full)</span>}
              </span>
            </div>
          </div>

          {/* Members Roster */}
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
              Circle Collaborators ({selectedMission.members.length})
            </h4>

            <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white overflow-hidden">
              {selectedMission.members.map((member, idx) => (
                <div key={idx} className="p-3 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-8 h-8 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <div className="font-semibold text-slate-900 flex items-center gap-1">
                        <span>{member.name}</span>
                        {member.role === 'Host' && (
                          <span className="text-[10px] text-brand-700 font-semibold bg-brand-50 px-1.5 py-0.2 rounded border border-brand-200">Host</span>
                        )}
                        {member.id === activePersona.id && (
                          <span className="text-[10px] text-slate-600 font-semibold bg-slate-100 px-1.5 py-0.2 rounded">You</span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {member.year || 'Student'} • Joined {member.joinedAt || 'Recently'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Checklist Preview */}
          {selectedMission.checklist && selectedMission.checklist.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 flex items-center gap-1">
                <ListTodo className="w-3.5 h-3.5 text-brand-600" />
                <span>Milestone Roadmap ({selectedMission.checklist.length} items)</span>
              </h4>
              <div className="space-y-1.5">
                {selectedMission.checklist.map((task) => (
                  <div 
                    key={task.id}
                    className="text-xs text-slate-700 bg-slate-50 px-3.5 py-2 rounded-lg border border-slate-200 flex items-center gap-2"
                  >
                    <span className="text-slate-400">•</span>
                    <span className={task.completed ? 'line-through text-slate-400' : 'text-slate-800 font-medium'}>
                      {task.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            onClick={() => setSelectedMissionId(null)}
            className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Close
          </button>

          <div className="flex items-center gap-2">
            {isJoined ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setSelectedMissionId(null);
                    setActiveTab('my-circles');
                  }}
                  className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ListTodo className="w-3.5 h-3.5" />
                  <span>Open in My Circles</span>
                </button>
                {!isHost && (
                  <button
                    onClick={() => leaveMission(selectedMission.id)}
                    className="px-3.5 py-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Leave
                  </button>
                )}
              </div>
            ) : isFull ? (
              <button
                disabled
                className="px-4 py-2 rounded-xl bg-slate-200 text-slate-400 text-xs font-semibold flex items-center gap-1.5 cursor-not-allowed"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Circle is Full</span>
              </button>
            ) : (
              <button
                onClick={() => joinMission(selectedMission.id)}
                className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-1"
              >
                <Users className="w-3.5 h-3.5" />
                <span>Join Mission</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
