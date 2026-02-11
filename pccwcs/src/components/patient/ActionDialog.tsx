'use client';

import React, { useState } from 'react';
import { useGlobal } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ClinicalAction, ActionType, PriorityLevel } from '@/lib/types';
import { Plus } from 'lucide-react';

interface ActionDialogProps {
    patientId: string;
    trigger?: React.ReactNode;
    defaultType?: ActionType;
}

export function ActionDialog({ patientId, trigger, defaultType = 'Prescription' }: ActionDialogProps) {
    const { addAction, currentUser } = useGlobal();
    const [open, setOpen] = useState(false);

    // Form State
    const [targetType, setTargetType] = useState<string>(defaultType);
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState<PriorityLevel>('P2');
    const [notes, setNotes] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

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
        setDescription('');
        setNotes('');
        setPriority('P2');
        setTargetType(defaultType);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
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
                        <Button type="submit">Submit Order</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
