'use client';

import React, { useState } from 'react';
import { useGlobal } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, CheckCircle2, Clock, MapPin, User, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { AppointmentStatus } from '@/lib/types';
import { cn } from '@/lib/utils'; // Assuming this exists from project setup

export function AppointmentScheduler() {
    const { appointments, addAppointment, updateAppointmentStatus, users } = useGlobal();

    // Form State
    const [patientName, setPatientName] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [doctorId, setDoctorId] = useState('');
    const [department, setDepartment] = useState('General');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [reason, setReason] = useState('');

    const doctors = users.filter(u => u.role === 'Doctor');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Combine date and time
        const isoTime = new Date(`${date}T${time}`).toISOString();

        addAppointment({
            patientName,
            contactNumber,
            doctorId,
            department,
            time: isoTime,
            reason,
        });

        // Reset form
        setPatientName('');
        setContactNumber('');
        setReason('');
        // Keep date/doctor for convenience
    };

    // Filter appointments for the selected date (or today if none selected) to show in the list
    const displayDate = date || new Date().toISOString().split('T')[0];
    const dailyAppointments = appointments
        .filter(a => a.time.startsWith(displayDate))
        .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());

    const getStatusColor = (status: AppointmentStatus) => {
        switch (status) {
            case 'Scheduled': return 'secondary';
            case 'Checked-in': return 'default'; // primary/greenish
            case 'Cancelled': return 'destructive';
            case 'Completed': return 'outline';
            default: return 'secondary';
        }
    };

    return (
        <div className="space-y-6">
            {/* Booking Form */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" /> New Appointment
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="patientName">Patient Name</Label>
                                <Input id="patientName" value={patientName} onChange={e => setPatientName(e.target.value)} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="contact">Contact Number</Label>
                                <Input id="contact" value={contactNumber} onChange={e => setContactNumber(e.target.value)} required />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="department">Department</Label>
                                <Select value={department} onValueChange={setDepartment}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Dept" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="General">General Practice</SelectItem>
                                        <SelectItem value="Cardiology">Cardiology</SelectItem>
                                        <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                                        <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="doctor">Doctor</Label>
                                <Select value={doctorId} onValueChange={setDoctorId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Doctor" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {doctors.map(doc => (
                                            <SelectItem key={doc.id} value={doc.id}>{doc.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="date">Date</Label>
                                <Input id="date" type="date" value={date} onChange={e => setDate(e.target.value)} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="time">Time</Label>
                                <Input id="time" type="time" value={time} onChange={e => setTime(e.target.value)} required />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="reason">Reason for Visit</Label>
                            <Input id="reason" value={reason} onChange={e => setReason(e.target.value)} placeholder="e.g. Fever, Checkup" />
                        </div>

                        <Button type="submit" className="w-full">Book Appointment</Button>
                    </form>
                </CardContent>
            </Card>

            {/* Daily Schedule List */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                        <Clock className="h-4 w-4" /> Schedule for {displayDate}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4 max-h-[400px] overflow-y-auto">
                        {dailyAppointments.length === 0 ? (
                            <p className="text-muted-foreground text-center text-sm">No appointments scheduled.</p>
                        ) : (
                            dailyAppointments.map(appt => {
                                const doc = doctors.find(d => d.id === appt.doctorId);
                                return (
                                    <div key={appt.id} className="flex flex-col gap-2 p-3 border rounded-lg text-sm bg-card hover:bg-accent/50 transition-colors">
                                        <div className="flex justify-between items-start">
                                            <div className="font-semibold">{new Date(appt.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {appt.patientName}</div>
                                            <Badge variant={getStatusColor(appt.status)} className="text-[10px] h-5">{appt.status}</Badge>
                                        </div>
                                        <div className="text-muted-foreground flex items-center gap-2">
                                            <User className="h-3 w-3" /> Dr. {doc?.name || 'Unknown'}
                                        </div>
                                        <div className="text-muted-foreground">
                                            Reason: {appt.reason}
                                        </div>

                                        {/* Actions */}
                                        {appt.status === 'Scheduled' && (
                                            <div className="flex gap-2 mt-2">
                                                <Button size="sm" variant="outline" className="h-7 text-xs w-full gap-1 hover:bg-green-100 hover:text-green-700" onClick={() => updateAppointmentStatus(appt.id, 'Checked-in')}>
                                                    <CheckCircle2 className="h-3 w-3" /> Check In
                                                </Button>
                                                <Button size="sm" variant="ghost" className="h-7 text-xs w-full gap-1 hover:bg-red-100 hover:text-red-700" onClick={() => updateAppointmentStatus(appt.id, 'Cancelled')}>
                                                    <XCircle className="h-3 w-3" /> Cancel
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
