'use client';

import React from 'react';
import { useGlobal } from '@/lib/store';
import { PatientAdmissionForm } from '@/components/reception/PatientAdmissionForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function ReceptionPage() {
    const { patients } = useGlobal();

    // Sort patients by admission date (newest first)
    const sortedPatients = [...patients].sort((a, b) =>
        new Date(b.admissionDate).getTime() - new Date(a.admissionDate).getTime()
    );

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Reception & Admission</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column: Admission Form */}
                <div className="md:col-span-1">
                    <PatientAdmissionForm />
                </div>

                {/* Right Column: Recent Admissions List */}
                <div className="md:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Currently Admitted Patients ({patients.length})</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
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
                                                    <span className="font-semibold text-lg">{patient.name}</span>
                                                    <span className="text-xs text-muted-foreground uppercase">ID: {patient.id}</span>
                                                    {isCritical && <Badge variant="destructive" className="ml-2 animate-pulse">CRITICAL</Badge>}
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    {patient.age}y / {patient.gender} • Room: {patient.roomNumber}
                                                </div>
                                                <div className="text-sm font-medium text-primary mt-1">
                                                    {patient.condition}
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end gap-2">
                                                <Badge variant="outline">{new Date(patient.admissionDate).toLocaleDateString()}</Badge>
                                                {patient.severity && !isCritical && (
                                                    <Badge variant={patient.severity === 'Urgent' ? 'secondary' : 'outline'}>{patient.severity}</Badge>
                                                )}
                                                {patient.allergies && patient.allergies.length > 0 && (
                                                    <Badge variant="destructive" className="text-xs">Allergies</Badge>
                                                )}
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
