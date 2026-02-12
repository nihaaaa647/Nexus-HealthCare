'use client';

import React, { useState, useEffect } from 'react';
import { useGlobal } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Sparkles, FileText, RefreshCw, Clock } from 'lucide-react';

interface HandoffSummaryProps {
    patientId: string;
    patientName: string;
}

export function HandoffSummary({ patientId, patientName }: HandoffSummaryProps) {
    const { actions } = useGlobal();
    const [summary, setSummary] = useState<string[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    const generateSummary = async () => {
        setLoading(true);
        try {
            // In a real application, this would fetch from a Gemini 2.5 Flash backed API
            const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000);
            const recentActions = actions.filter(action =>
                action.patientId === patientId &&
                action.status === 'Completed' &&
                new Date(action.timestamp) >= twelveHoursAgo
            );

            const response = await fetch('/api/shift-summary', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ patientName, actions: recentActions })
            });

            const data = await response.json();
            if (data.summary) {
                setSummary(data.summary);
                setLastUpdated(new Date());
            }
        } catch (error) {
            console.error('Failed to generate shift summary:', error);
        } finally {
            setLoading(false);
        }
    };

    // Auto-generate on first load if not present
    useEffect(() => {
        if (!summary && !loading) {
            generateSummary();
        }
    }, [patientId]);

    return (
        <Card className="border-primary/20 bg-primary/5 shadow-md">
            <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
                <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-primary" />
                        AI Shift Handoff Summary
                    </CardTitle>
                    <CardDescription>
                        Automated 12-hour progress report for incoming staff
                    </CardDescription>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={generateSummary}
                    disabled={loading}
                    title="Regenerate Summary"
                >
                    <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                </Button>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-[90%]" />
                        <Skeleton className="h-4 w-[95%]" />
                        <Skeleton className="h-4 w-[85%]" />
                        <Skeleton className="h-4 w-[40%]" />
                    </div>
                ) : summary ? (
                    <div className="space-y-3">
                        <ul className="list-disc list-inside space-y-2 text-sm">
                            {summary.map((point, i) => (
                                <li key={i} className="leading-relaxed">
                                    <span className="font-medium">{point}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="pt-2 flex items-center gap-1 text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                            <Clock className="h-3 w-3" />
                            Refined at {lastUpdated?.toLocaleTimeString()}
                        </div>
                    </div>
                ) : (
                    <div className="py-6 text-center text-sm text-muted-foreground">
                        <FileText className="h-8 w-8 mx-auto mb-2 opacity-20" />
                        No clinical actions recorded in the last 12 hours to summarize.
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
