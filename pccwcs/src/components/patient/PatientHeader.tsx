import React from 'react';
import { Patient, ActionStatus } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Calendar, Activity, Scale, Ruler, Thermometer, Droplet, Baby, Phone, Shield } from 'lucide-react';

interface PatientHeaderProps {
    patient: Patient;
    overallStatus: ActionStatus;
}

import { useGlobal } from '@/lib/store';

export function PatientHeader({ patient, overallStatus }: PatientHeaderProps) {
    const { users, currentUser, updatePatientSeverity } = useGlobal();

    const canEditSeverity = currentUser?.role === 'Doctor' || currentUser?.role === 'Nurse';

    const getDoctorName = (id: string) => {
        const doc = users.find(u => u.id === id);
        return doc ? doc.name : id;
    };

    const getStatusColor = (status: ActionStatus) => {
        switch (status) {
            case 'Pending': return 'destructive'; // Red for attention
            case 'In-Progress': return 'secondary'; // Yellow/Orangeish usually, secondary here
            case 'Completed': return 'default'; // Greenish
            default: return 'outline';
        }
    };

    const getSeverityColor = (severity?: string) => {
        switch (severity) {
            case 'Critical': return 'destructive';
            case 'Urgent': return 'secondary'; // or yellow if we had a warning variant
            case 'Stable': return 'outline'; // or default/success
            default: return 'outline';
        }
    };

    const handleSeverityChange = (value: string) => {
        updatePatientSeverity(patient.id, value as Patient['severity']);
    };

    return (
        <Card className="mb-6 border-l-4 border-l-primary/50">
            <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl font-bold tracking-tight">{patient.name}</h1>
                            <Badge variant="outline" className="text-muted-foreground">ID: {patient.id.toUpperCase()}</Badge>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <User className="h-4 w-4" />
                                <span>{patient.gender}, {patient.age}y</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>Admitted: {new Date(patient.admissionDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-1 text-foreground font-medium">
                                <Activity className="h-4 w-4" />
                                <span>{getDoctorName(patient.attendingDoctorId)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                        {canEditSeverity ? (
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Severity:</span>
                                <Select value={patient.severity || ''} onValueChange={handleSeverityChange}>
                                    <SelectTrigger className="w-[140px] h-8 text-sm">
                                        <SelectValue placeholder="Set severity" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Critical">
                                            <span className="text-red-600 font-semibold">🔴 Critical</span>
                                        </SelectItem>
                                        <SelectItem value="Urgent">
                                            <span className="text-amber-600 font-semibold">🟡 Urgent</span>
                                        </SelectItem>
                                        <SelectItem value="Stable">
                                            <span className="text-green-600 font-semibold">🟢 Stable</span>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        ) : (
                            <Badge variant={getSeverityColor(patient.severity)}>
                                {patient.severity}
                            </Badge>
                        )}
                        <span className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">Current Condition</span>
                        <div className="text-xl font-medium">{patient.condition}</div>
                        <Badge variant={getStatusColor(overallStatus)} className="text-base px-4 py-1">
                            Status: {overallStatus}
                        </Badge>
                    </div>
                </div>

                {/* Vitals & Admin Section */}
                {(patient.weight || patient.height || patient.bloodPressure || patient.temperature || patient.bloodGroup || patient.isPregnant || patient.isBreastfeeding || patient.phoneNumber || patient.insuranceProvider) && (
                    <div className="mt-6 pt-4 border-t grid grid-cols-2 md:grid-cols-4 gap-4">
                        {patient.weight && (
                            <div className="flex flex-col">
                                <span className="text-xs text-muted-foreground uppercase font-bold">Weight</span>
                                <div className="flex items-center gap-1 font-medium">
                                    <Scale className="h-4 w-4 text-primary/70" />
                                    {patient.weight} kg
                                </div>
                            </div>
                        )}
                        {patient.height && (
                            <div className="flex flex-col">
                                <span className="text-xs text-muted-foreground uppercase font-bold">Height</span>
                                <div className="flex items-center gap-1 font-medium">
                                    <Ruler className="h-4 w-4 text-primary/70" />
                                    {patient.height} cm
                                </div>
                            </div>
                        )}
                        {patient.bloodPressure && (
                            <div className="flex flex-col">
                                <span className="text-xs text-muted-foreground uppercase font-bold">Blood Pressure</span>
                                <div className="flex items-center gap-1 font-medium">
                                    <Activity className="h-4 w-4 text-primary/70" />
                                    {patient.bloodPressure}
                                </div>
                            </div>
                        )}
                        {patient.temperature && (
                            <div className="flex flex-col">
                                <span className="text-xs text-muted-foreground uppercase font-bold">Temperature</span>
                                <div className="flex items-center gap-1 font-medium">
                                    <Thermometer className="h-4 w-4 text-primary/70" />
                                    {patient.temperature}°C
                                </div>
                            </div>
                        )}
                        {patient.bloodGroup && (
                            <div className="flex flex-col">
                                <span className="text-xs text-muted-foreground uppercase font-bold">Blood Group</span>
                                <div className="flex items-center gap-1 font-medium">
                                    <Droplet className="h-4 w-4 text-red-500" />
                                    {patient.bloodGroup}
                                </div>
                            </div>
                        )}
                        {(patient.isPregnant || patient.isBreastfeeding) && (
                            <div className="flex flex-col">
                                <span className="text-xs text-muted-foreground uppercase font-bold">Status</span>
                                <div className="flex gap-2">
                                    {patient.isPregnant && <Badge variant="secondary" className="gap-1"><Baby className="h-3 w-3" /> Pregnant</Badge>}
                                    {patient.isBreastfeeding && <Badge variant="secondary" className="gap-1"><Baby className="h-3 w-3" /> Breastfeeding</Badge>}
                                </div>
                            </div>
                        )}
                        {patient.phoneNumber && (
                            <div className="flex flex-col">
                                <span className="text-xs text-muted-foreground uppercase font-bold">Contact</span>
                                <div className="flex items-center gap-1 font-medium">
                                    <Phone className="h-4 w-4 text-primary/70" />
                                    {patient.phoneNumber}
                                </div>
                            </div>
                        )}
                        {(patient.insuranceProvider || patient.insurancePolicyNumber) && (
                            <div className="flex flex-col col-span-2">
                                <span className="text-xs text-muted-foreground uppercase font-bold">Health Insurance</span>
                                <div className="flex items-center gap-2 font-medium">
                                    <Shield className="h-4 w-4 text-primary/70" />
                                    <span>{patient.insuranceProvider}</span>
                                    {patient.insurancePolicyNumber && <span className="text-muted-foreground">({patient.insurancePolicyNumber})</span>}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {patient.allergies && patient.allergies.length > 0 && (
                    <div className="mt-4 pt-4 border-t flex items-center gap-2">
                        <span className="text-xs text-muted-foreground uppercase font-bold">Allergies:</span>
                        <div className="flex gap-2">
                            {patient.allergies.map(allergy => (
                                <Badge key={allergy} variant="destructive" className="bg-red-100 text-red-700 hover:bg-red-200 border-red-200">
                                    {allergy}
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

