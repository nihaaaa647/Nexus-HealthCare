'use client';

import React, { use } from 'react';
import { useParams } from 'next/navigation';
import { useGlobal } from '@/lib/store';
import { PatientHeader } from '@/components/patient/PatientHeader';
import { ActionTimeline } from '@/components/patient/ActionTimeline';
import { QuickActions } from '@/components/patient/QuickActions';
import { ChatWidget } from '@/components/ChatWidget';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function PatientPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { patients, actions, addAction, currentUser } = useGlobal();

    const patient = patients.find(p => p.id === id);
    const patientActions = actions.filter(a => a.patientId === id).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    if (!patient) {
        return <div className="p-8 text-center text-muted-foreground">Patient not found</div>;
    }

    // Determine overall status based on most recent active action
    const activeAction = patientActions.find(a => a.status === 'In-Progress' || a.status === 'Pending');
    const overallStatus = activeAction ? activeAction.status : 'Completed';

    const handleQuickAction = (type: string) => {
        // In a real app, this would open a modal with a form.
        // For this hackathon demo, we'll quickly add a mock action to demonstrate real-time updates.
        const newAction = {
            patientId: patient.id,
            initiatorId: currentUser?.id || 'u1',
            targetDepartment: type === 'Prescription' ? 'Pharmacy' : 'Lab',
            type: type as any,
            description: `${type} request initiated via Quick Action`,
            priority: 'P2',
        };
        // @ts-ignore
        addAction(newAction);
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <PatientHeader patient={patient} overallStatus={overallStatus} />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <ActionTimeline actions={patientActions} />
                </div>

                <div className="space-y-6">
                    <QuickActions patientId={patient.id} />

                    <ChatWidget patientId={patient.id} />
                </div>
            </div>
        </div>
    );
}
