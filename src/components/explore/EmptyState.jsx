import React from 'react';
import { usePeerBridge } from '../../context/PeerBridgeContext';
import { SearchX, Plus, RotateCcw } from 'lucide-react';

export default function EmptyState({ onResetFilters }) {
  const { setIsCreateModalOpen } = usePeerBridge();

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center max-w-lg mx-auto shadow-card my-6">
      <div className="w-12 h-12 rounded-full bg-softBlue text-brand-600 flex items-center justify-center mx-auto mb-3 border border-brand-200">
        <SearchX className="w-6 h-6" />
      </div>

      <h3 className="text-base font-bold text-slate-900">
        No Matching Peer Missions Found
      </h3>

      <p className="text-xs text-slate-500 mt-1.5 leading-relaxed max-w-sm mx-auto">
        Try broadening your search query, selecting different categories, or setting schedule availability to flexible.
      </p>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
        {onResetFilters && (
          <button
            onClick={onResetFilters}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        )}

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Post This Mission</span>
        </button>
      </div>
    </div>
  );
}
