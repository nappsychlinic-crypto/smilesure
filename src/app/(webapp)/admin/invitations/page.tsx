'use client';

import { useEffect, useState } from 'react';
import { Phone, UserPlus, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface Invitation {
    _id: string;
    mobileNumber: string;
    countryCode?: string;
    role: string;
    expiresAt: string;
    accepted: boolean;
    createdAt: string;
}

export default function AdminInvitations() {
    const [invitations, setInvitations] = useState<Invitation[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ mobileNumber: '', countryCode: '+91', role: 'USER' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchInvitations();
    }, []);

    const fetchInvitations = async () => {
        setIsLoading(true);
        try {
            // Note: We'd need an invitations list API - for now showing the form
            setInvitations([]);
        } catch (error) {
            console.error('Error fetching invitations:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage({ type: '', text: '' });

        try {
            const response = await fetch('/api/users/invite', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage({ type: 'success', text: `Invitation sent to +91 ${formData.mobileNumber}` });
                setFormData({ mobileNumber: '', countryCode: '+91', role: 'USER' });
                setShowForm(false);
            } else {
                setMessage({ type: 'error', text: data.error || 'Failed to send invitation' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'An unexpected error occurred' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Invitations</h1>
                    <p className="text-gray-600 mt-1">Invite new users to join SmileSure</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 bg-gradient-to-r from-[#4A90D9] to-[#7EC8E3] text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                    <UserPlus className="w-5 h-5" />
                    {showForm ? 'Cancel' : 'New Invitation'}
                </button>
            </div>

            {message.text && (
                <div className={`p-4 rounded-xl ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                    {message.text}
                </div>
            )}

            {/* Invitation Form */}
            {showForm && (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Send Invitation</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
                            <div className="flex">
                                <div className="flex items-center px-4 bg-gray-100 border border-r-0 border-gray-200 rounded-l-xl text-gray-600 font-medium">
                                    +91
                                </div>
                                <input
                                    type="tel"
                                    inputMode="numeric"
                                    pattern="[0-9]{10}"
                                    maxLength={10}
                                    value={formData.mobileNumber}
                                    onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-r-xl focus:ring-2 focus:ring-[#4A90D9] focus:border-transparent"
                                    placeholder="Enter 10-digit mobile number"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                            <select
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4A90D9] focus:border-transparent"
                            >
                                <option value="USER">Patient</option>
                                <option value="FRONT_DESK">Front Desk</option>
                                <option value="ADMIN">Admin</option>
                            </select>
                        </div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-[#4A90D9] to-[#7EC8E3] text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                <>
                                    <Phone className="w-5 h-5" />
                                    Send Invitation
                                </>
                            )}
                        </button>
                    </form>
                </div>
            )}

            {/* Invitations List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-12 text-center">
                    <Phone className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Send Your First Invitation</h3>
                    <p className="text-gray-600">Click "New Invitation" to invite patients or staff members via SMS.</p>
                </div>
            </div>
        </div>
    );
}
