import React from 'react';
import Link from 'next/link';
import { Patient, ClinicalAction } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, ArrowRight, User } from 'lucide-react';

interface PatientListProps {
    patients: Patient[];
    actions: ClinicalAction[];
    currentDoctorId?: string;
}

export function PatientList({ patients, actions, currentDoctorId }: PatientListProps) {
    // Helper to check if patient has critical pending actions
    const hasCriticalUpdates = (patientId: string) => {
        return actions.some(
            a => a.patientId === patientId && a.status !== 'Completed' && a.priority === 'P1'
        );
    };

    const getPatientStatus = (patientId: string) => {
        const patientActions = actions.filter(a => a.patientId === patientId);
        const active = patientActions.find(a => a.status === 'In-Progress');
        const critical = patientActions.find(a => a.priority === 'P1' && a.status !== 'Completed');

        if (critical) return { label: 'CRITICAL ATTENTION', color: 'destructive' as const };
        if (active) return { label: 'In Progress', color: 'secondary' as const };
        return { label: 'Stable', color: 'outline' as const };
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {patients.map(patient => {
                const status = getPatientStatus(patient.id);
                const critical = hasCriticalUpdates(patient.id);

                return (
                    <Card key={patient.id} className={`transition-all hover:shadow-md ${critical ? 'border-destructive/50 ring-1 ring-destructive/20' : ''}`}>
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        <User className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg">{patient.name}</CardTitle>
                                        <CardDescription>Rm: {patient.roomNumber} • ID: {patient.id.toUpperCase()}</CardDescription>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {currentDoctorId && patient.attendingDoctorId === currentDoctorId && (
                                        <Badge className="bg-blue-500/15 text-blue-500 border-blue-500/30">My Patient</Badge>
                                    )}
                                    {/* @ts-ignore */}
                                    <Badge variant={status.color}>{status.label}</Badge>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-sm space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Condition:</span>
                                    <span className="font-medium">{patient.condition}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Admitted:</span>
                                    <span>{new Date(patient.admissionDate).toLocaleDateString()}</span>
                                </div>
                                {critical && (
                                    <div className="bg-destructive/10 text-destructive text-xs p-2 rounded flex items-center gap-2 mt-2">
                                        <AlertCircle className="h-4 w-4" />
                                        <span>Critical diagnostic results pending review</span>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button asChild className="w-full" variant={critical ? "default" : "secondary"}>
                                <Link href={`/patient/${patient.id}`}>
                                    View Patient Record <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>
                );
            })}
        </div>
    );
}
