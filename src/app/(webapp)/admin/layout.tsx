'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/webapp/AuthContext';
import { UserRole } from '@/lib/types';
import Sidebar from '@/components/webapp/Sidebar';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, isLoading, isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading) {
            if (!isAuthenticated) {
                router.push('/login');
            } else if (user?.role !== UserRole.ADMIN) {
                // Redirect non-admins to their respective dashboards
                if (user?.role === UserRole.FRONT_DESK) {
                    router.push('/frontdesk/appointments');
                } else if (user?.role === UserRole.USER) {
                    router.push('/user/appointments');
                }
            }
        }
    }, [isLoading, isAuthenticated, user, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4A90D9]"></div>
            </div>
        );
    }

    if (!isAuthenticated || user?.role !== UserRole.ADMIN) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Sidebar />
            <main className="ml-64 p-8 transition-all duration-300">
                {children}
            </main>
        </div>
    );
}
