import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Beaker, Pill, FileText, Stethoscope } from 'lucide-react';
import { ActionDialog } from './ActionDialog';
import { NotesPanel } from './NotesPanel';

interface QuickActionsProps {
    patientId: string;
    onActionClick?: (type: string) => void;
}

export function QuickActions({ patientId }: QuickActionsProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
                <ActionDialog
                    patientId={patientId}
                    defaultType="Prescription"
                    trigger={
                        <Button variant="outline" className="h-24 flex flex-col gap-2 border-0 shadow-sm bg-blue-100 text-blue-700 hover:bg-blue-200">
                            <Pill className="h-6 w-6" />
                            <span>Prescription</span>
                        </Button>
                    }
                />

                <ActionDialog
                    patientId={patientId}
                    defaultType="Lab Request"
                    trigger={
                        <Button variant="outline" className="h-24 flex flex-col gap-2 border-0 shadow-sm bg-indigo-100 text-indigo-700 hover:bg-indigo-200">
                            <Beaker className="h-6 w-6" />
                            <span>Diagnostic</span>
                        </Button>
                    }
                />

                <ActionDialog
                    patientId={patientId}
                    defaultType="CareInstruction"
                    trigger={
                        <Button variant="outline" className="h-24 flex flex-col gap-2 border-0 shadow-sm bg-emerald-100 text-emerald-700 hover:bg-emerald-200">
                            <Stethoscope className="h-6 w-6" />
                            <span>Nursing</span>
                        </Button>
                    }
                />

                <ActionDialog
                    patientId={patientId}
                    defaultType="General"
                    trigger={
                        <Button variant="outline" className="h-24 flex flex-col gap-2 border-0 shadow-sm bg-slate-100 text-slate-700 hover:bg-slate-200">
                            <FileText className="h-6 w-6" />
                            <span>General</span>
                        </Button>
                    }
                />

                <NotesPanel
                    patientId={patientId}
                    trigger={
                        <Button variant="outline" className="h-24 flex flex-col gap-2 border-0 shadow-sm bg-orange-100 text-orange-700 hover:bg-orange-200">
                            <FileText className="h-6 w-6" />
                            <span>Notes</span>
                        </Button>
                    }
                />
            </CardContent>
        </Card>
    );
}
