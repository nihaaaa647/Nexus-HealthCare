'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Activity, Pill, User, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useGlobal } from '@/lib/store';
import { Badge } from '@/components/ui/badge';
import { ModeToggle } from '@/components/mode-toggle';

export function MainLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { currentUser, logout } = useGlobal();
    const router = useRouter();

    // If on login page, don't show full layout or show simplified
    if (pathname === '/') {
        return <main className="min-h-screen bg-background">{children}</main>;
    }

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    const getNavItems = () => {
        const items = [];
        if (!currentUser) return [];

        const role = currentUser.role;

        if (role === 'Doctor') {
            items.push({ name: 'Doctor', href: '/doctor', icon: User });
        }
        if (role === 'Nurse') {
            items.push({ name: 'Nurse', href: '/nurse', icon: Activity });
        }
        if (role === 'Pharmacy') {
            items.push({ name: 'Pharmacy', href: '/pharmacy', icon: Pill });
        }
        if (role === 'Lab') {
            items.push({ name: 'Lab', href: '/lab', icon: Activity });
        }
        if (role === 'Receptionist') {
            items.push({ name: 'Reception', href: '/reception', icon: Users });
            // Receptionist can also see Doctor view ideally to check status, but let's keep it simple
            items.push({ name: 'All Patients', href: '/doctor', icon: User });
        }

        // Common links if needed?
        return items;
    };

    const navItems = getNavItems();

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <header className="border-b bg-card">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-xl text-primary cursor-pointer" onClick={() => router.push(currentUser ? `/${currentUser.role.toLowerCase()}` : '/')}>
                        <Activity className="h-6 w-6" />
                        <span>Nexus</span>
                        {currentUser && <Badge variant="outline" className="ml-2">{currentUser.role}</Badge>}
                    </div>

                    {currentUser && (
                        <div className="flex items-center gap-4">
                            <nav className="flex items-center gap-1">
                                {navItems.map((item) => (
                                    <Button
                                        key={item.name}
                                        variant={pathname?.startsWith(item.href) && item.href !== '/' || pathname === item.href ? 'secondary' : 'ghost'}
                                        asChild
                                        className="gap-2"
                                    >
                                        <Link href={item.href}>
                                            <item.icon className="h-4 w-4" />
                                            {item.name}
                                        </Link>
                                    </Button>
                                ))}
                            </nav>
                            <div className="h-6 w-px bg-border mx-2" />
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">{currentUser.name}</span>
                                <ModeToggle />
                                <Button variant="ghost" size="sm" onClick={handleLogout}>Logout</Button>
                            </div>
                        </div>
                    )}
                </div>
            </header>
            <main className="flex-1 container mx-auto px-4 py-8">
                {children}
            </main>
        </div>
    );
}
