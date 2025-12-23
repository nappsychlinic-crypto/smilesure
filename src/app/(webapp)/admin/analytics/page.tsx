'use client';

import { useEffect, useState } from 'react';
import { BarChart3, TrendingUp, Users, IndianRupee, Calendar, RefreshCw } from 'lucide-react';

interface RevenueData {
    summary: {
        totalRevenue: number;
        totalPayments: number;
        avgRevenuePerAppointment: number;
    };
    revenueByPeriod: { _id: string; total: number; count: number }[];
    revenueByTreatment: { _id: string; total: number; count: number }[];
}

interface PatientData {
    summary: {
        totalPatients: number;
        activePatients: number;
        recentlyVisitedCount: number;
    };
    visitMetrics: {
        avgVisitsPerPatient: string;
    };
}

interface RetentionData {
    summary: {
        firstTimePatients: number;
        returningPatients: number;
        returnRate: string;
        avgDaysBetweenVisits: number;
    };
}

export default function AdminAnalytics() {
    const [revenueData, setRevenueData] = useState<RevenueData | null>(null);
    const [patientData, setPatientData] = useState<PatientData | null>(null);
    const [retentionData, setRetentionData] = useState<RetentionData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        setIsLoading(true);
        try {
            const [revenueRes, patientRes, retentionRes] = await Promise.all([
                fetch('/api/analytics/revenue'),
                fetch('/api/analytics/patients'),
                fetch('/api/analytics/retention'),
            ]);

            const [revenue, patients, retention] = await Promise.all([
                revenueRes.json(),
                patientRes.json(),
                retentionRes.json(),
            ]);

            if (revenue.success) setRevenueData(revenue.data);
            if (patients.success) setPatientData(patients.data);
            if (retention.success) setRetentionData(retention.data);
        } catch (error) {
            console.error('Error fetching analytics:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const statCards = [
        {
            title: 'Total Revenue',
            value: revenueData ? `₹${revenueData.summary.totalRevenue.toLocaleString()}` : '...',
            subtitle: 'Last 30 days',
            icon: IndianRupee,
            color: 'from-green-500 to-emerald-600',
            bgColor: 'bg-green-50',
        },
        {
            title: 'Total Patients',
            value: patientData?.summary.totalPatients || 0,
            subtitle: `${patientData?.summary.activePatients || 0} active`,
            icon: Users,
            color: 'from-blue-500 to-blue-600',
            bgColor: 'bg-blue-50',
        },
        {
            title: 'Avg Revenue/Appointment',
            value: revenueData ? `₹${revenueData.summary.avgRevenuePerAppointment.toLocaleString()}` : '...',
            subtitle: 'Per completed visit',
            icon: TrendingUp,
            color: 'from-purple-500 to-purple-600',
            bgColor: 'bg-purple-50',
        },
        {
            title: 'Return Rate',
            value: retentionData ? `${retentionData.summary.returnRate}%` : '...',
            subtitle: `${retentionData?.summary.returningPatients || 0} returning patients`,
            icon: RefreshCw,
            color: 'from-orange-500 to-orange-600',
            bgColor: 'bg-orange-50',
        },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
                <p className="text-gray-600 mt-1">Business insights and performance metrics</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <div
                            key={card.title}
                            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={`${card.bgColor} p-3 rounded-xl`}>
                                    <Icon className="w-6 h-6" style={{ color: card.color.includes('green') ? '#22c55e' : card.color.includes('blue') ? '#3b82f6' : card.color.includes('purple') ? '#a855f7' : '#f97316' }} />
                                </div>
                            </div>
                            <p className="text-2xl font-bold text-gray-900">
                                {isLoading ? '...' : card.value}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">{card.title}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{card.subtitle}</p>
                        </div>
                    );
                })}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue by Treatment */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Treatment</h2>
                    {isLoading ? (
                        <div className="h-48 flex items-center justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4A90D9]"></div>
                        </div>
                    ) : revenueData?.revenueByTreatment.length ? (
                        <div className="space-y-4">
                            {revenueData.revenueByTreatment.slice(0, 5).map((item, index) => (
                                <div key={item._id || index}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-700">{item._id || 'Other'}</span>
                                        <span className="font-medium">₹{item.total.toLocaleString()}</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2">
                                        <div
                                            className="bg-gradient-to-r from-[#4A90D9] to-[#7EC8E3] h-2 rounded-full"
                                            style={{ width: `${Math.min((item.total / (revenueData.summary.totalRevenue || 1)) * 100, 100)}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="h-48 flex items-center justify-center text-gray-500">
                            <div className="text-center">
                                <BarChart3 className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                                <p>No revenue data yet</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Patient Metrics */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Patient Metrics</h2>
                    {isLoading ? (
                        <div className="h-48 flex items-center justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4A90D9]"></div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                <div>
                                    <p className="text-sm text-gray-500">First-time Patients</p>
                                    <p className="text-2xl font-bold text-gray-900">{retentionData?.summary.firstTimePatients || 0}</p>
                                </div>
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                    <Users className="w-6 h-6 text-blue-600" />
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                <div>
                                    <p className="text-sm text-gray-500">Avg Days Between Visits</p>
                                    <p className="text-2xl font-bold text-gray-900">{retentionData?.summary.avgDaysBetweenVisits || 0} days</p>
                                </div>
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                    <Calendar className="w-6 h-6 text-green-600" />
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                <div>
                                    <p className="text-sm text-gray-500">Avg Visits Per Patient</p>
                                    <p className="text-2xl font-bold text-gray-900">{patientData?.visitMetrics.avgVisitsPerPatient || 0}</p>
                                </div>
                                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                                    <TrendingUp className="w-6 h-6 text-purple-600" />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
