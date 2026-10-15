import React from 'react';
import { Target, Cpu } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-16 bg-white border-t border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-primary-500 flex items-center justify-center text-white">
                <Target className="w-3.5 h-3.5" />
              </div>
              <span className="text-base font-bold text-navy-900">PeerBridge</span>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-md">
              Find your people. Achieve more together. Temporary, outcome-bound university peer circles for exams, hackathons, and mock interviews.
            </p>
          </div>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[11px] text-slate-400">
          <div className="flex items-center gap-2 text-slate-600">
            <Cpu className="w-3.5 h-3.5 text-primary-500" />
            <span>Rule-Based Match Formula: 50% Goal • 30% Availability • 20% Commitment</span>
          </div>
          <div className="text-slate-500">
            Mission → Match → Circle → Complete
          </div>
        </div>
      </div>
    </footer>
  );
}
