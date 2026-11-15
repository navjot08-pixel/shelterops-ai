import React from 'react';
import {
  ShieldAlert,
  MapPin,
  Compass,
  Navigation,
  Users,
  Brain,
  MessageSquare,
  CloudLightning,
  Home,
  Layers,
  Radio,
  Clock,
  Sparkles,
  FileDown,
} from 'lucide-react';
import { User } from 'firebase/auth';

export type ActiveTab =
  | 'overview'
  | 'map'
  | 'predictions'
  | 'allocation'
  | 'routes'
  | 'agents'
  | 'paradigms';

interface NavbarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onOpenChatModal: () => void;
  currentUser: User | null;
  activeDisastersCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  onOpenChatModal,
  currentUser,
  activeDisastersCount,
}) => {
  const [time, setTime] = React.useState<string>('');

  React.useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('en-IN', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Command Center', icon: <Layers className="w-4 h-4" /> },
    { id: 'map', label: 'India Disaster Map', icon: <MapPin className="w-4 h-4" /> },
    { id: 'predictions', label: 'AI Predictions & Weather', icon: <CloudLightning className="w-4 h-4" /> },
    { id: 'allocation', label: 'Smart Shelter Allocation', icon: <Compass className="w-4 h-4" /> },
    { id: 'routes', label: 'Evacuation Routes', icon: <Navigation className="w-4 h-4" /> },
    { id: 'agents', label: 'Response Agents', icon: <Users className="w-4 h-4" /> },
    { id: 'paradigms', label: 'AI Paradigms', icon: <Brain className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Brand & Live Alert Status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onSelectTab('overview')}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-600 via-amber-600 to-blue-600 p-0.5 shadow-lg shadow-red-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <ShieldAlert className="w-5 h-5 text-red-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-sm tracking-tight text-white">ShelterOps AI</span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-red-900/60 text-red-300 border border-red-700/60">
                  INDIA
                </span>
              </div>
              <span className="text-[10px] text-slate-400 block tracking-tight font-medium">
                National Disaster Prediction & Smart Shelter Allocation
              </span>
            </div>
          </div>

          <div className="hidden xl:flex items-center gap-2 pl-3 border-l border-slate-800">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <span className="text-[11px] text-red-300 font-mono font-medium">
              {activeDisastersCount} Active Hazards Monitored
            </span>
          </div>
        </div>

        {/* Right side tools: IST Clock, Google Chat & AI Model Badge */}
        <div className="flex items-center gap-2.5">
          {/* IST Clock */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300">
            <Clock className="w-3.5 h-3.5 text-blue-400" />
            <span>{time || '04:30:00'} IST</span>
          </div>

          {/* Gemini Thinking Mode Indicator */}
          <div className="hidden md:flex items-center gap-1 px-2.5 py-1 rounded-xl bg-indigo-950/60 border border-indigo-800/60 text-[11px] text-indigo-300">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Thinking: HIGH</span>
          </div>

          {/* PPTX Presentation Deck Download */}
          <a
            href="/ShelterOps_AI_Presentation.pptx"
            download="ShelterOps_AI_Presentation.pptx"
            className="px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow bg-amber-600 hover:bg-amber-500 text-white shadow-amber-500/20"
            title="Download Academic 12-Slide PPTX Deck (CSE276)"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Presentation Deck (.pptx)</span>
            <span className="sm:hidden">.pptx</span>
          </a>

          {/* Google Chat Trigger */}
          <button
            onClick={onOpenChatModal}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow ${
              currentUser
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/20'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{currentUser ? 'Chat Space Connected' : 'Connect Google Chat'}</span>
          </button>
        </div>
      </div>

      {/* Navigation Bar Pills */}
      <div className="border-t border-slate-800/80 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <nav className="flex space-x-1 overflow-x-auto py-1.5 scrollbar-none">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap flex items-center gap-2 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};
