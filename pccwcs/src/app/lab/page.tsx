'use client';

import React from 'react';
import { useGlobal } from '@/lib/store';
import { PharmacyQueue } from '@/components/pharmacy/PharmacyQueue';

// Key Insight: The Lab Queue is functionally identical to the Pharmacy Queue
// (viewing tasks, updating status). We can reuse the component or adapt it.
// For speed, let's reuse but we might want to wrap it or copy-paste if we need different columns later.
// Actually, let's just create a new component `LabQueue` to be safe and clearer, 
// even if it shares code structure with PharmacyQueue.

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle2, Clock, AlertCircle, Activity } from 'lucide-react';
import { ClinicalAction } from '@/lib/types';

export default function LabPage() {
    const { actions, patients, updateActionStatus } = useGlobal();

    const labActions = actions.filter(a => a.targetDepartment === 'Lab');

    // Sort by priority (P1 first) then by timestamp
    const sortedActions = [...labActions].sort((a, b) => {
        if (a.priority === 'P1' && b.priority !== 'P1') return -1;
        if (a.priority !== 'P1' && b.priority === 'P1') return 1;
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });

    const pendingActions = sortedActions.filter(a => a.status === 'Pending');
    const inProgressActions = sortedActions.filter(a => a.status === 'In-Progress');
    const completedActions = sortedActions.filter(a => a.status === 'Completed');

    const getPatientName = (id: string) => patients.find(p => p.id === id)?.name || 'Unknown';

    const handleStatusUpdate = (id: string, newStatus: any) => {
        updateActionStatus(id, newStatus);
    };

    const ActionCard = ({ action }: { action: ClinicalAction }) => (
        <div className={`p-4 border rounded-lg mb-3 ${action.priority === 'P1' ? 'border-red-500/50 bg-red-50/10' : 'bg-card'}`}>
            <div className="flex justify-between items-start mb-2">
                <div>
                    <h3 className="font-semibold text-lg">{action.type}</h3>
                    <p className="text-sm text-muted-foreground">Patient: <span className="font-medium text-foreground">{getPatientName(action.patientId)}</span></p>
                </div>
                <Badge variant={action.priority === 'P1' ? 'destructive' : action.priority === 'P2' ? 'default' : 'secondary'}>
                    {action.priority}
                </Badge>
            </div>
            <p className="text-sm mb-3">{action.description}</p>
            {action.notes && <p className="text-xs text-muted-foreground mb-3 bg-muted p-2 rounded">Note: {action.notes}</p>}

            <div className="flex justify-end gap-2">
                {action.status === 'Pending' && (
                    <Button size="sm" onClick={() => handleStatusUpdate(action.id, 'In-Progress')}>
                        Start Analysis
                    </Button>
                )}
                {action.status === 'In-Progress' && (
                    <Button size="sm" variant="outline" className="text-green-600 border-green-200 hover:bg-green-50" onClick={() => handleStatusUpdate(action.id, 'Completed')}>
                        <CheckCircle2 className="w-4 h-4 mr-1" /> Finalize Results
                    </Button>
                )}
            </div>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Lab Diagnostics Queue</h1>
                <div className="flex gap-2">
                    <Badge variant="outline" className="text-base px-3 py-1">
                        Pending: {pendingActions.length}
                    </Badge>
                    <Badge variant="secondary" className="text-base px-3 py-1">
                        In-Progress: {inProgressActions.length}
                    </Badge>
                </div>
            </div>

            <Tabs defaultValue="active" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="active">Active Queue ({pendingActions.length + inProgressActions.length})</TabsTrigger>
                    <TabsTrigger value="completed">Completed History</TabsTrigger>
                </TabsList>

                <TabsContent value="active" className="space-y-4 mt-4">
                    {/* Critical/P1 Actions First */}
                    {sortedActions.filter(a => a.priority === 'P1' && a.status !== 'Completed').length > 0 && (
                        <div className="mb-6">
                            <h2 className="text-red-500 font-bold flex items-center gap-2 mb-3">
                                <AlertCircle className="h-5 w-5" /> Critical / STAT Requests
                            </h2>
                            {sortedActions.filter(a => a.priority === 'P1' && a.status !== 'Completed').map(action => (
                                <ActionCard key={action.id} action={action} />
                            ))}
                        </div>
                    )}

                    {/* Pending */}
                    <div>
                        <h2 className="font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                            <Clock className="h-4 w-4" /> Pending
                        </h2>
                        {pendingActions.filter(a => a.priority !== 'P1').length === 0 && <p className="text-muted-foreground italic text-sm">No pending routine requests.</p>}
                        {pendingActions.filter(a => a.priority !== 'P1').map(action => (
                            <ActionCard key={action.id} action={action} />
                        ))}
                    </div>

                    {/* In Progress */}
                    <div className="mt-6">
                        <h2 className="font-semibold text-blue-500 mb-3 flex items-center gap-2">
                            <Activity className="h-4 w-4" /> In Analysis
                        </h2>
                        {inProgressActions.length === 0 && <p className="text-muted-foreground italic text-sm">No analysis in progress.</p>}
                        {inProgressActions.map(action => (
                            <ActionCard key={action.id} action={action} />
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="completed" className="mt-4">
                    {completedActions.length === 0 && <p className="text-muted-foreground p-8 text-center">No completed records yet.</p>}
                    {completedActions.map(action => (
                        <div key={action.id} className="p-4 border rounded-lg mb-3 opacity-75 grayscale-[0.5] hover:opacity-100 hover:grayscale-0 transition-all">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="font-semibold">{action.type}</h3>
                                <Badge variant="secondary">Completed</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{getPatientName(action.patientId)}</p>
                        </div>
                    ))}
                </TabsContent>
            </Tabs>
        </div>
    );
}
