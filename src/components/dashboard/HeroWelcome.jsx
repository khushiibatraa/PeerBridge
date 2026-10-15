import React from 'react';
import { usePeerBridge } from '../../context/PeerBridgeContext';
import { PlusCircle, Compass, BookOpen, Rocket, Briefcase, Code } from 'lucide-react';

export default function HeroWelcome({ selectedCategory, onSelectCategory }) {
  const { activePersona, setIsCreateModalOpen, setActiveTab, missions } = usePeerBridge();

  const categories = [
    { 
      id: 'Study', 
      label: 'Study Sessions', 
      desc: 'Exam prep, DBMS, Operating Systems, Math', 
      icon: BookOpen,
      iconColor: 'text-blue-600',
      bgColor: 'bg-[#EFF6FF]',
      borderColor: 'border-[#BFDBFE] hover:border-blue-400',
    },
    { 
      id: 'Hackathon', 
      label: 'Hackathons', 
      desc: 'Team matching, ideation, and weekend sprints', 
      icon: Rocket,
      iconColor: 'text-purple-600',
      bgColor: 'bg-[#FAF5FF]',
      borderColor: 'border-[#E9D5FF] hover:border-purple-400',
    },
    { 
      id: 'Career', 
      label: 'Career & Mocks', 
      desc: 'Peer mock interviews, System Design, DSA', 
      icon: Briefcase,
      iconColor: 'text-amber-600',
      bgColor: 'bg-[#FFFBEB]',
      borderColor: 'border-[#FDE68A] hover:border-amber-400',
    },
    { 
      id: 'Projects', 
      label: 'Projects', 
      desc: 'Web dev, paper reading, open-source builds', 
      icon: Code,
      iconColor: 'text-emerald-600',
      bgColor: 'bg-[#ECFDF5]',
      borderColor: 'border-[#A7F3D0] hover:border-emerald-400',
    },
  ];

  return (
    <div className="bg-gradient-to-b from-brand-50/70 via-indigo-50/20 to-white rounded-3xl p-6 sm:p-10 border border-brand-100/90 shadow-sm mb-8">
      <div className="max-w-3xl">
        
        {/* Hero Badge Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-brand-200 text-brand-700 text-xs font-semibold shadow-xs mb-4">
          <span className="w-2 h-2 rounded-full bg-brand-600 animate-pulse"></span>
          <span>Find your people. Make things happen.</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          What do you want to achieve today, {activePersona.name.split(' ')[0]}?
        </h1>

        {/* Hero Subtitle */}
        <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
          Don't study or prepare alone in silence. Post a temporary mission with your topic and availability, discover compatible university peers, and track your shared checklist until the goal is finished.
        </p>

        {/* Hero Buttons */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold shadow-sm shadow-brand-200 transition-all hover:translate-y-[-1px] focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create a Mission</span>
          </button>

          <button
            onClick={() => setActiveTab('explore')}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 text-sm font-semibold shadow-xs transition-all hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-300"
          >
            <Compass className="w-4 h-4 text-brand-600" />
            <span>Explore Missions</span>
          </button>
        </div>
      </div>

      {/* 4 Distinct Pastel Category Cards */}
      <div className="mt-8 pt-6 border-t border-brand-100/80">
        <div className="flex items-center justify-between mb-3.5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Explore by Mission Category
          </span>
          {selectedCategory && selectedCategory !== 'All' && (
            <button
              onClick={() => onSelectCategory && onSelectCategory('All')}
              className="text-xs font-semibold text-brand-600 hover:text-brand-700 underline"
            >
              Show All Categories
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map(cat => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            const count = (missions || []).filter(m => m.category === cat.id).length;

            return (
              <button
                key={cat.id}
                onClick={() => {
                  if (onSelectCategory) {
                    onSelectCategory(isSelected ? 'All' : cat.id);
                  }
                }}
                className={`${cat.bgColor} border ${cat.borderColor} rounded-2xl p-4 text-left transition-all hover:shadow-xs group cursor-pointer ${
                  isSelected ? 'ring-2 ring-brand-500 shadow-sm' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Icon className={`w-5 h-5 ${cat.iconColor}`} />
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/80 text-slate-600 border border-slate-200/50">
                    {count} {count === 1 ? 'mission' : 'missions'}
                  </span>
                </div>
                <div className="font-bold text-sm text-slate-900 mb-1">{cat.label}</div>
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">{cat.desc}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
