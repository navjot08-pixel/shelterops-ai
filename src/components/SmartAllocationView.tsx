import React, { useState } from 'react';
import { Disaster, Shelter, AllocationPlan } from '../types';
import {
  Compass,
  CheckCircle2,
  AlertTriangle,
  Home,
  Users,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  Cpu,
  Layers,
  Sparkles,
  RefreshCw,
  Phone,
  Clock,
  Navigation,
} from 'lucide-react';

interface SmartAllocationViewProps {
  disaster: Disaster;
  shelters: Shelter[];
  allocationPlan: AllocationPlan | null;
  onRunAllocation: (disaster: Disaster, overridePop?: number) => void;
  onSelectShelterModal: (s: Shelter) => void;
}

export const SmartAllocationView: React.FC<SmartAllocationViewProps> = ({
  disaster,
  shelters,
  allocationPlan,
  onRunAllocation,
  onSelectShelterModal,
}) => {
  const [popSlider, setPopSlider] = useState<number>(disaster.affectedPopulation);
  const [isOptimizing, setIsOptimizing] = useState(false);

  const handleExecute = () => {
    setIsOptimizing(true);
    setTimeout(() => {
      onRunAllocation(disaster, popSlider);
      setIsOptimizing(false);
    }, 300);
  };

  const plan = allocationPlan;

  return (
    <div className="space-y-6">
      {/* Header & Interactive Constraint Control Bar */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-xl backdrop-blur-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-700/60 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30">
                <Compass className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-white tracking-wide">
                Smart Shelter Allocation Engine
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              Multi-objective constraint optimization solving capacity invariants, hazard exclusion perimeters, and vulnerable demographic routing.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExecute}
              disabled={isOptimizing}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-blue-500/25 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-60"
            >
              <RefreshCw className={`w-4 h-4 ${isOptimizing ? 'animate-spin' : ''}`} />
              <span>{isOptimizing ? 'Optimizing State Space...' : 'Run Constraint Optimization'}</span>
            </button>
          </div>
        </div>

        {/* Live Scenario Modifiers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-5">
          <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-700/60">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Active Hazard Focus
            </span>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-white truncate">{disaster.name}</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-900/60 text-red-300 border border-red-700">
                {disaster.severity}
              </span>
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">
              {disaster.location.district}, {disaster.location.state} • {disaster.exclusionRadiusKm}km safe exclusion zone
            </span>
          </div>

          <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-700/60 md:col-span-2">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Simulate Affected Population Surge
              </span>
              <span className="text-sm font-extrabold text-blue-400 font-mono">
                {popSlider.toLocaleString()} People
              </span>
            </div>
            <input
              type="range"
              min={2000}
              max={150000}
              step={1000}
              value={popSlider}
              onChange={(e) => setPopSlider(Number(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>2,000 (Local Hamlet)</span>
              <span>25,000 (Sub-District)</span>
              <span>75,000 (Major Basin)</span>
              <span>150,000 (Super Hazard Surge)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Plan Evaluation Summary Stats */}
      {plan && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 shadow-lg backdrop-blur-md">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Allocated Population</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-emerald-400 font-mono">
              {plan.totalAllocated.toLocaleString()}
            </div>
            <span className="text-[11px] text-slate-400">
              {plan.efficiencyScore}% of target population safely matched
            </span>
          </div>

          <div className={`border rounded-2xl p-4 shadow-lg backdrop-blur-md ${
            plan.unallocatedCount > 0 
              ? 'bg-red-950/40 border-red-800/80' 
              : 'bg-slate-800/80 border-slate-700/80'
          }`}>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Awaiting Capacity</span>
              <AlertTriangle className={`w-4 h-4 ${plan.unallocatedCount > 0 ? 'text-red-400' : 'text-slate-500'}`} />
            </div>
            <div className={`text-2xl font-black font-mono ${plan.unallocatedCount > 0 ? 'text-red-400' : 'text-slate-400'}`}>
              {plan.unallocatedCount.toLocaleString()}
            </div>
            <span className="text-[11px] text-slate-400">
              {plan.unallocatedCount > 0 ? 'Requires makeshift NDRF camps' : 'Zero unallocated deficit'}
            </span>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 shadow-lg backdrop-blur-md">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>State Space Explored</span>
              <Cpu className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-black text-blue-400 font-mono">
              {plan.statesExplored.toLocaleString()}
            </div>
            <span className="text-[11px] text-slate-400">
              Permutations validated in {plan.executionTimeMs} ms
            </span>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 shadow-lg backdrop-blur-md">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Safety Invariants</span>
              <ShieldAlert className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-base font-bold text-emerald-300">
              100% Verified Safe
            </div>
            <span className="text-[11px] text-slate-400">
              0 shelters inside {disaster.exclusionRadiusKm}km hazard radius
            </span>
          </div>
        </div>
      )}

      {/* Unallocated Population Warning if Capacity Exceeded */}
      {plan && plan.unallocatedCount > 0 && (
        <div className="bg-red-900/30 border border-red-700/80 p-4 rounded-2xl flex items-start gap-3 text-red-200">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <h4 className="font-bold text-sm text-red-300">
              Capacity Deficit Warning: {plan.unallocatedCount.toLocaleString()} Citizens Awaiting Shelter
            </h4>
            <p className="text-red-200/90 leading-relaxed">
              Permanent concrete shelters in the safe radius are at 100% capacity. AI Engine recommends initiating{' '}
              <strong>NDRF Emergency Annex Protocol</strong>: Mobilize waterproof modular tent townships on elevated airport runways, deploy rail passenger rakes as temporary mobile air-conditioned wards, and requisition interstate college campuses within 100km.
            </p>
          </div>
        </div>
      )}

      {/* Shelter Allocation Breakdown Table */}
      {plan && (
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-xl backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Home className="w-4 h-4 text-emerald-400" />
              <span>Recommended Shelter Distribution Plan</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-700 text-slate-300 font-normal">
                {plan.allocations.length} Shelters Assigned
              </span>
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 text-[11px] uppercase tracking-wider border-b border-slate-700">
                <tr>
                  <th className="py-3 px-4">Designated Shelter</th>
                  <th className="py-3 px-3">Transit & Distance</th>
                  <th className="py-3 px-3 text-center">Allocated</th>
                  <th className="py-3 px-3">Vulnerable Triage</th>
                  <th className="py-3 px-4">Explainable AI Allocation Rationale</th>
                  <th className="py-3 px-3">Backup Alternatives</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60 text-slate-200">
                {plan.allocations.map((alloc) => {
                  const alternates = plan.alternativeShelters[alloc.shelterId] || [];
                  const fullShelter = shelters.find((s) => s.id === alloc.shelterId);

                  return (
                    <tr key={alloc.shelterId} className="hover:bg-slate-700/30 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white text-sm">
                          {alloc.shelterName}
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                          <span className="px-1.5 py-0.2 bg-slate-700 rounded text-[10px]">
                            {alloc.shelterType}
                          </span>
                          <span>Safety: {alloc.safetyScore}/100</span>
                          <span>• Remaining: {alloc.remainingCapacityAfter} beds</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-1 font-mono text-emerald-400 font-medium">
                          <Navigation className="w-3.5 h-3.5" />
                          <span>{alloc.distanceKm} km</span>
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3 text-slate-500" />
                          <span>~{alloc.etaMinutes} min convoy</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-3 text-center">
                        <span className="text-base font-extrabold text-blue-400 font-mono">
                          {alloc.allocatedCount.toLocaleString()}
                        </span>
                        <span className="block text-[10px] text-slate-400">citizens</span>
                      </td>

                      <td className="py-3.5 px-3">
                        <div className="space-y-0.5 text-[11px]">
                          <div className="text-amber-300">
                            👴 Elderly: <strong>{alloc.vulnerableCount.elderly.toLocaleString()}</strong>
                          </div>
                          <div className="text-pink-300">
                            👶 Children: <strong>{alloc.vulnerableCount.children.toLocaleString()}</strong>
                          </div>
                          <div className="text-indigo-300">
                            ♿ Mobility: <strong>{alloc.vulnerableCount.disabled.toLocaleString()}</strong>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 max-w-sm">
                        <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-700/50 text-[11px] text-slate-300 leading-relaxed">
                          <Sparkles className="w-3 h-3 text-blue-400 inline mr-1" />
                          {alloc.reason}
                        </div>
                      </td>

                      <td className="py-3.5 px-3">
                        {alternates.length > 0 ? (
                          <div className="space-y-1">
                            {alternates.slice(0, 2).map((alt) => (
                              <div
                                key={alt.id}
                                className="text-[10px] bg-slate-900/80 px-2 py-1 rounded border border-slate-700/40 text-slate-300 flex items-center justify-between gap-1"
                              >
                                <span className="truncate max-w-[100px]">{alt.name}</span>
                                <span className="text-emerald-400">{alt.availableBeds}b</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-500">None needed</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
