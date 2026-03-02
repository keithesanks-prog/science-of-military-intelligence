import React, { useState } from 'react';
import { Episode, Task } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import {
    AlertCircle,
    CheckCircle2,
    Clock,
    ChevronRight,
    BarChart3,
    Timer,
    Film,
    Calendar,
    Layers,
    Edit2,
    Trash2,
    Plus,
    Box,
    Target
} from 'lucide-react';

interface DashboardProps {
    episodes: Episode[];
    tasks: Task[];
    activeProjectId: string | null;
    onUpdateEpisodes: (episodes: Episode[]) => void;
    onUpdateTasks: (tasks: Task[]) => void;
}

const Dashboard: React.FC<DashboardProps> = ({
    episodes,
    tasks,
    activeProjectId,
    onUpdateEpisodes,
    onUpdateTasks
}) => {
    const [editingEpId, setEditingEpId] = useState<string | null>(null);

    // Scoped Data
    const filteredEpisodes = activeProjectId
        ? episodes.filter(ep => ep.id === activeProjectId)
        : episodes.filter(ep => ep.status !== 'Archived');

    const filteredTasks = activeProjectId
        ? tasks.filter(t => t.projectId === activeProjectId)
        : tasks;

    const blockedTasks = filteredTasks.filter(t => t.status === 'Blocked');

    const updateEp = (id: string, updates: Partial<Episode>) => {
        onUpdateEpisodes(episodes.map(ep => ep.id === id ? { ...ep, ...updates } : ep));
    };

    const updateTask = (id: string, updates: Partial<Task>) => {
        onUpdateTasks(tasks.map(t => t.id === id ? { ...t, ...updates } : t));
    };

    const deleteEp = (id: string) => {
        if (confirm('Decommission this project?')) {
            onUpdateEpisodes(episodes.filter(ep => ep.id !== id));
        }
    };

    return (
        <div className="space-y-12 max-w-7xl mx-auto">
            {/* Header Section */}
            <header className="flex justify-between items-end mb-8">
                <div>
                    <h2 className="text-4xl font-black font-['Outfit'] tracking-tighter text-white mb-2 underline decoration-blue-500/50 underline-offset-8 flex items-center gap-3">
                        {activeProjectId ? 'Project Oversight' : 'Global Command'}
                    </h2>
                    <p className="text-gray-500 font-medium font-mono text-xs uppercase tracking-widest">
                        {activeProjectId ? `Focused on Vector ID: ${activeProjectId}` : 'Multi-Project Synthetic Intelligence'}
                    </p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-2xl flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-blue-400" />
                        <span className="text-xs font-bold text-gray-300 tracking-widest uppercase">
                            Active Vectors: {filteredEpisodes.length}
                        </span>
                    </div>
                </div>
            </header>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence mode="popLayout">
                    {filteredEpisodes.map((ep, idx) => (
                        <motion.div
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ delay: idx * 0.1 }}
                            key={ep.id}
                            className={`group relative glass-card p-1 overflow-hidden ${activeProjectId === ep.id ? 'border-blue-500/30' : ''}`}
                        >
                            <div className="p-8 relative">
                                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <Film className="w-20 h-20 text-white" />
                                </div>

                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="relative">
                                            <select
                                                value={ep.status}
                                                onChange={(e) => updateEp(ep.id, { status: e.target.value as any })}
                                                className="appearance-none bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-wider text-blue-400 pr-10 focus:outline-none focus:border-blue-500/50"
                                            >
                                                <option value="Active">Active</option>
                                                <option value="Pre-Production">Pre-Prod</option>
                                                <option value="Scripting">Scripting</option>
                                                <option value="Idea">Idea</option>
                                                <option value="Completed">Completed</option>
                                                <option value="Archived">Archived</option>
                                            </select>
                                            <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-blue-500 rotate-90 pointer-events-none" />
                                        </div>
                                        <button
                                            onClick={() => deleteEp(ep.id)}
                                            className="p-2 text-gray-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <input
                                        value={ep.title}
                                        onChange={(e) => updateEp(ep.id, { title: e.target.value })}
                                        className="w-full bg-transparent text-2xl font-bold text-white mb-8 group-hover:text-blue-400 transition-colors tracking-tight leading-tight focus:outline-none border-b border-transparent focus:border-blue-500/30"
                                        placeholder="Intel Title..."
                                    />

                                    <div className="space-y-4">
                                        <div className="flex justify-between items-end mb-2">
                                            <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Global Progress</span>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="100"
                                                    value={ep.progress}
                                                    onChange={(e) => updateEp(ep.id, { progress: parseInt(e.target.value) || 0 })}
                                                    className="bg-white/5 border border-white/10 rounded w-12 text-center text-sm font-black text-white focus:outline-none py-0.5"
                                                />
                                                <span className="text-sm font-black text-white">%</span>
                                            </div>
                                        </div>
                                        <div className="h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/5 p-[1px]">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${ep.progress}%` }}
                                                transition={{ duration: 1.5, ease: "circOut" }}
                                                className="h-full bg-gradient-to-r from-blue-600 via-blue-400 to-cyan-300 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-8 pt-6 border-t border-white/5 grid grid-cols-2 gap-4">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-gray-500 font-bold uppercase mb-1 flex items-center gap-1">
                                                <Calendar className="w-3 h-3" /> Start
                                            </span>
                                            <input
                                                type="date"
                                                value={ep.startDate}
                                                onChange={(e) => updateEp(ep.id, { startDate: e.target.value })}
                                                className="bg-transparent text-xs text-gray-300 font-mono focus:outline-none"
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-gray-500 font-bold uppercase mb-1 flex items-center gap-1">
                                                <Calendar className="w-3 h-3" /> End
                                            </span>
                                            <input
                                                type="date"
                                                value={ep.endDate}
                                                onChange={(e) => updateEp(ep.id, { endDate: e.target.value })}
                                                className="bg-transparent text-xs text-gray-300 font-mono focus:outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {!activeProjectId && (
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                            const newEp: Episode = {
                                id: (episodes.length + 1).toString(),
                                title: 'New Episode Idea',
                                status: 'Idea',
                                progress: 0,
                                startDate: new Date().toISOString().split('T')[0],
                                endDate: new Date().toISOString().split('T')[0],
                            };
                            onUpdateEpisodes([...episodes, newEp]);
                        }}
                        className="group glass-card border-dashed border-white/10 flex flex-col items-center justify-center gap-4 p-8 text-gray-600 hover:text-blue-400 hover:border-blue-500/30 transition-all min-h-[350px]"
                    >
                        <div className="p-4 bg-white/5 rounded-full group-hover:bg-blue-500/10 transition-colors">
                            <Plus className="w-8 h-8" />
                        </div>
                        <span className="text-xs font-black uppercase tracking-[0.2em]">New Project Vector</span>
                    </motion.button>
                )}
            </div>

            {/* Issues & Blockers */}
            {blockedTasks.length > 0 && (
                <section className="bg-red-500/5 border border-red-500/20 rounded-[3rem] p-10 mt-12 backdrop-blur-md relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-10 opacity-5">
                        <AlertCircle className="w-32 h-32 text-red-500" />
                    </div>
                    <div className="flex items-center gap-4 mb-8 relative z-10">
                        <div className="p-3 bg-red-500/20 rounded-2xl">
                            <AlertCircle className="w-6 h-6 text-red-400" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-white tracking-tight uppercase italic">Critical Blockers Detected</h3>
                            <p className="text-red-400/60 text-sm font-medium">Immediate intervention required on the following vectors</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                        {blockedTasks.map((task) => (
                            <div key={task.id} className="bg-black/40 border border-red-500/20 p-6 rounded-3xl flex items-start gap-4 ring-1 ring-red-500/10">
                                <div className="mt-1">
                                    <Timer className="w-5 h-5 text-red-500" />
                                </div>
                                <div className="space-y-3 flex-grow">
                                    <div className="flex justify-between items-start">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-red-500/50">Vector: {task.id} • Proj: {task.projectId}</span>
                                    </div>
                                    <input
                                        value={task.blocker || ''}
                                        onChange={(e) => updateTask(task.id, { blocker: e.target.value })}
                                        className="w-full bg-transparent text-white font-bold leading-tight focus:outline-none border-b border-white/5 focus:border-red-500/30"
                                        placeholder="Describe Blocker..."
                                    />
                                    <div className="flex justify-between pt-2">
                                        <span className="text-xs text-gray-500">Operation: <span className="text-white font-medium">{task.task}</span></span>
                                        <button
                                            onClick={() => updateTask(task.id, { status: 'Active', blocker: '' })}
                                            className="text-[10px] font-black text-green-400 uppercase tracking-widest hover:text-green-300 transition-colors"
                                        >
                                            CLEAR BLOCKER
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Task Matrix */}
            <section className="mt-16">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-2xl font-black text-white tracking-tighter flex items-center gap-4">
                        Intel Matrix
                        <span className="text-xs bg-white/5 px-3 py-1 rounded-full text-gray-500 font-bold">{filteredTasks.length} Vectors</span>
                    </h3>
                    <button
                        onClick={() => {
                            const newTask: Task = {
                                id: `T${tasks.length + 1}`,
                                projectId: activeProjectId || '1',
                                task: 'New Task',
                                assignee: 'Unassigned',
                                startDate: new Date().toISOString().split('T')[0],
                                duration: 1,
                                dependencies: [],
                                priority: 'Medium',
                                status: 'Pending'
                            };
                            onUpdateTasks([...tasks, newTask]);
                        }}
                        className="flex items-center gap-2 text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] px-4 py-2 bg-blue-500/10 rounded-full border border-blue-500/20 hover:bg-blue-500/20 transition-all"
                    >
                        <Plus className="w-3 h-3" /> {activeProjectId ? 'Add Project Task' : 'Add Global Task'}
                    </button>
                </div>

                <div className="bg-[#161b22]/40 backdrop-blur-xl rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-white/5 text-[10px] text-gray-500 uppercase tracking-[0.2em] font-black">
                                    <th className="p-8">Vector Identification</th>
                                    <th className="p-8">Scope</th>
                                    <th className="p-8">Status</th>
                                    <th className="p-8">Temporal Data</th>
                                    <th className="p-8">Logic Links</th>
                                    <th className="p-8">Personnel</th>
                                    <th className="p-8">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 font-medium">
                                {filteredTasks.map((task) => (
                                    <tr key={task.id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="p-8">
                                            <div className="flex flex-col space-y-2">
                                                <input
                                                    value={task.task}
                                                    onChange={(e) => updateTask(task.id, { task: e.target.value })}
                                                    className="bg-transparent text-white font-bold tracking-tight focus:outline-none group-hover:text-blue-400 transition-colors"
                                                />
                                                <select
                                                    value={task.priority}
                                                    onChange={(e) => updateTask(task.id, { priority: e.target.value as any })}
                                                    className={`appearance-none bg-transparent text-[10px] font-black uppercase tracking-widest focus:outline-none ${task.priority === 'Critical' ? 'text-purple-500' :
                                                            task.priority === 'High' ? 'text-red-400' : 'text-gray-500'
                                                        }`}
                                                >
                                                    <option value="Critical">Critical</option>
                                                    <option value="High">High</option>
                                                    <option value="Medium">Medium</option>
                                                    <option value="Low">Low</option>
                                                </select>
                                            </div>
                                        </td>
                                        <td className="p-8">
                                            <select
                                                value={task.projectId}
                                                onChange={(e) => updateTask(task.id, { projectId: e.target.value })}
                                                className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-[10px] font-black text-gray-500 uppercase focus:outline-none"
                                            >
                                                {episodes.map(ep => (
                                                    <option key={ep.id} value={ep.id}>EP.{ep.id}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="p-8">
                                            <div className="relative">
                                                <select
                                                    value={task.status}
                                                    onChange={(e) => updateTask(task.id, { status: e.target.value as any })}
                                                    className={`appearance-none bg-white/5 border border-white/5 rounded-full px-4 py-1.5 text-xs font-bold focus:outline-none pr-10 ${task.status === 'Completed' ? 'text-green-500' :
                                                            task.status === 'Blocked' ? 'text-red-500' : 'text-blue-400'
                                                        }`}
                                                >
                                                    <option value="Active">Active</option>
                                                    <option value="Pending">Pending</option>
                                                    <option value="Blocked">Blocked</option>
                                                    <option value="Completed">Completed</option>
                                                </select>
                                                <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 rotate-90 opacity-40 pointer-events-none" />
                                            </div>
                                        </td>
                                        <td className="p-8">
                                            <div className="space-y-2">
                                                <input
                                                    type="date"
                                                    value={task.startDate}
                                                    onChange={(e) => updateTask(task.id, { startDate: e.target.value })}
                                                    className="bg-transparent text-xs text-gray-500 font-mono focus:outline-none"
                                                />
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="number"
                                                        value={task.duration}
                                                        onChange={(e) => updateTask(task.id, { duration: parseInt(e.target.value) || 0 })}
                                                        className="bg-white/5 border border-white/5 rounded w-10 text-center text-xs text-white focus:outline-none py-0.5 font-bold"
                                                    />
                                                    <span className="text-[10px] text-gray-600 font-black uppercase">Days</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-8">
                                            <input
                                                value={task.dependencies?.join(', ')}
                                                onChange={(e) => updateTask(task.id, { dependencies: e.target.value.split(',').map(s => s.trim()).filter(s => s) })}
                                                placeholder="e.g. T1, T2"
                                                className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg text-[10px] font-mono text-gray-500 w-24 focus:outline-none focus:border-blue-500/30"
                                            />
                                        </td>
                                        <td className="p-8">
                                            <div className="flex flex-col space-y-2">
                                                <input
                                                    value={task.assignee}
                                                    onChange={(e) => updateTask(task.id, { assignee: e.target.value })}
                                                    className="bg-transparent text-sm text-gray-300 focus:outline-none"
                                                />
                                                <div className="flex items-center gap-2">
                                                    <div className="w-5 h-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[8px] font-black text-gray-500">
                                                        {task.assignee[0]}
                                                    </div>
                                                    <span className="text-[10px] text-gray-600 font-bold uppercase">Assigned Personnel</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-8">
                                            <button
                                                onClick={() => onUpdateTasks(tasks.filter(t => t.id !== task.id))}
                                                className="p-3 bg-red-500/5 border border-red-500/10 rounded-2xl text-red-500/30 hover:text-red-400 hover:bg-red-500/10 transition-all"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Dashboard;
