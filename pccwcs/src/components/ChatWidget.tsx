import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, MessageSquare } from 'lucide-react';
import { useGlobal } from '@/lib/store';

export function ChatWidget({ patientId }: { patientId: string }) {
    // In a real app, this would be in the store/DB. For now, local state mock.
    const [messages, setMessages] = useState([
        { id: 1, sender: 'Dr. Smith', text: 'Please monitor BP every hour.', time: '10:00 AM' },
        { id: 2, sender: 'Nurse Sarah', text: 'Noted. BP currently 120/80.', time: '10:05 AM' },
    ]);
    const [input, setInput] = useState('');
    const { currentUser } = useGlobal();

    const handleSend = () => {
        if (!input.trim()) return;
        const newMessage = {
            id: messages.length + 1,
            sender: currentUser?.name || 'Me',
            text: input,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages([...messages, newMessage]);
        setInput('');
    };

    return (
        <Card className="h-[400px] flex flex-col">
            <CardHeader className="py-3 border-b">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" /> Care Team Chat
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-0">
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex flex-col ${msg.sender === (currentUser?.name || 'Me') ? 'items-end' : 'items-start'}`}>
                            <div className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${msg.sender === (currentUser?.name || 'Me')
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted'
                                }`}>
                                {msg.text}
                            </div>
                            <span className="text-[10px] text-muted-foreground mt-1">
                                {msg.sender} • {msg.time}
                            </span>
                        </div>
                    ))}
                </div>
                <div className="p-3 border-t flex gap-2">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type a message..."
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    />
                    <Button size="icon" onClick={handleSend}>
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
