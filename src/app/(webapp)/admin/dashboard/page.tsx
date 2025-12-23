'use client';

import { useEffect, useState } from 'react';
import { Calendar, Users, IndianRupee, TrendingUp, Clock, CheckCircle } from 'lucide-react';

interface ScheduleItem {
    _id: string;
    patientId: { name: string };
    appointmentDateTime: string;
    treatmentType: string;
    status: string;
}

interface InsightItem {
    label: string;
    value: number | string;
}

interface DashboardStats {
    todayAppointments: number;
    totalPatients: number;
    monthlyRevenue: number;
    completedToday: number;
    todaySchedule?: ScheduleItem[];
    insights?: InsightItem[];
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats>({
        todayAppointments: 0,
        totalPatients: 0,
        monthlyRevenue: 0,
        completedToday: 0,
        todaySchedule: [],
        insights: [],
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Fetch dashboard stats
        async function fetchStats() {
            try {
                const response = await fetch('/api/analytics/dashboard');
                const data = await response.json();

                if (data.success) {
                    setStats(data.data);
                }
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchStats();
    }, []);

    const statCards = [
        {
            title: "Today's Appointments",
            value: stats.todayAppointments,
            icon: Calendar,
            color: 'from-blue-500 to-blue-600',
            bgColor: 'bg-blue-50',
        },
        {
            title: 'Total Patients',
            value: stats.totalPatients,
            icon: Users,
            color: 'from-green-500 to-green-600',
            bgColor: 'bg-green-50',
        },
        {
            title: 'Monthly Revenue',
            value: `₹${stats.monthlyRevenue.toLocaleString()}`,
            icon: IndianRupee,
            color: 'from-purple-500 to-purple-600',
            bgColor: 'bg-purple-50',
        },
        {
            title: 'Completed Today',
            value: stats.completedToday,
            icon: CheckCircle,
            color: 'from-emerald-500 to-emerald-600',
            bgColor: 'bg-emerald-50',
        },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-1">Welcome back! Here&apos;s what&apos;s happening today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <div
                            key={card.title}
                            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 font-medium">{card.title}</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">
                                        {isLoading ? '...' : card.value}
                                    </p>
                                </div>
                                <div className={`${card.bgColor} p-4 rounded-xl`}>
                                    <Icon className={`w-6 h-6 bg-gradient-to-r ${card.color} bg-clip-text text-transparent`} style={{ color: card.color.includes('blue') ? '#3b82f6' : card.color.includes('green') ? '#22c55e' : card.color.includes('purple') ? '#a855f7' : '#10b981' }} />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Appointments */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-900">Today&apos;s Schedule</h2>
                        <a href="/admin/appointments" className="text-sm text-[#4A90D9] hover:underline">
                            View all
                        </a>
                    </div>
                    <div className="space-y-4">
                        {isLoading ? (
                            <div className="animate-pulse space-y-3">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="h-16 bg-gray-100 rounded-xl" />
                                ))}
                            </div>
                        ) : stats.todaySchedule && stats.todaySchedule.length > 0 ? (
                            <div className="space-y-3">
                                {stats.todaySchedule.map((appt) => (
                                    <div key={appt._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                                                <Clock className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900">{appt.patientId?.name || 'Unknown Patient'}</p>
                                                <p className="text-sm text-gray-500">
                                                    {new Date(appt.appointmentDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {appt.treatmentType}
                                                </p>
                                            </div>
                                        </div>
                                        <span className={`text-xs px-2 py-1 rounded-full ${appt.status === 'Completed' ? 'bg-green-100 text-green-700' :
                                            appt.status === 'Confirmed' ? 'bg-blue-100 text-blue-700' :
                                                'bg-gray-100 text-gray-700'
                                            }`}>
                                            {appt.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                <p>No appointments scheduled for today</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Stats / Insights */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-900">Quick Insights</h2>
                        <a href="/admin/analytics" className="text-sm text-[#4A90D9] hover:underline">
                            Full analytics
                        </a>
                    </div>
                    <div className="space-y-4">
                        {isLoading ? (
                            <div className="animate-pulse space-y-3">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="h-12 bg-gray-100 rounded-xl" />
                                ))}
                            </div>
                        ) : stats.insights && stats.insights.length > 0 ? (
                            <div className="space-y-3">
                                {stats.insights.map((insight, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                        <p className="text-gray-600 font-medium">{insight.label}</p>
                                        <p className="text-xl font-bold text-gray-900">{insight.value}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <TrendingUp className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                <p>No insights available yet</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
