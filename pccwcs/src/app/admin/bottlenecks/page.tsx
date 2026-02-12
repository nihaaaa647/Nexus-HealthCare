'use client';

import React, { useMemo } from 'react';
import { useGlobal } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Activity, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function BottleneckDashboard() {
    const { actions } = useGlobal();
    const router = useRouter();

    const mttcData = useMemo(() => {
        const departments = ['Pharmacy', 'Lab', 'Nursing', 'General'];

        return departments.map(dept => {
            const completedActions = actions.filter(a =>
                a.targetDepartment === dept &&
                a.status === 'Completed' &&
                a.completedAt &&
                a.timestamp
            );

            if (completedActions.length === 0) {
                return { name: dept, mttc: 0, count: 0 };
            }

            const totalMinutes = completedActions.reduce((sum, action) => {
                const start = new Date(action.timestamp).getTime();
                const end = new Date(action.completedAt!).getTime();
                const diffMinutes = Math.max(0, (end - start) / (1000 * 60));
                return sum + diffMinutes;
            }, 0);

            const mttc = Math.round(totalMinutes / completedActions.length);
            return { name: dept, mttc, count: completedActions.length };
        });
    }, [actions]);

    return (
        <div className="p-6 space-y-6 max-w-6xl mx-auto">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">System Bottlenecks</h1>
                        <p className="text-muted-foreground text-sm uppercase font-bold tracking-widest mt-1">
                            MEAN TIME TO COMPLETION (MTTC) BY DEPARTMENT
                        </p>
                    </div>
                </div>
                <Activity className="h-8 w-8 text-primary opacity-50" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {mttcData.map((dept) => {
                    const isAlert = dept.mttc > 60;
                    const isEfficient = dept.mttc > 0 && dept.mttc < 20;

                    return (
                        <Card key={dept.name} className={isAlert ? 'border-destructive/50 bg-destructive/5' : ''}>
                            <CardHeader className="pb-2">
                                <CardDescription className="text-xs font-bold uppercase">{dept.name}</CardDescription>
                                <CardTitle className="text-2xl">{dept.mttc} <span className="text-sm font-normal text-muted-foreground">m</span></CardTitle>
                            </CardHeader>
                            <CardContent>
                                {isAlert && (
                                    <Badge variant="destructive" className="w-full flex justify-center gap-1">
                                        <AlertTriangle className="h-3 w-3" /> Resource Alert
                                    </Badge>
                                )}
                                {isEfficient && (
                                    <Badge variant="outline" className="w-full flex justify-center gap-1 border-green-500 text-green-600 bg-green-50">
                                        <CheckCircle className="h-3 w-3" /> Efficiency Leader
                                    </Badge>
                                )}
                                {!isAlert && !isEfficient && (
                                    <div className="text-[10px] text-muted-foreground flex items-center gap-1 justify-center py-1">
                                        <Clock className="h-3 w-3" /> Normal Operations
                                    </div>
                                )}
                                <div className="text-[10px] text-center mt-2 opacity-60">
                                    Based on {dept.count} completed actions
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>MTTC Visualization</CardTitle>
                    <CardDescription>Average minutes from order initiation to completion.</CardDescription>
                </CardHeader>
                <CardContent className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={mttcData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                            <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis fontSize={12} tickLine={false} axisLine={false} unit="m" />
                            <Tooltip
                                contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                            />
                            <Bar dataKey="mttc" radius={[4, 4, 0, 0]} barSize={60}>
                                {mttcData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.mttc > 60 ? '#ef4444' : entry.mttc > 40 ? '#f59e0b' : '#3b82f6'}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
}
