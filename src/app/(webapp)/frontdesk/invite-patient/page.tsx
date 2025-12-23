'use client';

import { useState } from 'react';
import { UserPlus, Phone, Loader2, CheckCircle } from 'lucide-react';

export default function InvitePatient() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        mobileNumber: '',
        countryCode: '+91',
        name: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            const response = await fetch('/api/users/invite', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    mobileNumber: formData.mobileNumber,
                    countryCode: formData.countryCode,
                    name: formData.name,
                    role: 'USER',
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(true);
                setFormData({ mobileNumber: '', countryCode: '+91', name: '' });
            } else {
                setError(data.error || 'Failed to send invitation');
            }
        } catch (err) {
            setError('An unexpected error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Invite Patient</h1>
                <p className="text-gray-600 mt-1">Send an invitation to a new patient</p>
            </div>

            {success ? (
                <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Invitation Sent!</h2>
                    <p className="text-gray-600 mb-6">The patient will receive an SMS with a link to set up their account.</p>
                    <button
                        onClick={() => setSuccess(false)}
                        className="bg-gradient-to-r from-[#4A90D9] to-[#7EC8E3] text-white px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-lg transition-all"
                    >
                        Invite Another Patient
                    </button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 space-y-6">
                    {error && (
                        <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600">
                            {error}
                        </div>
                    )}

                    {/* Name - Large input */}
                    <div>
                        <label className="flex items-center gap-2 text-lg font-medium text-gray-700 mb-3">
                            <UserPlus className="w-5 h-5" />
                            Patient Name
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Enter patient's name"
                            className="w-full px-4 py-4 text-lg border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4A90D9] focus:border-transparent"
                        />
                    </div>

                    {/* Mobile Number - Large input */}
                    <div>
                        <label className="flex items-center gap-2 text-lg font-medium text-gray-700 mb-3">
                            <Phone className="w-5 h-5" />
                            Mobile Number
                        </label>
                        <div className="flex">
                            <div className="flex items-center px-4 bg-gray-100 border border-r-0 border-gray-200 rounded-l-xl text-gray-600 font-medium text-lg">
                                +91
                            </div>
                            <input
                                type="tel"
                                inputMode="numeric"
                                pattern="[0-9]{10}"
                                maxLength={10}
                                value={formData.mobileNumber}
                                onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                                placeholder="Enter 10-digit mobile number"
                                className="w-full px-4 py-4 text-lg border border-gray-200 rounded-r-xl focus:ring-2 focus:ring-[#4A90D9] focus:border-transparent"
                                required
                            />
                        </div>
                    </div>

                    {/* Submit Button - Large */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-[#4A90D9] to-[#7EC8E3] text-white py-5 rounded-xl text-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-6 h-6 animate-spin" />
                                Sending...
                            </>
                        ) : (
                            <>
                                <Phone className="w-6 h-6" />
                                Send Invitation
                            </>
                        )}
                    </button>
                </form>
            )}
        </div>
    );
}
