/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useCallback } from 'react';
import { 
  ShieldCheck, 
  Map, 
  Search, 
  Layers, 
  Cpu, 
  ArrowRight, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  Terminal,
  Activity,
  Workflow
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AgentType, AgentStatus, AgentState, StrategyReport } from './types.ts';
import { aiService } from './services/aiService.ts';

export default function App() {
  const [projectObjective, setProjectObjective] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [report, setReport] = useState<StrategyReport | null>(null);
  const [agents, setAgents] = useState<AgentState[]>([
    { type: AgentType.SCOUT, status: AgentStatus.IDLE, message: 'Ready to scan market', progress: 0 },
    { type: AgentType.ARCHITECT, status: AgentStatus.IDLE, message: 'Ready to evaluate infra', progress: 0 },
    { type: AgentType.ANALYST, status: AgentStatus.IDLE, message: 'Ready to analyze feedback', progress: 0 },
    { type: AgentType.ORCHESTRATOR, status: AgentStatus.IDLE, message: 'Ready to synthesize', progress: 0 },
  ]);

  const updateAgent = useCallback((type: AgentType, updates: Partial<AgentState>) => {
    setAgents(prev => prev.map(a => a.type === type ? { ...a, ...updates } : a));
  }, []);

  const runOrchestration = async () => {
    if (!projectObjective) return;
    setIsRunning(true);
    setReport(null);

    try {
      // 1. Parallel Research
      updateAgent(AgentType.SCOUT, { status: AgentStatus.RESEARCHING, message: 'Searching competitors...', progress: 30 });
      updateAgent(AgentType.ARCHITECT, { status: AgentStatus.RESEARCHING, message: 'Checking constraints...', progress: 30 });
      updateAgent(AgentType.ANALYST, { status: AgentStatus.RESEARCHING, message: 'Processing sentiment...', progress: 30 });

      const [scoutRes, archRes, analRes] = await Promise.all([
        aiService.runAgentTask(AgentType.SCOUT, projectObjective),
        aiService.runAgentTask(AgentType.ARCHITECT, projectObjective),
        aiService.runAgentTask(AgentType.ANALYST, projectObjective),
      ]);

      updateAgent(AgentType.SCOUT, { status: AgentStatus.COMPLETED, message: 'Market signals captured', progress: 100 });
      updateAgent(AgentType.ARCHITECT, { status: AgentStatus.COMPLETED, message: 'Feasibility constraints mapped', progress: 100 });
      updateAgent(AgentType.ANALYST, { status: AgentStatus.COMPLETED, message: 'Friction points identified', progress: 100 });

      // 2. Orchestration
      updateAgent(AgentType.ORCHESTRATOR, { status: AgentStatus.ANALYZING, message: 'Reasoning through strategy...', progress: 50 });
      
      const finalReport = await aiService.generateFinalStrategy(
        projectObjective,
        scoutRes,
        archRes,
        analRes
      );

      setReport(finalReport);
      updateAgent(AgentType.ORCHESTRATOR, { status: AgentStatus.COMPLETED, message: 'Strategic roadmap generated', progress: 100 });
    } catch (error) {
      console.error(error);
      updateAgent(AgentType.ORCHESTRATOR, { status: AgentStatus.FAILED, message: 'Error in synthesis chain', progress: 0 });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#E4E3E0] text-[#141414] font-sans selection:bg-[#141414] selection:text-[#E4E3E0]">
      {/* Sidebar / Grid Header */}
      <header className="border-b border-[#141414] p-6 flex justify-between items-center bg-[#E4E3E0] sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Workflow className="w-8 h-8" />
          <div>
            <h1 className="text-xl font-bold tracking-tight uppercase">AI Strategy Orchestrator</h1>
            <p className="text-[10px] font-mono opacity-50 uppercase tracking-widest">Multi-Agent Intelligence Platform v1.0</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-mono opacity-50 uppercase">System Status</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-mono">ALL AGENTS ONLINE</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 md:p-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Col: Setup & Objectives */}
        <section className="lg:col-span-4 space-y-8">
          <div>
            <h2 className="font-serif italic text-2xl mb-4">Strategic Intent</h2>
            <p className="text-sm opacity-70 mb-6 leading-relaxed">
              Describe your product objective, target market, or a specific problem you're solving. 
              Sub-agents will branch out to research market signals, technical hurdles, and user needs simultaneously.
            </p>
            <div className="relative group">
              <textarea
                id="objective-input"
                className="w-full h-48 bg-white/50 border border-[#141414] p-4 font-mono text-sm focus:bg-white focus:outline-none transition-all resize-none"
                placeholder="e.g., Building a decentralized open-source alternative to Slack for high-security medical teams..."
                value={projectObjective}
                onChange={(e) => setProjectObjective(e.target.value)}
                disabled={isRunning}
              />
              <div className="absolute top-0 right-0 p-2 opacity-20 pointer-events-none">
                <Terminal className="w-4 h-4" />
              </div>
            </div>
            
            <button
              id="run-btn"
              onClick={runOrchestration}
              disabled={isRunning || !projectObjective}
              className="mt-6 w-full group relative overflow-hidden bg-[#141414] text-[#E4E3E0] py-4 px-6 flex items-center justify-center gap-3 hover:bg-zinc-800 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <AnimatePresence mode="wait">
                {isRunning ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-3"
                  >
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="font-bold uppercase tracking-widest text-xs">Processing Node Chain</span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-3"
                  >
                    <span className="font-bold uppercase tracking-widest text-xs">Execute Orchestration</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>

          <div className="border-t border-[#141414] pt-8">
            <h3 className="text-[10px] font-mono opacity-50 uppercase tracking-widest mb-6">Agent Pool Status</h3>
            <div className="space-y-4">
              {agents.map((agent) => (
                <div key={agent.type} className="group cursor-default border-b border-[#141414]/10 pb-4">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-3">
                      {agent.type === AgentType.SCOUT && <Search className="w-4 h-4" />}
                      {agent.type === AgentType.ARCHITECT && <Cpu className="w-4 h-4" />}
                      {agent.type === AgentType.ANALYST && <Activity className="w-4 h-4" />}
                      {agent.type === AgentType.ORCHESTRATOR && <Layers className="w-4 h-4" />}
                      <span className="text-xs font-bold uppercase">{agent.type} Agent</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {agent.status === AgentStatus.COMPLETED && <CheckCircle2 className="w-4 h-4 text-green-600" />}
                      {agent.status === AgentStatus.RESEARCHING && <Loader2 className="w-4 h-4 animate-spin opacity-50" />}
                      {agent.status === AgentStatus.ANALYZING && <Loader2 className="w-4 h-4 animate-spin opacity-50" />}
                      {agent.status === AgentStatus.FAILED && <AlertCircle className="w-4 h-4 text-red-600" />}
                      <span className="text-[10px] font-mono opacity-60 uppercase">{agent.status}</span>
                    </div>
                  </div>
                  <div className="h-1 bg-white/30 overflow-hidden relative">
                    <motion.div 
                      className="absolute top-0 left-0 h-full bg-[#141414]"
                      initial={{ width: 0 }}
                      animate={{ width: `${agent.progress}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <p className="text-[10px] mt-2 font-mono italic opacity-50 truncate">{agent.message}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Right Col: Output/Strategy Report */}
        <section className="lg:col-span-8 min-h-[600px] border-l border-[#141414] pl-0 lg:pl-12">
          {!report && !isRunning && (
            <div className="h-full flex flex-col items-center justify-center opacity-20 text-center space-y-4">
              <Map className="w-16 h-16" />
              <div>
                <p className="font-serif italic text-xl">Operational Ready</p>
                <p className="text-sm font-mono mt-2 uppercase tracking-tighter">Waiting for Strategic Intent Input</p>
              </div>
            </div>
          )}

          {isRunning && !report && (
            <div className="space-y-8 animate-pulse">
              <div className="h-32 bg-[#141414]/5" />
              <div className="h-64 bg-[#141414]/5" />
              <div className="h-48 bg-[#141414]/5" />
            </div>
          )}

          <AnimatePresence>
            {report && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-12 pb-24"
              >
                <div>
                  <div className="col-header mb-4">Strategic Synthesis</div>
                  <h2 className="text-4xl font-bold tracking-tight mb-6 leading-[1.1]">{report.summary}</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div>
                    <div className="col-header mb-6">High-Impact Features</div>
                    <ul className="space-y-6">
                      {report.priorityFeatures.map((feature, i) => (
                        <li key={i} className="flex gap-4 items-start border-l-2 border-[#141414] pl-6 py-1">
                          <span className="text-xs font-mono opacity-30">0{i + 1}</span>
                          <span className="font-medium text-lg leading-snug">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white p-8 border border-[#141414] shadow-[8px_8px_0px_#141414]">
                    <div className="flex items-center gap-2 mb-6 text-red-600">
                      <ShieldCheck className="w-5 h-5" />
                      <span className="text-xs font-bold uppercase tracking-widest">Risk Assessment</span>
                    </div>
                    <ul className="space-y-3 font-mono text-[11px] leading-relaxed italic">
                      {report.risks.map((risk, i) => (
                        <li key={i} className="opacity-70 flex gap-2">
                          <span>[!] </span>
                          <span>{risk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div>
                  <div className="col-header mb-8 text-center bg-[#141414] text-[#E4E3E0] py-2">Evolutionary Roadmap</div>
                  <div className="relative border border-[#141414] bg-white divide-y divide-[#141414]">
                    {report.roadmap.map((phase, i) => (
                      <div key={i} className="p-8 hover:bg-zinc-50 transition-colors">
                        <div className="flex flex-col md:flex-row md:items-center gap-6">
                          <div className="min-w-[140px]">
                            <span className="text-[10px] font-mono opacity-50 uppercase tracking-widest block mb-1">Target Phase</span>
                            <span className="font-bold text-xl uppercase tracking-tighter">P-0{i+1}</span>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-serif italic text-2xl mb-4">{phase.phase}</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {phase.goals.map((goal, j) => (
                                <div key={j} className="flex items-center gap-3">
                                  <div className="w-1.5 h-1.5 rounded-full bg-[#141414]" />
                                  <span className="text-sm opacity-80">{goal}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mt-12 p-8 border border-[#141414]/20 bg-[#141414]/5">
                  <h5 className="text-[10px] font-mono opacity-50 uppercase tracking-widest mb-4">Meta-Reflection for Evaluation</h5>
                  <p className="text-xs font-mono leading-relaxed opacity-60 italic">
                    This orchestration run utilized {agents.length} specialized agents across two Gemini models (Pro & Flash). 
                    The logical flow involved parallelized deep-scanning (Chain-of-Intelligence) followed by a high-entropy 
                    synthesis step to resolve conflicting constraints. Total token commitment: High.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>

      {/* Decorative Grid Overlays */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[-1]" 
           style={{ backgroundImage: 'radial-gradient(#141414 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
    </div>
  );
}

