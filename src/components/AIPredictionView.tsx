import React, { useState } from 'react';
import { Disaster, Shelter } from '../types';
import { DynamicPredictionResult } from '../utils/predictionEngine';
import { RealtimeWeather } from '../utils/weatherService';
import {
  CloudLightning,
  Droplets,
  Wind,
  Compass,
  Thermometer,
  ShieldAlert,
  Sparkles,
  RefreshCw,
  Send,
  Calendar,
  Layers,
  Activity,
  CheckCircle2,
  Info,
  Radio,
  FileText,
} from 'lucide-react';

interface AIPredictionViewProps {
  disaster: Disaster;
  prediction: DynamicPredictionResult;
  liveWeather: RealtimeWeather | null;
  isLoadingWeather: boolean;
  onRefreshWeather: () => void;
  shelters: Shelter[];
}

export const AIPredictionView: React.FC<AIPredictionViewProps> = ({
  disaster,
  prediction,
  liveWeather,
  isLoadingWeather,
  onRefreshWeather,
  shelters,
}) => {
  const [customQuery, setCustomQuery] = useState('');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiReport, setAiReport] = useState<string | null>(null);
  const [aiModelUsed, setAiModelUsed] = useState<string>('gemini-3.8-flash (Thinking: HIGH)');

  const handleGenerateAIStrategy = async (queryText?: string) => {
    setIsGeneratingAI(true);
    try {
      const res = await fetch('/api/gemini/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenario: {
            title: disaster.name,
            state: disaster.location.state,
            district: disaster.location.district,
          },
          disaster,
          affectedPopulation: disaster.affectedPopulation,
          shelters,
          customQuery: queryText || customQuery,
        }),
      });
      const data = await res.json();
      if (data.analysis) {
        setAiReport(data.analysis);
        if (data.model) setAiModelUsed(data.model);
      }
    } catch (err) {
      console.error('Failed to query Gemini Thinking API:', err);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Critical':
        return 'text-red-400 bg-red-950/60 border-red-800';
      case 'High':
        return 'text-amber-400 bg-amber-950/60 border-amber-800';
      case 'Moderate':
        return 'text-yellow-400 bg-yellow-950/60 border-yellow-800';
      default:
        return 'text-emerald-400 bg-emerald-950/60 border-emerald-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Weather Feed & Prediction Summary */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-xl backdrop-blur-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-700/60 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                <CloudLightning className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-white tracking-wide">
                AI Disaster Prediction & Weather Fusion Module
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              Integrates real-time meteorological sensors with CWC river levels, USGS seismic activity, and IMD historical baselines.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`text-xs px-3 py-1.5 rounded-xl border flex items-center gap-1.5 font-semibold ${
                disaster.isSimulated
                  ? 'bg-purple-900/30 text-purple-300 border-purple-700'
                  : 'bg-emerald-900/30 text-emerald-300 border-emerald-700'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>{disaster.isSimulated ? 'Simulated AI Prediction Scenario' : 'Verified Real-Time Sensor Alert'}</span>
            </span>

            <button
              onClick={onRefreshWeather}
              disabled={isLoadingWeather}
              className="px-3.5 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-medium rounded-xl border border-slate-600 shadow flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingWeather ? 'animate-spin' : ''}`} />
              <span>Refresh Weather</span>
            </button>
          </div>
        </div>

        {/* Live Weather Telemetry Grid */}
        <div className="pt-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Droplets className="w-3.5 h-3.5 text-blue-400" />
              <span>Live Meteorological Telemetry: {liveWeather?.locationName || disaster.location.district}</span>
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">
              Last synced: {liveWeather ? new Date(liveWeather.timestamp).toLocaleTimeString() : 'Connecting...'}
            </span>
          </div>

          {liveWeather ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-700/60">
                <span className="text-[10px] text-slate-400 block mb-1">Temperature</span>
                <div className="text-xl font-black text-amber-400 font-mono">
                  {liveWeather.temperatureC}°C
                </div>
                <span className="text-[10px] text-slate-500">Surface 2m</span>
              </div>

              <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-700/60">
                <span className="text-[10px] text-slate-400 block mb-1">Humidity</span>
                <div className="text-xl font-black text-blue-400 font-mono">
                  {liveWeather.humidityPct}%
                </div>
                <span className="text-[10px] text-slate-500">Dewpoint Saturated</span>
              </div>

              <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-700/60">
                <span className="text-[10px] text-slate-400 block mb-1">Precipitation</span>
                <div className="text-xl font-black text-cyan-400 font-mono">
                  {liveWeather.precipitationMm} mm
                </div>
                <span className="text-[10px] text-slate-500">Hourly Rate</span>
              </div>

              <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-700/60">
                <span className="text-[10px] text-slate-400 block mb-1">Wind Speed</span>
                <div className="text-xl font-black text-indigo-400 font-mono">
                  {liveWeather.windSpeedKmh} km/h
                </div>
                <span className="text-[10px] text-slate-500">Gusts: {liveWeather.windGustsKmh} km/h</span>
              </div>

              <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-700/60">
                <span className="text-[10px] text-slate-400 block mb-1">Pressure</span>
                <div className="text-xl font-black text-slate-300 font-mono">
                  {liveWeather.surfacePressureHpa} hPa
                </div>
                <span className="text-[10px] text-slate-500">Barometric Center</span>
              </div>

              <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-700/60">
                <span className="text-[10px] text-slate-400 block mb-1">Sky Condition</span>
                <div className="text-xs font-bold text-emerald-400 line-clamp-1 mt-1">
                  {liveWeather.conditionText}
                </div>
                <span className="text-[10px] text-slate-500">WMO Code {liveWeather.weatherCode}</span>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-slate-900/60 text-center text-xs text-slate-400">
              Loading live weather telemetry from meteorological feed...
            </div>
          )}

          {liveWeather && (
            <div className="mt-3 text-xs bg-slate-900/50 p-2.5 rounded-xl border border-slate-700/40 text-slate-300 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-amber-400">Hazard Impact:</span>
                <span>{liveWeather.hazardIndicators.summary}</span>
              </div>
              <span className="text-[10px] text-slate-500 shrink-0 font-mono">
                Mult: Flood x{liveWeather.hazardIndicators.floodRiskMultiplier} | Cyclone x{liveWeather.hazardIndicators.cycloneRiskMultiplier}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Multi-Horizon Risk Assessments (24h, 48h, 7d) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-xl backdrop-blur-md relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-blue-400" />
              <span>24-Hour Horizon</span>
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getRiskColor(prediction.forecastHorizons['24h'].riskLevel)}`}>
              {prediction.forecastHorizons['24h'].riskLevel} Risk
            </span>
          </div>

          <div className="text-3xl font-black text-white font-mono mb-2">
            {prediction.forecastHorizons['24h'].probability}%
          </div>
          <p className="text-xs text-slate-300 mb-3 leading-relaxed">
            High immediate threat. Rapid inundation and localized power disruption anticipated across vulnerable lowlands.
          </p>

          <div className="text-[11px] text-slate-400 border-t border-slate-700/60 pt-2 flex items-center justify-between">
            <span>Forecast Rainfall:</span>
            <span className="text-blue-300 font-bold">{prediction.forecastHorizons['24h'].expectedRainfallMm || 180} mm</span>
          </div>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-xl backdrop-blur-md relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
              <span>48-Hour Horizon</span>
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getRiskColor(prediction.forecastHorizons['48h'].riskLevel)}`}>
              {prediction.forecastHorizons['48h'].riskLevel} Risk
            </span>
          </div>

          <div className="text-3xl font-black text-white font-mono mb-2">
            {prediction.forecastHorizons['48h'].probability}%
          </div>
          <p className="text-xs text-slate-300 mb-3 leading-relaxed">
            Peak flood crest or cyclone eye passage. Secondary tributaries expected to breach embankment buffers.
          </p>

          <div className="text-[11px] text-slate-400 border-t border-slate-700/60 pt-2 flex items-center justify-between">
            <span>Peak Discharge:</span>
            <span className="text-indigo-300 font-bold">+2.4m Above Danger</span>
          </div>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-xl backdrop-blur-md relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              <span>7-Day Horizon</span>
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getRiskColor(prediction.forecastHorizons['7d'].riskLevel)}`}>
              {prediction.forecastHorizons['7d'].riskLevel} Risk
            </span>
          </div>

          <div className="text-3xl font-black text-white font-mono mb-2">
            {prediction.forecastHorizons['7d'].probability}%
          </div>
          <p className="text-xs text-slate-300 mb-3 leading-relaxed">
            Post-hazard recession trajectory. Risk of waterborne disease outbreaks, sanitation stress, and infrastructure repair window.
          </p>

          <div className="text-[11px] text-slate-400 border-t border-slate-700/60 pt-2 flex items-center justify-between">
            <span>Recovery Trend:</span>
            <span className="text-emerald-400 font-bold">{prediction.forecastHorizons['7d'].trend}</span>
          </div>
        </div>
      </div>

      {/* Contributing Factors & Explainability */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-xl backdrop-blur-md">
        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <Activity className="w-4 h-4 text-amber-400" />
          <span>Explainable AI: Key Contributing Factors to Prediction</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          {prediction.contributingFactors.map((factor, idx) => (
            <div
              key={idx}
              className="bg-slate-900/60 p-3 rounded-xl border border-slate-700/50 flex items-start gap-2.5 text-xs text-slate-300"
            >
              <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0 mt-1" />
              <span>{factor}</span>
            </div>
          ))}
        </div>

        <div className="text-xs text-slate-400 bg-slate-900/40 p-3 rounded-xl border border-slate-700/40">
          <strong>Methodology & Attribution:</strong> {prediction.confidenceExplanation}
        </div>
      </div>

      {/* Gemini AI High-Thinking Deep Strategic Assessment */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950/80 border border-indigo-700/50 rounded-2xl p-5 shadow-2xl backdrop-blur-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-indigo-800/40 pb-4">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
            </span>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Gemini High-Thinking Mode Disaster Strategist</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-900/60 text-indigo-300 border border-indigo-600 font-mono">
                  ThinkingLevel: HIGH
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Generates multi-step crisis directives, logistics bottlenecks resolution, and hospital surge triage plans.
              </p>
            </div>
          </div>

          <button
            onClick={() => handleGenerateAIStrategy()}
            disabled={isGeneratingAI}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-indigo-500/25 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isGeneratingAI ? 'animate-spin' : ''}`} />
            <span>{isGeneratingAI ? 'Gemini is Thinking (High)...' : 'Run Strategic Assessment'}</span>
          </button>
        </div>

        {/* Quick Question Prompts */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 text-[11px]">Quick Scenarios:</span>
          <button
            onClick={() => handleGenerateAIStrategy('How should we sequence evacuation for elderly and pregnant women in flood-hit Morigaon?')}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition-colors text-[11px]"
          >
            👴 Vulnerable Evacuation Sequencing
          </button>
          <button
            onClick={() => handleGenerateAIStrategy('Assess secondary dam spillway discharge risks and bridge failure mitigation.')}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition-colors text-[11px]"
          >
            🌊 Embankment Breach Tactics
          </button>
          <button
            onClick={() => handleGenerateAIStrategy('Draft emergency medical triage and water purification dispatch plan.')}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition-colors text-[11px]"
          >
            💉 Medical & Potable Water Buffer
          </button>
        </div>

        {/* Custom Question Input */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Ask Gemini AI Chief Strategist (e.g., 'What are the top 3 logistics bottlenecks if rains continue for 72h?')..."
            value={customQuery}
            onChange={(e) => setCustomQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGenerateAIStrategy()}
            className="flex-1 px-4 py-2 bg-slate-950/80 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
          <button
            onClick={() => handleGenerateAIStrategy()}
            disabled={isGeneratingAI}
            className="p-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow cursor-pointer disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        {/* AI Output Card */}
        {aiReport && (
          <div className="bg-slate-950/80 border border-indigo-800/40 p-4 rounded-xl text-xs text-slate-200 leading-relaxed font-sans space-y-2 mt-3 max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2 text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5 font-semibold text-indigo-300">
                <FileText className="w-3.5 h-3.5 text-indigo-400" /> Strategic Action Plan Generated
              </span>
              <span className="font-mono text-[10px]">Model: {aiModelUsed}</span>
            </div>
            <div className="whitespace-pre-line prose prose-invert max-w-none text-xs">
              {aiReport}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
