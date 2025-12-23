'use client';

import { useEffect, useState } from 'react';
import { Calendar, Clock, Plus, AlertCircle, X, AlertTriangle } from 'lucide-react';

interface Appointment {
    _id: string;
    appointmentDateTime: string;
    status: string;
    treatmentType: string;
    feeAmount?: number;
    notes?: string;
}

const statusColors: Record<string, string> = {
    'Scheduled': 'bg-blue-100 text-blue-700 border-blue-200',
    'Confirmed': 'bg-green-100 text-green-700 border-green-200',
    'Checked-In': 'bg-yellow-100 text-yellow-700 border-yellow-200',
    'In Treatment': 'bg-purple-100 text-purple-700 border-purple-200',
    'Completed': 'bg-emerald-100 text-emerald-700 border-emerald-200',
    'Cancelled': 'bg-red-100 text-red-700 border-red-200',
    'No-Show': 'bg-gray-100 text-gray-700 border-gray-200',
};

export default function UserAppointments() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
    const [cancelModal, setCancelModal] = useState<{ show: boolean; appointmentId: string; treatmentType: string }>({ show: false, appointmentId: '', treatmentType: '' });
    const [isCancelling, setIsCancelling] = useState(false);

    useEffect(() => {
        fetchAppointments();
    }, [activeTab]);

    const fetchAppointments = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(
                `/api/appointments?upcoming=${activeTab === 'upcoming'}`
            );
            const data = await response.json();

            if (data.success) {
                setAppointments(data.data);
            }
        } catch (error) {
            console.error('Error fetching appointments:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancelAppointment = async () => {
        setIsCancelling(true);
        try {
            const response = await fetch(`/api/appointments/${cancelModal.appointmentId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'Cancelled' }),
            });

            if (response.ok) {
                setAppointments(prev =>
                    prev.map(apt =>
                        apt._id === cancelModal.appointmentId ? { ...apt, status: 'Cancelled' } : apt
                    )
                );
                setCancelModal({ show: false, appointmentId: '', treatmentType: '' });
            }
        } catch (error) {
            console.error('Error cancelling appointment:', error);
        } finally {
            setIsCancelling(false);
        }
    };

    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        return {
            date: date.toLocaleDateString('en-IN', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
            }),
            time: date.toLocaleTimeString('en-IN', {
                hour: '2-digit',
                minute: '2-digit',
            }),
        };
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
                    <p className="text-gray-600 mt-1">View and manage your dental appointments</p>
                </div>
                <a
                    href="/user/book-appointment"
                    className="flex items-center gap-2 bg-gradient-to-r from-[#4A90D9] to-[#7EC8E3] text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                    <Plus className="w-5 h-5" />
                    Book New
                </a>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-2xl p-2 shadow-sm border border-gray-100 inline-flex">
                <button
                    onClick={() => setActiveTab('upcoming')}
                    className={`px-6 py-3 rounded-xl font-medium transition-all ${activeTab === 'upcoming'
                            ? 'bg-[#4A90D9] text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                >
                    Upcoming
                </button>
                <button
                    onClick={() => setActiveTab('past')}
                    className={`px-6 py-3 rounded-xl font-medium transition-all ${activeTab === 'past'
                            ? 'bg-[#4A90D9] text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                >
                    Past
                </button>
            </div>

            {/* Appointments List */}
            <div className="space-y-4">
                {isLoading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-pulse">
                                <div className="h-24 bg-gray-100 rounded-xl" />
                            </div>
                        ))}
                    </div>
                ) : appointments.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
                        <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {activeTab === 'upcoming' ? 'No Upcoming Appointments' : 'No Past Appointments'}
                        </h3>
                        <p className="text-gray-600 mb-6">
                            {activeTab === 'upcoming'
                                ? "You don't have any upcoming appointments scheduled."
                                : "You don't have any past appointments."}
                        </p>
                        {activeTab === 'upcoming' && (
                            <a
                                href="/user/book-appointment"
                                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#4A90D9] to-[#7EC8E3] text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                            >
                                <Plus className="w-5 h-5" />
                                Book an Appointment
                            </a>
                        )}
                    </div>
                ) : (
                    appointments.map((appointment) => {
                        const { date, time } = formatDateTime(appointment.appointmentDateTime);
                        const isUpcoming = new Date(appointment.appointmentDateTime) > new Date();
                        const canCancel = isUpcoming && appointment.status !== 'Cancelled';

                        return (
                            <div
                                key={appointment._id}
                                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                            >
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    {/* Date & Time */}
                                    <div className="flex items-start gap-4">
                                        <div className="bg-[#4A90D9]/10 p-4 rounded-xl">
                                            <Calendar className="w-6 h-6 text-[#4A90D9]" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">{appointment.treatmentType}</h3>
                                            <div className="flex items-center gap-2 text-gray-600 mt-1">
                                                <Clock className="w-4 h-4" />
                                                <span>{date}</span>
                                                <span>•</span>
                                                <span className="font-medium">{time}</span>
                                            </div>
                                            {appointment.notes && (
                                                <p className="text-sm text-gray-500 mt-2">{appointment.notes}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Status & Actions */}
                                    <div className="flex items-center gap-3">
                                        <span className={`px-4 py-2 rounded-full text-sm font-medium border ${statusColors[appointment.status] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                                            {appointment.status}
                                        </span>

                                        {canCancel && (
                                            <button
                                                onClick={() => setCancelModal({ show: true, appointmentId: appointment._id, treatmentType: appointment.treatmentType })}
                                                className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl font-medium transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800">
                    <p className="font-medium">Need to reschedule?</p>
                    <p>Please contact the clinic at least 24 hours before your appointment to reschedule or cancel.</p>
                </div>
            </div>

            {/* Cancel Confirmation Modal */}
            {cancelModal.show && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-red-100 rounded-full">
                                    <AlertTriangle className="w-6 h-6 text-red-600" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900">Cancel Appointment</h2>
                            </div>
                            <button
                                onClick={() => setCancelModal({ show: false, appointmentId: '', treatmentType: '' })}
                                className="p-2 hover:bg-gray-100 rounded-lg"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <p className="text-gray-600 mb-6">
                            Are you sure you want to cancel your <strong>{cancelModal.treatmentType}</strong> appointment? This action cannot be undone.
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setCancelModal({ show: false, appointmentId: '', treatmentType: '' })}
                                className="flex-1 py-3 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Keep Appointment
                            </button>
                            <button
                                onClick={handleCancelAppointment}
                                disabled={isCancelling}
                                className="flex-1 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
                            >
                                {isCancelling ? 'Cancelling...' : 'Yes, Cancel'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
