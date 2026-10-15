import React from 'react';
import { usePeerBridge } from '../../context/PeerBridgeContext';
import { Compass, Users, CheckCircle, Flame } from 'lucide-react';

export default function QuickStats() {
  const { missions, myJoinedCircles } = usePeerBridge();

  const totalMissions = missions.length;
  const joinedCount = myJoinedCircles.length;
  
  // Count tasks across joined circles
  let totalTasks = 0;
  let completedTasks = 0;
  let completedCirclesCount = 0;

  myJoinedCircles.forEach(circle => {
    if (circle.status === 'Completed') completedCirclesCount++;
    if (Array.isArray(circle.checklist)) {
      totalTasks += circle.checklist.length;
      completedTasks += circle.checklist.filter(t => t.completed).length;
    }
  });

  const overallProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const stats = [
    {
      label: 'Discoverable Missions',
      value: totalMissions,
      sub: 'Active campus goals',
      icon: Compass,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-100'
    },
    {
      label: 'My Peer Circles',
      value: joinedCount,
      sub: `${completedCirclesCount} accomplished`,
      icon: Users,
      color: 'text-brand-600 bg-brand-50 border-brand-100'
    },
    {
      label: 'Tasks Finished',
      value: `${completedTasks}/${totalTasks}`,
      sub: `${overallProgress}% overall completion`,
      icon: CheckCircle,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100'
    },
    {
      label: 'Focus Velocity',
      value: joinedCount > 0 ? `${overallProgress}%` : 'Ready',
      sub: 'Progress across circles',
      icon: Flame,
      color: 'text-amber-600 bg-amber-50 border-amber-100'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div 
            key={idx}
            className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 border ${stat.color}`}>
              <Icon className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <div className="text-2xl font-bold text-slate-900 leading-tight">{stat.value}</div>
              <div className="text-xs font-semibold text-slate-700 truncate">{stat.label}</div>
              <div className="text-[11px] text-slate-500 truncate">{stat.sub}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
