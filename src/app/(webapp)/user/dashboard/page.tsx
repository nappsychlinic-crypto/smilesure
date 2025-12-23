'use client';

import { useEffect, useState } from 'react';
import { Calendar, Clock, History, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface AppointmentData {
    appointmentDateTime: string;
    treatmentType: string;
    status: string;
}

interface DashboardStats {
    upcomingAppointments: number;
    pastVisits: number;
    nextAppointment?: AppointmentData | null;
}

export default function UserDashboard() {
    const [stats, setStats] = useState<DashboardStats>({
        upcomingAppointments: 0,
        pastVisits: 0,
        nextAppointment: null
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
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

    const nextApptDate = stats.nextAppointment
        ? new Date(stats.nextAppointment.appointmentDateTime)
        : null;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-1">Welcome back!</p>
            </div>

            {/* Next Appointment Card - Highlighted */}
            <div className={`rounded-2xl p-8 transition-all ${nextApptDate
                    ? 'bg-gradient-to-r from-[#4A90D9] to-[#7EC8E3] text-white shadow-lg'
                    : 'bg-white border border-gray-100 shadow-sm'
                }`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h2 className={`text-lg font-semibold mb-2 ${nextApptDate ? 'text-blue-50' : 'text-gray-900'}`}>Next Appointment</h2>
                        {isLoading ? (
                            <div className={`h-8 w-48 rounded-lg animate-pulse ${nextApptDate ? 'bg-white/20' : 'bg-gray-100'}`} />
                        ) : nextApptDate ? (
                            <div>
                                <p className="text-3xl font-bold mb-1">
                                    {nextApptDate.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                                </p>
                                <p className="text-xl opacity-90 flex items-center gap-2">
                                    <Clock className="w-5 h-5" />
                                    {nextApptDate.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                                    <span className="mx-2">•</span>
                                    {stats.nextAppointment?.treatmentType}
                                </p>
                            </div>
                        ) : (
                            <p className="text-gray-500 text-lg">No upcoming appointments scheduled.</p>
                        )}
                    </div>

                    {!isLoading && (
                        <div>
                            {nextApptDate ? (
                                <Link
                                    href="/user/appointments"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#4A90D9] rounded-xl font-semibold hover:bg-blue-50 transition-colors"
                                >
                                    View Details
                                </Link>
                            ) : (
                                <Link
                                    href="/user/book-appointment"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#4A90D9] text-white rounded-xl font-semibold hover:bg-[#357abd] transition-colors shadow-md hover:shadow-lg"
                                >
                                    Book Now <ArrowRight className="w-4 h-4" />
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-gray-500 font-medium">Upcoming Appointments</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">
                                {isLoading ? '...' : stats.upcomingAppointments}
                            </p>
                            <Link href="/user/appointments" className="text-sm text-[#4A90D9] hover:underline mt-2 inline-block">
                                View all upcoming
                            </Link>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-xl">
                            <Calendar className="w-8 h-8 text-[#4A90D9]" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-gray-500 font-medium">Past Visits</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">
                                {isLoading ? '...' : stats.pastVisits}
                            </p>
                            <Link href="/user/appointments?tab=past" className="text-sm text-[#4A90D9] hover:underline mt-2 inline-block">
                                View history
                            </Link>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-xl">
                            <History className="w-8 h-8 text-purple-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Link to Book */}
            {isLoading || stats.upcomingAppointments > 0 ? null : (
                <div className="bg-gray-50 rounded-2xl p-8 text-center">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Time for a checkup?</h3>
                    <p className="text-gray-600 mb-6">Regular dental visits are key to a healthy smile.</p>
                    <Link
                        href="/user/book-appointment"
                        className="inline-flex items-center gap-2 px-8 py-3 bg-[#4A90D9] text-white rounded-xl font-semibold hover:bg-[#357abd] transition-colors shadow-sm"
                    >
                        Schedule Appointment
                    </Link>
                </div>
            )}
        </div>
    );
}
