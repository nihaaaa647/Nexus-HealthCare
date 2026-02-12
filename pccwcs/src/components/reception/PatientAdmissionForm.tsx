'use client';

import React, { useState } from 'react';
import { useGlobal } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';

export function PatientAdmissionForm({ onSuccess }: { onSuccess?: () => void }) {
    const { addPatient, users } = useGlobal();
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
    const [severity, setSeverity] = useState<'Critical' | 'Urgent' | 'Stable'>('Stable');
    const [condition, setCondition] = useState('');
    const [roomNumber, setRoomNumber] = useState('');

    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [bloodPressure, setBloodPressure] = useState('');
    const [temperature, setTemperature] = useState('');
    const [bloodGroup, setBloodGroup] = useState('');
    const [isPregnant, setIsPregnant] = useState(false);
    const [isBreastfeeding, setIsBreastfeeding] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [insuranceProvider, setInsuranceProvider] = useState('');
    const [insurancePolicyNumber, setInsurancePolicyNumber] = useState('');
    const [hasInsurance, setHasInsurance] = useState(false);

    // Filter for doctors
    const doctors = users.filter(u => u.role === 'Doctor');
    const [attendingDoctorId, setAttendingDoctorId] = useState(doctors[0]?.id || 'u1');

    const [allergies, setAllergies] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Parse allergies (comma separated)
        const allergyList = allergies.split(',').map(a => a.trim()).filter(a => a);

        addPatient({
            name,
            age: parseInt(age) || 0,
            gender,
            condition,
            severity,
            roomNumber,
            attendingDoctorId,
            allergies: allergyList,
            weight: weight ? parseFloat(weight) : undefined,
            height: height ? parseFloat(height) : undefined,
            bloodPressure,
            temperature: temperature ? parseFloat(temperature) : undefined,
            bloodGroup,
            isPregnant: gender === 'Female' ? isPregnant : false,
            isBreastfeeding: gender === 'Female' ? isBreastfeeding : false,
            phoneNumber,
            insuranceProvider: hasInsurance ? insuranceProvider : undefined,
            insurancePolicyNumber: hasInsurance ? insurancePolicyNumber : undefined,
        });

        // Reset form
        setName('');
        setAge('');
        setCondition('');
        setRoomNumber('');
        setAllergies('');
        setWeight('');
        setHeight('');
        setBloodPressure('');
        setTemperature('');
        setBloodGroup('');
        setIsPregnant(false);
        setIsBreastfeeding(false);
        setPhoneNumber('');
        setInsuranceProvider('');
        setInsurancePolicyNumber('');
        setHasInsurance(false);

        if (onSuccess) onSuccess();
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Admit New Patient</CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" value={name} onChange={e => setName(e.target.value)} required placeholder="John Doe" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="age">Age</Label>
                            <Input id="age" type="number" value={age} onChange={e => setAge(e.target.value)} required placeholder="45" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="gender">Gender</Label>
                            <Select value={gender} onValueChange={(v: any) => setGender(v)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Male">Male</SelectItem>
                                    <SelectItem value="Female">Female</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} required placeholder="+1 (555) 000-0000" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="height">Height (cm)</Label>
                            <Input id="height" type="number" value={height} onChange={e => setHeight(e.target.value)} placeholder="175" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="weight">Weight (kg)</Label>
                            <Input id="weight" type="number" value={weight} onChange={e => setWeight(e.target.value)} placeholder="70" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="bp">Blood Pressure</Label>
                            <Input id="bp" value={bloodPressure} onChange={e => setBloodPressure(e.target.value)} placeholder="120/80" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="temp">Temperature (°C)</Label>
                            <Input id="temp" type="number" step="0.1" value={temperature} onChange={e => setTemperature(e.target.value)} placeholder="36.6" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="bloodGroup">Blood Group</Label>
                        <Select value={bloodGroup} onValueChange={setBloodGroup}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select blood group" />
                            </SelectTrigger>
                            <SelectContent>
                                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                                    <SelectItem key={bg} value={bg}>{bg}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {gender === 'Female' && (
                        <div className="flex flex-col gap-2 p-3 border rounded-md bg-muted/20">
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="pregnant"
                                    checked={isPregnant}
                                    onChange={e => setIsPregnant(e.target.checked)}
                                    className="h-4 w-4"
                                />
                                <Label htmlFor="pregnant" className="cursor-pointer">Patient is Pregnant</Label>
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="breastfeeding"
                                    checked={isBreastfeeding}
                                    onChange={e => setIsBreastfeeding(e.target.checked)}
                                    className="h-4 w-4"
                                />
                                <Label htmlFor="breastfeeding" className="cursor-pointer">Patient is Breastfeeding</Label>
                            </div>
                        </div>
                    )}

                    <div className="p-3 border rounded-md space-y-3 bg-muted/10">
                        <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-sm">Health Insurance</h4>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="hasInsurance"
                                    checked={hasInsurance}
                                    onChange={e => setHasInsurance(e.target.checked)}
                                    className="h-4 w-4"
                                />
                                <Label htmlFor="hasInsurance" className="cursor-pointer text-xs font-normal">Patient has insurance</Label>
                            </div>
                        </div>

                        {hasInsurance && (
                            <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                <div className="space-y-2">
                                    <Label htmlFor="insuranceProvider">Provider</Label>
                                    <Input id="insuranceProvider" value={insuranceProvider} onChange={e => setInsuranceProvider(e.target.value)} placeholder="e.g. Blue Cross" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="policyNumber">Policy ID / Number</Label>
                                    <Input id="policyNumber" value={insurancePolicyNumber} onChange={e => setInsurancePolicyNumber(e.target.value)} placeholder="XP-998877" />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="severity">Severity Status</Label>
                        <Select value={severity} onValueChange={(v: any) => setSeverity(v)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select severity" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Stable">Stable (Green)</SelectItem>
                                <SelectItem value="Urgent">Urgent (Yellow)</SelectItem>
                                <SelectItem value="Critical">Critical (Red)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="condition">Initial Condition</Label>
                        <Input id="condition" value={condition} onChange={e => setCondition(e.target.value)} required placeholder="e.g. Chest Pain" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="doctor">Assign Doctor</Label>
                        <Select value={attendingDoctorId} onValueChange={setAttendingDoctorId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select doctor" />
                            </SelectTrigger>
                            <SelectContent>
                                {doctors.map(doc => (
                                    <SelectItem key={doc.id} value={doc.id}>{doc.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="room">Room Number</Label>
                        <Input id="room" value={roomNumber} onChange={e => setRoomNumber(e.target.value)} required placeholder="e.g. 101-A" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="allergies">Allergies (comma separated)</Label>
                        <Input id="allergies" value={allergies} onChange={e => setAllergies(e.target.value)} placeholder="e.g. Penicillin, Peanuts" />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit" className="w-full">Admit Patient</Button>
                </CardFooter>
            </form>
        </Card>
    );
}
