'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Database, AlertCircle, Target, MessageSquare, TrendingUp, Key, Cpu, Zap, BarChart3, Activity, ArrowRight, ExternalLink } from 'lucide-react';
import type { FullReport } from './api/run/route';

const LOADING_STATUSES = [
  "Initializing Mistral engine...",
  "Fetching raw market signals...",
  "Cross-referencing Notion releases...",
  "Analyzing Asana sentiment trends...",
  "Synthesizing ClickUp pain points...",
  "Mapping Monday.com architecture...",
  "Processing GTM vector alignments...",
  "Formulating copy revisions...",
  "Finalizing Campaign Integrator feedback..."
];

export default function Dashboard() {
  const [apiKey, setApiKey] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [report, setReport] = useState<FullReport | null>(null);
  const [previousReport, setPreviousReport] = useState<FullReport | null>(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'insights' | 'campaign'>('campaign');

  // Remove the automatic fetch on mount to keep space empty when loaded
  // useEffect(() => {
  //   fetch('/api/run')
  //     .then(res => res.json())
  //     .then(data => {
  //       if (data && data.insights) {
  //         setReport(data);
  //       }
  //     })
  //     .catch(console.error);
  // }, []);

  // Simulate loading steps progression
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setLoadingStep(prev => (prev < LOADING_STATUSES.length - 1 ? prev + 1 : prev));
      }, 1500);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const handleRunSweep = async (useDemo: boolean = false) => {
    if (isRunning) return; // Prevent double click
    
    setError('');
    setIsRunning(true);

    try {
      const res = await fetch('/api/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: useDemo ? 'demo' : apiKey }),
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Failed to generate report');
      
      setReport(data.current);
      setPreviousReport(data.previous);
      setActiveTab('campaign');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsRunning(false);
    }
  };

  const renderActiveLoadingOverlay = () => {
    return (
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl"
      >
        <div className="flex flex-col items-center max-w-md w-full p-10 glass-card rounded-3xl border border-blue-500/30 shadow-[0_0_100px_rgba(59,130,246,0.2)] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-zinc-900">
             <motion.div 
               className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-purple-500"
               initial={{ width: "0%" }}
               animate={{ width: `${(loadingStep / (LOADING_STATUSES.length - 1)) * 100}%` }}
               transition={{ ease: "easeInOut", duration: 1.5 }}
             />
          </div>

          <div className="relative mb-10 mt-6 scale-125">
             <motion.div
               animate={{ rotate: 360 }}
               transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
               className="absolute -inset-4 border-2 border-blue-500/30 border-t-transparent rounded-full"
             />
             <motion.div
               animate={{ rotate: -360 }}
               transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
               className="absolute -inset-8 border border-purple-500/20 border-b-transparent rounded-full"
             />
             <div className="w-24 h-24 flex items-center justify-center rounded-full bg-blue-500/10 backdrop-blur-md border border-blue-500/20 shadow-[inset_0_0_20px_rgba(59,130,246,0.2)]">
               <Cpu className="w-10 h-10 text-blue-400 animate-pulse" />
             </div>
          </div>

          <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">Intelligence Engine Active</h3>
          
          <div className="h-8 overflow-hidden relative w-full text-center">
            <AnimatePresence mode="popLayout">
              <motion.p
                key={loadingStep}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.4, ease: "backOut" }}
                className="text-cyan-300 text-sm font-semibold tracking-wider absolute w-full uppercase"
              >
                {LOADING_STATUSES[loadingStep]}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen relative overflow-hidden selection:bg-blue-500/30 selection:text-white">
      <AnimatePresence>
        {isRunning && renderActiveLoadingOverlay()}
      </AnimatePresence>

      {/* Navbar area */}
      <nav className="w-full border-b border-white/5 bg-black/60 backdrop-blur-2xl sticky top-0 z-[60]">
        <div className="max-w-[1400px] mx-auto px-8 h-24 flex justify-between items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <div className="p-3 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-2xl border border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.15)] group transition-all cursor-pointer">
              <Activity className="text-blue-400 w-7 h-7 group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter text-white flex items-center gap-2 uppercase">
                KEEN<span className="text-blue-500">FOX</span> ASSIGNMENT <span className="w-1.5 h-1.5 rounded-full bg-blue-500/50 animate-pulse hidden sm:block"></span> <span className="opacity-40 font-medium text-sm hidden lg:inline tracking-[0.2em] uppercase ml-2">Intelligence Dashboard</span>
              </h1>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-6"
          >
            <div className="relative group hidden md:block">
              <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-blue-400 transition-colors" />
              <input 
                type="password"
                placeholder="Mistral API Key"
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
                disabled={isRunning}
                className="pl-12 pr-5 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 text-sm w-72 transition-all placeholder:text-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            
            <button
              onClick={() => handleRunSweep(true)}
              disabled={isRunning}
              className="text-zinc-400 hover:text-white px-5 py-3 rounded-2xl font-bold transition-all text-sm hover:bg-white/5 disabled:opacity-30 flex items-center gap-2"
            >
              Demo Mode
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleRunSweep(false)}
              disabled={isRunning}
              className="glow-button flex items-center gap-2 px-8 py-3 rounded-2xl font-extrabold text-white tracking-widest uppercase text-sm"
            >
              <Zap className={`w-4 h-4 fill-white ${isRunning ? 'animate-bounce' : ''}`} />
              <span>{isRunning ? 'Processing...' : 'Run Intelligence'}</span>
            </motion.button>
          </motion.div>
        </div>
      </nav>

      <main className="max-w-[1400px] mx-auto px-8 py-12 w-full">
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="mb-10 p-5 bg-red-950/20 border border-red-500/20 rounded-2xl flex items-center gap-4 text-red-200 shadow-[0_0_40px_rgba(239,68,68,0.05)]"
          >
            <div className="p-2 bg-red-500/20 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-400" />
            </div>
            <p className="text-sm font-semibold">{error}</p>
          </motion.div>
        )}

        {!report && !isRunning && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="flex flex-col items-center justify-center py-40 text-center relative max-w-3xl mx-auto"
          >
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent w-full" />
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="relative mb-12"
            >
              <div className="absolute inset-0 bg-blue-500/20 blur-[60px] rounded-full" />
              <Database className="w-24 h-24 text-blue-400 relative z-10" />
            </motion.div>
            
            <h2 className="text-6xl font-black mb-6 text-white tracking-tighter leading-[0.9] bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent">
              DECIPHER MARKET<br/>SIGNAL TRENDS
            </h2>
            <p className="text-zinc-400 text-xl leading-relaxed mb-10 max-w-xl font-medium">
              Synchronize intelligence across <span className="text-blue-400">Notion</span>, <span className="text-purple-400">Asana</span>, and <span className="text-cyan-400">ClickUp</span> to find your competitive edge.
            </p>
            <div className="flex items-center gap-6">
              <button 
                onClick={() => handleRunSweep(false)} 
                className="px-10 py-4 bg-white text-black font-black uppercase tracking-widest text-sm rounded-2xl hover:bg-blue-500 hover:text-white transition-all transform hover:-translate-y-1 active:translate-y-0"
              >
                Engage Sweep
              </button>
              <button 
                onClick={() => handleRunSweep(true)} 
                className="group flex items-center gap-2 text-zinc-500 hover:text-white font-bold transition-colors uppercase tracking-widest text-xs"
              >
                Access Demo Data <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        )}

        {report && (
          <div className="space-y-10">
            <div className="flex gap-3 p-2 bg-white/5 rounded-2xl inline-flex border border-white/5">
              <button 
                onClick={() => setActiveTab('campaign')}
                className={`py-3 px-8 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${activeTab === 'campaign' ? 'bg-blue-500 text-white shadow-[0_0_25px_rgba(59,130,246,0.4)]' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}
              >
                <div className="flex items-center gap-2 font-black"><Target className="w-4 h-4" /> Strategy</div>
              </button>
              <button 
                onClick={() => setActiveTab('insights')}
                className={`py-3 px-8 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${activeTab === 'insights' ? 'bg-blue-500 text-white shadow-[0_0_25px_rgba(59,130,246,0.4)]' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}
              >
                <div className="flex items-center gap-2 font-black"><BarChart3 className="w-4 h-4" /> Intelligence</div>
              </button>
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'campaign' && (
                <motion.div key="cam" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }} className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                  {/* Left Column (GTM & Adjustments) */}
                  <div className="xl:col-span-8 space-y-8">
                    <section className="glass-card rounded-[2.5rem] p-10 h-full">
                      <div className="flex items-center justify-between mb-10">
                        <h3 className="text-3xl font-black flex items-center gap-4 text-white tracking-tighter italic">
                          <Target className="w-8 h-8 text-blue-500" /> REFINED GTM STRATEGY
                        </h3>
                        <div className="px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-[10px] font-black tracking-[0.2em] uppercase text-blue-400">
                          AI-Optimized
                        </div>
                      </div>
                      <div className="space-y-6">
                        {report.recommendations.gtmStrategyRefinements.strategicMoves.map((move, i) => (
                          <motion.div 
                            key={i} 
                            whileHover={{ scale: 1.01, x: 5 }}
                            className="bg-white/[0.03] p-8 rounded-3xl border border-white/5 hover:border-blue-500/30 transition-all group relative overflow-hidden"
                          >
                            <div className="absolute top-0 right-0 w-2 h-full bg-blue-500/0 group-hover:bg-blue-500/20 transition-all" />
                            <h4 className="font-black text-white text-xl mb-3 tracking-tight group-hover:text-blue-400 transition-colors uppercase">{move.title}</h4>
                            <p className="text-zinc-400 mb-6 leading-relaxed font-medium">{move.detail}</p>
                            <div className="flex items-center gap-3 text-[10px] font-black tracking-widest uppercase px-4 py-2 bg-blue-950/40 text-blue-400 rounded-xl border border-blue-900/50 w-fit">
                              <ExternalLink className="w-3.5 h-3.5" />
                              <span>SIGNAL: {move.basedOnCompetitorSignal}</span>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </section>
                  </div>

                  {/* Right Column (Channels & Copy) */}
                  <div className="xl:col-span-4 space-y-8">
                    <section className="glass-card rounded-[2.5rem] p-8">
                      <h3 className="text-xl font-black mb-8 flex items-center gap-3 text-white tracking-widest uppercase italic"><TrendingUp className="w-6 h-6 text-purple-500" /> Channel Mix</h3>
                      <div className="space-y-4">
                        {report.recommendations.channelAndTargetingStrategy.recommendations.map((rec, i) => (
                          <div key={i} className="flex gap-5 p-5 rounded-3xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.07] transition-all">
                             <div className={`mt-1.5 flex-shrink-0 w-3 h-3 rounded-full ${rec.action === 'DOUBLE_DOWN' ? 'bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.6)]' : rec.action === 'PULL_BACK' ? 'bg-red-400 shadow-[0_0_15px_rgba(248,113,113,0.6)]' : 'bg-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.6)]'}`} />
                             <div>
                               <div className="flex items-center justify-between mb-2">
                                 <h4 className="text-sm font-black text-white tracking-widest uppercase italic">{rec.channel}</h4>
                                 <span className="text-[10px] font-black tracking-[0.2em] uppercase opacity-60 bg-white/10 px-3 py-1 rounded-lg text-white">{rec.action.replace('_', ' ')}</span>
                               </div>
                               <p className="text-xs text-zinc-400 leading-relaxed font-medium">{rec.explanation}</p>
                             </div>
                          </div>
                        ))}
                      </div>
                    </section>

                    <section className="glass-card rounded-[2.5rem] p-8 relative overflow-hidden border-t-2 border-t-pink-500/20">
                      <h3 className="text-xl font-black mb-8 flex items-center gap-3 text-white tracking-widest uppercase italic"><MessageSquare className="w-6 h-6 text-pink-500" /> Signal Copy</h3>
                      <div className="space-y-6">
                        {report.recommendations.messagingAndPositioning.revisedCopySuggestions.map((copy, i) => (
                          <div key={i} className="bg-black/40 p-6 rounded-3xl border border-white/5 group hover:border-pink-500/30 transition-all overflow-hidden relative">
                            <span className="text-[10px] font-black text-pink-500 uppercase tracking-[0.3em] block mb-4 italic">{copy.channel}</span>
                            <div className="space-y-5">
                              <div className="opacity-40 grayscale group-hover:grayscale-0 transition-all">
                                <span className="text-[9px] text-zinc-500 uppercase font-black tracking-widest">Baseline</span>
                                <p className="text-xs line-through text-zinc-400 mt-1">{copy.originalIdea}</p>
                              </div>
                              <div className="pl-4 border-l-4 border-emerald-500/50">
                                <span className="text-[9px] text-emerald-500 uppercase font-black tracking-widest">Strategic Pivot</span>
                                <p className="text-sm font-black text-emerald-100 mt-1 italic leading-relaxed">"{copy.revisedCopy}"</p>
                              </div>
                            </div>
                            <div className="mt-6 pt-4 border-t border-white/5">
                              <p className="text-[10px] text-zinc-500 font-bold leading-relaxed uppercase tracking-widest leading-relaxed"><strong>Intel:</strong> {copy.rationale}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  </div>
                </motion.div>
              )}

              {activeTab === 'insights' && (
                <motion.div key="ins" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.02 }} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {report.insights.map((insight, idx) => (
                    <motion.div 
                      key={idx} 
                      whileHover={{ y: -8 }}
                      className="glass-card rounded-[3rem] p-10"
                    >
                      <div className="flex items-center justify-between mb-10 border-b border-white/5 pb-6">
                        <h3 className="text-4xl font-black bg-gradient-to-r from-white via-white to-white/40 bg-clip-text text-transparent italic tracking-tighter">{insight.competitor}</h3>
                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                           <Cpu className="w-6 h-6 text-zinc-500" />
                        </div>
                      </div>
                      
                      <div className="space-y-10">
                        {insight.featureLaunches.length > 0 && (
                          <div>
                            <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] mb-5 flex items-center gap-3"><Zap className="w-4 h-4 fill-blue-500"/> Vector Launches</h4>
                            <ul className="space-y-3">
                              {insight.featureLaunches.map((f, i) => <li key={i} className="text-sm text-zinc-300 pl-5 border-l-2 border-blue-500/20 leading-relaxed font-bold">{f}</li>)}
                            </ul>
                          </div>
                        )}
                        
                        {insight.messagingShifts.length > 0 && (
                          <div>
                            <h4 className="text-[10px] font-black text-purple-500 uppercase tracking-[0.4em] mb-5 flex items-center gap-3"><TrendingUp className="w-4 h-4"/> Narrative Shifts</h4>
                            <ul className="space-y-3">
                              {insight.messagingShifts.map((m, i) => <li key={i} className="text-sm text-zinc-300 pl-5 border-l-2 border-purple-500/20 leading-relaxed font-bold">{m}</li>)}
                            </ul>
                          </div>
                        )}

                        <div className="p-8 bg-black/60 rounded-[2.5rem] border border-white/5 shadow-inner">
                          <h4 className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.4em] mb-6 text-center">Sentiment Architecture</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                              <span className="text-emerald-500 text-[10px] font-black uppercase tracking-widest block mb-4 italic">Aggregated Wins</span>
                              <ul className="space-y-3">{insight.customerSentiment.positive.map((p,i)=><li key={i} className="text-[11px] text-zinc-400 bg-emerald-500/5 px-3 py-2 rounded-xl border border-emerald-500/10 font-bold">{p}</li>)}</ul>
                            </div>
                            <div>
                              <span className="text-red-500 text-[10px] font-black uppercase tracking-widest block mb-4 italic">Exploitable Gaps</span>
                              <ul className="space-y-3">{insight.customerSentiment.negative.map((p,i)=><li key={i} className="text-[11px] text-zinc-400 bg-red-500/5 px-3 py-2 rounded-xl border border-red-500/10 font-bold">{p}</li>)}</ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  );
}
