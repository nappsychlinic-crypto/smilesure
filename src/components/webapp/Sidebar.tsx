'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/components/webapp/AuthContext';
import { UserRole } from '@/lib/types';
import {
    LayoutDashboard,
    Calendar,
    Users,
    UserCog,
    BarChart3,
    Mail,
    Settings,
    LogOut,
    CalendarPlus,
    UserPlus,
    User,
    ChevronLeft,
    ChevronRight,
    Stethoscope,
    Wallet,
} from 'lucide-react';
import { useState } from 'react';

interface NavItem {
    label: string;
    href: string;
    icon: React.ElementType;
}

const adminNavItems: NavItem[] = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Appointments', href: '/admin/appointments', icon: Calendar },
    { label: 'Patients', href: '/admin/patients', icon: Users },
    { label: 'Front Desk Staff', href: '/admin/frontdesk-users', icon: UserCog },
    { label: 'Payments', href: '/admin/payments', icon: Wallet },
    { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { label: 'Invitations', href: '/admin/invitations', icon: Mail },
    { label: 'Treatment Types', href: '/admin/treatment-types', icon: Stethoscope },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
];

const frontDeskNavItems: NavItem[] = [
    { label: 'Dashboard', href: '/frontdesk/dashboard', icon: LayoutDashboard },
    { label: 'Appointments', href: '/frontdesk/appointments', icon: Calendar },
    { label: 'Create Appointment', href: '/frontdesk/create-appointment', icon: CalendarPlus },
    { label: 'Patients', href: '/frontdesk/patients', icon: Users },
    { label: 'Invite Patient', href: '/frontdesk/invite-patient', icon: UserPlus },
    { label: 'Profile', href: '/frontdesk/profile', icon: User },
];

const userNavItems: NavItem[] = [
    { label: 'Dashboard', href: '/user/dashboard', icon: LayoutDashboard },
    { label: 'My Appointments', href: '/user/appointments', icon: Calendar },
    { label: 'Book Appointment', href: '/user/book-appointment', icon: CalendarPlus },
    { label: 'My Profile', href: '/user/profile', icon: User },
];

export default function Sidebar() {
    const { user, logout } = useAuth();
    const pathname = usePathname();
    const router = useRouter();
    const [collapsed, setCollapsed] = useState(false);

    if (!user) return null;

    const getNavItems = (): NavItem[] => {
        switch (user.role) {
            case UserRole.ADMIN:
                return adminNavItems;
            case UserRole.FRONT_DESK:
                return frontDeskNavItems;
            case UserRole.USER:
                return userNavItems;
            default:
                return [];
        }
    };

    const getRoleLabel = (): string => {
        switch (user.role) {
            case UserRole.ADMIN:
                return 'Administrator';
            case UserRole.FRONT_DESK:
                return 'Front Desk';
            case UserRole.USER:
                return 'Patient';
            default:
                return '';
        }
    };

    const handleLogout = async () => {
        await logout();
        router.push('/');
    };

    const navItems = getNavItems();

    return (
        <aside
            className={`fixed left-0 top-0 h-screen bg-white border-r border-gray-200 transition-all duration-300 z-40 flex flex-col ${collapsed ? 'w-20' : 'w-64'
                }`}
        >
            {/* Logo */}
            <div className="h-20 flex items-center justify-center border-b border-gray-100 px-4">
                <Link href="/" className="flex items-center">
                    {collapsed ? (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#4A90D9] to-[#7EC8E3] flex items-center justify-center text-white font-bold text-lg">
                            S
                        </div>
                    ) : (
                        <Image
                            src="/logo1.png"
                            alt="SmileSure"
                            width={140}
                            height={50}
                            className="object-contain"
                        />
                    )}
                </Link>
            </div>

            {/* User Info */}
            <div className={`p-4 border-b border-gray-100 ${collapsed ? 'text-center' : ''}`}>
                <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'}`}>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#4A90D9] to-[#7EC8E3] flex items-center justify-center text-white font-semibold shrink-0">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    {!collapsed && (
                        <div className="overflow-hidden">
                            <p className="font-medium text-gray-900 truncate">{user.name}</p>
                            <span className="inline-block px-2 py-0.5 text-xs font-medium bg-[#4A90D9]/10 text-[#4A90D9] rounded-full">
                                {getRoleLabel()}
                            </span>
                            <p className="text-xs text-gray-500 mt-1 truncate">
                                {user.countryCode || '+91'} {user.mobileNumber}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                ? 'bg-gradient-to-r from-[#4A90D9] to-[#7EC8E3] text-white shadow-md'
                                : 'text-gray-600 hover:bg-gray-100'
                                } ${collapsed ? 'justify-center px-3' : ''}`}
                            title={collapsed ? item.label : undefined}
                        >
                            <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-[#4A90D9]'}`} />
                            {!collapsed && <span className="font-medium">{item.label}</span>}
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-gray-100 space-y-2">
                <button
                    onClick={handleLogout}
                    className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors ${collapsed ? 'justify-center px-3' : ''
                        }`}
                    title={collapsed ? 'Logout' : undefined}
                >
                    <LogOut className="w-5 h-5 shrink-0" />
                    {!collapsed && <span className="font-medium">Logout</span>}
                </button>

                {/* Collapse Toggle */}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className={`flex items-center gap-3 w-full px-4 py-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors ${collapsed ? 'justify-center px-3' : ''
                        }`}
                >
                    {collapsed ? (
                        <ChevronRight className="w-5 h-5" />
                    ) : (
                        <>
                            <ChevronLeft className="w-5 h-5" />
                            <span className="text-sm">Collapse</span>
                        </>
                    )}
                </button>
            </div>
        </aside>
    );
}
