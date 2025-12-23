'use client';

import { useEffect, useState } from 'react';
import { Calendar, Search, Plus, Eye, Edit, X, ChevronDown, Loader2, IndianRupee } from 'lucide-react';

interface Patient {
    _id: string;
    name: string;
    email?: string;
    phone?: string;
    mobileNumber?: string;
    countryCode?: string;
}

interface Appointment {
    _id: string;
    patientId: Patient;
    appointmentDateTime: string;
    status: string;
    treatmentType: string;
    feeAmount?: number;
    notes?: string;
}

interface PaymentInfo {
    _id: string;
    amount: number;
    paymentMode: string;
    transactionNumber?: string;
    paymentDate: string;
    createdBy: {
        _id: string;
        name: string;
    };
}

interface TreatmentType {
    _id: string;
    name: string;
}

const statusColors: Record<string, string> = {
    'Scheduled': 'bg-blue-100 text-blue-700',
    'Confirmed': 'bg-green-100 text-green-700',
    'Checked-In': 'bg-yellow-100 text-yellow-700',
    'In Treatment': 'bg-purple-100 text-purple-700',
    'Completed': 'bg-emerald-100 text-emerald-700',
    'Cancelled': 'bg-red-100 text-red-700',
    'No-Show': 'bg-gray-100 text-gray-700',
};

const allStatuses = ['Scheduled', 'Confirmed', 'Checked-In', 'In Treatment', 'Completed', 'Cancelled', 'No-Show'];
const statuses = ['All', ...allStatuses];

export default function AdminAppointments() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [treatmentTypes, setTreatmentTypes] = useState<TreatmentType[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Filters
    const [dateFilter, setDateFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('All');
    const [treatmentFilter, setTreatmentFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    // Modal state
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
    const [modalMode, setModalMode] = useState<'view' | 'edit'>('view');
    const [showModal, setShowModal] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [editData, setEditData] = useState({ status: '', feeAmount: '', notes: '' });

    // Payment modal state
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentData, setPaymentData] = useState({
        amount: 0,
        paymentMode: 'CASH' as 'CASH' | 'ONLINE',
        transactionNumber: '',
    });
    const [paymentError, setPaymentError] = useState('');
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);

    // Payment info for view modal
    const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);
    const [isLoadingPayment, setIsLoadingPayment] = useState(false);

    useEffect(() => {
        fetchTreatmentTypes();
    }, []);

    useEffect(() => {
        fetchAppointments();
    }, [dateFilter]);

    const fetchTreatmentTypes = async () => {
        try {
            const response = await fetch('/api/treatment-types');
            const data = await response.json();
            if (data.success) {
                setTreatmentTypes(data.data);
            }
        } catch (error) {
            console.error('Error fetching treatment types:', error);
        }
    };

    const fetchAppointments = async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams();

            // Add date params
            const now = new Date();
            if (dateFilter === 'today') {
                const start = new Date(now);
                start.setHours(0, 0, 0, 0);
                const end = new Date(now);
                end.setHours(23, 59, 59, 999);
                params.append('startDate', start.toISOString());
                params.append('endDate', end.toISOString());
            } else if (dateFilter === 'this-week') {
                const start = new Date(now);
                start.setDate(start.getDate() - start.getDay());
                start.setHours(0, 0, 0, 0);
                params.append('startDate', start.toISOString());
            } else if (dateFilter === 'this-month') {
                const start = new Date(now.getFullYear(), now.getMonth(), 1);
                params.append('startDate', start.toISOString());
            } else if (dateFilter === 'this-year') {
                const start = new Date(now.getFullYear(), 0, 1);
                params.append('startDate', start.toISOString());
            }

            const response = await fetch(`/api/appointments?${params.toString()}`);
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

    const openViewModal = async (apt: Appointment) => {
        setSelectedAppointment(apt);
        setPaymentInfo(null);
        setModalMode('view');
        setShowModal(true);

        // Fetch payment info if appointment is completed
        if (apt.status === 'Completed') {
            setIsLoadingPayment(true);
            try {
                const response = await fetch(`/api/payments?appointmentId=${apt._id}`);
                const data = await response.json();
                if (data.success && data.data.length > 0) {
                    setPaymentInfo(data.data[0]);
                }
            } catch (error) {
                console.error('Error fetching payment:', error);
            } finally {
                setIsLoadingPayment(false);
            }
        }
    };

    const openEditModal = (apt: Appointment) => {
        setSelectedAppointment(apt);
        setEditData({
            status: apt.status,
            feeAmount: apt.feeAmount?.toString() || '',
            notes: apt.notes || '',
        });
        setModalMode('edit');
        setShowModal(true);
    };

    const handleSave = async () => {
        if (!selectedAppointment) return;

        // If changing to Completed, show payment modal instead
        if (editData.status === 'Completed' && selectedAppointment.status !== 'Completed') {
            setPaymentData({
                amount: editData.feeAmount ? parseFloat(editData.feeAmount) : (selectedAppointment.feeAmount || 0),
                paymentMode: 'CASH',
                transactionNumber: '',
            });
            setPaymentError('');
            setShowModal(false);
            setShowPaymentModal(true);
            return;
        }

        setIsSaving(true);

        try {
            const response = await fetch(`/api/appointments/${selectedAppointment._id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status: editData.status,
                    feeAmount: editData.feeAmount ? parseFloat(editData.feeAmount) : undefined,
                    notes: editData.notes,
                }),
            });

            if (response.ok) {
                setAppointments(prev =>
                    prev.map(apt =>
                        apt._id === selectedAppointment._id
                            ? { ...apt, status: editData.status, feeAmount: parseFloat(editData.feeAmount) || apt.feeAmount, notes: editData.notes }
                            : apt
                    )
                );
                setShowModal(false);
            }
        } catch (error) {
            console.error('Error updating appointment:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handlePaymentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedAppointment) return;

        setPaymentError('');
        setIsProcessingPayment(true);

        try {
            // Validate
            if (paymentData.amount <= 0) {
                setPaymentError('Please enter a valid amount');
                setIsProcessingPayment(false);
                return;
            }

            if (paymentData.paymentMode === 'ONLINE' && !paymentData.transactionNumber.trim()) {
                setPaymentError('Transaction number is required for online payments');
                setIsProcessingPayment(false);
                return;
            }

            const response = await fetch('/api/payments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    appointmentId: selectedAppointment._id,
                    amount: paymentData.amount,
                    paymentMode: paymentData.paymentMode,
                    transactionNumber: paymentData.paymentMode === 'ONLINE' ? paymentData.transactionNumber : undefined,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // Update appointment status in UI
                setAppointments(prev =>
                    prev.map(apt =>
                        apt._id === selectedAppointment._id ? { ...apt, status: 'Completed' } : apt
                    )
                );
                setShowPaymentModal(false);
                setSelectedAppointment(null);
            } else {
                setPaymentError(data.error || 'Failed to process payment');
            }
        } catch (error) {
            setPaymentError('An unexpected error occurred');
        } finally {
            setIsProcessingPayment(false);
        }
    };

    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        return {
            date: date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
            time: date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
            full: date.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
        };
    };

    const filteredAppointments = appointments.filter(apt => {
        // Status filter
        if (statusFilter !== 'All' && apt.status !== statusFilter) return false;

        // Treatment type filter
        if (treatmentFilter !== 'All' && apt.treatmentType !== treatmentFilter) return false;

        // Search query
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            const nameMatch = apt.patientId?.name?.toLowerCase().includes(query);
            const treatmentMatch = apt.treatmentType?.toLowerCase().includes(query);
            const mobileMatch = apt.patientId?.mobileNumber?.includes(query);
            if (!nameMatch && !treatmentMatch && !mobileMatch) return false;
        }

        return true;
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
                    <p className="text-gray-600 mt-1">Manage all clinic appointments</p>
                </div>
                <a
                    href="/admin/appointments/new"
                    className="flex items-center gap-2 bg-gradient-to-r from-[#4A90D9] to-[#7EC8E3] text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                    <Plus className="w-5 h-5" />
                    New Appointment
                </a>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-4">
                {/* Date Filter */}
                <div className="flex flex-wrap gap-2">
                    {[
                        { key: 'today', label: 'Today' },
                        { key: 'this-week', label: 'This Week' },
                        { key: 'this-month', label: 'This Month' },
                        { key: 'this-year', label: 'This Year' },
                        { key: 'all', label: 'All Time' },
                    ].map((item) => (
                        <button
                            key={item.key}
                            onClick={() => setDateFilter(item.key)}
                            className={`px-4 py-2 rounded-xl font-medium transition-all ${dateFilter === item.key
                                ? 'bg-[#4A90D9] text-white shadow-md'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>

                {/* Search and Dropdowns */}
                <div className="flex flex-wrap gap-4 pt-2 border-t border-gray-100">
                    <div className="flex-1 min-w-[200px]">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by patient, mobile, or treatment..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4A90D9] focus:border-transparent"
                            />
                        </div>
                    </div>
                    <div className="min-w-[150px]">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4A90D9] bg-white"
                        >
                            {statuses.map((status) => (
                                <option key={status} value={status}>{status === 'All' ? 'All Statuses' : status}</option>
                            ))}
                        </select>
                    </div>
                    <div className="min-w-[180px]">
                        <select
                            value={treatmentFilter}
                            onChange={(e) => setTreatmentFilter(e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4A90D9] bg-white"
                        >
                            <option value="All">All Treatments</option>
                            {treatmentTypes.map((tt) => (
                                <option key={tt._id} value={tt.name}>{tt.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Results Summary */}
            <div className="text-sm text-gray-500">
                Showing {filteredAppointments.length} of {appointments.length} appointments
            </div>

            {/* Appointments Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Patient</th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Date & Time</th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Treatment</th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Fee</th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4A90D9] mx-auto"></div>
                                </td>
                            </tr>
                        ) : filteredAppointments.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                    <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                    <p>No appointments found</p>
                                </td>
                            </tr>
                        ) : (
                            filteredAppointments.map((apt) => {
                                const { date, time } = formatDateTime(apt.appointmentDateTime);
                                return (
                                    <tr key={apt._id} className="border-b border-gray-50 hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-medium text-gray-900">{apt.patientId?.name || 'Unknown'}</p>
                                                <p className="text-sm text-gray-500">
                                                    {apt.patientId?.mobileNumber
                                                        ? `${apt.patientId.countryCode || '+91'} ${apt.patientId.mobileNumber}`
                                                        : apt.patientId?.phone || '-'
                                                    }
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-gray-900">{date}</p>
                                            <p className="text-sm text-gray-500">{time}</p>
                                        </td>
                                        <td className="px-6 py-4 text-gray-700">{apt.treatmentType}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[apt.status] || 'bg-gray-100 text-gray-700'}`}>
                                                {apt.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-700">₹{apt.feeAmount?.toLocaleString() || '-'}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => openViewModal(apt)}
                                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                                    title="View Details"
                                                >
                                                    <Eye className="w-4 h-4 text-gray-500" />
                                                </button>
                                                <button
                                                    onClick={() => openEditModal(apt)}
                                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit className="w-4 h-4 text-gray-500" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* View/Edit Modal */}
            {showModal && selectedAppointment && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-lg">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900">
                                {modalMode === 'view' ? 'Appointment Details' : 'Edit Appointment'}
                            </h2>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {/* Patient Info */}
                            <div className="p-4 bg-gray-50 rounded-xl">
                                <p className="text-sm text-gray-500 mb-1">Patient</p>
                                <p className="font-semibold text-gray-900">{selectedAppointment.patientId?.name || 'Unknown'}</p>
                                <p className="text-sm text-gray-600">
                                    {selectedAppointment.patientId?.mobileNumber
                                        ? `${selectedAppointment.patientId.countryCode || '+91'} ${selectedAppointment.patientId.mobileNumber}`
                                        : selectedAppointment.patientId?.phone || '-'
                                    }
                                </p>
                            </div>

                            {/* Date & Treatment */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-gray-50 rounded-xl">
                                    <p className="text-sm text-gray-500 mb-1">Date & Time</p>
                                    <p className="font-semibold text-gray-900">{formatDateTime(selectedAppointment.appointmentDateTime).full}</p>
                                    <p className="text-sm text-gray-600">{formatDateTime(selectedAppointment.appointmentDateTime).time}</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-xl">
                                    <p className="text-sm text-gray-500 mb-1">Treatment</p>
                                    <p className="font-semibold text-gray-900">{selectedAppointment.treatmentType}</p>
                                </div>
                            </div>

                            {modalMode === 'view' ? (
                                <>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 bg-gray-50 rounded-xl">
                                            <p className="text-sm text-gray-500 mb-1">Status</p>
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[selectedAppointment.status]}`}>
                                                {selectedAppointment.status}
                                            </span>
                                        </div>
                                        <div className="p-4 bg-gray-50 rounded-xl">
                                            <p className="text-sm text-gray-500 mb-1">Fee</p>
                                            <p className="font-semibold text-gray-900">₹{selectedAppointment.feeAmount?.toLocaleString() || '-'}</p>
                                        </div>
                                    </div>
                                    {selectedAppointment.notes && (
                                        <div className="p-4 bg-gray-50 rounded-xl">
                                            <p className="text-sm text-gray-500 mb-1">Notes</p>
                                            <p className="text-gray-700">{selectedAppointment.notes}</p>
                                        </div>
                                    )}

                                    {/* Payment Info */}
                                    {selectedAppointment.status === 'Completed' && (
                                        <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                                            <p className="text-sm font-medium text-green-800 mb-3">💰 Payment Details</p>
                                            {isLoadingPayment ? (
                                                <div className="flex items-center gap-2 text-green-700">
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    Loading payment info...
                                                </div>
                                            ) : paymentInfo ? (
                                                <div className="space-y-2 text-sm">
                                                    <div className="flex justify-between">
                                                        <span className="text-green-700">Amount Paid:</span>
                                                        <span className="font-semibold text-green-900">₹{paymentInfo.amount.toLocaleString()}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-green-700">Payment Mode:</span>
                                                        <span className="font-medium text-green-900">{paymentInfo.paymentMode === 'CASH' ? '💵 Cash' : '📱 Online/UPI'}</span>
                                                    </div>
                                                    {paymentInfo.paymentMode === 'ONLINE' && paymentInfo.transactionNumber && (
                                                        <div className="flex justify-between">
                                                            <span className="text-green-700">Transaction No:</span>
                                                            <span className="font-mono text-green-900">{paymentInfo.transactionNumber}</span>
                                                        </div>
                                                    )}
                                                    <div className="flex justify-between">
                                                        <span className="text-green-700">Collected By:</span>
                                                        <span className="font-medium text-green-900">{paymentInfo.createdBy?.name || 'Unknown'}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-green-700">Date:</span>
                                                        <span className="text-green-900">{new Date(paymentInfo.paymentDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="text-green-700 text-sm">No payment record found</p>
                                            )}
                                        </div>
                                    )}
                                    <button
                                        onClick={() => {
                                            setEditData({
                                                status: selectedAppointment.status,
                                                feeAmount: selectedAppointment.feeAmount?.toString() || '',
                                                notes: selectedAppointment.notes || '',
                                            });
                                            setModalMode('edit');
                                        }}
                                        className="w-full py-3 bg-gradient-to-r from-[#4A90D9] to-[#7EC8E3] text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                                    >
                                        Edit Appointment
                                    </button>
                                </>
                            ) : (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                        <select
                                            value={editData.status}
                                            onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4A90D9]"
                                        >
                                            {allStatuses.map((s) => (
                                                <option key={s} value={s}>{s}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Fee (₹)</label>
                                        <input
                                            type="number"
                                            value={editData.feeAmount}
                                            onChange={(e) => setEditData({ ...editData, feeAmount: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4A90D9]"
                                            placeholder="Enter fee amount"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                                        <textarea
                                            value={editData.notes}
                                            onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
                                            rows={3}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4A90D9]"
                                            placeholder="Add notes..."
                                        />
                                    </div>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setModalMode('view')}
                                            className="flex-1 py-3 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSave}
                                            disabled={isSaving}
                                            className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-[#4A90D9] to-[#7EC8E3] text-white rounded-xl font-semibold disabled:opacity-50"
                                        >
                                            {isSaving ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    Saving...
                                                </>
                                            ) : 'Save Changes'}
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Payment Modal */}
            {showPaymentModal && selectedAppointment && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Collect Payment</h2>
                            <button
                                onClick={() => {
                                    setShowPaymentModal(false);
                                    setShowModal(true);
                                }}
                                className="p-2 hover:bg-gray-100 rounded-lg"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Appointment Info */}
                        <div className="p-4 bg-gray-50 rounded-xl mb-6">
                            <p className="font-semibold text-gray-900">{selectedAppointment.patientId?.name}</p>
                            <p className="text-sm text-gray-600">{selectedAppointment.treatmentType}</p>
                        </div>

                        {paymentError && (
                            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-xl text-sm">
                                {paymentError}
                            </div>
                        )}

                        <form onSubmit={handlePaymentSubmit} className="space-y-4">
                            {/* Amount */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                    <IndianRupee className="w-4 h-4" />
                                    Amount
                                </label>
                                <input
                                    type="number"
                                    value={paymentData.amount}
                                    onChange={(e) => setPaymentData({ ...paymentData, amount: parseFloat(e.target.value) || 0 })}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4A90D9] focus:border-transparent text-lg font-semibold"
                                    placeholder="Enter amount"
                                    required
                                    min="0"
                                />
                            </div>

                            {/* Payment Mode */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Payment Mode
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setPaymentData({ ...paymentData, paymentMode: 'CASH', transactionNumber: '' })}
                                        className={`p-4 rounded-xl border-2 font-medium transition-all ${paymentData.paymentMode === 'CASH'
                                            ? 'border-[#4A90D9] bg-[#4A90D9]/10 text-[#4A90D9]'
                                            : 'border-gray-200 text-gray-700 hover:border-gray-300'
                                            }`}
                                    >
                                        💵 Cash
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setPaymentData({ ...paymentData, paymentMode: 'ONLINE' })}
                                        className={`p-4 rounded-xl border-2 font-medium transition-all ${paymentData.paymentMode === 'ONLINE'
                                            ? 'border-[#4A90D9] bg-[#4A90D9]/10 text-[#4A90D9]'
                                            : 'border-gray-200 text-gray-700 hover:border-gray-300'
                                            }`}
                                    >
                                        📱 Online/UPI
                                    </button>
                                </div>
                            </div>

                            {/* Transaction Number (for Online) */}
                            {paymentData.paymentMode === 'ONLINE' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Transaction Number <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={paymentData.transactionNumber}
                                        onChange={(e) => setPaymentData({ ...paymentData, transactionNumber: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4A90D9] focus:border-transparent"
                                        placeholder="Enter UTR/Transaction ID"
                                        required
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Enter the UTR or transaction reference number from UPI payment</p>
                                </div>
                            )}

                            {/* Buttons */}
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowPaymentModal(false);
                                        setShowModal(true);
                                    }}
                                    className="flex-1 py-3 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isProcessingPayment}
                                    className="flex-1 py-3 bg-gradient-to-r from-[#4A90D9] to-[#7EC8E3] text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isProcessingPayment ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        'Complete & Collect'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
