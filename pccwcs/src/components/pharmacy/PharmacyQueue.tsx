import React from 'react';
import { ClinicalAction, ActionStatus, Patient } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Clock, PlayCircle, AlertTriangle } from 'lucide-react';

interface PharmacyQueueProps {
    actions: ClinicalAction[];
    patients: Patient[];
    onStatusUpdate: (actionId: string, status: ActionStatus) => void;
}

export function PharmacyQueue({ actions, patients, onStatusUpdate }: PharmacyQueueProps) {
    const getPatientName = (id: string) => patients.find(p => p.id === id)?.name || 'Unknown Patient';

    const getStatusColor = (status: ActionStatus) => {
        switch (status) {
            case 'Pending': return 'secondary';
            case 'In-Progress': return 'default'; // In progress is active 'blue' usually, but primary here works
            case 'Completed': return 'outline';
            default: return 'outline';
        }
    };

    const pendingActions = actions.filter(a => a.status === 'Pending');
    const inProgressActions = actions.filter(a => a.status === 'In-Progress');
    const completedActions = actions.filter(a => a.status === 'Completed').slice(0, 5); // Show last 5

    const ActionCard = ({ action }: { action: ClinicalAction }) => (
        <Card key={action.id} className="mb-4">
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle>{getPatientName(action.patientId)}</CardTitle>
                        <CardDescription>
                            {new Date(action.timestamp).toLocaleTimeString()} • Dr. {action.initiatorId}
                        </CardDescription>
                    </div>
                    {action.priority === 'P1' && (
                        <Badge variant="destructive" className="animate-pulse">STAT</Badge>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                <p className="font-medium">{action.description}</p>
                <div className="text-xs text-muted-foreground mt-1">ID: {action.id.slice(0, 8)}</div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
                {action.status === 'Pending' && (
                    <Button onClick={() => onStatusUpdate(action.id, 'In-Progress')} size="sm">
                        <PlayCircle className="mr-2 h-4 w-4" /> Prepare
                    </Button>
                )}
                {action.status === 'In-Progress' && (
                    <Button onClick={() => onStatusUpdate(action.id, 'Completed')} size="sm" variant="default" className="bg-green-600 hover:bg-green-700">
                        <CheckCircle2 className="mr-2 h-4 w-4" /> Ready for Pickup
                    </Button>
                )}
            </CardFooter>
        </Card>
    );

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                    <Clock className="h-5 w-5 text-yellow-500" />
                    <h2 className="text-xl font-bold">Pending ({pendingActions.length})</h2>
                </div>
                {pendingActions.map(action => <ActionCard key={action.id} action={action} />)}
                {pendingActions.length === 0 && <p className="text-muted-foreground italic">No pending requests.</p>}
            </div>

            <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                    <PlayCircle className="h-5 w-5 text-blue-500" />
                    <h2 className="text-xl font-bold">Preparing ({inProgressActions.length})</h2>
                </div>
                {inProgressActions.map(action => <ActionCard key={action.id} action={action} />)}
                {inProgressActions.length === 0 && <p className="text-muted-foreground italic">No active preparations.</p>}
            </div>

            <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <h2 className="text-xl font-bold">Ready / Completed</h2>
                </div>
                {completedActions.map(action => (
                    <Card key={action.id} className="mb-4 opacity-75">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base">{getPatientName(action.patientId)}</CardTitle>
                            <CardDescription className="text-xs">{new Date(action.timestamp).toLocaleTimeString()}</CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2">
                            <p className="text-sm">{action.description}</p>
                        </CardContent>
                        <CardFooter>
                            <Badge variant="outline" className="w-full justify-center text-green-600 border-green-200 bg-green-50">Dispensed</Badge>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
