export type UserRole = 'Doctor' | 'Nurse' | 'Pharmacy' | 'Lab' | 'Receptionist' | 'Admin';

export interface User {
    id: string;
    username: string; // Added for login
    name: string;
    role: UserRole;
    avatar?: string;
    password?: string; // Optional for security/redaction
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
    weight?: number; // kg
    height?: number; // cm
    bloodGroup?: string;
    bloodPressure?: string;
    temperature?: number;
    isPregnant?: boolean;
    isBreastfeeding?: boolean;
    phoneNumber?: string;
    insuranceProvider?: string;
    insurancePolicyNumber?: string;
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

export type AppointmentStatus = 'Scheduled' | 'Checked-in' | 'Cancelled' | 'Completed';

export interface Appointment {
    id: string;
    patientName: string;
    contactNumber: string;
    doctorId: string;
    department: string;
    time: string; // ISO string
    reason: string;
    status: AppointmentStatus;
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
