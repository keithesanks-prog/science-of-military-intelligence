import React, { useState } from 'react';
import { Task } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Clock,
    ArrowRight,
    GanttChartSquare,
    FileText,
    Plus,
    ChevronRight,
    Settings,
    Trash2,
    AlertCircle,
    Sparkles,
    Zap
} from 'lucide-react';

interface TimelineProps {
    tasks: Task[];
    activeProjectId: string | null;
    onUpdateTasks: (tasks: Task[]) => void;
}

const Timeline: React.FC<TimelineProps> = ({ tasks, activeProjectId, onUpdateTasks }) => {
    const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
    const [isOptimizing, setIsOptimizing] = useState(false);

    // Scoped Data
    const filteredTasks = activeProjectId
        ? tasks.filter(t => t.projectId === activeProjectId)
        : tasks;

    const getTimelineOffset = (date: string) => {
        const start = new Date('2026-02-20').getTime();
        const current = new Date(date).getTime();
        const diff = (current - start) / (1000 * 60 * 60 * 24);
        return Math.max(0, diff * 30); // 30px per day
    };

    const updateTask = (id: string, updates: Partial<Task>) => {
        onUpdateTasks(tasks.map(t => t.id === id ? { ...t, ...updates } : t));
    };

    const addTask = () => {
        const newTask: Task = {
            id: `T${tasks.length + 1}`,
            projectId: activeProjectId || '1',
            task: 'New Production Vector',
            assignee: 'Unassigned',
            startDate: '2026-02-20',
            duration: 3,
            dependencies: [],
            priority: 'Medium',
            status: 'Pending'
        };
        onUpdateTasks([...tasks, newTask]);
        setEditingTaskId(newTask.id);
    };

    // AI Optimization Logic (Phase 14)
    const aiOptimize = () => {
        setIsOptimizing(true);
        setTimeout(() => {
            // Logic: Sort by Priority (Critical first) then by Start Date
            const priorityMap = { 'Critical': 0, 'High': 1, 'Medium': 2, 'Low': 3 };
            const sorted = [...tasks].sort((a, b) => {
                if (a.projectId === activeProjectId && b.projectId !== activeProjectId) return -1;
                if (a.projectId !== activeProjectId && b.projectId === activeProjectId) return 1;

                const pDiff = priorityMap[a.priority as keyof typeof priorityMap] - priorityMap[b.priority as keyof typeof priorityMap];
                if (pDiff !== 0) return pDiff;

                return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
            });
            onUpdateTasks(sorted);
            setIsOptimizing(false);
        }, 1200);
    };

    const editingTask = tasks.find(t => t.id === editingTaskId);

    return (
        <div className="space-y-12 max-w-7xl mx-auto relative">
            {/* Header */}
            <header className="flex justify-between items-end">
                <div>
                    <h2 className="text-4xl font-black font-['Outfit'] tracking-tighter text-white mb-2 underline decoration-purple-500/50 underline-offset-8">
                        Strategic Timeline
                    </h2>
                    <p className="text-gray-500 font-medium italic">
                        {activeProjectId ? `Active Deployment Flow for Episode ${activeProjectId}` : 'Global Sequence Mapping'}
                    </p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={aiOptimize}
                        disabled={isOptimizing}
                        className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] px-6 py-3 rounded-2xl border transition-all shadow-lg ${isOptimizing
                                ? 'bg-blue-500/20 border-blue-500/40 text-blue-400 animate-pulse'
                                : 'bg-blue-500/10 border-blue-500/20 text-blue-400 hover:bg-blue-500/20 shadow-blue-500/10'
                            }`}
                    >
                        <Sparkles className="w-4 h-4" />
                        {isOptimizing ? 'SYNTHESIZING...' : 'AI OPTIMIZE'}
                    </button>
                    <button
                        onClick={addTask}
                        className="flex items-center gap-2 text-[10px] font-black text-purple-400 uppercase tracking-[0.2em] px-6 py-3 bg-purple-500/10 rounded-2xl border border-purple-500/20 hover:bg-purple-500/20 transition-all shadow-lg shadow-purple-500/10"
                    >
                        <Plus className="w-4 h-4" /> Deploy Task
                    </button>
                </div>
            </header>

            <div className="flex gap-8 items-start">
                {/* Main Timeline View */}
                <div className="flex-grow bg-[#161b22]/40 backdrop-blur-xl rounded-[3rem] border border-white/5 p-10 overflow-x-auto shadow-2xl relative min-h-[600px] custom-scrollbar">
                    <AnimatePresence>
                        {isOptimizing && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 z-50 bg-[#05070a]/60 backdrop-blur-sm flex items-center justify-center rounded-[3rem]"
                            >
                                <div className="flex flex-col items-center gap-4">
                                    <Zap className="w-12 h-12 text-blue-400 animate-bounce" />
                                    <span className="text-sm font-black text-blue-400 tracking-[0.3em] animate-pulse">OPTIMIZING LOGISTICS...</span>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Date Headers */}
                    <div className="flex mb-12 border-b border-white/5 pb-4 sticky top-0 bg-[#0d1117]/80 backdrop-blur-md z-10">
                        {Array.from({ length: 12 }).map((_, i) => (
                            <div key={i} className="min-w-[150px] text-[10px] font-black uppercase tracking-widest text-gray-600 border-l border-white/5 pl-4">
                                WEEK {i + 1}
                            </div>
                        ))}
                    </div>

                    {/* Task Bars */}
                    <div className="space-y-10 relative">
                        <AnimatePresence mode="popLayout">
                            {filteredTasks.map((task, idx) => (
                                <motion.div
                                    layout
                                    key={task.id}
                                    className="relative h-12 flex items-center group"
                                >
                                    <motion.div
                                        layoutId={`task-${task.id}`}
                                        onClick={() => setEditingTaskId(task.id)}
                                        className={`absolute h-10 rounded-xl flex items-center px-4 shadow-2xl border transition-all duration-300 cursor-pointer ${editingTaskId === task.id ? 'ring-2 ring-purple-500/50 scale-[1.02] border-purple-500' : 'border-white/10'
                                            }`}
                                        style={{
                                            left: `${getTimelineOffset(task.startDate)}px`,
                                            width: `${(task.duration || 1) * 30}px`,
                                            background: task.status === 'Blocked' ? 'rgba(239, 68, 68, 0.2)' :
                                                task.status === 'Completed' ? 'rgba(34, 197, 94, 0.2)' :
                                                    'rgba(59, 130, 246, 0.2)',
                                            borderColor: task.status === 'Blocked' ? 'rgba(239, 68, 68, 0.4)' :
                                                task.status === 'Completed' ? 'rgba(34, 197, 94, 0.4)' :
                                                    'rgba(59, 130, 246, 0.4)'
                                        }}
                                    >
                                        <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap w-full">
                                            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${task.status === 'Blocked' ? 'bg-red-500 animate-pulse' :
                                                    task.status === 'Completed' ? 'bg-green-500' :
                                                        'bg-blue-500'
                                                }`} />
                                            <span className="text-[10px] font-black text-white uppercase tracking-wider truncate">
                                                {task.task}
                                            </span>
                                        </div>

                                        {/* Duration Label */}
                                        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[8px] font-black text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                            {task.duration} DAYS • {task.startDate}
                                        </div>
                                    </motion.div>

                                    {/* Blocker Callout */}
                                    {task.status === 'Blocked' && (
                                        <div
                                            className="absolute -top-10 z-20 bg-red-600 text-white text-[8px] font-black uppercase px-2 py-1 rounded shadow-lg animate-bounce"
                                            style={{ left: `${getTimelineOffset(task.startDate)}px` }}
                                        >
                                            BLOCKER: {task.blocker || 'INTEL GAP'}
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Background Grid */}
                    <div className="absolute inset-0 top-[100px] flex pointer-events-none opacity-5">
                        {Array.from({ length: 12 }).map((_, i) => (
                            <div key={i} className="min-w-[150px] border-l border-white h-full" />
                        ))}
                    </div>
                </div>

                {/* Tactical Side Panel (Task Editor) */}
                <AnimatePresence>
                    {editingTaskId && editingTask && (
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 50 }}
                            className="w-96 bg-[#1c222d]/60 backdrop-blur-3xl rounded-[3rem] border border-purple-500/20 p-8 shadow-2xl relative"
                        >
                            <div className="flex justify-between items-center mb-8">
                                <h4 className="text-xl font-black text-white uppercase italic tracking-tighter">Vector Settings</h4>
                                <button
                                    onClick={() => setEditingTaskId(null)}
                                    className="p-2 hover:bg-white/5 rounded-full transition-colors"
                                >
                                    <ChevronRight className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>

                            <div className="space-y-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Identification</label>
                                    <input
                                        value={editingTask.task}
                                        onChange={(e) => updateTask(editingTask.id, { task: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white font-bold focus:outline-none focus:border-purple-500/50"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Deployment</label>
                                        <input
                                            type="date"
                                            value={editingTask.startDate}
                                            onChange={(e) => updateTask(editingTask.id, { startDate: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-xs text-gray-300 font-mono focus:outline-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Duration (Days)</label>
                                        <input
                                            type="number"
                                            value={editingTask.duration}
                                            onChange={(e) => updateTask(editingTask.id, { duration: parseInt(e.target.value) || 0 })}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white font-black text-center focus:outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Status Protocol</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {['Pending', 'Active', 'Blocked', 'Completed'].map((s) => (
                                            <button
                                                key={s}
                                                onClick={() => updateTask(editingTask.id, { status: s as any })}
                                                className={`py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${editingTask.status === s
                                                        ? 'bg-purple-600 border-purple-400 text-white'
                                                        : 'bg-white/5 border-white/5 text-gray-500 hover:border-purple-500/30'
                                                    }`}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {editingTask.status === 'Blocked' && (
                                    <div className="space-y-2 animate-pulse">
                                        <label className="text-[10px] font-black text-red-500 uppercase tracking-widest flex items-center gap-2">
                                            <AlertCircle className="w-3 h-3" /> Blocker Intel
                                        </label>
                                        <textarea
                                            value={editingTask.blocker || ''}
                                            onChange={(e) => updateTask(editingTask.id, { blocker: e.target.value })}
                                            className="w-full bg-red-500/5 border border-red-500/20 rounded-2xl p-4 text-sm text-red-400 focus:outline-none min-h-[100px]"
                                            placeholder="Identify original conflict..."
                                        />
                                    </div>
                                )}

                                <div className="pt-8 flex gap-4">
                                    <button
                                        onClick={() => {
                                            if (confirm('Purge vector data?')) {
                                                onUpdateTasks(tasks.filter(t => t.id !== editingTask.id));
                                                setEditingTaskId(null);
                                            }
                                        }}
                                        className="flex-grow bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-500 py-4 rounded-2xl transition-all flex items-center justify-center gap-2"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Purge</span>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Legend & Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-blue-500/10 border border-blue-500/20 p-8 rounded-[2.5rem] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity"><Clock className="w-16 h-16 text-blue-400" /></div>
                    <div className="flex items-center gap-3 mb-4">
                        <Clock className="w-5 h-5 text-blue-400" />
                        <span className="text-sm font-black text-white uppercase italic tracking-widest">Production Cycle</span>
                    </div>
                    <p className="text-xs text-gray-500 font-medium leading-relaxed">
                        Avg task duration is current <span className="text-white">{(filteredTasks.reduce((acc, t) => acc + (t.duration || 0), 0) / (filteredTasks.length || 1)).toFixed(1)} days</span>.
                        Focus on parallel workflows.
                    </p>
                </div>
                <div className="bg-purple-500/10 border border-purple-500/20 p-8 rounded-[2.5rem] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity"><GanttChartSquare className="w-16 h-16 text-purple-400" /></div>
                    <div className="flex items-center gap-3 mb-4">
                        <GanttChartSquare className="w-5 h-5 text-purple-400" />
                        <span className="text-sm font-black text-white uppercase italic tracking-widest">Logic Dependency</span>
                    </div>
                    <p className="text-xs text-gray-500 font-medium leading-relaxed">
                        Visualizing <span className="text-white">{filteredTasks.filter(t => t.dependencies?.length > 0).length} sequential links</span>.
                        Downstream delays may affect targets.
                    </p>
                </div>
                <div className="bg-white/5 border border-white/5 p-8 rounded-[2.5rem] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity"><FileText className="w-16 h-16 text-gray-400" /></div>
                    <div className="flex items-center gap-3 mb-4">
                        <FileText className="w-5 h-5 text-gray-400" />
                        <span className="text-sm font-black text-white uppercase italic tracking-widest">Timeline Legend</span>
                    </div>
                    <div className="grid grid-cols-2 gap-y-3">
                        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500" /><span className="text-[10px] text-gray-500 font-black uppercase">Active</span></div>
                        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500" /><span className="text-[10px] text-gray-500 font-black uppercase">Blocked</span></div>
                        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500" /><span className="text-[10px] text-gray-500 font-black uppercase">Done</span></div>
                        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-purple-500" /><span className="text-[10px] text-gray-500 font-black uppercase">Selected</span></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Timeline;
