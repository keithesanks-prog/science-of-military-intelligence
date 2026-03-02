export interface Contact {
    id: string;
    name: string;
    role: string;
    email?: string;
    phone?: string;
    notes?: string;
    status: 'Pending' | 'Contacted' | 'In Discussion' | 'Confirmed' | 'Completed';
}

export interface Event {
    id: string;
    date: string;
    location: string;
    activity: string;
    team: string;
}

export interface Task {
    id: string;
    projectId: string; // Link to Episode
    task: string;
    assignee: string;
    startDate: string;
    duration: number;
    dependencies: string[];
    priority: 'Low' | 'Medium' | 'High' | 'Critical';
    status: 'Pending' | 'Active' | 'Blocked' | 'Completed';
    blocker?: string;
}

export interface Episode {
    id: string;
    title: string;
    status: 'Active' | 'Pre-Production' | 'Scripting' | 'Completed' | 'Archived' | 'Idea';
    progress: number;
    startDate: string;
    endDate: string;
}

export interface POD {
    id: string;
    projectId: string;
    date: string;
    goals: string[];
    equipment: string[];
    crew: string[];
}

export interface SMIState {
    episodes: Episode[];
    contacts: Contact[];
    events: Event[];
    tasks: Task[];
    activeProjectId: string | null; // Multi-project focus
    pods: POD[];
    materials: {
        camera: string[];
        audio: string[];
        misc: string[];
    };
}
