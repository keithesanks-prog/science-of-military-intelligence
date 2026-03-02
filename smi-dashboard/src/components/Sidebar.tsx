import React from 'react';
import {
    LayoutDashboard,
    Calendar,
    Users,
    GanttChartSquare,
    FileText,
    Settings,
    Package,
    ChevronDown,
    Target
} from 'lucide-react';
import { Episode } from '../types';
import { motion } from 'framer-motion';

interface SidebarProps {
    activePage: string;
    setActivePage: (page: string) => void;
    episodes: Episode[];
    activeProjectId: string | null;
    onSelectProject: (id: string | null) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
    activePage,
    setActivePage,
    episodes,
    activeProjectId,
    onSelectProject
}) => {
    const activeProject = episodes.find(e => e.id === activeProjectId);

    const menuItems = [
        { id: 'episodes', label: 'Command Hub', icon: LayoutDashboard },
        { id: 'timeline', label: 'Strategic Timeline', icon: GanttChartSquare },
        { id: 'outreach', label: 'Outreach CRM', icon: Users },
        { id: 'scheduler', label: 'Shoot Scheduler', icon: Calendar },
        { id: 'pod', label: 'POD Generator', icon: FileText },
        { id: 'materials', label: 'Gear Checklist', icon: Package },
    ];

    return (
        <aside className="w-80 h-full glass-card rounded-none rounded-r-[3rem] p-8 flex flex-col border-y-0 border-l-0">
            {/* Project Selector HUB */}
            <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-500 rounded-xl shadow-lg shadow-blue-500/20">
                        <Target className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-2xl font-black tracking-tighter text-white font-['Outfit']">SMI HUB-01</h1>
                </div>

                <div className="relative group">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-2 mb-2 block">Active Vector Focus</label>
                    <div className="relative">
                        <select
                            value={activeProjectId || ''}
                            onChange={(e) => onSelectProject(e.target.value || null)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-sm font-bold text-white appearance-none focus:outline-none focus:border-blue-500/50 transition-all cursor-pointer hover:bg-white/10"
                        >
                            <option value="">GLOBAL OVERVIEW</option>
                            {episodes.map(ep => (
                                <option key={ep.id} value={ep.id}>{ep.title.toUpperCase()}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500 pointer-events-none group-hover:scale-110 transition-transform" />
                    </div>

                    {activeProject && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-3 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center gap-2"
                        >
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                            <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Focus: {activeProject.status}</span>
                        </motion.div>
                    )}
                </div>
            </div>

            <nav className="flex-grow space-y-2">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActivePage(item.id)}
                        className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-black transition-all group ${activePage === item.id
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 translate-x-1'
                            : 'text-gray-500 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <item.icon className={`w-5 h-5 ${activePage === item.id ? 'text-white' : 'text-gray-600 group-hover:text-blue-400'} transition-colors`} />
                        <span className="tracking-tight uppercase tracking-widest text-[11px]">{item.label}</span>
                    </button>
                ))}
            </nav>

            <div className="mt-auto pt-8 border-t border-white/5">
                <button className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-gray-700 hover:text-white transition-all group text-xs font-black uppercase tracking-widest">
                    <Settings className="w-5 h-5" />
                    System Core
                </button>
                <div className="mt-4 px-6">
                    <p className="text-[10px] text-gray-800 font-bold uppercase tracking-widest">Version: SMI-04-HUD</p>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
