export type UserRole = 'Doctor' | 'Nurse' | 'Pharmacy' | 'Lab' | 'Receptionist';

export interface User {
    id: string;
    name: string;
    role: UserRole;
    avatar?: string;
}

export interface Patient {
    id: string;
    name: string;
    age: number;
    gender: 'Male' | 'Female' | 'Other';
    condition: string;
    roomNumber: string;
    attendingDoctorId: string;
    allergies?: string[];
    admissionDate: string;
    severity?: 'Critical' | 'Urgent' | 'Stable';
}

export type ActionType = 'Prescription' | 'Diagnostic' | 'Referral' | 'CareInstruction' | 'Lab Request' | 'General';
export type ActionStatus = 'Pending' | 'In-Progress' | 'Completed' | 'Rejected';
export type PriorityLevel = 'P1' | 'P2' | 'P3';

export interface ClinicalAction {
    id: string;
    patientId: string;
    initiatorId: string;
    targetDepartment: 'Pharmacy' | 'Lab' | 'Nursing' | 'General';
    type: ActionType;
    description: string;
    status: ActionStatus;
    priority: PriorityLevel;
    timestamp: string;
    metadata?: Record<string, any>;
    notes?: string;
}

export interface PatientNote {
    id: string;
    patientId: string;
    authorId: string;
    authorName: string;
    authorRole: string;
    content: string;
    timestamp: string;
}
