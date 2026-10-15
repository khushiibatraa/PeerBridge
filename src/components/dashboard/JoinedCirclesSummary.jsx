import React from 'react';
import { usePeerBridge } from '../../context/PeerBridgeContext';
import { Users, CheckCircle2, ArrowRight, Clock, Target, ArrowUpRight } from 'lucide-react';

export default function JoinedCirclesSummary() {
  const { myJoinedCircles, setActiveTab } = usePeerBridge();

  if (!myJoinedCircles || myJoinedCircles.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-6 text-center shadow-card mb-6">
        <div className="w-10 h-10 rounded-full bg-softBlue text-primary-500 flex items-center justify-center mx-auto mb-2.5">
          <Users className="w-5 h-5" />
        </div>
        <h3 className="text-sm font-bold text-navy-900">
          No Active Peer Circles Joined Yet
        </h3>
        <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
          Find your people and turn goals into shared achievements by joining an active study session, hackathon squad, or mock interview group below.
        </p>
        <button
          onClick={() => setActiveTab('explore')}
          className="mt-3.5 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-xs transition-colors"
        >
          <span>Find a Compatible Circle</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3.5">
        <div>
          <h2 className="text-base font-bold text-navy-900 flex items-center gap-2">
            <span>Your Active Circles</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-softBlue text-primary-500">
              {myJoinedCircles.length} Active
            </span>
          </h2>
          <p className="text-xs text-slate-500">
            Track milestones and next actions with your peer collaborators
          </p>
        </div>

        <button
          onClick={() => setActiveTab('my-circles')}
          className="text-xs font-semibold text-primary-500 hover:text-primary-600 flex items-center gap-1"
        >
          <span>View all circles</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {myJoinedCircles.map(circle => {
          const checklist = circle.checklist || [];
          const totalTasks = checklist.length;
          const completedTasks = checklist.filter(t => t.completed).length;
          const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
          const isCompleted = circle.status === 'Completed';

          // Find the first pending task for "Next Action"
          const nextTask = checklist.find(t => !t.completed);

          return (
            <div 
              key={circle.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-card hover:border-slate-300 hover:shadow-card-hover transition-all flex flex-col justify-between"
            >
              <div>
                {/* Top Tags */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-md bg-softBlue text-brand-700 border border-brand-200 uppercase tracking-wide">
                    {circle.category}
                  </span>
                  <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-md flex items-center gap-1 ${
                    isCompleted 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                      : 'bg-slate-100 text-slate-700 border border-slate-200'
                  }`}>
                    {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Clock className="w-3.5 h-3.5 text-slate-400" />}
                    <span>{circle.status}</span>
                  </span>
                </div>

                {/* Circle Title */}
                <h3 className="font-bold text-sm text-slate-900 line-clamp-1 mb-1">
                  {circle.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 mb-3">
                  {circle.description}
                </p>

                {/* Reference 1 Inspired Pastel Status Chips Row */}
                <div className="grid grid-cols-2 gap-1.5 mb-3 text-[11px]">
                  <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-lg px-2.5 py-1 flex items-center justify-between">
                    <span className="font-medium text-amber-700/80">Schedule</span>
                    <span className="font-semibold truncate max-w-[90px]">{circle.availability}</span>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-lg px-2.5 py-1 flex items-center justify-between">
                    <span className="font-medium text-blue-700/80">Progress</span>
                    <span className="font-bold">{progressPercent}%</span>
                  </div>
                </div>

                {/* Next Action Box */}
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 mb-3 text-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                    Next Action Milestone
                  </span>
                  <div className="font-medium text-slate-800 line-clamp-1 flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-brand-600 flex-shrink-0" />
                    <span>{nextTask ? nextTask.text : 'All milestones finished!'}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                    <span className="font-medium">Shared Checklist</span>
                    <span className="font-bold text-slate-900">{completedTasks}/{totalTasks}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-300 ${
                        isCompleted ? 'bg-emerald-500' : 'bg-brand-600'
                      }`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Footer with member avatars and action button */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="flex -space-x-1.5 overflow-hidden">
                    {circle.members.map((m, i) => (
                      <img
                        key={i}
                        src={m.avatar}
                        alt={m.name}
                        title={`${m.name} (${m.role})`}
                        className="inline-block h-6 w-6 rounded-full border border-white object-cover"
                      />
                    ))}
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium ml-1">
                    {circle.members.length}/{circle.groupSize}
                  </span>
                </div>

                <button
                  onClick={() => setActiveTab('my-circles')}
                  className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
                >
                  <span>Open Circle</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
