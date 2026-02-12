'use client';

import React, { useState } from 'react';
import { useGlobal } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ClinicalAction, ActionType, PriorityLevel } from '@/lib/types';
import { Plus, AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ActionDialogProps {
    patientId: string;
    trigger?: React.ReactNode;
    defaultType?: ActionType;
}

export function ActionDialog({ patientId, trigger, defaultType = 'Prescription' }: ActionDialogProps) {
    const { addAction, currentUser, patients } = useGlobal();
    const [open, setOpen] = useState(false);

    // Form State
    const [targetType, setTargetType] = useState<string>(defaultType);
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState<PriorityLevel>('P2');
    const [notes, setNotes] = useState('');

    // Safety Check State
    const [isChecking, setIsChecking] = useState(false);
    const [safetyConflict, setSafetyConflict] = useState<string | null>(null);
    const [showOverride, setShowOverride] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // If a conflict was already shown and we are still here, it means we are trying to submit with override
        if (safetyConflict && !showOverride) {
            return;
        }

        // Safety Check Logic for Prescriptions
        if (targetType === 'Prescription' && !showOverride) {
            setIsChecking(true);
            setSafetyConflict(null);

            const patient = patients.find(p => p.id === patientId);
            const allergies = patient?.allergies || [];

            try {
                const response = await fetch('/api/safety-check', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ prescription: description, allergies })
                });

                const data = await response.json();

                if (data.conflict) {
                    setSafetyConflict(data.message);
                    setShowOverride(true);
                    setIsChecking(false);
                    return; // Stop and show warning
                }
            } catch (err) {
                console.error("Safety check failed", err);
            }
            setIsChecking(false);
        }

        // Proceed with Action
        submitAction();
    };

    const submitAction = () => {
        // Determine target department based on Action Type
        let targetDept: any = 'General';
        if (targetType === 'Prescription') targetDept = 'Pharmacy';
        if (targetType === 'Lab Request') targetDept = 'Lab';
        if (targetType === 'CareInstruction') targetDept = 'Nursing';

        addAction({
            patientId,
            initiatorId: currentUser?.id || 'u1',
            targetDepartment: targetDept,
            type: targetType as ActionType,
            description,
            priority,
            notes
        });

        // Reset and close
        setOpen(false);
        resetForm();
    };

    const resetForm = () => {
        setDescription('');
        setNotes('');
        setPriority('P2');
        setTargetType(defaultType);
        setSafetyConflict(null);
        setShowOverride(false);
        setIsChecking(false);
    };

    const handleOpenChange = (newOpen: boolean) => {
        if (!newOpen) resetForm();
        setOpen(newOpen);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                {trigger || <Button><Plus className="mr-2 h-4 w-4" /> Add Action</Button>}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Initiate Clinical Action</DialogTitle>
                    <DialogDescription>
                        Create a new order for {targetType === 'Prescription' ? 'Pharmacy' : targetType === 'Lab Request' ? 'Lab' : 'Nursing'}.
                    </DialogDescription>
                </DialogHeader>

                {safetyConflict && (
                    <Alert variant="destructive" className="mb-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Safety Conflict Detected</AlertTitle>
                        <AlertDescription>
                            {safetyConflict}
                        </AlertDescription>
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="type" className="text-right">
                                Type
                            </Label>
                            <Select value={targetType} onValueChange={(v) => setTargetType(v)}>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Prescription">Prescription</SelectItem>
                                    <SelectItem value="Lab Request">Lab Request</SelectItem>
                                    <SelectItem value="CareInstruction">Nursing/General</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="description" className="text-right">
                                Details
                            </Label>
                            <Input
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder={targetType === 'Prescription' ? "Medication name & dosage" : "Test name or instruction"}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="priority" className="text-right">
                                Priority
                            </Label>
                            <Select value={priority} onValueChange={(v: any) => setPriority(v)}>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Priority" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="P1">P1 - Critical (STAT)</SelectItem>
                                    <SelectItem value="P2">P2 - Urgent</SelectItem>
                                    <SelectItem value="P3">P3 - Routine</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="notes" className="text-right">
                                Notes
                            </Label>
                            <Input
                                id="notes"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Additional instructions..."
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        {showOverride ? (
                            <div className="flex w-full gap-2">
                                <Button type="button" variant="outline" className="flex-1" onClick={resetForm}>
                                    Cancel
                                </Button>
                                <Button type="submit" variant="destructive" className="flex-1">
                                    Confirm Override
                                </Button>
                            </div>
                        ) : (
                            <Button type="submit" className="w-full" disabled={isChecking}>
                                {isChecking ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Checking Safety...
                                    </>
                                ) : (
                                    "Submit Order"
                                )}
                            </Button>
                        )}
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
