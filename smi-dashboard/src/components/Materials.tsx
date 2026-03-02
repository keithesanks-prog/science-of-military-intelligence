import React from 'react';
import { Camera, Mic, Box, Check, Plus, Minus, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

interface MaterialsProps {
    materials: {
        camera: string[];
        audio: string[];
        misc: string[];
    };
    onUpdateMaterials: (materials: any) => void;
}

const Materials: React.FC<MaterialsProps> = ({ materials, onUpdateMaterials }) => {
    const icons = {
        camera: Camera,
        audio: Mic,
        misc: Box
    };

    const handleAdd = (cat: 'camera' | 'audio' | 'misc') => {
        const newMaterials = { ...materials };
        newMaterials[cat].push('New Intelligence Asset');
        onUpdateMaterials(newMaterials);
    };

    const handleRemove = (cat: 'camera' | 'audio' | 'misc', idx: number) => {
        const newMaterials = { ...materials };
        newMaterials[cat].splice(idx, 1);
        onUpdateMaterials(newMaterials);
    };

    return (
        <div className="space-y-12 max-w-7xl mx-auto">
            <header className="flex justify-between items-end">
                <div>
                    <h2 className="text-4xl font-black font-['Outfit'] tracking-tighter text-white mb-2 underline decoration-cyan-500/50 underline-offset-8">
                        Deployment Logistics
                    </h2>
                    <p className="text-gray-500 font-medium italic">Mission-critical gear check & equipment tracking</p>
                </div>
                <div className="bg-white/5 px-6 py-3 rounded-2xl border border-white/10 flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-cyan-400" />
                    <span className="text-xs font-black uppercase text-gray-300 tracking-widest">Pre-Flight Ready</span>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {(['camera', 'audio', 'misc'] as const).map((cat, catIdx) => {
                    const Icon = icons[cat];
                    return (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: catIdx * 0.1 }}
                            key={cat}
                            className="bg-[#161b22]/40 backdrop-blur-xl border border-white/5 p-8 rounded-[2.5rem] shadow-2xl flex flex-col group hover:border-cyan-500/20 transition-all duration-300"
                        >
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-3 bg-white/5 rounded-2xl">
                                    <Icon className="w-5 h-5 text-gray-300 group-hover:text-cyan-400 transition-colors" />
                                </div>
                                <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em]">{cat === 'misc' ? 'Logistics' : cat}</h3>
                            </div>

                            <ul className="space-y-3 flex-grow">
                                {materials[cat].map((item, idx) => (
                                    <motion.li
                                        key={idx}
                                        className="flex items-center gap-4 group/item py-1"
                                    >
                                        <div className="flex-shrink-0 relative w-6 h-6 flex items-center justify-center">
                                            <input type="checkbox" className="peer absolute inset-0 opacity-0 cursor-pointer z-10" />
                                            <div className="w-5 h-5 rounded border border-white/10 bg-white/5 peer-checked:bg-cyan-500 peer-checked:border-cyan-500 transition-all flex items-center justify-center">
                                                <Check className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                                            </div>
                                        </div>

                                        <input
                                            className="bg-transparent border-none text-sm font-medium text-gray-300 focus:outline-none focus:text-cyan-400 w-full transition-colors truncate"
                                            value={item}
                                            onChange={(e) => {
                                                const newMaterials = { ...materials };
                                                newMaterials[cat][idx] = e.target.value;
                                                onUpdateMaterials(newMaterials);
                                            }}
                                        />

                                        <button
                                            onClick={() => handleRemove(cat, idx)}
                                            className="opacity-0 group-item/hover:opacity-100 p-1 rounded-lg hover:bg-red-500/10 text-gray-600 hover:text-red-400 transition-all"
                                        >
                                            <Minus className="w-3 h-3" />
                                        </button>
                                    </motion.li>
                                ))}
                            </ul>

                            <button
                                onClick={() => handleAdd(cat)}
                                className="mt-8 py-3 bg-white/5 hover:bg-cyan-500/10 text-gray-500 hover:text-cyan-400 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2"
                            >
                                <Plus className="w-3 h-3" />
                                Add Asset
                            </button>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

export default Materials;
