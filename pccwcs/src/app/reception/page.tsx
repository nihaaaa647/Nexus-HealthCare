'use client';

import React from 'react';
import { useGlobal } from '@/lib/store';
import { PatientAdmissionForm } from '@/components/reception/PatientAdmissionForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import { AppointmentScheduler } from '@/components/reception/AppointmentScheduler';

export default function ReceptionPage() {
    const { patients } = useGlobal();

    // Sort patients by admission date (newest first)
    const sortedPatients = [...patients].sort((a, b) =>
        new Date(b.admissionDate).getTime() - new Date(a.admissionDate).getTime()
    );

    return (
        <div className="max-w-[1400px] mx-auto space-y-6 px-4">
            <h1 className="text-3xl font-bold tracking-tight">Reception & Admission</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Column 1: Appointment Scheduling */}
                <div className="lg:col-span-1">
                    <AppointmentScheduler />
                </div>

                {/* Column 2: Admission Form */}
                <div className="lg:col-span-1">
                    <PatientAdmissionForm />
                </div>

                {/* Column 3: Recent Admissions List */}
                <div className="lg:col-span-1">
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle>Currently Admitted ({patients.length})</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4 max-h-[calc(100vh-250px)] overflow-y-auto pr-2">
                                {sortedPatients.map(patient => {
                                    const isCritical = patient.severity === 'Critical';
                                    return (
                                        <div
                                            key={patient.id}
                                            className={`flex items-center justify-between p-4 border rounded-lg transition-colors ${isCritical
                                                ? 'border-destructive bg-destructive/10 hover:bg-destructive/20'
                                                : 'bg-card hover:bg-accent/50'
                                                }`}
                                        >
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold">{patient.name}</span>
                                                    {isCritical && <Badge variant="destructive" className="ml-2 animate-pulse">CRIT</Badge>}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    {patient.age}y/{patient.gender} • Rm: {patient.roomNumber}
                                                </div>
                                                <div className="text-xs font-medium text-primary mt-1">
                                                    {patient.condition}
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end gap-1">
                                                {patient.severity && !isCritical && (
                                                    <Badge variant={patient.severity === 'Urgent' ? 'secondary' : 'outline'} className="text-[10px]">{patient.severity}</Badge>
                                                )}
                                                <span className="text-[10px] text-muted-foreground">{new Date(patient.admissionDate).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
