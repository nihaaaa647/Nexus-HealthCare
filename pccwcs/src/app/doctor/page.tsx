'use client';

import React, { useState } from 'react';
import { useGlobal } from '@/lib/store';
import { PatientList } from '@/components/doctor/PatientList';
import { PendingRequests } from '@/components/doctor/PendingRequests';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PatientAdmissionForm } from '@/components/reception/PatientAdmissionForm';
import { DoctorNotifications } from '@/components/doctor/DoctorNotifications';

export default function DoctorDashboard() {
    const { patients, actions, currentUser } = useGlobal();
    const [openAdmit, setOpenAdmit] = useState(false);

    const doctorId = currentUser?.id || 'u1';
    const myPatients = patients.filter(p => p.attendingDoctorId === doctorId);
    const allPatientsSorted = [...patients].sort((a, b) => new Date(b.admissionDate).getTime() - new Date(a.admissionDate).getTime());
    const pendingCount = actions.filter(a => a.status === 'Pending').length;

    return (
        <div className="space-y-8">
            <DoctorNotifications />
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Doctor Dashboard</h1>
                    <p className="text-muted-foreground">Manage your patients and clinical workflows.</p>
                </div>

                {currentUser?.role === 'Receptionist' && (
                    <Dialog open={openAdmit} onOpenChange={setOpenAdmit}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" /> Admit Patient
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Admit New Patient</DialogTitle>
                                <DialogDescription>Enter patient details to admit them to the system.</DialogDescription>
                            </DialogHeader>
                            <PatientAdmissionForm onSuccess={() => setOpenAdmit(false)} />
                        </DialogContent>
                    </Dialog>
                )}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">My Patients</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{myPatients.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Critical Attention</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-destructive">
                            {myPatients.filter(p => actions.some(a => a.patientId === p.id && a.priority === 'P1')).length}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold ${pendingCount > 0 ? 'text-amber-500' : ''}`}>
                            {pendingCount}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Hospital Patients</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{patients.length}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Pending Requests & Patient Assignment */}
            <PendingRequests />

            {/* All Hospital Patients */}
            <div>
                <h2 className="text-xl font-semibold mb-4">All Hospital Patients ({patients.length})</h2>
                <PatientList patients={allPatientsSorted} actions={actions} currentDoctorId={doctorId} />
            </div>
        </div>
    );
}
