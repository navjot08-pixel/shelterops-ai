import React from 'react';
import { Disaster, Shelter, EvacuationRoute, AllocationPlan, IndianState } from '../types';
import { RealtimeWeather } from '../utils/weatherService';
import { GoogleMapsView } from './GoogleMapsView';
import {
  AlertTriangle,
  Home,
  Users,
  ShieldAlert,
  Compass,
  Navigation,
  CloudLightning,
  Sparkles,
  Droplets,
  Package,
  Activity,
  ArrowRight,
  TrendingUp,
  MessageSquare,
  Radio,
  Zap,
} from 'lucide-react';

interface DashboardOverviewProps {
  disasters: Disaster[];
  shelters: Shelter[];
  routes: EvacuationRoute[];
  selectedDisaster: Disaster;
  onSelectDisaster: (d: Disaster) => void;
  selectedShelter: Shelter | null;
  onSelectShelter: (s: Shelter | null) => void;
  selectedState: IndianState | null;
  onSelectState: (s: IndianState) => void;
  allStates: IndianState[];
  allocationPlan: AllocationPlan | null;
  onTriggerAllocation: (d: Disaster) => void;
  onNavigateTab: (tab: any) => void;
  onOpenChatModal: () => void;
  liveWeather: RealtimeWeather | null;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  disasters,
  shelters,
  routes,
  selectedDisaster,
  onSelectDisaster,
  selectedShelter,
  onSelectShelter,
  selectedState,
  onSelectState,
  allStates,
  allocationPlan,
  onTriggerAllocation,
  onNavigateTab,
  onOpenChatModal,
  liveWeather,
}) => {
  // Aggregate statistics across India
  const totalPredictedEvents = disasters.length;
  const criticalDistrictsCount = disasters.filter((d) => d.severity === 'Critical' || d.severity === 'High').length;
  const totalAffectedPop = disasters.reduce((acc, d) => acc + d.affectedPopulation, 0);
  const totalShelterCapacity = shelters.reduce((acc, s) => acc + s.capacity, 0);
  const totalShelterOccupancy = shelters.reduce((acc, s) => acc + s.currentOccupancy, 0);
  const totalAvailableBeds = shelters.reduce((acc, s) => acc + s.availableBeds, 0);
  const totalWaterBuffer = shelters.reduce((acc, s) => acc + s.drinkingWaterLiters, 0);

  const scenarioPresets = [
    { id: 'disaster-assam-flood', label: '🌊 Assam Floods (Brahmaputra)', stateCode: 'AS' },
    { id: 'disaster-odisha-cyclone', label: '🌀 Odisha Cyclone (Dana)', stateCode: 'OD' },
    { id: 'disaster-uttarakhand-quake', label: '⚡ Uttarakhand Quake (Chamoli)', stateCode: 'UK' },
    { id: 'disaster-himachal-landslide', label: '⛰️ Himachal Landslide (Mandi)', stateCode: 'HP' },
    { id: 'disaster-punjab-flood', label: '💧 Punjab Floods (Sutlej-Beas)', stateCode: 'PB' },
  ];

  return (
    <div className="space-y-6">
      {/* Simulation Scenario Switcher Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Zap className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Demonstration Simulation Scenarios
              </h3>
              <p className="text-[11px] text-slate-400">
                Select an active disaster hotspot to inspect prediction horizons and run shelter allocation:
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {scenarioPresets.map((sc) => {
              const isActive = selectedDisaster.id === sc.id;
              return (
                <button
                  key={sc.id}
                  onClick={() => {
                    const match = disasters.find((d) => d.id === sc.id);
                    if (match) {
                      onSelectDisaster(match);
                      const st = allStates.find((s) => s.code === sc.stateCode);
                      if (st) onSelectState(st);
                    }
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-500/25 border border-blue-400'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/80'
                  }`}
                >
                  {sc.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top Command Center KPI Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 shadow-lg backdrop-blur-md">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Active Events</span>
            <AlertTriangle className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">{totalPredictedEvents}</div>
          <span className="text-[10px] text-red-300 font-medium">
            {criticalDistrictsCount} Critical / High Zones
          </span>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 shadow-lg backdrop-blur-md">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Affected Population</span>
            <Users className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400 font-mono">
            {totalAffectedPop.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-400">Total at-risk across India</span>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 shadow-lg backdrop-blur-md">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Available Beds</span>
            <Home className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400 font-mono">
            {totalAvailableBeds.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-400">
            {Math.round((totalAvailableBeds / totalShelterCapacity) * 100)}% beds unallocated
          </span>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 shadow-lg backdrop-blur-md">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Current Allocation</span>
            <Compass className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-blue-400 font-mono">
            {allocationPlan ? allocationPlan.totalAllocated.toLocaleString() : 'Ready'}
          </div>
          <span className="text-[10px] text-slate-400">
            {allocationPlan ? `${allocationPlan.efficiencyScore}% matched` : 'Click Run Allocation'}
          </span>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 shadow-lg backdrop-blur-md">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Potable Water Buffer</span>
            <Droplets className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-cyan-400 font-mono">
            {(totalWaterBuffer / 1000).toFixed(0)}k L
          </div>
          <span className="text-[10px] text-slate-400">Safe drinking water</span>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 shadow-lg backdrop-blur-md">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Backup Power</span>
            <Zap className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-purple-400 font-mono">
            100% DG
          </div>
          <span className="text-[10px] text-slate-400">72h fuel reserve verified</span>
        </div>
      </div>

      {/* Central Interactive Google Maps Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              India Geospatial Command Center • Interactive Google Map
            </h3>
          </div>
          <span className="text-xs text-slate-400 hidden sm:inline">
            Zoom, click hazard markers or shelters for deep triage metrics.
          </span>
        </div>

        <GoogleMapsView
          disasters={disasters}
          shelters={shelters}
          routes={routes}
          selectedDisaster={selectedDisaster}
          onSelectDisaster={onSelectDisaster}
          selectedShelter={selectedShelter}
          onSelectShelter={onSelectShelter}
          selectedState={selectedState}
          onSelectState={onSelectState}
          allStates={allStates}
          onTriggerAllocation={onTriggerAllocation}
        />
      </div>

      {/* Two Column Layout: Selected Scenario Focus & Live Incident Alert Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Selected Hazard Tactical Focus Card */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-xl backdrop-blur-md space-y-4 lg:col-span-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-700/60 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl">
                  {selectedDisaster.type === 'flood'
                    ? '🌊'
                    : selectedDisaster.type === 'cyclone'
                    ? '🌀'
                    : selectedDisaster.type === 'earthquake'
                    ? '⚡'
                    : selectedDisaster.type === 'landslide'
                    ? '⛰️'
                    : '☀️'}
                </span>
                <h4 className="text-base font-bold text-white">{selectedDisaster.name}</h4>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {selectedDisaster.location.district}, {selectedDisaster.location.state} • {selectedDisaster.status}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-1 rounded-full bg-red-950/80 text-red-300 border border-red-700 font-bold">
                {selectedDisaster.severity} Risk ({selectedDisaster.probability}%)
              </span>
              <button
                onClick={() => onTriggerAllocation(selectedDisaster)}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl shadow flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Allocate Shelters</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-700/60">
              <span className="text-[10px] text-slate-400 block">Affected Population</span>
              <span className="text-lg font-black text-white font-mono">
                {selectedDisaster.affectedPopulation.toLocaleString()}
              </span>
            </div>

            <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-700/60">
              <span className="text-[10px] text-slate-400 block">High-Risk Vulnerable</span>
              <span className="text-lg font-black text-amber-400 font-mono">
                {(
                  selectedDisaster.vulnerableDemographics.elderly +
                  selectedDisaster.vulnerableDemographics.disabled +
                  selectedDisaster.vulnerableDemographics.children
                ).toLocaleString()}
              </span>
            </div>

            <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-700/60">
              <span className="text-[10px] text-slate-400 block">Safe Exclusion Radius</span>
              <span className="text-lg font-black text-red-400 font-mono">
                {selectedDisaster.exclusionRadiusKm} km
              </span>
            </div>

            <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-700/60">
              <span className="text-[10px] text-slate-400 block">Live Precipitation</span>
              <span className="text-lg font-black text-blue-400 font-mono">
                {liveWeather ? `${liveWeather.precipitationMm} mm/h` : '18 mm/h'}
              </span>
            </div>
          </div>

          {/* Contributing Factors & Actions */}
          <div className="space-y-2 text-xs">
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
              Contributing Hazard Factors
            </span>
            <div className="space-y-1 text-slate-300 text-[11px]">
              {selectedDisaster.contributingFactors.slice(0, 3).map((f, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Action Navigation Buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-700/60">
            <button
              onClick={() => onNavigateTab('predictions')}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-700 text-slate-200 text-xs rounded-xl border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <CloudLightning className="w-3.5 h-3.5 text-indigo-400" />
              <span>Multi-Horizon Forecasts</span>
            </button>
            <button
              onClick={() => onNavigateTab('routes')}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-700 text-slate-200 text-xs rounded-xl border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Navigation className="w-3.5 h-3.5 text-emerald-400" />
              <span>Evacuation Corridors</span>
            </button>
            <button
              onClick={() => onNavigateTab('agents')}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-700 text-slate-200 text-xs rounded-xl border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Users className="w-3.5 h-3.5 text-cyan-400" />
              <span>6 Response Agents</span>
            </button>
            <button
              onClick={onOpenChatModal}
              className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer ml-auto"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Broadcast Bulletin</span>
            </button>
          </div>
        </div>

        {/* Live National Incident & Alert Feed */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-xl backdrop-blur-md space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-700/60 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-red-400 animate-pulse" />
                <h4 className="text-sm font-bold text-white">Live Incident Feed (NDMA)</h4>
              </div>
              <span className="text-[10px] text-emerald-400 font-mono">LIVE FEED</span>
            </div>

            <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1 text-xs">
              <div className="bg-red-950/40 border border-red-800/60 p-2.5 rounded-xl text-red-200 space-y-1">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-bold text-red-300 uppercase">Flash Alert • Assam</span>
                  <span className="text-slate-400 font-mono">04:22 IST</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Brahmaputra water level breached 52.4m at Lahorighat. Mandatory evacuation order active.
                </p>
              </div>

              <div className="bg-amber-950/40 border border-amber-800/60 p-2.5 rounded-xl text-amber-200 space-y-1">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-bold text-amber-300 uppercase">Cyclone Warning • Odisha</span>
                  <span className="text-slate-400 font-mono">04:05 IST</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Cyclone Dana center tracked 180km SE of Paradip. Coastal squall speeds exceeding 110 km/h.
                </p>
              </div>

              <div className="bg-slate-900/60 border border-slate-700/60 p-2.5 rounded-xl text-slate-300 space-y-1">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-bold text-blue-300 uppercase">Highway Bulletin • NH-37</span>
                  <span className="text-slate-400 font-mono">03:48 IST</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Connector road near Mayong submerged under 1.8m backflow. Convoys diverted to Elevated SH-715A.
                </p>
              </div>

              <div className="bg-slate-900/60 border border-slate-700/60 p-2.5 rounded-xl text-slate-300 space-y-1">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-bold text-emerald-300 uppercase">Shelter Status • Nagaon</span>
                  <span className="text-slate-400 font-mono">03:30 IST</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Nagaon Indoor Stadium confirms 2,350 available beds with Level-2 medical triage readiness.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-700/60 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Sources: IMD • CWC • NDMA</span>
            <span className="text-emerald-400 font-mono">Latency: 14ms</span>
          </div>
        </div>
      </div>
    </div>
  );
};
