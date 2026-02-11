'use client';

import React from 'react';
import { useGlobal } from '@/lib/store';
import { PharmacyQueue } from '@/components/pharmacy/PharmacyQueue';

export default function PharmacyPage() {
    const { actions, patients, updateActionStatus } = useGlobal();

    // Filter for pharmacy actions
    const pharmacyActions = actions.filter(a => a.targetDepartment === 'Pharmacy');

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Pharmacy Queue</h1>
                    <p className="text-muted-foreground">Manage ongoing prescriptions and dispensations.</p>
                </div>
            </div>

            <PharmacyQueue
                actions={pharmacyActions}
                patients={patients}
                onStatusUpdate={updateActionStatus}
            />
        </div>
    );
}
