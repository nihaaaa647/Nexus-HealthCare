'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Patient, ClinicalAction, ActionStatus, PriorityLevel, ActionType, PatientNote, Appointment, AppointmentStatus } from './types';
import { MOCK_USERS, MOCK_PATIENTS, INITIAL_ACTIONS } from './mockData';

interface GlobalState {
    currentUser: User | null;
    users: User[];
    patients: Patient[];
    notes: PatientNote[];
    actions: ClinicalAction[];
    patientNotes: PatientNote[];
    appointments: Appointment[];
    setCurrentUser: (user: User | null) => void;
    addPatient: (patient: Omit<Patient, 'id' | 'admissionDate'>) => void;
    addAction: (action: Omit<ClinicalAction, 'id' | 'timestamp' | 'status'>) => void;
    updateActionStatus: (actionId: string, status: ActionStatus) => void;
    assignPatientToDoctor: (patientId: string, doctorId: string) => void;
    updatePatientSeverity: (patientId: string, severity: Patient['severity']) => void;
    addNote: (patientId: string, content: string) => void;
    getNotesForPatient: (patientId: string) => PatientNote[];
    addAppointment: (appointment: Omit<Appointment, 'id' | 'status'>) => void;
    updateAppointmentStatus: (id: string, status: AppointmentStatus) => void;
    getActionCounts: (department: string) => { pending: number; inProgress: number; completed: number };
    login: (username: string, role: string, password?: string) => boolean;
    logout: () => void;
    addUser: (user: Omit<User, 'id'>) => void;
    changePassword: (userId: string, newPassword: string) => void;
}

const GlobalContext = createContext<GlobalState | undefined>(undefined);

const STORAGE_KEY_ACTIONS = 'pccwcs_actions';
const STORAGE_KEY_USER = 'pccwcs_current_user';
const STORAGE_KEY_USERS_LIST = 'pccwcs_users_list';
const STORAGE_KEY_NOTES = 'pccwcs_notes';
const STORAGE_KEY_APPOINTMENTS = 'pccwcs_appointments';

export function GlobalProvider({ children }: { children: React.ReactNode }) {
    const [currentUser, setCurrentUserState] = useState<User | null>(null);
    const [users, setUsers] = useState<User[]>(MOCK_USERS);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [actions, setActions] = useState<ClinicalAction[]>([]);
    const [patientNotes, setPatientNotes] = useState<PatientNote[]>([]);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [patientsLoaded, setPatientsLoaded] = useState(false);

    // Load initial data
    useEffect(() => {
        // Load patients from LocalStorage or API
        const storedPatients = localStorage.getItem('pccwcs_patients');
        if (storedPatients) {
            setPatients(JSON.parse(storedPatients));
            setPatientsLoaded(true);
        } else {
            // Fallback to fetch or mock
            fetch('/api/patients')
                .then(res => res.json())
                .then(data => {
                    if (data && data.length > 0) {
                        setPatients(data);
                        localStorage.setItem('pccwcs_patients', JSON.stringify(data));
                    } else {
                        setPatients(MOCK_PATIENTS);
                        localStorage.setItem('pccwcs_patients', JSON.stringify(MOCK_PATIENTS));
                    }
                    setPatientsLoaded(true);
                })
                .catch(() => {
                    setPatients(MOCK_PATIENTS);
                    localStorage.setItem('pccwcs_patients', JSON.stringify(MOCK_PATIENTS));
                    setPatientsLoaded(true);
                });
        }

        const storedActions = localStorage.getItem(STORAGE_KEY_ACTIONS);
        if (storedActions) {
            setActions(JSON.parse(storedActions));
        } else {
            setActions(INITIAL_ACTIONS);
            localStorage.setItem(STORAGE_KEY_ACTIONS, JSON.stringify(INITIAL_ACTIONS));
        }

        const storedUsersList = localStorage.getItem(STORAGE_KEY_USERS_LIST);
        if (storedUsersList) {
            setUsers(JSON.parse(storedUsersList));
        } else {
            // First run: persist mock users to storage so admins can edit them
            localStorage.setItem(STORAGE_KEY_USERS_LIST, JSON.stringify(MOCK_USERS));
        }

        const storedUser = localStorage.getItem(STORAGE_KEY_USER);
        if (storedUser) {
            setCurrentUserState(JSON.parse(storedUser));
        }

        const storedNotes = localStorage.getItem(STORAGE_KEY_NOTES);
        if (storedNotes) {
            setPatientNotes(JSON.parse(storedNotes));
        }

        const storedAppointments = localStorage.getItem(STORAGE_KEY_APPOINTMENTS);
        if (storedAppointments) {
            setAppointments(JSON.parse(storedAppointments));
        }
    }, []);

    // Sync with other tabs
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === STORAGE_KEY_ACTIONS && e.newValue) {
                setActions(JSON.parse(e.newValue));
            }
            if (e.key === STORAGE_KEY_USERS_LIST && e.newValue) {
                setUsers(JSON.parse(e.newValue));
            }
            if (e.key === STORAGE_KEY_APPOINTMENTS && e.newValue) {
                setAppointments(JSON.parse(e.newValue));
            }
            if (e.key === 'pccwcs_patients' && e.newValue) {
                setPatients(JSON.parse(e.newValue));
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const setCurrentUser = (user: User | null) => {
        setCurrentUserState(user);
        if (user) {
            localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
        } else {
            localStorage.removeItem(STORAGE_KEY_USER);
        }
    };

    const login = (username: string, role: string, password?: string) => {
        // Find user by username
        const user = users.find(u => u.username === username && u.role === role);

        if (user) {
            // Check password
            if (password && user.password && user.password !== password) {
                return false;
            }
            setCurrentUser(user);
            return true;
        }

        return false;
    };

    const logout = () => {
        setCurrentUser(null);
    };

    const addUser = (userData: Omit<User, 'id'>) => {
        const newUser: User = {
            ...userData,
            id: `u${Date.now()}`,
        };
        const updatedUsers = [...users, newUser];
        setUsers(updatedUsers);
        localStorage.setItem(STORAGE_KEY_USERS_LIST, JSON.stringify(updatedUsers));
    };

    const changePassword = (userId: string, newPassword: string) => {
        const updatedUsers = users.map(u =>
            u.id === userId ? { ...u, password: newPassword } : u
        );
        setUsers(updatedUsers);
        localStorage.setItem(STORAGE_KEY_USERS_LIST, JSON.stringify(updatedUsers));

        // Update current user if it's the one changing password
        if (currentUser && currentUser.id === userId) {
            const updatedUser = { ...currentUser, password: newPassword };
            setCurrentUser(updatedUser);
        }
    };

    const addPatient = (patientData: Omit<Patient, 'id' | 'admissionDate'>) => {
        const newPatient: Patient = {
            ...patientData,
            id: `p${Date.now()}`,
            admissionDate: new Date().toISOString(),
        };
        const updatedPatients = [...patients, newPatient];
        setPatients(updatedPatients);
        localStorage.setItem('pccwcs_patients', JSON.stringify(updatedPatients));

        // Persist to server (optional/mock)
        fetch('/api/patients', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newPatient),
        }).catch(err => console.error('Failed to save patient to server:', err));
    };

    const assignPatientToDoctor = (patientId: string, doctorId: string) => {
        const updatedPatients = patients.map(p =>
            p.id === patientId ? { ...p, attendingDoctorId: doctorId } : p
        );
        setPatients(updatedPatients);
        localStorage.setItem('pccwcs_patients', JSON.stringify(updatedPatients));

        // Persist updated patient list to server
        fetch('/api/patients', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedPatients),
        }).catch(err => console.error('Failed to update patient on server:', err));
    };

    // Helper for Smart Prioritization
    const analyzePriority = (description: string): PriorityLevel => {
        const text = description.toUpperCase();
        if (text.includes('STAT') || text.includes('EMERGENCY') || text.includes('ASAP') || text.includes('CRITICAL')) {
            return 'P1';
        }
        if (text.includes('URGENT')) {
            return 'P2';
        }
        return 'P3';
    };

    // Helper for Clinical Safety Check (Mock)
    const checkSafety = (patientId: string, description: string): string | null => {
        const patient = patients.find(p => p.id === patientId);
        if (!patient || !patient.allergies) return null;

        const text = description.toUpperCase();
        // Simple mock check
        if (patient.allergies.includes('Penicillin') && (text.includes('PENICILLIN') || text.includes('AMOXICILLIN'))) {
            return 'WARNING: Patient has Penicillin allergy!';
        }
        return null;
    };

    const addAction = (newActionData: Omit<ClinicalAction, 'id' | 'timestamp' | 'status'>) => {
        // 1. Smart Prioritization
        let priority = newActionData.priority;
        if (!priority || priority === 'P2') { // Only auto-set if not explicitly set to P1 or P3 (defaulting behavior)
            priority = analyzePriority(newActionData.description);
        }

        // 2. Safety Check (In a real app, this might block or require override. Here we just append to notes)
        const safetyWarning = checkSafety(newActionData.patientId, newActionData.description);
        let notes = newActionData.notes || '';
        if (safetyWarning) {
            notes = notes ? `${notes} | ${safetyWarning}` : safetyWarning;
            // Force priority up if safety issue is detected? Maybe not, but let's flag it.
        }

        const newAction: ClinicalAction = {
            ...newActionData,
            priority,
            notes,
            id: crypto.randomUUID(),
            timestamp: new Date().toISOString(),
            status: 'Pending',
        };

        const updatedActions = [newAction, ...actions];
        setActions(updatedActions);
        localStorage.setItem(STORAGE_KEY_ACTIONS, JSON.stringify(updatedActions));
    };

    const updateActionStatus = (actionId: string, status: ActionStatus) => {
        const updatedActions = actions.map((action) =>
            action.id === actionId ? { ...action, status } : action
        );
        setActions(updatedActions);
        localStorage.setItem(STORAGE_KEY_ACTIONS, JSON.stringify(updatedActions));
    };

    const updatePatientSeverity = (patientId: string, severity: Patient['severity']) => {
        const updatedPatients = patients.map(p => p.id === patientId ? { ...p, severity } : p);
        setPatients(updatedPatients);
        localStorage.setItem('pccwcs_patients', JSON.stringify(updatedPatients));
    };

    const getActionCounts = (department: string) => {
        return actions.reduce(
            (acc, action) => {
                if (action.targetDepartment === department) {
                    if (action.status === 'Pending') acc.pending++;
                    if (action.status === 'In-Progress') acc.inProgress++;
                    if (action.status === 'Completed') acc.completed++;
                }
                return acc;
            },
            { pending: 0, inProgress: 0, completed: 0 }
        );
    };

    const addNote = (patientId: string, content: string) => {
        const note: PatientNote = {
            id: crypto.randomUUID(),
            patientId,
            authorId: currentUser?.id || 'u1',
            authorName: currentUser?.name || 'Unknown',
            authorRole: currentUser?.role || 'Doctor',
            content,
            timestamp: new Date().toISOString(),
        };
        const updated = [note, ...patientNotes];
        setPatientNotes(updated);
        localStorage.setItem(STORAGE_KEY_NOTES, JSON.stringify(updated));
    };

    const getNotesForPatient = (patientId: string) => {
        return patientNotes
            .filter(n => n.patientId === patientId)
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    };

    const addAppointment = (apptData: Omit<Appointment, 'id' | 'status'>) => {
        const newAppt: Appointment = {
            ...apptData,
            id: crypto.randomUUID(),
            status: 'Scheduled',
        };
        const updated = [...appointments, newAppt];
        setAppointments(updated);
        localStorage.setItem(STORAGE_KEY_APPOINTMENTS, JSON.stringify(updated));
    };

    const updateAppointmentStatus = (id: string, status: AppointmentStatus) => {
        const updated = appointments.map(a => a.id === id ? { ...a, status } : a);
        setAppointments(updated);
        localStorage.setItem(STORAGE_KEY_APPOINTMENTS, JSON.stringify(updated));
    };

    return (
        <GlobalContext.Provider
            value={{
                currentUser,
                users,
                patients,
                notes: patientNotes,
                actions,
                patientNotes,
                appointments,
                setCurrentUser,
                addPatient,
                addAction,
                updateActionStatus,
                assignPatientToDoctor,
                updatePatientSeverity,
                addNote,
                getNotesForPatient,
                addAppointment,
                updateAppointmentStatus,
                getActionCounts,
                login,
                logout,
                addUser,
                changePassword,
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
}

export function useGlobal() {
    const context = useContext(GlobalContext);
    if (context === undefined) {
        throw new Error('useGlobal must be used within a GlobalProvider');
    }
    return context;
}
