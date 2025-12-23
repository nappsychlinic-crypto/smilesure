'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, User, FileText, IndianRupee, Loader2, CheckCircle } from 'lucide-react';

interface Patient {
    _id: string;
    name: string;
    email: string;
    phone?: string;
}

interface TreatmentType {
    _id: string;
    name: string;
    price: number;
}

export default function AdminCreateAppointment() {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [treatmentTypes, setTreatmentTypes] = useState<TreatmentType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const [formData, setFormData] = useState({
        patientId: '',
        appointmentDate: '',
        appointmentTime: '',
        treatmentType: '',
        feeAmount: '',
        notes: '',
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [patientsRes, typesRes] = await Promise.all([
                    fetch('/api/users?role=USER'),
                    fetch('/api/treatment-types?isActive=true')
                ]);

                const patientsData = await patientsRes.json();
                const typesData = await typesRes.json();

                if (patientsData.success) setPatients(patientsData.data);
                if (typesData.success) setTreatmentTypes(typesData.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleTreatmentTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedName = e.target.value;
        const selectedType = treatmentTypes.find(t => t.name === selectedName);

        setFormData({
            ...formData,
            treatmentType: selectedName,
            feeAmount: selectedType ? selectedType.price.toString() : formData.feeAmount
        });
    };

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
                    patientId: formData.patientId,
                    appointmentDateTime: appointmentDateTime.toISOString(),
                    treatmentType: formData.treatmentType,
                    feeAmount: formData.feeAmount ? parseFloat(formData.feeAmount) : 0,
                    notes: formData.notes,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(true);
                setTimeout(() => router.push('/admin/appointments'), 2000);
            } else {
                setError(data.error || 'Failed to create appointment');
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
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Appointment Created!</h2>
                    <p className="text-gray-600">Redirecting to appointments...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">New Appointment</h1>
                <p className="text-gray-600 mt-1">Schedule a new appointment for a patient</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 space-y-6">
                {error && (
                    <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600">
                        {error}
                    </div>
                )}

                {/* Patient Selection */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <User className="w-4 h-4" />
                        Select Patient
                    </label>
                    {isLoading ? (
                        <div className="animate-pulse h-12 bg-gray-100 rounded-xl" />
                    ) : (
                        <select
                            value={formData.patientId}
                            onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4A90D9] focus:border-transparent"
                            required
                        >
                            <option value="">Choose a patient...</option>
                            {patients.map((patient) => (
                                <option key={patient._id} value={patient._id}>
                                    {patient.name} - {patient.phone || patient.email}
                                </option>
                            ))}
                        </select>
                    )}
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                            <Calendar className="w-4 h-4" />
                            Date
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
                            Time
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
                        Treatment Type
                    </label>
                    <select
                        value={formData.treatmentType}
                        onChange={handleTreatmentTypeChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4A90D9] focus:border-transparent"
                        required
                    >
                        <option value="">Select treatment...</option>
                        {treatmentTypes.map((type) => (
                            <option key={type._id} value={type.name}>
                                {type.name} - ₹{type.price}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Fee Amount */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <IndianRupee className="w-4 h-4" />
                        Fee Amount (₹)
                    </label>
                    <input
                        type="number"
                        value={formData.feeAmount}
                        onChange={(e) => setFormData({ ...formData, feeAmount: e.target.value })}
                        placeholder="0"
                        min="0"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4A90D9] focus:border-transparent"
                    />
                </div>

                {/* Notes */}
                <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Notes (Optional)</label>
                    <textarea
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="Any additional notes..."
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4A90D9] focus:border-transparent"
                    />
                </div>

                {/* Submit Button */}
                <div className="flex gap-4">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="flex-1 py-3 border border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-[#4A90D9] to-[#7EC8E3] text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Creating...
                            </>
                        ) : (
                            'Create Appointment'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
