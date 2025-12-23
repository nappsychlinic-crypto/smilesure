'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, FileText, Loader2, CheckCircle, Info } from 'lucide-react';

interface TreatmentType {
    _id: string;
    name: string;
    price: number;
}

export default function BookAppointment() {
    const [treatmentTypes, setTreatmentTypes] = useState<TreatmentType[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const [formData, setFormData] = useState({
        appointmentDate: '',
        appointmentTime: '',
        treatmentType: '',
        notes: '',
    });

    useEffect(() => {
        const fetchTypes = async () => {
            try {
                const response = await fetch('/api/treatment-types?isActive=true');
                const data = await response.json();
                if (data.success) {
                    setTreatmentTypes(data.data);
                }
            } catch (error) {
                console.error('Error fetching treatment types:', error);
            }
        };

        fetchTypes();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            const appointmentDateTime = new Date(`${formData.appointmentDate}T${formData.appointmentTime}`);

            const response = await fetch('/api/appointments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    appointmentDateTime: appointmentDateTime.toISOString(),
                    treatmentType: formData.treatmentType,
                    notes: formData.notes,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(true);
                setTimeout(() => router.push('/user/appointments'), 2000);
            } else {
                setError(data.error || 'Failed to book appointment');
            }
        } catch (err) {
            setError('An unexpected error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (success) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Appointment Requested!</h2>
                    <p className="text-gray-600">We&apos;ll confirm your appointment soon.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Book Appointment</h1>
                <p className="text-gray-600 mt-1">Request a new dental appointment</p>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <p className="text-sm text-blue-800">
                    Your appointment request will be reviewed and confirmed by our team. We&apos;ll notify you once confirmed.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 space-y-6">
                {error && (
                    <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600">
                        {error}
                    </div>
                )}

                {/* Date & Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                            <Calendar className="w-4 h-4" />
                            Preferred Date
                        </label>
                        <input
                            type="date"
                            value={formData.appointmentDate}
                            onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                            min={new Date().toISOString().split('T')[0]}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4A90D9] focus:border-transparent"
                            required
                        />
                    </div>
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                            <Clock className="w-4 h-4" />
                            Preferred Time
                        </label>
                        <input
                            type="time"
                            value={formData.appointmentTime}
                            onChange={(e) => setFormData({ ...formData, appointmentTime: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4A90D9] focus:border-transparent"
                            required
                        />
                    </div>
                </div>

                {/* Treatment Type */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <FileText className="w-4 h-4" />
                        What do you need help with?
                    </label>
                    <select
                        value={formData.treatmentType}
                        onChange={(e) => setFormData({ ...formData, treatmentType: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4A90D9] focus:border-transparent"
                        required
                    >
                        <option value="">Select a reason...</option>
                        {treatmentTypes.map((type) => (
                            <option key={type._id} value={type.name}>{type.name}</option>
                        ))}
                    </select>
                </div>

                {/* Notes */}
                <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Additional Notes (Optional)
                    </label>
                    <textarea
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="Any specific concerns or information we should know..."
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4A90D9] focus:border-transparent"
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#4A90D9] to-[#7EC8E3] text-white py-3.5 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Submitting...
                        </>
                    ) : (
                        <>
                            <Calendar className="w-5 h-5" />
                            Request Appointment
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
