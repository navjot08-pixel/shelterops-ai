/// <reference types="google.maps" />
import React, { useState, useEffect, useRef } from 'react';
import {
  Map,
  AdvancedMarker,
  InfoWindow,
  useMap,
} from '@vis.gl/react-google-maps';
import { Disaster, Shelter, EvacuationRoute, IndianState } from '../types';
import {
  AlertTriangle,
  Home,
  Shield,
  Layers,
  MapPin,
  Compass,
  Maximize2,
  Minimize2,
  Navigation,
  Wind,
  Droplets,
  Radio,
  ExternalLink,
  Users,
  Activity,
} from 'lucide-react';

interface GoogleMapsViewProps {
  disasters: Disaster[];
  shelters: Shelter[];
  routes: EvacuationRoute[];
  selectedDisaster: Disaster | null;
  onSelectDisaster: (d: Disaster) => void;
  selectedShelter: Shelter | null;
  onSelectShelter: (s: Shelter | null) => void;
  selectedState: IndianState | null;
  onSelectState: (s: IndianState) => void;
  allStates: IndianState[];
  onTriggerAllocation: (d: Disaster) => void;
}

// Inner component that manages circles and route polylines on the Google Map instance
function MapOverlays({
  disasters,
  routes,
  selectedDisaster,
  showExclusionZones,
  showRoutes,
}: {
  disasters: Disaster[];
  routes: EvacuationRoute[];
  selectedDisaster: Disaster | null;
  showExclusionZones: boolean;
  showRoutes: boolean;
}) {
  const map = useMap();
  const circlesRef = useRef<google.maps.Circle[]>([]);
  const polylinesRef = useRef<google.maps.Polyline[]>([]);

  // Render exclusion zone circles
  useEffect(() => {
    if (!map) return;

    // Clean up previous circles
    circlesRef.current.forEach((c) => c.setMap(null));
    circlesRef.current = [];

    if (!showExclusionZones) return;

    disasters.forEach((d) => {
      const isSelected = selectedDisaster?.id === d.id;
      const color =
        d.severity === 'Critical'
          ? '#EF4444'
          : d.severity === 'High'
          ? '#F97316'
          : d.severity === 'Moderate'
          ? '#EAB308'
          : '#10B981';

      // Inner high-hazard exclusion circle
      const circle = new google.maps.Circle({
        strokeColor: color,
        strokeOpacity: 0.85,
        strokeWeight: isSelected ? 3 : 1.5,
        fillColor: color,
        fillOpacity: isSelected ? 0.22 : 0.12,
        map,
        center: { lat: d.location.lat, lng: d.location.lng },
        radius: d.exclusionRadiusKm * 1000,
        zIndex: isSelected ? 10 : 2,
      });

      circlesRef.current.push(circle);
    });

    return () => {
      circlesRef.current.forEach((c) => c.setMap(null));
      circlesRef.current = [];
    };
  }, [map, disasters, selectedDisaster, showExclusionZones]);

  // Render evacuation route polylines
  useEffect(() => {
    if (!map) return;

    polylinesRef.current.forEach((p) => p.setMap(null));
    polylinesRef.current = [];

    if (!showRoutes) return;

    routes.forEach((r) => {
      const isBlocked = r.status === 'Blocked';
      const isSafest = r.status === 'Safest';

      const strokeColor = isBlocked ? '#DC2626' : isSafest ? '#10B981' : '#3B82F6';
      const polyline = new google.maps.Polyline({
        path: r.path,
        geodesic: true,
        strokeColor,
        strokeOpacity: isBlocked ? 0.9 : 0.85,
        strokeWeight: isSafest ? 4 : isBlocked ? 3 : 3,
        map,
        zIndex: isSafest ? 20 : isBlocked ? 25 : 15,
        icons: isBlocked
          ? [
              {
                icon: { path: 'M 0,-1 0,1', strokeOpacity: 1, scale: 3 },
                offset: '0',
                repeat: '15px',
              },
            ]
          : undefined,
      });

      polylinesRef.current.push(polyline);
    });

    return () => {
      polylinesRef.current.forEach((p) => p.setMap(null));
      polylinesRef.current = [];
    };
  }, [map, routes, showRoutes]);

  return null;
}

// Inner component to pan and zoom smoothly when a state or disaster is selected
function MapController({
  selectedDisaster,
  selectedState,
}: {
  selectedDisaster: Disaster | null;
  selectedState: IndianState | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    if (selectedDisaster) {
      map.panTo({
        lat: selectedDisaster.location.lat,
        lng: selectedDisaster.location.lng,
      });
      map.setZoom(9);
    } else if (selectedState) {
      map.panTo({
        lat: selectedState.lat,
        lng: selectedState.lng,
      });
      map.setZoom(selectedState.zoom);
    }
  }, [map, selectedDisaster, selectedState]);

  return null;
}

export const GoogleMapsView: React.FC<GoogleMapsViewProps> = ({
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
  onTriggerAllocation,
}) => {
  const [showDisasters, setShowDisasters] = useState(true);
  const [showShelters, setShowShelters] = useState(true);
  const [showExclusionZones, setShowExclusionZones] = useState(true);
  const [showRoutes, setShowRoutes] = useState(true);
  const [mapType, setMapType] = useState<'roadmap' | 'satellite' | 'hybrid' | 'terrain'>('roadmap');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return 'bg-red-900/80 text-red-200 border-red-700';
      case 'High':
        return 'bg-amber-900/80 text-amber-200 border-amber-700';
      case 'Moderate':
        return 'bg-yellow-900/80 text-yellow-200 border-yellow-700';
      default:
        return 'bg-emerald-900/80 text-emerald-200 border-emerald-700';
    }
  };

  const getDisasterIconSymbol = (type: string) => {
    switch (type) {
      case 'flood':
        return '🌊';
      case 'cyclone':
        return '🌀';
      case 'earthquake':
        return '⚡';
      case 'landslide':
        return '⛰️';
      case 'drought':
        return '☀️';
      case 'forest_fire':
        return '🔥';
      default:
        return '⚠️';
    }
  };

  return (
    <div className={`relative w-full rounded-2xl overflow-hidden border border-slate-700/80 shadow-2xl bg-slate-900 ${isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'h-[640px]'}`}>
      {/* Top Map Control Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-2.5 pointer-events-none">
        {/* Left: State quick switcher */}
        <div className="flex items-center gap-2 pointer-events-auto bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/80 shadow-lg">
          <MapPin className="w-4 h-4 text-emerald-400" />
          <select
            className="bg-transparent text-xs font-medium text-slate-100 focus:outline-none cursor-pointer pr-2"
            value={selectedState?.code || ''}
            onChange={(e) => {
              const st = allStates.find((s) => s.code === e.target.value);
              if (st) onSelectState(st);
            }}
          >
            <option value="" className="bg-slate-900 text-slate-300">
              🇮🇳 Entire India (Overview)
            </option>
            <optgroup label="States with Active Alerts" className="bg-slate-900 text-amber-300 font-semibold">
              {allStates
                .filter((s) => s.activeDisasters > 0)
                .map((s) => (
                  <option key={s.code} value={s.code} className="bg-slate-900 text-slate-100">
                    {s.name} ({s.activeDisasters} active)
                  </option>
                ))}
            </optgroup>
            <optgroup label="All States & UTs" className="bg-slate-900 text-slate-400">
              {allStates.map((s) => (
                <option key={s.code} value={s.code} className="bg-slate-900 text-slate-100">
                  {s.name} ({s.capital})
                </option>
              ))}
            </optgroup>
          </select>
        </div>

        {/* Right: Layer Toggles & Map controls */}
        <div className="flex items-center gap-1.5 pointer-events-auto bg-slate-900/90 backdrop-blur-md p-1 rounded-xl border border-slate-700/80 shadow-lg">
          <button
            onClick={() => setShowDisasters(!showDisasters)}
            className={`px-2.5 py-1 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors ${
              showDisasters
                ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle Hazards"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
            <span className="hidden sm:inline">Hazards</span>
          </button>

          <button
            onClick={() => setShowShelters(!showShelters)}
            className={`px-2.5 py-1 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors ${
              showShelters
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle Shelters"
          >
            <Home className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Shelters</span>
          </button>

          <button
            onClick={() => setShowExclusionZones(!showExclusionZones)}
            className={`px-2.5 py-1 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors ${
              showExclusionZones
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle Exclusion Zones"
          >
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Exclusion</span>
          </button>

          <button
            onClick={() => setShowRoutes(!showRoutes)}
            className={`px-2.5 py-1 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors ${
              showRoutes
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle Evacuation Routes"
          >
            <Navigation className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">Routes</span>
          </button>

          <div className="w-px h-4 bg-slate-700 mx-0.5" />

          {/* Map style toggle */}
          <button
            onClick={() => setMapType(mapType === 'roadmap' ? 'hybrid' : mapType === 'hybrid' ? 'terrain' : 'roadmap')}
            className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            title={`View: ${mapType.toUpperCase()}`}
          >
            <Layers className="w-3.5 h-3.5" />
          </button>

          {/* Fullscreen toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Map'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Map Legend (Bottom Left) */}
      <div className="absolute bottom-4 left-4 z-20 pointer-events-auto bg-slate-950/85 backdrop-blur-md p-3 rounded-xl border border-slate-700/80 shadow-xl text-xs space-y-1.5 max-w-[240px]">
        <div className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider flex items-center justify-between">
          <span>Map Telemetry</span>
          <span className="text-emerald-400 text-[10px] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live
          </span>
        </div>
        <div className="flex items-center gap-2 text-slate-300">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 ring-2 ring-red-500/30 animate-ping" />
          <span>Critical Disaster (Exclusion Zone)</span>
        </div>
        <div className="flex items-center gap-2 text-slate-300">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span>Shelter Available ({'>'}500 beds)</span>
        </div>
        <div className="flex items-center gap-2 text-slate-300">
          <span className="w-4 h-0.5 bg-emerald-400 rounded" />
          <span>Safest Evacuation Corridor</span>
        </div>
        <div className="flex items-center gap-2 text-slate-300">
          <span className="w-4 h-0.5 border-t border-dashed border-red-500" />
          <span>Blocked Highway (Hazard)</span>
        </div>
      </div>

      {/* Main Google Map Canvas */}
      <Map
        mapId="DEMO_MAP_ID"
        internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
        style={{ width: '100%', height: '100%' }}
        defaultCenter={{ lat: 22.9734, lng: 79.6569 }}
        defaultZoom={5}
        mapTypeId={mapType}
        gestureHandling="greedy"
        disableDefaultUI={false}
        zoomControl={true}
        streetViewControl={false}
        mapTypeControl={false}
      >
        <MapOverlays
          disasters={disasters}
          routes={routes}
          selectedDisaster={selectedDisaster}
          showExclusionZones={showExclusionZones}
          showRoutes={showRoutes}
        />
        <MapController
          selectedDisaster={selectedDisaster}
          selectedState={selectedState}
        />

        {/* Disaster Advanced Markers */}
        {showDisasters &&
          disasters.map((d) => {
            const isSelected = selectedDisaster?.id === d.id;
            return (
              <AdvancedMarker
                key={d.id}
                position={{ lat: d.location.lat, lng: d.location.lng }}
                onClick={() => {
                  onSelectDisaster(d);
                  onSelectShelter(null);
                }}
              >
                <div className="relative group cursor-pointer">
                  {/* Pulsing ring for critical/high disasters */}
                  {(d.severity === 'Critical' || d.severity === 'High') && (
                    <span
                      className={`absolute -inset-2 rounded-full animate-ping opacity-75 ${
                        d.severity === 'Critical' ? 'bg-red-500' : 'bg-amber-500'
                      }`}
                    />
                  )}
                  <div
                    className={`relative flex items-center justify-center w-8 h-8 rounded-full shadow-lg border-2 text-base transition-transform group-hover:scale-125 ${
                      d.severity === 'Critical'
                        ? 'bg-red-600 border-white text-white shadow-red-500/50'
                        : d.severity === 'High'
                        ? 'bg-amber-600 border-white text-white shadow-amber-500/50'
                        : d.severity === 'Moderate'
                        ? 'bg-yellow-500 border-white text-slate-900 shadow-yellow-500/50'
                        : 'bg-emerald-600 border-white text-white'
                    } ${isSelected ? 'scale-125 ring-4 ring-red-400' : ''}`}
                  >
                    <span>{getDisasterIconSymbol(d.type)}</span>
                  </div>
                </div>
              </AdvancedMarker>
            );
          })}

        {/* Shelter Advanced Markers */}
        {showShelters &&
          shelters.map((s) => {
            const isSelected = selectedShelter?.id === s.id;
            const isFullOrHazard = s.status === 'Full' || s.status === 'In Hazard Zone';
            const isNearCap = s.status === 'Near Capacity' || s.availableBeds < 300;

            return (
              <AdvancedMarker
                key={s.id}
                position={{ lat: s.location.lat, lng: s.location.lng }}
                onClick={() => {
                  onSelectShelter(s);
                }}
              >
                <div className="relative group cursor-pointer">
                  <div
                    className={`flex items-center gap-1 px-1.5 py-1 rounded-full shadow-md border text-[11px] font-bold text-white transition-transform group-hover:scale-125 ${
                      isFullOrHazard
                        ? 'bg-slate-700 border-slate-500 opacity-70'
                        : isNearCap
                        ? 'bg-amber-600 border-amber-300'
                        : 'bg-emerald-600 border-emerald-300 shadow-emerald-500/40'
                    } ${isSelected ? 'scale-125 ring-4 ring-emerald-400' : ''}`}
                  >
                    <Home className="w-3 h-3" />
                    <span>{s.availableBeds.toLocaleString()}</span>
                  </div>
                </div>
              </AdvancedMarker>
            );
          })}

        {/* Disaster InfoWindow */}
        {selectedDisaster && (
          <InfoWindow
            position={{
              lat: selectedDisaster.location.lat,
              lng: selectedDisaster.location.lng,
            }}
            onCloseClick={() => onSelectDisaster(selectedDisaster)}
          >
            <div className="p-2.5 max-w-xs text-slate-900 font-sans">
              <div className="flex items-center justify-between gap-2 border-b border-slate-200 pb-2 mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-xl">{getDisasterIconSymbol(selectedDisaster.type)}</span>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 leading-tight">
                      {selectedDisaster.name}
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      {selectedDisaster.location.district}, {selectedDisaster.location.state}
                    </p>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getSeverityBadge(selectedDisaster.severity)}`}>
                  {selectedDisaster.severity}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-1.5 text-xs mb-2.5">
                <div className="bg-slate-100 p-1.5 rounded">
                  <span className="text-[10px] text-slate-500 block">Affected Pop</span>
                  <span className="font-bold text-slate-800">{selectedDisaster.affectedPopulation.toLocaleString()}</span>
                </div>
                <div className="bg-slate-100 p-1.5 rounded">
                  <span className="text-[10px] text-slate-500 block">Probability</span>
                  <span className="font-bold text-slate-800">{selectedDisaster.probability}% ({selectedDisaster.confidence}% Conf)</span>
                </div>
                {selectedDisaster.metrics.rainfall_mm_24h && (
                  <div className="bg-blue-50 p-1.5 rounded col-span-2 flex items-center justify-between text-blue-900">
                    <span className="text-[10px] flex items-center gap-1">
                      <Droplets className="w-3 h-3" /> Rainfall 24h
                    </span>
                    <span className="font-bold">{selectedDisaster.metrics.rainfall_mm_24h} mm</span>
                  </div>
                )}
                {selectedDisaster.metrics.seismicMagnitude && (
                  <div className="bg-red-50 p-1.5 rounded col-span-2 flex items-center justify-between text-red-900">
                    <span className="text-[10px] flex items-center gap-1">
                      <Activity className="w-3 h-3" /> Richter Scale
                    </span>
                    <span className="font-bold">{selectedDisaster.metrics.seismicMagnitude} Magnitude</span>
                  </div>
                )}
              </div>

              <div className="text-[11px] text-slate-600 mb-3 bg-amber-50 border border-amber-200 p-1.5 rounded">
                <strong>Exclusion Radius:</strong> {selectedDisaster.exclusionRadiusKm} km safe perimeter mandatory
              </div>

              <button
                onClick={() => onTriggerAllocation(selectedDisaster)}
                className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded-lg shadow flex items-center justify-center gap-1.5 transition-colors"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Run Shelter Allocation Engine</span>
              </button>
            </div>
          </InfoWindow>
        )}

        {/* Shelter InfoWindow */}
        {selectedShelter && (
          <InfoWindow
            position={{
              lat: selectedShelter.location.lat,
              lng: selectedShelter.location.lng,
            }}
            onCloseClick={() => onSelectShelter(null)}
          >
            <div className="p-2.5 max-w-xs text-slate-900 font-sans">
              <div className="flex items-center justify-between gap-2 border-b border-slate-200 pb-2 mb-2">
                <div className="flex items-center gap-1.5">
                  <div className="p-1 rounded bg-emerald-100 text-emerald-800">
                    <Home className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 leading-tight">
                      {selectedShelter.name}
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      {selectedShelter.type} • {selectedShelter.location.district}
                    </p>
                  </div>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    selectedShelter.status === 'Available'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {selectedShelter.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-1.5 text-xs mb-2">
                <div className="bg-slate-100 p-1.5 rounded">
                  <span className="text-[10px] text-slate-500 block">Available Beds</span>
                  <span className="font-bold text-emerald-700">{selectedShelter.availableBeds.toLocaleString()} / {selectedShelter.capacity.toLocaleString()}</span>
                </div>
                <div className="bg-slate-100 p-1.5 rounded">
                  <span className="text-[10px] text-slate-500 block">Safety Score</span>
                  <span className="font-bold text-slate-800">{selectedShelter.safetyScore}/100</span>
                </div>
                <div className="bg-slate-100 p-1.5 rounded">
                  <span className="text-[10px] text-slate-500 block">Food/Water</span>
                  <span className="font-bold text-slate-800">{selectedShelter.foodWaterDays} Days Stock</span>
                </div>
                <div className="bg-slate-100 p-1.5 rounded">
                  <span className="text-[10px] text-slate-500 block">DG Generator</span>
                  <span className="font-bold text-slate-800">{selectedShelter.electricityBackup ? '✅ Installed' : '❌ None'}</span>
                </div>
              </div>

              {selectedShelter.medicalFacilities.length > 0 && (
                <div className="text-[11px] text-slate-600 mb-2">
                  <span className="font-semibold text-slate-700">Medical:</span>{' '}
                  {selectedShelter.medicalFacilities.join(', ')}
                </div>
              )}

              <div className="text-[11px] bg-slate-50 border border-slate-200 p-1.5 rounded text-slate-600">
                <strong>Contact:</strong> {selectedShelter.contactPerson} ({selectedShelter.contactPhone})
              </div>
            </div>
          </InfoWindow>
        )}
      </Map>
    </div>
  );
};
