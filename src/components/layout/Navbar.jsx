import React, { useState, useRef, useEffect } from 'react';
import { usePeerBridge } from '../../context/PeerBridgeContext';
import { SAMPLE_PERSONAS } from '../../data/samplePersonas';
import { 
  Compass, 
  Users, 
  FolderKanban, 
  PlusCircle, 
  LayoutDashboard, 
  ChevronDown, 
  UserCheck, 
  Menu, 
  X,
  Target
} from 'lucide-react';

export default function Navbar() {
  const { 
    activeTab, 
    setActiveTab, 
    setIsCreateModalOpen, 
    activePersona, 
    switchPersona
  } = usePeerBridge();

  const [isPersonaOpen, setIsPersonaOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsPersonaOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'explore', label: 'Explore Missions', icon: Compass },
    { id: 'my-circles', label: 'My Circles', icon: Users },
    { id: 'my-missions', label: 'My Missions', icon: FolderKanban },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-16 gap-2 md:gap-4 xl:gap-6">
          
          {/* Logo & Optional Tagline */}
          <div className="flex-shrink-0 flex items-center">
            <button 
              onClick={() => { setActiveTab('dashboard'); setIsMobileMenuOpen(false); }}
              className="flex items-center gap-2.5 text-left group focus:outline-none cursor-pointer"
            >
              <div className="w-9 h-9 xl:w-10 xl:h-10 rounded-2xl bg-brand-600 flex items-center justify-center text-white shadow-xs group-hover:bg-brand-700 transition-colors flex-shrink-0">
                <Target className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg xl:text-xl font-bold tracking-tight text-slate-900 group-hover:text-brand-600 transition-colors leading-tight">
                  Peer<span className="text-brand-600">Bridge</span>
                </span>
                <p className="text-[11px] text-slate-500 hidden 2xl:block leading-tight mt-0.5 whitespace-nowrap">
                  Find your people. Achieve more together.
                </p>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5" aria-label="Main Navigation">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 xl:px-3.5 xl:py-2 text-xs xl:text-sm font-medium rounded-xl transition-colors whitespace-nowrap flex-shrink-0 cursor-pointer ${
                    isActive 
                      ? 'text-brand-600 bg-brand-50 font-semibold' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-brand-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Bar */}
          <div className="flex-shrink-0 flex items-center gap-2 sm:gap-2.5 xl:gap-3">
            
            {/* Persona Switcher Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsPersonaOpen(!isPersonaOpen)}
                className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 text-left rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all focus:outline-none focus:ring-2 focus:ring-brand-500/20 cursor-pointer flex-shrink-0"
                aria-expanded={isPersonaOpen}
                aria-label="Switch Student Persona"
                title="Switch simulated student profile to see matching logic adapt"
              >
                <img 
                  src={activePersona.avatar} 
                  alt={activePersona.name} 
                  className="w-7 h-7 rounded-full object-cover border border-slate-200 flex-shrink-0"
                />
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-semibold text-slate-800 flex items-center gap-1">
                    <span className="truncate max-w-[90px] xl:max-w-none">{activePersona.name}</span>
                    <span className="text-[10px] text-brand-600 font-medium">({activePersona.role})</span>
                  </div>
                  <div className="text-[10px] text-slate-500 truncate max-w-[120px] hidden xl:block">
                    {activePersona.primaryCategory} • {activePersona.commitment}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              </button>

              {isPersonaOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Simulated Student Persona
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Switch to observe how rule-based matching scores adapt live:
                    </p>
                  </div>
                  <div className="py-1">
                    {SAMPLE_PERSONAS.map(p => {
                      const isCurrent = p.id === activePersona.id;
                      return (
                        <button
                          key={p.id}
                          onClick={() => {
                            switchPersona(p.id);
                            setIsPersonaOpen(false);
                          }}
                          className={`w-full flex items-start gap-3 px-3 py-2.5 text-left hover:bg-slate-50 transition-colors cursor-pointer ${
                            isCurrent ? 'bg-brand-50' : ''
                          }`}
                        >
                          <img 
                            src={p.avatar} 
                            alt={p.name} 
                            className="w-8 h-8 rounded-full object-cover mt-0.5 border border-slate-200 flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-semibold text-slate-900">{p.name}</span>
                              {isCurrent && <UserCheck className="w-3.5 h-3.5 text-brand-600" />}
                            </div>
                            <p className="text-[11px] text-brand-600 font-medium">{p.role} • {p.year}</p>
                            <p className="text-[10px] text-slate-500 mt-0.5 truncate">
                              Goal: {p.goals?.[0]} | Avail: {p.preferredAvailability}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Create Mission Button */}
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 xl:px-4 xl:py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 whitespace-nowrap flex-shrink-0 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 flex-shrink-0" />
              <span>Create Mission</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium cursor-pointer ${
                  isActive ? 'bg-brand-50 text-brand-600 font-semibold' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
