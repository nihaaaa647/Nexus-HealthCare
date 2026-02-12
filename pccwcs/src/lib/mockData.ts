import { Patient, User, ClinicalAction } from './types';

export const MOCK_USERS: User[] = [
    { id: 'u0', name: 'Admin User', username: 'admin', role: 'Admin', password: 'admin123' },
    { id: 'u1', name: 'Dr. Smith', username: 'smith', role: 'Doctor', password: 'pass123' },
    { id: 'u2', name: 'Sarah Jones', username: 'sarah', role: 'Nurse', password: 'pass123' },
    { id: 'u3', name: 'Pharmacy Unit A', username: 'pharmacy', role: 'Pharmacy', password: 'pass123' },
    { id: 'u4', name: 'Lab Unit B', username: 'lab', role: 'Lab', password: 'pass123' },
    { id: 'u5', name: 'Front Desk', username: 'reception', role: 'Receptionist', password: 'pass123' },
];

export const MOCK_PATIENTS: Patient[] = [
    {
        id: 'p1',
        name: 'John Doe',
        age: 45,
        gender: 'Male',
        condition: 'Pneumonia',
        roomNumber: '101',
        attendingDoctorId: 'u1',
        allergies: ['Penicillin'],
        admissionDate: '2023-10-25',
        severity: 'Stable',
    },
    {
        id: 'p2',
        name: 'Jane Roe',
        age: 32,
        gender: 'Female',
        condition: 'Post-op Recovery',
        roomNumber: '102',
        attendingDoctorId: 'u1',
        admissionDate: '2023-10-26',
        severity: 'Stable',
    },
    {
        id: 'p3',
        name: 'Robert Brown',
        age: 60,
        gender: 'Male',
        condition: 'Cardiac Observation',
        roomNumber: 'ICU-1',
        attendingDoctorId: 'u1',
        admissionDate: '2023-10-24',
        severity: 'Critical',
    },
];

export const INITIAL_ACTIONS: ClinicalAction[] = [
    {
        id: 'a1',
        patientId: 'p1',
        initiatorId: 'u1',
        targetDepartment: 'Pharmacy',
        type: 'Prescription',
        description: 'Amoxicillin 500mg',
        status: 'Pending',
        priority: 'P2',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
    },
    {
        id: 'a2',
        patientId: 'p1',
        initiatorId: 'u1',
        targetDepartment: 'Lab',
        type: 'Diagnostic',
        description: 'Chest X-Ray',
        status: 'Completed',
        priority: 'P2',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    },
    {
        id: 'a3',
        patientId: 'p3',
        initiatorId: 'u1',
        targetDepartment: 'Lab',
        type: 'Diagnostic',
        description: 'Troponin Levels',
        status: 'In-Progress',
        priority: 'P1',
        timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(), // 10 mins ago
    },
    {
        id: 'n1',
        patientId: 'p1',
        initiatorId: 'u1',
        targetDepartment: 'Nursing',
        type: 'General',
        description: 'Vital signs q4h (BP, Pulse, SpO2)',
        status: 'Pending',
        priority: 'P2',
        timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    },
    {
        id: 'n2',
        patientId: 'p2',
        initiatorId: 'u1',
        targetDepartment: 'Nursing',
        type: 'General',
        description: 'Assist with ambulation',
        status: 'In-Progress',
        priority: 'P3',
        timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    },
    {
        id: 'n3',
        patientId: 'p3',
        initiatorId: 'u1',
        targetDepartment: 'Nursing',
        type: 'General',
        description: 'Wound dressing change - Abdominal',
        status: 'Pending',
        priority: 'P1',
        timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    },
    {
        id: 'a4',
        patientId: 'p2',
        initiatorId: 'u1',
        targetDepartment: 'Pharmacy',
        type: 'Prescription',
        description: 'Ibuprofen 400mg',
        status: 'Completed',
        priority: 'P3',
        timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
        completedAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(), // Finished 10 mins ago (110 mins MTTC)
    },
    {
        id: 'a5',
        patientId: 'p1',
        initiatorId: 'u1',
        targetDepartment: 'Lab',
        type: 'Diagnostic',
        description: 'Blood Glucose',
        status: 'Completed',
        priority: 'P2',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
        completedAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(), // Finished 25 mins ago (5 mins MTTC)
    }
];
