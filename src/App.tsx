import React, { useState, useEffect, useCallback } from 'react';
import { APIProvider } from '@vis.gl/react-google-maps';
import firebaseConfig from '../firebase-applet-config.json';
import {
  INDIAN_STATES_AND_UTS,
  INITIAL_DISASTERS,
  ALL_SHELTERS,
  EVACUATION_ROUTES,
  AI_AGENTS,
} from './data/indiaData';
import {
  Disaster,
  Shelter,
  EvacuationRoute,
  AllocationPlan,
  IndianState,
} from './types';
import { solveShelterAllocation } from './utils/allocationEngine';
import { fetchLiveWeather, RealtimeWeather } from './utils/weatherService';
import { evaluateDynamicDisasterRisk, DynamicPredictionResult } from './utils/predictionEngine';
import { initAuth } from './utils/firebaseAuth';
import { User } from 'firebase/auth';

import { Navbar, ActiveTab } from './components/Navbar';
import { DashboardOverview } from './components/DashboardOverview';
import { GoogleMapsView } from './components/GoogleMapsView';
import { SmartAllocationView } from './components/SmartAllocationView';
import { AIPredictionView } from './components/AIPredictionView';
import { MultiAgentView } from './components/MultiAgentView';
import { EvacuationRoutesView } from './components/EvacuationRoutesView';
import { AIParadigmsView } from './components/AIParadigmsView';
import { GoogleChatModal } from './components/GoogleChatModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [disasters, setDisasters] = useState<Disaster[]>(INITIAL_DISASTERS);
  const [shelters, setShelters] = useState<Shelter[]>(ALL_SHELTERS);
  const [routes, setRoutes] = useState<EvacuationRoute[]>(EVACUATION_ROUTES);
  const [selectedDisaster, setSelectedDisaster] = useState<Disaster>(INITIAL_DISASTERS[0]);
  const [selectedShelter, setSelectedShelter] = useState<Shelter | null>(null);
  const [selectedState, setSelectedState] = useState<IndianState | null>(
    INDIAN_STATES_AND_UTS.find((s) => s.code === 'AS') || null
  );

  const [allocationPlan, setAllocationPlan] = useState<AllocationPlan | null>(null);
  const [liveWeather, setLiveWeather] = useState<RealtimeWeather | null>(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);
  const [predictionResult, setPredictionResult] = useState<DynamicPredictionResult | null>(null);

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [gmpQuotaExceeded, setGmpQuotaExceeded] = useState(false);

  // Maps API Key from environment or provisioned config
  const mapsApiKey = (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY || (firebaseConfig as any).apiKey || '';

  // Listen for Google Maps Quota Defense event
  useEffect(() => {
    const handleQuotaExceeded = () => setGmpQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', handleQuotaExceeded);
    return () => window.removeEventListener('gmp-quota-exceeded', handleQuotaExceeded);
  }, []);

  // Initialize Firebase Auth listener for Google Workspace Chat
  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setCurrentUser(user);
        setAuthToken(token);
      },
      () => {
        setCurrentUser(null);
        setAuthToken(null);
      }
    );
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  // Compute Shelter Allocation for selected disaster
  const runAllocation = useCallback(
    (disasterToAllocate: Disaster, overridePop?: number) => {
      const plan = solveShelterAllocation(disasterToAllocate, shelters, overridePop);
      setAllocationPlan(plan);
    },
    [shelters]
  );

  // Fetch real-time weather feed when disaster changes
  const refreshWeatherForDisaster = useCallback(async (d: Disaster) => {
    setIsLoadingWeather(true);
    try {
      const weather = await fetchLiveWeather(
        d.location.lat,
        d.location.lng,
        `${d.location.district}, ${d.location.state}`
      );
      setLiveWeather(weather);
      const prediction = evaluateDynamicDisasterRisk(d, weather);
      setPredictionResult(prediction);
    } catch (err) {
      console.error('Weather load error:', err);
    } finally {
      setIsLoadingWeather(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    runAllocation(selectedDisaster);
    refreshWeatherForDisaster(selectedDisaster);
  }, [selectedDisaster, runAllocation, refreshWeatherForDisaster]);

  const handleSelectDisaster = (d: Disaster) => {
    setSelectedDisaster(d);
    runAllocation(d);
    refreshWeatherForDisaster(d);
    const matchedState = INDIAN_STATES_AND_UTS.find(
      (s) => s.name.toLowerCase() === d.location.state.toLowerCase()
    );
    if (matchedState) setSelectedState(matchedState);
  };

  const handleSelectState = (stateObj: IndianState) => {
    setSelectedState(stateObj);
    const disasterInState = disasters.find(
      (d) => d.location.state.toLowerCase() === stateObj.name.toLowerCase()
    );
    if (disasterInState) {
      setSelectedDisaster(disasterInState);
      runAllocation(disasterInState);
      refreshWeatherForDisaster(disasterInState);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-500 selection:text-white">
      {/* Google Maps Quota Reached Banner (Required by Google Maps Platform guidelines) */}
      {gmpQuotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}

      {/* Main Top Navbar */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenChatModal={() => setIsChatModalOpen(true)}
        currentUser={currentUser}
        activeDisastersCount={disasters.length}
      />

      {/* Wrapped in Google Maps APIProvider */}
      <APIProvider apiKey={mapsApiKey}>
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
          {activeTab === 'overview' && (
            <DashboardOverview
              disasters={disasters}
              shelters={shelters}
              routes={routes}
              selectedDisaster={selectedDisaster}
              onSelectDisaster={handleSelectDisaster}
              selectedShelter={selectedShelter}
              onSelectShelter={setSelectedShelter}
              selectedState={selectedState}
              onSelectState={handleSelectState}
              allStates={INDIAN_STATES_AND_UTS}
              allocationPlan={allocationPlan}
              onTriggerAllocation={(d) => {
                setActiveTab('allocation');
                runAllocation(d);
              }}
              onNavigateTab={setActiveTab}
              onOpenChatModal={() => setIsChatModalOpen(true)}
              liveWeather={liveWeather}
            />
          )}

          {activeTab === 'map' && (
            <div className="space-y-4">
              <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-white">Full-Screen India Disaster & Shelter Map</h2>
                  <p className="text-xs text-slate-400">
                    Interact directly with Google Maps to explore hazard zones, shelter bed buffers, and evacuation corridors across all 28 states and 8 union territories.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setActiveTab('allocation');
                    runAllocation(selectedDisaster);
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl shadow flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                >
                  <span>Optimize Selected ({selectedDisaster.name})</span>
                </button>
              </div>

              <div className="h-[720px] rounded-2xl overflow-hidden border border-slate-700 shadow-2xl">
                <GoogleMapsView
                  disasters={disasters}
                  shelters={shelters}
                  routes={routes}
                  selectedDisaster={selectedDisaster}
                  onSelectDisaster={handleSelectDisaster}
                  selectedShelter={selectedShelter}
                  onSelectShelter={setSelectedShelter}
                  selectedState={selectedState}
                  onSelectState={handleSelectState}
                  allStates={INDIAN_STATES_AND_UTS}
                  onTriggerAllocation={(d) => {
                    setActiveTab('allocation');
                    runAllocation(d);
                  }}
                />
              </div>
            </div>
          )}

          {activeTab === 'predictions' && predictionResult && (
            <AIPredictionView
              disaster={selectedDisaster}
              prediction={predictionResult}
              liveWeather={liveWeather}
              isLoadingWeather={isLoadingWeather}
              onRefreshWeather={() => refreshWeatherForDisaster(selectedDisaster)}
              shelters={shelters}
            />
          )}

          {activeTab === 'allocation' && (
            <SmartAllocationView
              disaster={selectedDisaster}
              shelters={shelters}
              allocationPlan={allocationPlan}
              onRunAllocation={runAllocation}
              onSelectShelterModal={(s) => setSelectedShelter(s)}
            />
          )}

          {activeTab === 'routes' && (
            <EvacuationRoutesView
              routes={routes}
              disaster={selectedDisaster}
              shelters={shelters}
            />
          )}

          {activeTab === 'agents' && (
            <MultiAgentView
              disaster={selectedDisaster}
              agents={AI_AGENTS}
            />
          )}

          {activeTab === 'paradigms' && (
            <AIParadigmsView />
          )}
        </main>
      </APIProvider>

      {/* Google Chat Modal */}
      <GoogleChatModal
        isOpen={isChatModalOpen}
        onClose={() => setIsChatModalOpen(false)}
        disaster={selectedDisaster}
        allocationPlan={allocationPlan}
        currentUser={currentUser}
        token={authToken}
        onAuthChange={(user, token) => {
          setCurrentUser(user);
          setAuthToken(token);
        }}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">ShelterOps AI</span>
            <span>• National Disaster Prediction & Smart Shelter Allocation System</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>Powered by Google Maps Platform & Gemini AI</span>
            <span>• Open-Meteo Telemetry</span>
            <span>• NDMA Standard Alignment</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
