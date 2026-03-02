import { useState, useEffect } from "react";
import { SMIState, Episode, Task, Contact, Event, POD } from "../types";
import { initialSMIState } from "../data/initialState";

export const useSMIState = () => {
    const [state, setState] = useState<SMIState>(initialSMIState);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem("smi_dashboard_state");
        if (saved) {
            try {
                const parsed = JSON.parse(saved) as SMIState;

                // Migrate data to include project scoping
                const migratedTasks = parsed.tasks.map(t => ({
                    ...t,
                    projectId: t.projectId || '1', // Default to first episode if missing
                    duration: t.duration ?? 0,
                    dependencies: t.dependencies ?? [],
                    status: t.status ?? 'Pending',
                    priority: t.priority ?? 'Medium'
                }));

                const migratedContacts = (parsed.contacts || []).map(c => ({
                    ...c,
                    email: c.email ?? '',
                    phone: c.phone ?? '',
                    notes: c.notes ?? ''
                }));

                const migratedPods = (parsed.pods || []).map(p => ({
                    ...p,
                    projectId: p.projectId || '1'
                }));

                setState({
                    ...parsed,
                    activeProjectId: parsed.activeProjectId || '1',
                    tasks: migratedTasks,
                    contacts: migratedContacts,
                    pods: migratedPods
                });
            } catch (e) {
                console.error("Failed to parse saved state", e);
            }
        }
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem("smi_dashboard_state", JSON.stringify(state));
        }
    }, [state, isLoaded]);

    const setActiveProject = (id: string | null) =>
        setState(s => ({ ...s, activeProjectId: id }));

    const updateEpisodes = (episodes: Episode[]) =>
        setState(s => ({ ...s, episodes }));

    const updateContacts = (contacts: Contact[]) =>
        setState(s => ({ ...s, contacts }));

    const updateEvents = (events: Event[]) =>
        setState(s => ({ ...s, events }));

    const updateTasks = (tasks: Task[]) =>
        setState(s => ({ ...s, tasks }));

    const updatePods = (pods: POD[]) =>
        setState(s => ({ ...s, pods }));

    const updateMaterials = (materials: SMIState["materials"]) =>
        setState(s => ({ ...s, materials }));

    return {
        state,
        isLoaded,
        setActiveProject,
        updateEpisodes,
        updateContacts,
        updateEvents,
        updateTasks,
        updatePods,
        updateMaterials
    };
};
