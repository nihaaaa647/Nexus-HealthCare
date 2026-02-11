'use client';

import React, { useState } from 'react';
import { useGlobal } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CheckCircle2, ClipboardList, Plus } from 'lucide-react';
import { PriorityLevel } from '@/lib/types';
import Link from 'next/link';

export default function NursePage() {
    const { actions, updateActionStatus, patients, addAction, currentUser } = useGlobal();
    const [openAdd, setOpenAdd] = useState(false);

    // Form state
    const [selectedPatient, setSelectedPatient] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState<PriorityLevel>('P2');
    const [notes, setNotes] = useState('');

    // Filter actions for "Nursing" or "General"
    const nurseActions = actions.filter(a => a.targetDepartment === 'Nursing' || a.targetDepartment === 'General');
    const pendingActions = nurseActions.filter(a => a.status !== 'Completed');
    const completedActions = nurseActions.filter(a => a.status === 'Completed');
    const sortedPending = [...pendingActions].sort((a, b) => {
        const pOrder: Record<string, number> = { P1: 0, P2: 1, P3: 2 };
        const pDiff = pOrder[a.priority] - pOrder[b.priority];
        if (pDiff !== 0) return pDiff;
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });

    const getPatient = (id: string) => patients.find(p => p.id === id);

    const handleComplete = (id: string) => {
        updateActionStatus(id, 'Completed');
    };

    const handleAddTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedPatient || !description.trim()) return;

        addAction({
            patientId: selectedPatient,
            initiatorId: currentUser?.id || 'u2',
            targetDepartment: 'Nursing',
            type: 'CareInstruction',
            description: description.trim(),
            priority,
            notes: notes.trim() || undefined,
        });

        // Reset and close
        setSelectedPatient('');
        setDescription('');
        setPriority('P2');
        setNotes('');
        setOpenAdd(false);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Nurse Dashboard</h1>
                    <p className="text-muted-foreground">
                        {pendingActions.length} active task{pendingActions.length !== 1 ? 's' : ''} • {completedActions.length} completed
                    </p>
                </div>

                <Dialog open={openAdd} onOpenChange={setOpenAdd}>
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" /> Add Task
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Add Nursing Task</DialogTitle>
                            <DialogDescription>
                                Create a new care task for a patient.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleAddTask}>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label className="text-right">Patient</Label>
                                    <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                                        <SelectTrigger className="col-span-3">
                                            <SelectValue placeholder="Select patient" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {patients.map(p => (
                                                <SelectItem key={p.id} value={p.id}>
                                                    {p.name} (Rm {p.roomNumber})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label className="text-right">Task</Label>
                                    <Input
                                        value={description}
                                        onChange={e => setDescription(e.target.value)}
                                        placeholder="e.g. Check IV line, Wound care"
                                        className="col-span-3"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label className="text-right">Priority</Label>
                                    <Select value={priority} onValueChange={(v: any) => setPriority(v)}>
                                        <SelectTrigger className="col-span-3">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="P1">P1 - Critical (STAT)</SelectItem>
                                            <SelectItem value="P2">P2 - Urgent</SelectItem>
                                            <SelectItem value="P3">P3 - Routine</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label className="text-right">Notes</Label>
                                    <Input
                                        value={notes}
                                        onChange={e => setNotes(e.target.value)}
                                        placeholder="Optional notes..."
                                        className="col-span-3"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" disabled={!selectedPatient || !description.trim()}>
                                    Add Task
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ClipboardList className="h-5 w-5" /> Active Care Tasks
                            {pendingActions.length > 0 && (
                                <Badge variant="destructive" className="ml-2">{pendingActions.length}</Badge>
                            )}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {sortedPending.length === 0 ? (
                            <p className="text-muted-foreground text-center py-8">No nursing tasks pending. All clear! ✅</p>
                        ) : (
                            <div className="space-y-4">
                                {sortedPending.map(action => {
                                    const patient = getPatient(action.patientId);
                                    return (
                                        <div
                                            key={action.id}
                                            className={`flex items-center justify-between p-4 border rounded-lg transition-all ${action.priority === 'P1'
                                                    ? 'border-red-500/30 bg-red-500/5'
                                                    : 'bg-card'
                                                }`}
                                        >
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold text-lg">{action.description}</span>
                                                    <Badge variant={action.priority === 'P1' ? 'destructive' : 'secondary'}>{action.priority}</Badge>
                                                    <Badge variant="outline">{action.status}</Badge>
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    Patient: <Link href={`/patient/${patient?.id}`} className="font-medium text-primary hover:underline">{patient?.name}</Link> (Room {patient?.roomNumber})
                                                </div>
                                                {action.notes && (
                                                    <div className="text-sm bg-muted p-2 rounded mt-2">
                                                        <span className="font-semibold">Notes:</span> {action.notes}
                                                    </div>
                                                )}
                                            </div>
                                            {action.status !== 'Completed' && (
                                                <Button onClick={() => handleComplete(action.id)} size="sm" className="gap-2">
                                                    <CheckCircle2 className="h-4 w-4" /> Complete
                                                </Button>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {completedActions.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-muted-foreground">
                                <CheckCircle2 className="h-5 w-5" /> Completed ({completedActions.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {completedActions.slice(0, 5).map(action => {
                                    const patient = getPatient(action.patientId);
                                    return (
                                        <div key={action.id} className="flex items-center justify-between p-3 border rounded-lg opacity-60">
                                            <div>
                                                <span className="font-medium">{action.description}</span>
                                                <span className="text-sm text-muted-foreground ml-2">— {patient?.name}</span>
                                            </div>
                                            <Badge variant="outline">Done</Badge>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
