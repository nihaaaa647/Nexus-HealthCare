'use client';

import React from 'react';
import { useGlobal } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, AlertTriangle, UserPlus, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function PendingRequests() {
    const { actions, patients, currentUser, updateActionStatus, assignPatientToDoctor, users } = useGlobal();

    // All pending actions across the system
    const pendingActions = actions
        .filter(a => a.status === 'Pending')
        .sort((a, b) => {
            // P1 first, then P2, then P3
            const priorityOrder = { P1: 0, P2: 1, P3: 2 };
            const pDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
            if (pDiff !== 0) return pDiff;
            return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        });

    const getPatient = (id: string) => patients.find(p => p.id === id);
    const getInitiator = (id: string) => users.find(u => u.id === id);

    // Unassigned patients (not assigned to current doctor)
    const unassignedPatients = patients.filter(
        p => p.attendingDoctorId !== (currentUser?.id || 'u1')
    );

    const handleAccept = (actionId: string) => {
        updateActionStatus(actionId, 'In-Progress');
    };

    const handleAssignToMe = (patientId: string) => {
        assignPatientToDoctor(patientId, currentUser?.id || 'u1');
    };

    const priorityStyles: Record<string, string> = {
        P1: 'bg-red-500/15 text-red-400 border-red-500/30',
        P2: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
        P3: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    };

    return (
        <div className="space-y-6">
            {/* Pending Actions Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-amber-500" />
                        Pending Requests
                        {pendingActions.length > 0 && (
                            <Badge variant="destructive" className="ml-2">{pendingActions.length}</Badge>
                        )}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {pendingActions.length === 0 ? (
                        <p className="text-muted-foreground text-center py-6">No pending requests. All clear! ✅</p>
                    ) : (
                        <div className="space-y-3">
                            {pendingActions.map(action => {
                                const patient = getPatient(action.patientId);
                                const initiator = getInitiator(action.initiatorId);

                                return (
                                    <div
                                        key={action.id}
                                        className={`flex items-center justify-between p-4 rounded-lg border transition-all hover:shadow-sm ${action.priority === 'P1'
                                                ? 'border-red-500/30 bg-red-500/5'
                                                : 'border-border bg-card'
                                            }`}
                                    >
                                        <div className="space-y-1 flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                {action.priority === 'P1' && (
                                                    <AlertTriangle className="h-4 w-4 text-red-500 shrink-0" />
                                                )}
                                                <span className="font-semibold truncate">{action.description}</span>
                                                <Badge className={`text-xs ${priorityStyles[action.priority]}`}>
                                                    {action.priority}
                                                </Badge>
                                                <Badge variant="outline" className="text-xs">
                                                    {action.type}
                                                </Badge>
                                            </div>
                                            <div className="text-sm text-muted-foreground flex items-center gap-2 flex-wrap">
                                                <span>
                                                    Patient:{' '}
                                                    <Link
                                                        href={`/patient/${patient?.id}`}
                                                        className="font-medium text-primary hover:underline"
                                                    >
                                                        {patient?.name || 'Unknown'}
                                                    </Link>
                                                </span>
                                                <span>•</span>
                                                <span>From: {initiator?.name || 'System'}</span>
                                                <span>•</span>
                                                <span>Dept: {action.targetDepartment}</span>
                                            </div>
                                            {action.notes && (
                                                <div className="text-xs bg-muted p-2 rounded mt-1">
                                                    {action.notes}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 ml-4 shrink-0">
                                            <Button
                                                onClick={() => handleAccept(action.id)}
                                                size="sm"
                                                className="gap-1"
                                            >
                                                Accept
                                            </Button>
                                            <Button asChild size="sm" variant="ghost">
                                                <Link href={`/patient/${action.patientId}`}>
                                                    <ArrowRight className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Unassigned Patients Section */}
            {unassignedPatients.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <UserPlus className="h-5 w-5 text-blue-500" />
                            Available Patients
                            <Badge variant="secondary" className="ml-2">{unassignedPatients.length}</Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {unassignedPatients.map(patient => {
                                const assignedDoc = users.find(u => u.id === patient.attendingDoctorId);
                                return (
                                    <div
                                        key={patient.id}
                                        className="flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:shadow-sm transition-all"
                                    >
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold">{patient.name}</span>
                                                <Badge variant="outline" className="text-xs">
                                                    Rm: {patient.roomNumber}
                                                </Badge>
                                                {patient.severity && (
                                                    <Badge
                                                        variant={
                                                            patient.severity === 'Critical'
                                                                ? 'destructive'
                                                                : patient.severity === 'Urgent'
                                                                    ? 'secondary'
                                                                    : 'outline'
                                                        }
                                                        className="text-xs"
                                                    >
                                                        {patient.severity}
                                                    </Badge>
                                                )}
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                {patient.condition}
                                                {assignedDoc && <span> • Currently with: {assignedDoc.name}</span>}
                                            </div>
                                        </div>
                                        <Button
                                            onClick={() => handleAssignToMe(patient.id)}
                                            size="sm"
                                            variant="outline"
                                            className="gap-2"
                                        >
                                            <UserPlus className="h-4 w-4" />
                                            Add to My List
                                        </Button>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
