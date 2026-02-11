import React from 'react';
import { ClinicalAction } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // Fixed CardHeader import/usage
import { CheckCircle2, Clock, PlayCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns'; // Need to add date-fns potentially or write simple formatter

function formatTimeAgo(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
}

interface ActionTimelineProps {
    actions: ClinicalAction[];
}

export function ActionTimeline({ actions }: ActionTimelineProps) {
    const getStatusIcon = (status: ClinicalAction['status']) => {
        switch (status) {
            case 'Completed': return <CheckCircle2 className="h-5 w-5 text-green-500" />;
            case 'In-Progress': return <PlayCircle className="h-5 w-5 text-blue-500" />;
            case 'Rejected': return <XCircle className="h-5 w-5 text-red-500" />;
            default: return <Clock className="h-5 w-5 text-gray-400" />;
        }
    };

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Clinical Timeline</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="relative border-l border-muted ml-3 space-y-8 pb-8">
                    {actions.length === 0 && (
                        <div className="pl-6 text-muted-foreground italic">No actions recorded yet.</div>
                    )}
                    {actions.map((action) => (
                        <div key={action.id} className="relative pl-8">
                            <span className={cn(
                                "absolute -left-[11px] top-1 flex h-6 w-6 items-center justify-center rounded-full ring-4 ring-background bg-background",
                            )}>
                                {getStatusIcon(action.status)}
                            </span>
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-sm">{action.type}</span>
                                    <Badge variant="outline" className="text-[10px] h-5">{action.targetDepartment}</Badge>
                                    {action.priority === 'P1' && (
                                        <Badge variant="destructive" className="text-[10px] h-5 animate-pulse">STAT</Badge>
                                    )}
                                </div>
                                <p className="text-sm text-foreground/90">{action.description}</p>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                    <span>{formatTimeAgo(action.timestamp)}</span>
                                    <span>by Dr. {action.initiatorId}</span> {/* Should lookup name */}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
