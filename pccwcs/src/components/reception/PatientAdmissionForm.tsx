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
            allergies: allergyList
        });

        // Reset form
        setName('');
        setAge('');
        setCondition('');
        setRoomNumber('');
        setAllergies('');

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
