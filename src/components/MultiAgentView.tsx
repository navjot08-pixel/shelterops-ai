import React, { useState } from 'react';
import { Disaster, AIAgent } from '../types';
import {
  Users,
  Radio,
  ShieldAlert,
  Home,
  Navigation,
  HeartPulse,
  Package,
  Activity,
  CheckCircle2,
  RefreshCw,
  Cpu,
  Layers,
  Sparkles,
  Zap,
} from 'lucide-react';

interface MultiAgentViewProps {
  disaster: Disaster;
  agents: AIAgent[];
}

export const MultiAgentView: React.FC<MultiAgentViewProps> = ({
  disaster,
  agents,
}) => {
  const [isRealigning, setIsRealigning] = useState(false);
  const [agentLogs, setAgentLogs] = useState<
    { timestamp: string; agentCode: string; agentName: string; text: string; type: 'info' | 'alert' | 'success' }[]
  >([
    {
      timestamp: '04:12:05',
      agentCode: 'DPA',
      agentName: 'Disaster Prediction Agent',
      text: 'Atmospheric radar burst logged 310mm rainfall. Flood probability calibrated to 96%. Threshold exceeded for Brahmaputra Lahorighat sector.',
      type: 'alert',
    },
    {
      timestamp: '04:12:18',
      agentCode: 'RAA',
      agentName: 'Risk Assessment Agent',
      text: 'Demographic overlay completed. 45,000 residents in trajectory. 5,400 elderly and 1,800 disabled individuals prioritized for immediate convoy extraction.',
      type: 'info',
    },
    {
      timestamp: '04:12:35',
      agentCode: 'RPA',
      agentName: 'Route Planning Agent',
      text: 'NH-37 connector marked BLOCKED due to 1.8m inundation. Rerouted primary convoy traffic along Elevated State Highway 715A. Transit time updated to 38 mins.',
      type: 'alert',
    },
    {
      timestamp: '04:12:49',
      agentCode: 'SAA',
      agentName: 'Shelter Allocation Agent',
      text: 'Constraint optimizer converged in 12ms. 100% capacity invariant satisfied. Nagaon Stadium and Tezpur Campus assigned as primary hubs.',
      type: 'success',
    },
    {
      timestamp: '04:13:02',
      agentCode: 'MRA',
      agentName: 'Medical Response Agent',
      text: 'Dispatched 400 medical oxygen cylinders and 2,000 vials of polyvalent snake antivenom to Nagaon Stadium. 4 mobile medical vans stationed on elevated bypass.',
      type: 'info',
    },
    {
      timestamp: '04:13:15',
      agentCode: 'RMA',
      agentName: 'Resource Management Agent',
      text: 'Potable water tankers (25,000L) and 8 days dry rations confirmed on-site. All 28 diesel backup generators verified online with 72-hour fuel buffer.',
      type: 'success',
    },
  ]);

  const handleRealign = () => {
    setIsRealigning(true);
    setTimeout(() => {
      const now = new Date().toLocaleTimeString();
      setAgentLogs((prev) => [
        {
          timestamp: now,
          agentCode: 'SAA',
          agentName: 'Shelter Allocation Agent',
          text: 'Re-verified shelter occupancy buffers. Nagaon Stadium accepting elderly convoy waves 1 & 2 without overcrowding.',
          type: 'success',
        },
        {
          timestamp: now,
          agentCode: 'RPA',
          agentName: 'Route Planning Agent',
          text: 'BRO (Border Roads Organisation) confirms alternate elevated bypass clear of fallen debris. Drone convoy escort dispatched.',
          type: 'info',
        },
        ...prev,
      ]);
      setIsRealigning(false);
    }, 600);
  };

  const getAgentIcon = (id: string) => {
    switch (id) {
      case 'dpa':
        return <Radio className="w-4 h-4 text-cyan-400" />;
      case 'raa':
        return <ShieldAlert className="w-4 h-4 text-amber-400" />;
      case 'saa':
        return <Home className="w-4 h-4 text-blue-400" />;
      case 'rpa':
        return <Navigation className="w-4 h-4 text-emerald-400" />;
      case 'mra':
        return <HeartPulse className="w-4 h-4 text-red-400" />;
      case 'rma':
        return <Package className="w-4 h-4 text-purple-400" />;
      default:
        return <Cpu className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Multi-Agent Consensus Header */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-xl backdrop-blur-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-700/60 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <Users className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-white tracking-wide">
                Multi-Agent AI Coordination Command Center
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              6 decoupled autonomous AI agents collaboratively synthesizing predictions, routes, resources, and shelter allocations into one coordinated Emergency Action Plan.
            </p>
          </div>

          <button
            onClick={handleRealign}
            disabled={isRealigning}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-emerald-500/25 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRealigning ? 'animate-spin' : ''}`} />
            <span>{isRealigning ? 'Synchronizing Agents...' : 'Re-Align Agent Consensus'}</span>
          </button>
        </div>

        {/* 6 Agents Status Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-5">
          {agents.map((ag) => (
            <div
              key={ag.id}
              className="bg-slate-900/70 border border-slate-700/70 rounded-xl p-4 shadow space-y-3 relative overflow-hidden group hover:border-slate-500 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-slate-800 border border-slate-700">
                    {getAgentIcon(ag.id)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{ag.name}</h4>
                    <span className="text-[10px] text-slate-400 font-mono">[{ag.code}]</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-black text-emerald-400 font-mono">
                    {ag.confidence}%
                  </span>
                  <span className="block text-[9px] text-slate-500 uppercase tracking-wider">Confidence</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-300 leading-relaxed line-clamp-2">
                {ag.lastMessage}
              </p>

              <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-slate-800 text-[10px]">
                {ag.metrics.map((m, idx) => (
                  <div key={idx} className="bg-slate-800/60 p-1.5 rounded text-center">
                    <span className="text-slate-400 block text-[9px] truncate">{m.label}</span>
                    <span className="font-bold text-slate-200 truncate block">{m.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Unified Emergency Action Plan (EAP) Consensus Card */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-emerald-500/40 rounded-2xl p-5 shadow-2xl backdrop-blur-md space-y-4">
        <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">
              Unified Emergency Action Plan (EAP) • Agent Consensus
            </h3>
          </div>
          <span className="text-[11px] text-emerald-300 font-semibold px-2.5 py-0.5 rounded-full bg-emerald-900/50 border border-emerald-600">
            6/6 Agents Synchronized
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-200">
          <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-700/50 space-y-2">
            <span className="font-bold text-indigo-300 block flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-indigo-400" /> Phase 1: Immediate Triage (0-3 Hours)
            </span>
            <ul className="list-disc list-inside space-y-1 text-slate-300 text-[11px]">
              <li>Execute Code Red sirens across Lahorighat & Bhuragaon riverbanks</li>
              <li>Mobilize 8 NDRF speedboats for 1,800 persons with disabilities</li>
              <li>Impose total traffic barrier on submerged NH-37 connector</li>
            </ul>
          </div>

          <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-700/50 space-y-2">
            <span className="font-bold text-blue-300 block flex items-center gap-1.5">
              <Navigation className="w-4 h-4 text-blue-400" /> Phase 2: Convoy Transit (3-8 Hours)
            </span>
            <ul className="list-disc list-inside space-y-1 text-slate-300 text-[11px]">
              <li>Route bus convoys via Elevated State Highway 715A (38 min transit)</li>
              <li>Distribute 15,000 ready-to-eat dry rations and water bottles on transit</li>
              <li>Continuous aerial drone surveillance for slope slips or water backflow</li>
            </ul>
          </div>

          <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-700/50 space-y-2">
            <span className="font-bold text-emerald-300 block flex items-center gap-1.5">
              <HeartPulse className="w-4 h-4 text-emerald-400" /> Phase 3: Shelter Sustenance (8-72 Hours)
            </span>
            <ul className="list-disc list-inside space-y-1 text-slate-300 text-[11px]">
              <li>Activate Nagaon Stadium (2,350 beds) and Tezpur Campus (2,700 beds)</li>
              <li>Connect 400 oxygen beds; stage 2,000 anti-venom ampoules</li>
              <li>Engage 28 diesel generators with 72h fuel reserve for uninterrupted power</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Live Agent Collaboration Communication Stream */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-xl backdrop-blur-md space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span>Live Multi-Agent Communication Bus</span>
          </h3>
          <span className="text-[10px] text-slate-400 font-mono">Protocol: NDMA-MAS/Blackboard v2.4</span>
        </div>

        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
          {agentLogs.map((log, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl border text-xs flex items-start gap-3 ${
                log.type === 'alert'
                  ? 'bg-amber-950/30 border-amber-800/60 text-amber-200'
                  : log.type === 'success'
                  ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-200'
                  : 'bg-slate-900/70 border-slate-700/60 text-slate-300'
              }`}
            >
              <span className="font-mono text-[10px] text-slate-400 shrink-0 mt-0.5">
                [{log.timestamp}]
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold shrink-0 bg-slate-800 text-slate-200 border border-slate-700">
                {log.agentCode}
              </span>
              <div className="flex-1">
                <span className="font-semibold text-white mr-1.5">{log.agentName}:</span>
                <span>{log.text}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
