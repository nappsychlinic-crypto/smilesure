'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { User, Phone, Calendar, CheckCircle, XCircle, ArrowLeft, Save, Loader2 } from 'lucide-react';

interface Patient {
    _id: string;
    name: string;
    mobileNumber: string;
    countryCode?: string;
    email?: string;
    isActive: boolean;
    createdAt: string;
}

interface Appointment {
    _id: string;
    appointmentDateTime: string;
    status: string;
    treatmentType: string;
    feeAmount?: number;
}

export default function FrontDeskPatientProfile() {
    const params = useParams();
    const router = useRouter();
    const patientId = params.id as string;

    const [patient, setPatient] = useState<Patient | null>(null);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [formData, setFormData] = useState({ name: '', isActive: true });

    useEffect(() => {
        fetchPatient();
        fetchAppointments();
    }, [patientId]);

    const fetchPatient = async () => {
        try {
            const response = await fetch(`/api/users/${patientId}`);
            const data = await response.json();
            if (data.success) {
                setPatient(data.data);
                setFormData({
                    name: data.data.name,
                    isActive: data.data.isActive,
                });
            }
        } catch (error) {
            console.error('Error fetching patient:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchAppointments = async () => {
        try {
            const response = await fetch(`/api/appointments?patientId=${patientId}`);
            const data = await response.json();
            if (data.success) {
                setAppointments(data.data);
            }
        } catch (error) {
            console.error('Error fetching appointments:', error);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        setMessage({ type: '', text: '' });

        try {
            const response = await fetch(`/api/users/${patientId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage({ type: 'success', text: 'Patient profile updated successfully!' });
                setPatient({ ...patient!, ...formData });
            } else {
                setMessage({ type: 'error', text: data.error || 'Failed to update profile' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'An unexpected error occurred' });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4A90D9]"></div>
            </div>
        );
    }

    if (!patient) {
        return (
            <div className="text-center py-12">
                <User className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h2 className="text-xl font-semibold text-gray-900">Patient Not Found</h2>
                <button onClick={() => router.back()} className="mt-4 text-[#4A90D9] hover:underline">
                    ← Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => router.back()}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Patient Profile</h1>
                    <p className="text-gray-600">View and edit patient information</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Form */}
                <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#4A90D9] to-[#7EC8E3] flex items-center justify-center text-white font-bold text-2xl">
                            {patient.name?.charAt(0).toUpperCase() || '?'}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">{patient.name}</h2>
                            <p className="text-gray-500">{patient.countryCode || '+91'} {patient.mobileNumber}</p>
                        </div>
                    </div>

                    {message.text && (
                        <div className={`mb-6 p-4 rounded-xl ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                            {message.text}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                <User className="w-4 h-4" />
                                Full Name
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4A90D9] focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                <Phone className="w-4 h-4" />
                                Mobile Number
                            </label>
                            <div className="flex">
                                <div className="flex items-center px-4 bg-gray-100 border border-r-0 border-gray-200 rounded-l-xl text-gray-600 font-medium">
                                    {patient.countryCode || '+91'}
                                </div>
                                <input
                                    type="tel"
                                    value={patient.mobileNumber}
                                    disabled
                                    className="w-full px-4 py-3 border border-gray-200 rounded-r-xl bg-gray-50 text-gray-500"
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Mobile number cannot be changed</p>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                            <div>
                                <p className="font-medium text-gray-900">Account Status</p>
                                <p className="text-sm text-gray-500">Enable or disable this account</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4A90D9]"></div>
                            </label>
                        </div>

                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#4A90D9] to-[#7EC8E3] text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="w-5 h-5" />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Appointments Summary */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Appointment History</h3>

                    <div className="space-y-3">
                        {appointments.length === 0 ? (
                            <p className="text-gray-500 text-center py-4">No appointments yet</p>
                        ) : (
                            appointments.slice(0, 5).map((apt) => (
                                <div key={apt._id} className="p-3 bg-gray-50 rounded-xl">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm font-medium text-gray-900">{apt.treatmentType}</span>
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${apt.status === 'Completed' ? 'bg-green-100 text-green-700' :
                                            apt.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                                                'bg-blue-100 text-blue-700'
                                            }`}>
                                            {apt.status}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        {new Date(apt.appointmentDateTime).toLocaleDateString('en-IN', {
                                            day: 'numeric', month: 'short', year: 'numeric'
                                        })}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>

                    {appointments.length > 5 && (
                        <button className="w-full mt-4 text-[#4A90D9] text-sm font-medium hover:underline">
                            View all {appointments.length} appointments
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
