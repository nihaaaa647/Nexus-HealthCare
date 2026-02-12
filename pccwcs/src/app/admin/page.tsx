'use client';

import React, { useState } from 'react';
import { useGlobal } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { UserPlus, Shield, Key, LogOut } from 'lucide-react';
import { UserRole } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export default function AdminDashboard() {
    const { users, addUser, currentUser, logout, changePassword, patients } = useGlobal();
    const router = useRouter();

    // Add User State
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [newName, setNewName] = useState('');
    const [newUsername, setNewUsername] = useState('');
    const [newRole, setNewRole] = useState<UserRole>('Doctor');
    const [newPassword, setNewPassword] = useState('pass123');

    // Change Password State
    const [isChangePwdOpen, setIsChangePwdOpen] = useState(false);
    const [targetUserId, setTargetUserId] = useState<string | null>(null);
    const [targetUserName, setTargetUserName] = useState('');
    const [resetPassword, setResetPassword] = useState('');

    const handleAddUser = (e: React.FormEvent) => {
        e.preventDefault();
        addUser({
            name: newName,
            username: newUsername,
            role: newRole,
            password: newPassword,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newUsername}`
        });
        setIsAddOpen(false);
        setNewName('');
        setNewUsername('');
        setNewPassword('pass123');
        setNewRole('Doctor');
    };

    const handleChangePassword = (e: React.FormEvent) => {
        e.preventDefault();
        if (targetUserId) {
            changePassword(targetUserId, resetPassword);
            setIsChangePwdOpen(false);
            setResetPassword('');
            setTargetUserId(null);
        }
    };

    const openChangePassword = (userId: string, userName: string) => {
        setTargetUserId(userId);
        setTargetUserName(userName);
        setResetPassword('');
        setIsChangePwdOpen(true);
    };

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    if (currentUser?.role !== 'Admin') {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <h1 className="text-2xl font-bold text-destructive">Access Denied</h1>
                <p>You must be an administrator to view this page.</p>
                <Button onClick={() => router.push('/')} className="mt-4">Go Home</Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">System Administration</h1>
                        <p className="text-muted-foreground">Manage users, roles, and system security.</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-lg">
                            <Shield className="h-5 w-5 text-primary" />
                            <span className="font-medium">Admin Mode</span>
                        </div>
                        <Button variant="outline" onClick={handleLogout}>
                            <LogOut className="mr-2 h-4 w-4" /> Sign Out
                        </Button>
                    </div>
                </div>

                {/* User Management Section */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>User Management</CardTitle>
                            <CardDescription>View and manage authorized system users.</CardDescription>
                        </div>
                        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                            <DialogTrigger asChild>
                                <Button>
                                    <UserPlus className="mr-2 h-4 w-4" /> Add New User
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Add New User</DialogTitle>
                                    <DialogDescription>Create a new account for a hospital staff member.</DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleAddUser} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full Name</Label>
                                        <Input id="name" value={newName} onChange={e => setNewName(e.target.value)} required placeholder="e.g. Dr. Jane Doe" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="username">Username</Label>
                                        <Input id="username" value={newUsername} onChange={e => setNewUsername(e.target.value)} required placeholder="e.g. jdoe" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="role">Role</Label>
                                        <Select value={newRole} onValueChange={(v: any) => setNewRole(v)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select role" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Doctor">Doctor</SelectItem>
                                                <SelectItem value="Nurse">Nurse</SelectItem>
                                                <SelectItem value="Pharmacy">Pharmacy</SelectItem>
                                                <SelectItem value="Lab">Lab</SelectItem>
                                                <SelectItem value="Receptionist">Receptionist</SelectItem>
                                                <SelectItem value="Admin">Admin</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="password">Default Password</Label>
                                        <Input id="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
                                    </div>
                                    <DialogFooter>
                                        <Button type="submit">Create Account</Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {users.map(user => (
                                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg bg-card hover:bg-accent/50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-bold
                                            ${user.role === 'Admin' ? 'bg-purple-600' :
                                                user.role === 'Doctor' ? 'bg-blue-600' :
                                                    user.role === 'Nurse' ? 'bg-green-600' : 'bg-slate-600'}`}>
                                            {user.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-medium">{user.name}</div>
                                            <div className="text-xs text-muted-foreground capitalize">{user.role} • @{user.username}</div>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon" onClick={() => openChangePassword(user.id, user.name)}>
                                        <Key className="h-4 w-4 text-muted-foreground" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Change Password Dialog */}
                <Dialog open={isChangePwdOpen} onOpenChange={setIsChangePwdOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Change Password</DialogTitle>
                            <DialogDescription>Update password for <strong>{targetUserName}</strong>.</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleChangePassword} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="new-password">New Password</Label>
                                <Input
                                    id="new-password"
                                    type="password"
                                    value={resetPassword}
                                    onChange={e => setResetPassword(e.target.value)}
                                    required
                                    placeholder="Enter new secure password"
                                />
                            </div>
                            <DialogFooter>
                                <Button type="submit">Update Password</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
                {/* Patient Records Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Patient Records</CardTitle>
                        <CardDescription>View and access all patient files.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Patient Name</TableHead>
                                        <TableHead>ID</TableHead>
                                        <TableHead>Attending Doctor</TableHead>
                                        <TableHead>Admission Date</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users && patients && patients.map((patient) => {
                                        // Helper for doctor name
                                        const doc = users.find(u => u.id === patient.attendingDoctorId);
                                        const doctorName = doc ? doc.name : patient.attendingDoctorId;

                                        // Status logic
                                        const isCritical = patient.severity === 'Critical';

                                        return (
                                            <TableRow key={patient.id}>
                                                <TableCell className="font-medium">
                                                    {patient.name}
                                                    {isCritical && <Badge variant="destructive" className="ml-2 text-[10px]">CRIT</Badge>}
                                                </TableCell>
                                                <TableCell className="uppercase text-xs font-mono">{patient.id}</TableCell>
                                                <TableCell>{doctorName}</TableCell>
                                                <TableCell>{new Date(patient.admissionDate).toLocaleDateString()}</TableCell>
                                                <TableCell>
                                                    <Badge variant={patient.severity === 'Urgent' ? 'secondary' : isCritical ? 'destructive' : 'outline'}>
                                                        {patient.severity || 'Stable'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button asChild size="sm" variant="outline">
                                                        <a href={`/patient/${patient.id}`}>
                                                            Open File
                                                        </a>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                    {patients && patients.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={6} className="h-24 text-center">
                                                No patients found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
