"use client";

import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Dashboard from '../components/Dashboard';
import Outreach from '../components/Outreach';
import Scheduler from '../components/Scheduler';
import POD from '../components/POD';
import Materials from '../components/Materials';
import Timeline from '../components/Timeline';
import { useSMIState } from '../hooks/useSMIState';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const {
    state,
    isLoaded,
    setActiveProject,
    updateEpisodes,
    updateContacts,
    updateEvents,
    updateTasks,
    updatePods,
    updateMaterials
  } = useSMIState();

  const [activePage, setActivePage] = useState('episodes');

  if (!isLoaded) return (
    <div className="min-h-screen bg-[#05070a] flex items-center justify-center">
      <div className="text-blue-500 font-black tracking-widest animate-pulse font-mono">INITIALIZING SMI_CORE_v4.0...</div>
    </div>
  );

  return (
    <main className="flex h-screen bg-[#05070a] text-white overflow-hidden font-inter selection:bg-blue-500/30">
      {/* Background HUD Ambience */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-20">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[150px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 mix-blend-overlay" />
      </div>

      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        episodes={state.episodes}
        activeProjectId={state.activeProjectId}
        onSelectProject={setActiveProject}
      />

      <div className="flex-grow overflow-y-auto custom-scrollbar relative">
        <div className="p-12 relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePage + (state.activeProjectId || 'global')}
              initial={{ opacity: 0, y: 10, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -10, filter: 'blur(10px)' }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            >
              {activePage === 'episodes' && (
                <Dashboard
                  episodes={state.episodes}
                  tasks={state.tasks}
                  activeProjectId={state.activeProjectId}
                  onUpdateEpisodes={updateEpisodes}
                  onUpdateTasks={updateTasks}
                />
              )}
              {activePage === 'timeline' && (
                <Timeline
                  tasks={state.tasks}
                  activeProjectId={state.activeProjectId}
                  onUpdateTasks={updateTasks}
                />
              )}
              {activePage === 'outreach' && (
                <Outreach
                  contacts={state.contacts}
                  onUpdateContacts={updateContacts}
                />
              )}
              {activePage === 'scheduler' && (
                <Scheduler
                  events={state.events}
                  onUpdateEvents={updateEvents}
                />
              )}
              {activePage === 'pod' && (
                <POD
                  state={state}
                  activeProjectId={state.activeProjectId || ''}
                  onUpdateState={(updatedState) => {
                    if (updatedState.pods) updatePods(updatedState.pods);
                  }}
                />
              )}
              {activePage === 'materials' && (
                <Materials
                  materials={state.materials}
                  onUpdateMaterials={updateMaterials}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
