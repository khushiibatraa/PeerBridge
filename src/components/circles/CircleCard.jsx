import React, { useState } from 'react';
import { usePeerBridge } from '../../context/PeerBridgeContext';
import ChecklistManager from './ChecklistManager';
import { 
  Calendar, 
  CheckCircle2, 
  RotateCcw, 
  LogOut, 
  ChevronDown, 
  ChevronUp,
  Check,
  Video,
  ExternalLink,
  FileText,
  Save,
  MessageSquare
} from 'lucide-react';

export default function CircleCard({ mission }) {
  const { activePersona, completeMission, leaveMission, updateCircleNotes, updateCircleMeetingLink } = usePeerBridge();
  const [showMembers, setShowMembers] = useState(false);
  const [showCollabHub, setShowCollabHub] = useState(false);
  const [meetingInput, setMeetingInput] = useState(mission.meetingLink || '');
  const [notesInput, setNotesInput] = useState(mission.sessionNotes || '');
  const [isEditingNotes, setIsEditingNotes] = useState(false);

  const isCompleted = mission.status === 'Completed';
  const isHost = mission.createdBy?.id === activePersona.id;

  // Category tags using centralized tokens
  const categoryStyles = {
    Study: 'text-blue-700 bg-blue-50 border-blue-200',
    Hackathon: 'text-purple-700 bg-purple-50 border-purple-200',
    Career: 'text-amber-800 bg-amber-50 border-amber-200',
    Projects: 'text-emerald-800 bg-emerald-50 border-emerald-200',
  };

  const tagStyle = categoryStyles[mission.category] || 'text-slate-700 bg-slate-50 border-slate-200';

  const checklist = mission.checklist || [];
  const completedCount = checklist.filter(t => t.completed).length;
  const progressPercent = checklist.length > 0 ? Math.round((completedCount / checklist.length) * 100) : 0;

  return (
    <div className={`bg-white rounded-2xl border shadow-card hover:shadow-card-hover transition-all overflow-hidden ${
      isCompleted ? 'border-emerald-200 bg-emerald-50/10' : 'border-slate-200'
    }`}>
      
      {/* Completion Banner */}
      {isCompleted && (
        <div className="bg-emerald-600 text-white px-5 py-2.5 flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-100" />
            <span>Mission Accomplished! This circle completed all milestones.</span>
          </div>
          <button
            onClick={() => completeMission(mission.id, 'Active')}
            className="text-[11px] underline hover:text-emerald-100 transition-colors flex items-center gap-1 cursor-pointer font-medium"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Re-open</span>
          </button>
        </div>
      )}

      {/* Main Body */}
      <div className="p-5 sm:p-6 space-y-4">
        
        {/* Header */}
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-md border ${tagStyle}`}>
                {mission.category}
              </span>
              <span className={`text-[11px] font-medium px-2.5 py-0.5 rounded-md border ${
                isCompleted 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold' 
                  : 'bg-softBlue text-brand-700 border-brand-200 font-semibold'
              }`}>
                {mission.status}
              </span>
            </div>

            <div className="text-xs text-slate-500 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-brand-600" />
              <span>{mission.availability}</span>
            </div>
          </div>

          <h3 className="text-lg font-bold text-slate-900 leading-snug">
            {mission.title}
          </h3>

          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
            {mission.description}
          </p>
        </div>

        {/* Reference 1 Inspired Pastel Status Chips Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-xl p-2.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700/80 block">Schedule</span>
            <span className="font-semibold truncate block mt-0.5">{mission.availability}</span>
          </div>
          <div className="bg-purple-50 border border-purple-200 text-purple-800 rounded-xl p-2.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700/80 block">Pace</span>
            <span className="font-semibold truncate block mt-0.5">{mission.commitment || 'Regular'} Intensity</span>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-2.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700/80 block">Circle Size</span>
            <span className="font-semibold truncate block mt-0.5">{mission.members.length} / {mission.groupSize} Students</span>
          </div>
          <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-xl p-2.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700/80 block">Milestones</span>
            <span className="font-bold truncate block mt-0.5">{progressPercent}% Done</span>
          </div>
        </div>

        {/* Member Roster Info */}
        <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex -space-x-1.5 overflow-hidden">
                {mission.members.map((m, idx) => (
                  <img
                    key={idx}
                    src={m.avatar}
                    alt={m.name}
                    title={`${m.name} (${m.role})`}
                    className="inline-block h-6 w-6 rounded-full border border-white object-cover"
                  />
                ))}
              </div>
              <span className="text-xs font-semibold text-slate-800">
                {mission.members.length} of {mission.groupSize} students in circle
              </span>
            </div>

            <button
              onClick={() => setShowMembers(!showMembers)}
              className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1 cursor-pointer"
            >
              <span>{showMembers ? 'Hide Roster' : 'View Members'}</span>
              {showMembers ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {showMembers && (
            <div className="mt-3 pt-3 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {mission.members.map((m, idx) => (
                <div key={idx} className="flex items-center gap-2.5 p-2 bg-white rounded-lg border border-slate-200 text-xs shadow-xs">
                  <img src={m.avatar} alt={m.name} className="w-6 h-6 rounded-full object-cover" />
                  <div className="min-w-0">
                    <span className="font-semibold text-slate-900">{m.name}</span>
                    <span className="text-[10px] text-slate-400 ml-1">
                      {m.role === 'Host' ? '(Host)' : m.id === activePersona.id ? '(You)' : ''}
                    </span>
                    <div className="text-[10px] text-slate-500 truncate">{m.year || 'Student'}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Circle Collaboration Hub: Video Meeting & Session Scratchpad */}
        <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
              <Video className="w-4 h-4 text-brand-600" />
              <span>Circle Collaboration Hub & Meeting Room</span>
            </div>

            <button
              onClick={() => setShowCollabHub(!showCollabHub)}
              className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1 cursor-pointer"
            >
              <span>{showCollabHub ? 'Hide Hub' : 'Open Hub'}</span>
              {showCollabHub ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {showCollabHub && (
            <div className="mt-3 pt-3 border-t border-slate-200 space-y-3">
              {/* Meeting Link Row */}
              <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs">
                <span className="font-semibold text-slate-900 block mb-1">
                  Virtual Study Room / Video Call Link:
                </span>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <input
                    type="url"
                    value={meetingInput}
                    onChange={(e) => setMeetingInput(e.target.value)}
                    placeholder="e.g. https://meet.google.com/abc-defg-hij or Zoom / Discord link"
                    className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => updateCircleMeetingLink(mission.id, meetingInput.trim())}
                      className="px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Save className="w-3 h-3" />
                      <span>Save Link</span>
                    </button>
                    {mission.meetingLink && (
                      <a
                        href={mission.meetingLink.startsWith('http') ? mission.meetingLink : `https://${mission.meetingLink}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Join Call</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Shared Scratchpad Notes */}
              <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-semibold text-slate-900 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-brand-600" />
                    <span>Shared Session Notes & Resources</span>
                  </span>
                  {!isEditingNotes ? (
                    <button
                      onClick={() => setIsEditingNotes(true)}
                      className="text-[11px] text-brand-600 hover:text-brand-700 font-semibold cursor-pointer"
                    >
                      Edit Notes
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        updateCircleNotes(mission.id, notesInput.trim());
                        setIsEditingNotes(false);
                      }}
                      className="text-[11px] text-emerald-600 hover:text-emerald-700 font-semibold cursor-pointer"
                    >
                      Done Editing
                    </button>
                  )}
                </div>

                {isEditingNotes ? (
                  <textarea
                    rows={3}
                    value={notesInput}
                    onChange={(e) => setNotesInput(e.target.value)}
                    placeholder="Jot down shared exam topics, agreed meeting times, paper links, or repository links..."
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                ) : (
                  <p className="text-slate-600 text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-100 whitespace-pre-wrap">
                    {mission.sessionNotes || 'No shared notes yet. Click "Edit Notes" to add study links or collaboration minutes.'}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Shared Checklist Section */}
        <ChecklistManager mission={mission} />

        {/* Bottom Actions */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
          <div>
            {!isHost && (
              <button
                onClick={() => leaveMission(mission.id)}
                className="text-xs text-slate-400 hover:text-rose-600 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Leave circle</span>
              </button>
            )}
          </div>

          <div>
            {!isCompleted ? (
              <button
                onClick={() => completeMission(mission.id, 'Completed')}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Mark Goal Accomplished</span>
              </button>
            ) : (
              <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Goal Accomplished</span>
              </span>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
