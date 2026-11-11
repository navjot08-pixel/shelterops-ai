import React from 'react';
import { EvacuationRoute, Disaster, Shelter } from '../types';
import {
  Navigation,
  AlertOctagon,
  ShieldCheck,
  Clock,
  MapPin,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Compass,
  CheckCircle2,
  Truck,
  Car,
} from 'lucide-react';

interface EvacuationRoutesViewProps {
  routes: EvacuationRoute[];
  disaster: Disaster;
  shelters: Shelter[];
  onSelectRoute?: (r: EvacuationRoute) => void;
}

export const EvacuationRoutesView: React.FC<EvacuationRoutesViewProps> = ({
  routes,
  disaster,
  shelters,
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-xl backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700/60 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30">
                <Navigation className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-white tracking-wide">
                Evacuation Route Planning & Corridor Navigation
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              Evaluates road accessibility, identifies flooded/blocked arterial highways, and routes emergency convoys along structural safe corridors.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="px-3 py-1 rounded-xl bg-emerald-950/60 text-emerald-300 border border-emerald-700 flex items-center gap-1 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Elevated Corridors Verified</span>
            </span>
          </div>
        </div>

        {/* Corridor Health Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
          <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-700/60 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Safest Primary Corridor</span>
              <span className="text-sm font-bold text-white">Elevated SH-715A</span>
              <span className="text-[11px] text-emerald-400 block font-mono">24.8 km • ~38 min ETA</span>
            </div>
          </div>

          <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-700/60 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Secondary Northern Corridor</span>
              <span className="text-sm font-bold text-white">Napaam-Tezpur Highway</span>
              <span className="text-[11px] text-blue-400 block font-mono">52.4 km • ~65 min ETA</span>
            </div>
          </div>

          <div className="bg-slate-900/60 p-3.5 rounded-xl border border-red-800/60 flex items-center gap-3 bg-red-950/20">
            <div className="p-2 rounded-lg bg-red-500/20 text-red-400">
              <AlertOctagon className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-red-400 uppercase tracking-wider block">Critical Roadblock Alert</span>
              <span className="text-sm font-bold text-white">NH-37 Lahorighat Connector</span>
              <span className="text-[11px] text-red-300 block font-mono">Submerged 1.8m Water</span>
            </div>
          </div>
        </div>
      </div>

      {/* Routes List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {routes.map((r) => {
          const isSafest = r.status === 'Safest';
          const isBlocked = r.status === 'Blocked';

          return (
            <div
              key={r.id}
              className={`rounded-2xl border p-5 shadow-xl backdrop-blur-md space-y-4 transition-all ${
                isSafest
                  ? 'bg-slate-800/90 border-emerald-500/60 ring-1 ring-emerald-500/30'
                  : isBlocked
                  ? 'bg-slate-900/90 border-red-800/80'
                  : 'bg-slate-800/80 border-slate-700/80'
              }`}
            >
              <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider flex items-center gap-1 ${
                    isSafest
                      ? 'bg-emerald-950/80 text-emerald-300 border-emerald-600'
                      : isBlocked
                      ? 'bg-red-950/80 text-red-300 border-red-600 animate-pulse'
                      : 'bg-blue-950/80 text-blue-300 border-blue-600'
                  }`}
                >
                  {isSafest ? <ShieldCheck className="w-3 h-3" /> : isBlocked ? <AlertOctagon className="w-3 h-3" /> : <Navigation className="w-3 h-3" />}
                  <span>{r.status} Route</span>
                </span>

                <div className="text-right font-mono">
                  <span className="text-xs font-bold text-white">{r.distanceKm} km</span>
                  <span className="block text-[10px] text-slate-400">~{r.etaMinutes} min convoy</span>
                </div>
              </div>

              {/* Origin -> Destination */}
              <div className="space-y-2 text-xs">
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Origin (Hazard Zone)</span>
                    <span className="font-semibold text-slate-100">{r.originName}</span>
                  </div>
                </div>

                <div className="w-0.5 h-3 bg-slate-600 ml-1.5" />

                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Designated Shelter Destination</span>
                    <span className="font-semibold text-slate-100">{r.destinationName}</span>
                  </div>
                </div>
              </div>

              {/* Blocked message or features */}
              {isBlocked ? (
                <div className="bg-red-950/50 border border-red-800/80 p-3 rounded-xl text-[11px] text-red-200 space-y-1.5">
                  <div className="font-bold flex items-center gap-1 text-red-300">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                    <span>Hazard Obstacle:</span>
                  </div>
                  <p className="leading-relaxed">{r.blockedReason}</p>
                  {r.alternativeRouteName && (
                    <div className="pt-1.5 border-t border-red-900/60 text-[10px] text-amber-300">
                      <strong>AI Alternate:</strong> {r.alternativeRouteName}
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-slate-900/60 border border-slate-700/50 p-3 rounded-xl text-[11px] text-slate-300 space-y-1">
                  <div className="flex items-center justify-between text-slate-400 text-[10px]">
                    <span>Surface Quality: Asphalt High-Clearance</span>
                    <span className="text-emerald-400">Zero Inundation</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400 text-[10px]">
                    <span>Max Vehicle Clearance: Heavy Buses / Trucks</span>
                    <span className="text-blue-300">Bridge Audited</span>
                  </div>
                  {r.alternativeRouteName && (
                    <div className="pt-1 border-t border-slate-800 text-[10px] text-slate-400">
                      Bypass: {r.alternativeRouteName}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
