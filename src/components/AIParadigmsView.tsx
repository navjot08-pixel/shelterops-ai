import React from 'react';
import { AI_PARADIGMS_COMPARISON } from '../data/indiaData';
import {
  Brain,
  CheckCircle2,
  TrendingUp,
  Cpu,
  Layers,
  Sparkles,
  GitBranch,
  ShieldCheck,
  Scale,
  Users,
} from 'lucide-react';

export const AIParadigmsView: React.FC = () => {
  const getIconForParadigm = (idx: number) => {
    switch (idx) {
      case 0:
        return <ShieldCheck className="w-5 h-5 text-emerald-400" />;
      case 1:
        return <TrendingUp className="w-5 h-5 text-cyan-400" />;
      case 2:
        return <GitBranch className="w-5 h-5 text-indigo-400" />;
      case 3:
        return <Scale className="w-5 h-5 text-blue-400" />;
      case 4:
        return <Users className="w-5 h-5 text-purple-400" />;
      default:
        return <Brain className="w-5 h-5 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-2 mb-1">
          <span className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400 border border-purple-500/30">
            <Brain className="w-5 h-5" />
          </span>
          <h2 className="text-xl font-bold text-white tracking-wide">
            Advanced AI Reasoning & Paradigms Comparison Matrix
          </h2>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          ShelterOps AI employs an ensemble of 5 distinct artificial intelligence architectures, balancing mathematical guarantees, uncertainty management, heuristic exploration, and multi-agent coordination.
        </p>
      </div>

      {/* Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {AI_PARADIGMS_COMPARISON.map((p, idx) => (
          <div
            key={idx}
            className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 shadow-xl backdrop-blur-md flex flex-col justify-between space-y-4 hover:border-slate-500 transition-colors"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-2.5 border-b border-slate-700/60 pb-3">
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-700">
                  {getIconForParadigm(idx)}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white leading-tight">
                    {p.paradigm}
                  </h3>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {p.activeModule}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block mb-1">
                  Role in ShelterOps AI
                </span>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {p.roleInShelterOps}
                </p>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase text-emerald-400 tracking-wider block mb-1">
                  Core Strengths
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {p.strengths}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-700/60 text-xs">
              <span className="text-[10px] font-bold uppercase text-amber-400 tracking-wider block mb-1">
                Known Trade-off / Limitation
              </span>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                {p.limitations}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Mathematical Formulation Explainer */}
      <div className="bg-slate-900/80 border border-slate-700/80 rounded-2xl p-5 shadow-xl backdrop-blur-md space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Scale className="w-4 h-4 text-blue-400" />
          <span>ShelterOps AI Multi-Objective Mathematical Formulation</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300 leading-relaxed">
          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-2">
            <h4 className="font-bold text-emerald-400 text-xs uppercase tracking-wider">
              1. Invariant Hard Constraints (Rule-Based Filter)
            </h4>
            <div className="font-mono text-[11px] bg-slate-900 p-2.5 rounded border border-slate-800 space-y-1 text-slate-300">
              <p>{"// Safety Exclusion Zone:"}</p>
              <p className="text-emerald-400">{"∀ shelter s ∈ S, dist(d, s) > R_exclusion"}</p>
              <p className="mt-2">{"// Strict Bed Capacity:"}</p>
              <p className="text-emerald-400">{"Allocated(s) + Occupied(s) ≤ Capacity(s)"}</p>
            </div>
            <p className="text-[11px] text-slate-400">
              Guarantees zero victims placed in the hazard impact path or in overflowing shelters.
            </p>
          </div>

          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-2">
            <h4 className="font-bold text-blue-400 text-xs uppercase tracking-wider">
              2. Objective Function (Optimization Scoring)
            </h4>
            <div className="font-mono text-[11px] bg-slate-900 p-2.5 rounded border border-slate-800 text-slate-300">
              <p className="text-blue-300">
                {"Score(s) = w_d · D_score + w_c · C_score + w_s · S_safety + w_r · R_supply"}
              </p>
              <p className="mt-1 text-slate-500 text-[10px]">
                {"Where weights: w_d = 0.40, w_c = 0.25, w_s = 0.20, w_r = 0.15"}
              </p>
            </div>
            <p className="text-[11px] text-slate-400">
              Balances transit proximity against hospital-grade medical infrastructure and multi-day potable water buffers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
