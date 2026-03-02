import React, { useState } from 'react';
import { SMIState, POD, Task } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ClipboardCheck,
    Printer,
    Camera,
    Users,
    Target,
    Sparkles,
    ChevronRight,
    Plus,
    Trash2,
    Zap
} from 'lucide-react';

interface PODProps {
    state: SMIState;
    activeProjectId: string;
    onUpdateState: (state: Partial<SMIState>) => void;
}

const PODGenerator: React.FC<PODProps> = ({ state, activeProjectId, onUpdateState }) => {
    const activeProject = state.episodes.find(e => e.id === activeProjectId);
    const projectTasks = state.tasks.filter(t => t.projectId === activeProjectId && t.status !== 'Completed');

    // Local state for the current POD being drafted
    const [currentPOD, setCurrentPOD] = useState<Partial<POD>>({
        projectId: activeProjectId,
        date: new Date().toISOString().split('T')[0],
        goals: [],
        equipment: [],
        crew: []
    });

    const addGoal = (goal: string) => {
        if (!goal) return;
        setCurrentPOD(prev => ({ ...prev, goals: [...(prev.goals || []), goal] }));
    };

    const autoIngestTasks = () => {
        const highPriorityTasks = projectTasks
            .sort((a, b) => (a.priority === 'Critical' ? -1 : 1))
            .slice(0, 3)
            .map(t => `RECORD: ${t.task}`);

        setCurrentPOD(prev => ({
            ...prev,
            goals: [...new Set([...(prev.goals || []), ...highPriorityTasks])]
        }));
    };

    const savePOD = () => {
        const newPOD: POD = {
            id: Date.now().toString(),
            projectId: activeProjectId,
            date: currentPOD.date || '',
            goals: currentPOD.goals || [],
            equipment: currentPOD.equipment || [],
            crew: currentPOD.crew || []
        };
        onUpdateState({ pods: [...state.pods, newPOD] });
        alert('Plan of the Day Deployed to Archive');
    };

    return (
        <div className="space-y-12 max-w-7xl mx-auto">
            {/* Header */}
            <header className="flex justify-between items-end">
                <div>
                    <h2 className="text-4xl font-black font-['Outfit'] tracking-tighter text-white mb-2 underline decoration-cyan-500/50 underline-offset-8 flex items-center gap-3">
                        POD Generator
                        <div className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full">
                            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest leading-none">Phase: Deployment</span>
                        </div>
                    </h2>
                    <p className="text-gray-500 font-medium italic">
                        {activeProject ? `Synthesizing recording logistics for ${activeProject.title}` : 'Select a project to generate deployment plans'}
                    </p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={() => window.print()}
                        className="p-4 bg-white/5 border border-white/10 rounded-2xl text-gray-400 hover:text-white transition-all shadow-xl"
                    >
                        <Printer className="w-5 h-5" />
                    </button>
                    <button
                        onClick={savePOD}
                        className="bg-cyan-600 hover:bg-cyan-500 text-white px-8 py-4 rounded-2xl flex items-center gap-2 font-bold transition-all shadow-lg shadow-cyan-500/20"
                    >
                        <ClipboardCheck className="w-5 h-5" />
                        Deploy Plan
                    </button>
                </div>
            </header>

            {!activeProjectId ? (
                <div className="text-center py-40 glass-card border-dashed">
                    <Target className="w-16 h-16 text-gray-700 mx-auto mb-6" />
                    <p className="text-gray-500 font-black uppercase tracking-[0.3em]">No Active Vector Selected</p>
                    <p className="text-gray-600 text-xs mt-2 uppercase">Switch focus in the sidebar to begin deployment</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Config Panel */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="glass-card p-10">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-2xl font-black text-white tracking-tighter flex items-center gap-3">
                                    <Sparkles className="w-6 h-6 text-cyan-400" />
                                    Tactical Objectives
                                </h3>
                                <button
                                    onClick={autoIngestTasks}
                                    className="text-[10px] font-black text-cyan-400 uppercase tracking-widest flex items-center gap-2 bg-cyan-500/10 px-4 py-2 rounded-full border border-cyan-500/20 hover:bg-cyan-500/20"
                                >
                                    <Zap className="w-3 h-3" /> AI Suggest from Timeline
                                </button>
                            </div>

                            <div className="space-y-4">
                                {currentPOD.goals?.map((goal, i) => (
                                    <motion.div
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        key={i}
                                        className="flex justify-between items-center group bg-white/5 border border-white/5 p-4 rounded-2xl hover:border-cyan-500/30 transition-all"
                                    >
                                        <span className="text-sm font-bold text-gray-300 flex items-center gap-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                                            {goal}
                                        </span>
                                        <button
                                            onClick={() => setCurrentPOD(prev => ({
                                                ...prev,
                                                goals: prev.goals?.filter((_, idx) => idx !== i)
                                            }))}
                                            className="text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </motion.div>
                                ))}

                                <div className="relative mt-6">
                                    <input
                                        type="text"
                                        placeholder="Identify new production goal..."
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                addGoal(e.currentTarget.value);
                                                e.currentTarget.value = '';
                                            }
                                        }}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white focus:outline-none focus:border-cyan-500/50 pr-16"
                                    />
                                    <Plus className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-700" />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="glass-card p-8">
                                <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                    <Camera className="w-4 h-4" /> Gear Logistics
                                </h4>
                                <div className="space-y-3">
                                    {[...state.materials.camera, ...state.materials.audio].slice(0, 6).map((item, i) => (
                                        <div key={i} className="flex items-center gap-3 text-xs font-bold text-gray-400">
                                            <div className="w-4 h-4 border border-white/10 rounded-md bg-white/5" />
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="glass-card p-8">
                                <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                    <Users className="w-4 h-4" /> Personnel
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {['Director', 'DP', 'Audio Ops', 'Art Director', 'Grip'].map((r) => (
                                        <span key={r} className="px-3 py-1 bg-white/5 border border-white/5 rounded-lg text-[10px] font-black text-gray-500 uppercase">
                                            {r}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* HUD Preview */}
                    <div className="space-y-8 print:col-span-3">
                        <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-[3rem] p-10 backdrop-blur-3xl sticky top-8">
                            <div className="text-center mb-10 pb-10 border-b border-cyan-500/10">
                                <h3 className="text-3xl font-black text-white italic tracking-tighter mb-2">DEPLOYMENT_PLAN</h3>
                                <p className="text-[10px] font-black text-cyan-400 tracking-[0.4em] uppercase">{currentPOD.date}</p>
                            </div>

                            <div className="space-y-8">
                                <div>
                                    <span className="text-[10px] font-black text-cyan-500/50 uppercase tracking-widest block mb-4">Target Vector</span>
                                    <p className="text-xl font-bold text-white tracking-tight">{activeProject?.title}</p>
                                </div>

                                <div>
                                    <span className="text-[10px] font-black text-cyan-500/50 uppercase tracking-widest block mb-4">Tactical Priorities</span>
                                    <ul className="space-y-3">
                                        {(currentPOD.goals?.length || 0) > 0 ? currentPOD.goals?.map((g, i) => (
                                            <li key={i} className="text-sm font-bold text-gray-300 flex items-start gap-3">
                                                <ChevronRight className="w-4 h-4 text-cyan-500 mt-0.5 flex-shrink-0" />
                                                {g}
                                            </li>
                                        )) : (
                                            <li className="text-xs italic text-gray-600">Pending objective identification...</li>
                                        )}
                                    </ul>
                                </div>

                                <div className="pt-8 flex justify-center">
                                    <div className="text-[8px] font-black text-gray-700 tracking-[0.5em] uppercase">SMI System Synthetic Plan 04</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PODGenerator;
