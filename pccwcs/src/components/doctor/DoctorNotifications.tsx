import React, { useEffect, useState } from 'react';
import { useGlobal } from '@/lib/store';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Bell, X, AlertCircle, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Patient } from '@/lib/types';

const STORAGE_KEY_SEEN = 'nexus_seen_patients';

export function DoctorNotifications() {
    const { patients, currentUser } = useGlobal();
    const [unseenPatients, setUnseenPatients] = useState<Patient[]>([]);

    useEffect(() => {
        if (!currentUser || currentUser.role !== 'Doctor') return;

        // Get patients assigned to this doctor
        const myPatients = patients.filter(p => p.attendingDoctorId === currentUser.id);

        // Get list of already acknowledged patient IDs
        const seenIds = JSON.parse(localStorage.getItem(STORAGE_KEY_SEEN) || '[]');

        // Filter for patients the doctor hasn't "seen" an alert for yet
        const unseen = myPatients.filter(p => !seenIds.includes(p.id));
        setUnseenPatients(unseen);
    }, [patients, currentUser]);

    const handleDismiss = (patientId: string) => {
        const seenIds = JSON.parse(localStorage.getItem(STORAGE_KEY_SEEN) || '[]');
        const updatedSeen = [...new Set([...seenIds, patientId])];
        localStorage.setItem(STORAGE_KEY_SEEN, JSON.stringify(updatedSeen));
        setUnseenPatients(prev => prev.filter(p => p.id !== patientId));
    };

    if (unseenPatients.length === 0) return null;

    return (
        <div className="space-y-3 mb-6 animate-in fade-in slide-in-from-top-4 duration-500">
            {unseenPatients.map((patient) => {
                const isCritical = patient.severity === 'Critical';
                const isUrgent = patient.severity === 'Urgent';

                return (
                    <Alert
                        key={patient.id}
                        variant={isCritical ? "destructive" : "default"}
                        className={`relative pr-12 ${isUrgent ? 'border-amber-500 bg-amber-500/5 text-amber-600 dark:text-amber-400' : ''}`}
                    >
                        {isCritical ? <AlertCircle className="h-4 w-4" /> : isUrgent ? <AlertTriangle className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
                        <AlertTitle className="font-bold flex items-center gap-2">
                            New Patient Assigned: {patient.name}
                            {isCritical && <span className="text-[10px] bg-destructive text-destructive-foreground px-1.5 py-0.5 rounded uppercase">Emergency</span>}
                        </AlertTitle>
                        <AlertDescription className="text-sm">
                            Room {patient.roomNumber} • Condition: {patient.condition} • Severity: <span className="font-semibold">{patient.severity || 'Normal'}</span>
                        </AlertDescription>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-2 h-8 w-8 opacity-70 hover:opacity-100"
                            onClick={() => handleDismiss(patient.id)}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </Alert>
                );
            })}
        </div>
    );
}
