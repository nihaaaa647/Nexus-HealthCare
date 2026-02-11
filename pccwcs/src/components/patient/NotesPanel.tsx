'use client';

import React, { useState } from 'react';
import { useGlobal } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { FileText, Send, User, Clock } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

interface NotesPanelProps {
    patientId: string;
    trigger: React.ReactNode;
}

export function NotesPanel({ patientId, trigger }: NotesPanelProps) {
    const { addNote, getNotesForPatient, currentUser } = useGlobal();
    const [newNote, setNewNote] = useState('');
    const [open, setOpen] = useState(false);

    const notes = getNotesForPatient(patientId);

    const handleSubmit = () => {
        if (!newNote.trim()) return;
        addNote(patientId, newNote.trim());
        setNewNote('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            handleSubmit();
        }
    };

    const roleColors: Record<string, string> = {
        Doctor: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
        Nurse: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
        Pharmacy: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
        Lab: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
        Receptionist: 'bg-pink-500/15 text-pink-400 border-pink-500/30',
    };

    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="max-w-lg max-h-[85vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Clinical Notes
                    </DialogTitle>
                </DialogHeader>

                {/* Add New Note */}
                <div className="space-y-2 border-b pb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <User className="h-3 w-3" />
                        Posting as <span className="font-medium text-foreground">{currentUser?.name || 'Unknown'}</span>
                        <Badge className={`text-xs ${roleColors[currentUser?.role || 'Doctor'] || ''}`}>
                            {currentUser?.role || 'Doctor'}
                        </Badge>
                    </div>
                    <Textarea
                        placeholder="Write a clinical note..."
                        value={newNote}
                        onChange={e => setNewNote(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="min-h-[80px] resize-none"
                    />
                    <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">Ctrl+Enter to submit</span>
                        <Button onClick={handleSubmit} size="sm" disabled={!newNote.trim()} className="gap-2">
                            <Send className="h-4 w-4" />
                            Add Note
                        </Button>
                    </div>
                </div>

                {/* Notes List */}
                <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                    {notes.length === 0 ? (
                        <p className="text-center text-muted-foreground py-8">No notes yet. Be the first to add one.</p>
                    ) : (
                        notes.map(note => (
                            <div
                                key={note.id}
                                className="p-3 rounded-lg border bg-card space-y-2"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                                            {note.authorName.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <span className="font-medium text-sm">{note.authorName}</span>
                                            <Badge className={`ml-2 text-xs ${roleColors[note.authorRole] || ''}`}>
                                                {note.authorRole}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                        <Clock className="h-3 w-3" />
                                        {formatTime(note.timestamp)}
                                    </div>
                                </div>
                                <p className="text-sm whitespace-pre-wrap pl-9">{note.content}</p>
                            </div>
                        ))
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
