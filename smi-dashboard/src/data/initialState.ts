import { SMIState } from "../types";

export const initialSMIState: SMIState = {
    activeProjectId: '1', // Default focus on the first episode
    episodes: [
        {
            id: '1',
            title: 'The Spark That Changed the World',
            status: 'Pre-Production',
            progress: 25,
            startDate: '2026-02-20',
            endDate: '2026-03-30'
        },
        {
            id: '2',
            title: 'Friend or Foe',
            status: 'Scripting',
            progress: 10,
            startDate: '2026-04-01',
            endDate: '2026-05-15'
        },
        {
            id: '3',
            title: 'Digital Mirage',
            status: 'Idea',
            progress: 5,
            startDate: '2026-05-20',
            endDate: '2026-07-01'
        },
    ],
    contacts: [
        {
            id: 'c1',
            name: 'Dr. Elisa Müller',
            role: 'Radio History Expert (Karlsruhe)',
            status: 'Pending',
            email: 'e.mueller@karlsruhe-tech.edu',
            phone: '+49 721 6084',
            notes: 'Expert on Heinrich Hertz original laboratory equipment.'
        },
        {
            id: 'c2',
            name: 'George Lockard III',
            role: 'Descendant of SCR-270 Operator',
            status: 'In Discussion',
            email: 'george3@history-alliance.org',
            phone: '808-555-0192',
            notes: 'Grandson of the Opana Point radar operator.'
        },
        {
            id: 'c3',
            name: 'Harbor Master',
            role: 'Location Contact (Foggy Quay)',
            status: 'Contacted',
            email: 'admin@rotterdam-harbor.nl',
            phone: '+31 10 252',
            notes: 'Point of contact for shoot permits at the historic quay.'
        }
    ],
    events: [
        { id: 'e1', date: '2026-02-28', location: 'Coastal Cliff Site', activity: 'Location Scouting (Opana Simulation)', team: 'Director/DP' },
        { id: 'e2', date: '2026-03-05', location: 'Historical Lab Set', activity: 'Shoot Day 1: Hertz Experiment', team: 'Main Crew' },
        { id: 'e3', date: '2026-03-12', location: 'Waterfront Dock 4', activity: 'Shoot Day 2: Hülsmeyer Rotterdam', team: 'Main Crew' },
    ],
    tasks: [
        {
            id: 't1',
            projectId: '1',
            task: 'Rent 1940s Telephone Prop',
            assignee: 'Art Dept',
            startDate: '2026-02-26',
            duration: 3,
            dependencies: [],
            priority: 'High',
            status: 'Active'
        },
        {
            id: 't2',
            projectId: '1',
            task: 'Prepare "Fog" Machine for Harbor Shoot',
            assignee: 'Grip',
            startDate: '2026-03-05',
            duration: 2,
            dependencies: ['t1'],
            priority: 'Medium',
            status: 'Pending'
        },
        {
            id: 't3',
            projectId: '1',
            task: 'Location Access Permit (Hawaii)',
            assignee: 'Producer',
            startDate: '2026-02-25',
            duration: 10,
            dependencies: [],
            priority: 'Critical',
            status: 'Blocked',
            blocker: 'Waiting for Parks Department approval'
        },
        {
            id: 't4',
            projectId: '2',
            task: 'Draft Hertz Dialogue Scene',
            assignee: 'Scriptwriter',
            startDate: '2026-04-05',
            duration: 5,
            dependencies: [],
            priority: 'High',
            status: 'Active'
        }
    ],
    pods: [
        {
            id: 'pod1',
            projectId: '1',
            date: '2026-03-05',
            goals: ['Capture Hertz lab sequence', 'Record harbor fog atmospheric shots'],
            equipment: ['Main Camera', 'Fog Machine', 'Hertz Lab Prop Set'],
            crew: ['Director', 'DP', 'Gaffer', 'Art Dept']
        }
    ],
    materials: {
        camera: ['Main Camera Body', '24-70mm Lens', 'Tripod', 'ND Filters'],
        audio: ['Lavalier Mics (x2)', 'Boom Mic & Pole', 'External Recorder'],
        misc: ['Printed Scripts', 'Batteries (Charged)', 'SD Cards (Formatted)']
    }
};
