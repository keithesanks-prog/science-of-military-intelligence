import React, { useState } from 'react';
import { Event } from '../types';
import { motion } from 'framer-motion';
import { MapPin, Users, CalendarPlus, Trash2, Map, Users2 } from 'lucide-react';

interface SchedulerProps {
    events: Event[];
    onUpdateEvents: (events: Event[]) => void;
}

const Scheduler: React.FC<SchedulerProps> = ({ events, onUpdateEvents }) => {
    const [newEvent, setNewEvent] = useState({ date: '', location: '', activity: '', team: '' });

    const handleAdd = () => {
        if (newEvent.date && newEvent.activity) {
            onUpdateEvents([...events, { ...newEvent, id: Date.now().toString() }]);
            setNewEvent({ date: '', location: '', activity: '', team: '' });
        }
    };

    const handleRemove = (id: string) => {
        onUpdateEvents(events.filter(e => e.id !== id));
    };

    const handleChange = (id: string, field: keyof Event, value: string) => {
        onUpdateEvents(events.map(e => e.id === id ? { ...e, [field]: value } : e));
    };

    return (
        <div className="space-y-12 max-w-7xl mx-auto">
            <header className="flex justify-between items-end">
                <div>
                    <h2 className="text-4xl font-black font-['Outfit'] tracking-tighter text-white mb-2 underline decoration-blue-500/50 underline-offset-8">
                        Operation Timeline
                    </h2>
                    <p className="text-gray-500 font-medium italic">Production events, scouting & deployment windows</p>
                </div>
                <div className="bg-white/5 px-6 py-3 rounded-2xl border border-white/10 flex items-center gap-3">
                    <CalendarPlus className="w-5 h-5 text-blue-400" />
                    <span className="text-xs font-black uppercase text-gray-300">{events.length} Scheduled Events</span>
                </div>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                <div className="xl:col-span-2 space-y-6">
                    {events.map((event, idx) => (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            key={event.id}
                            className="bg-[#161b22]/30 backdrop-blur-md border border-white/5 p-8 rounded-[2.5rem] group hover:border-blue-500/20 transition-all duration-300 shadow-xl relative overflow-hidden"
                        >
                            <div className="flex flex-col md:flex-row gap-10">
                                <div className="flex flex-col min-w-[120px]">
                                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.3em] mb-2">Cycle Date</span>
                                    <input
                                        type="date"
                                        className="bg-transparent text-xl font-black text-white focus:outline-none focus:text-blue-400 cursor-pointer"
                                        value={event.date}
                                        onChange={e => handleChange(event.id, 'date', e.target.value)}
                                    />
                                </div>

                                <div className="flex-grow flex flex-col gap-6">
                                    <input
                                        className="bg-transparent text-2xl font-bold text-white focus:outline-none focus:text-blue-400 w-full placeholder-gray-700"
                                        placeholder="Operation Name"
                                        value={event.activity}
                                        onChange={e => handleChange(event.id, 'activity', e.target.value)}
                                    />

                                    <div className="flex flex-wrap gap-10">
                                        <div className="flex items-center gap-3">
                                            <MapPin className="w-4 h-4 text-gray-500" />
                                            <input
                                                className="bg-transparent text-xs text-gray-400 focus:outline-none focus:text-white font-medium italic uppercase tracking-widest border-b border-transparent focus:border-white/10"
                                                placeholder="Location Area"
                                                value={event.location}
                                                onChange={e => handleChange(event.id, 'location', e.target.value)}
                                            />
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Users className="w-4 h-4 text-gray-500" />
                                            <input
                                                className="bg-transparent text-xs text-gray-400 focus:outline-none focus:text-white font-medium uppercase tracking-widest border-b border-transparent focus:border-white/10"
                                                placeholder="Lead Team"
                                                value={event.team}
                                                onChange={e => handleChange(event.id, 'team', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleRemove(event.id)} className="p-4 rounded-2xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all">
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="space-y-10">
                    <div className="bg-blue-500/5 backdrop-blur-xl border border-blue-500/20 p-10 rounded-[2.5rem] shadow-3xl h-fit">
                        <h3 className="text-xl font-black text-white uppercase tracking-widest mb-8 border-b border-white/5 pb-4">Initialize Operation</h3>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest px-1">Phase Activity</label>
                                <input
                                    placeholder="e.g. Scrambled Signal Test"
                                    className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl focus:outline-none focus:border-blue-500/50 transition-all font-bold text-white placeholder-gray-700"
                                    value={newEvent.activity}
                                    onChange={e => setNewEvent({ ...newEvent, activity: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest px-1">Deployment Date</label>
                                <input
                                    type="date"
                                    className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl focus:outline-none focus:border-blue-500/50 transition-all font-black text-blue-400"
                                    value={newEvent.date}
                                    onChange={e => setNewEvent({ ...newEvent, date: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest px-1">Target Location</label>
                                <input
                                    placeholder="e.g. Hawaii Radar Silo"
                                    className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl focus:outline-none focus:border-blue-500/50 transition-all font-medium text-gray-400"
                                    value={newEvent.location}
                                    onChange={e => setNewEvent({ ...newEvent, location: e.target.value })}
                                />
                            </div>
                            <button
                                onClick={handleAdd}
                                className="w-full py-5 bg-blue-500 text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-500/20 hover:bg-blue-400 transition-all active:scale-95 flex items-center justify-center gap-3"
                            >
                                Schedule Event
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Scheduler;
