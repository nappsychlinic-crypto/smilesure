'use client';

import { useEffect, useState } from 'react';
import { Calendar, Clock, ChevronDown, X, Eye, Loader2, IndianRupee, Search, Filter } from 'lucide-react';

interface Patient {
    _id: string;
    name: string;
    email: string;
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

interface TreatmentType {
    _id: string;
    name: string;
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

export default function FrontDeskAppointments() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [treatmentTypes, setTreatmentTypes] = useState<TreatmentType[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Filters
    const [dateFilter, setDateFilter] = useState('today');
    const [statusFilter, setStatusFilter] = useState('All');
    const [treatmentFilter, setTreatmentFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    const [statusDropdown, setStatusDropdown] = useState<string | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);

    // View modal state
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
    const [showViewModal, setShowViewModal] = useState(false);
    const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);
    const [isLoadingPayment, setIsLoadingPayment] = useState(false);

    // Payment modal state
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentAppointment, setPaymentAppointment] = useState<Appointment | null>(null);
    const [paymentData, setPaymentData] = useState({
        amount: 0,
        paymentMode: 'CASH' as 'CASH' | 'ONLINE',
        transactionNumber: '',
    });
    const [paymentError, setPaymentError] = useState('');
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);

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
            const today = new Date();
            let startDate = new Date(today.setHours(0, 0, 0, 0));
            let endDate = new Date(today.setHours(23, 59, 59, 999));

            if (dateFilter === 'tomorrow') {
                startDate = new Date(today);
                startDate.setDate(startDate.getDate() + 1);
                startDate.setHours(0, 0, 0, 0);
                endDate = new Date(startDate);
                endDate.setHours(23, 59, 59, 999);
            } else if (dateFilter === 'this-week') {
                endDate = new Date(today);
                endDate.setDate(endDate.getDate() + 7);
            } else if (dateFilter === 'all') {
                // Don't add date filters
                const response = await fetch('/api/appointments');
                const data = await response.json();
                if (data.success) {
                    setAppointments(data.data);
                }
                setIsLoading(false);
                return;
            }

            const response = await fetch(
                `/api/appointments?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
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

    const updateStatus = async (appointmentId: string, newStatus: string) => {
        // If marking as Completed, show payment modal instead
        if (newStatus === 'Completed') {
            const apt = appointments.find(a => a._id === appointmentId);
            if (apt) {
                setPaymentAppointment(apt);
                setPaymentData({
                    amount: apt.feeAmount || 0,
                    paymentMode: 'CASH',
                    transactionNumber: '',
                });
                setPaymentError('');
                setShowPaymentModal(true);
                setStatusDropdown(null);
            }
            return;
        }

        setIsUpdating(true);
        try {
            const response = await fetch(`/api/appointments/${appointmentId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });

            if (response.ok) {
                setAppointments(prev =>
                    prev.map(apt =>
                        apt._id === appointmentId ? { ...apt, status: newStatus } : apt
                    )
                );
            }
        } catch (error) {
            console.error('Error updating status:', error);
        } finally {
            setIsUpdating(false);
            setStatusDropdown(null);
        }
    };

    const handlePaymentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!paymentAppointment) return;

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
                    appointmentId: paymentAppointment._id,
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
                        apt._id === paymentAppointment._id ? { ...apt, status: 'Completed' } : apt
                    )
                );
                setShowPaymentModal(false);
                setPaymentAppointment(null);
            } else {
                setPaymentError(data.error || 'Failed to process payment');
            }
        } catch (error) {
            setPaymentError('An unexpected error occurred');
        } finally {
            setIsProcessingPayment(false);
        }
    };

    const openViewModal = async (apt: Appointment) => {
        setSelectedAppointment(apt);
        setPaymentInfo(null);
        setShowViewModal(true);

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

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
        });
    };

    const formatFullDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    // Apply filters
    const filteredAppointments = appointments.filter(apt => {
        // Status filter
        if (statusFilter !== 'All' && apt.status !== statusFilter) return false;

        // Treatment type filter
        if (treatmentFilter !== 'All' && apt.treatmentType !== treatmentFilter) return false;

        // Search query
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            const nameMatch = apt.patientId?.name?.toLowerCase().includes(query);
            const mobileMatch = apt.patientId?.mobileNumber?.includes(query);
            const treatmentMatch = apt.treatmentType?.toLowerCase().includes(query);
            if (!nameMatch && !mobileMatch && !treatmentMatch) return false;
        }

        return true;
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
                    <p className="text-gray-600 mt-1">Manage today&apos;s appointments</p>
                </div>
                <a
                    href="/frontdesk/create-appointment"
                    className="flex items-center gap-2 bg-gradient-to-r from-[#4A90D9] to-[#7EC8E3] text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                    <Calendar className="w-5 h-5" />
                    New Appointment
                </a>
            </div>

            {/* Filters Section */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-4">
                {/* Date Filter */}
                <div className="flex flex-wrap gap-3">
                    {[
                        { key: 'today', label: 'Today' },
                        { key: 'tomorrow', label: 'Tomorrow' },
                        { key: 'this-week', label: 'This Week' },
                        { key: 'all', label: 'All' },
                    ].map((item) => (
                        <button
                            key={item.key}
                            onClick={() => setDateFilter(item.key)}
                            className={`px-5 py-2.5 rounded-xl font-medium transition-all ${dateFilter === item.key
                                ? 'bg-[#4A90D9] text-white shadow-md'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>

                {/* Advanced Filters */}
                <div className="flex flex-wrap gap-4 pt-2 border-t border-gray-100">
                    {/* Search */}
                    <div className="flex-1 min-w-[200px]">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by patient name, mobile, or treatment..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4A90D9] focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Status Filter */}
                    <div className="min-w-[150px]">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4A90D9] bg-white"
                        >
                            <option value="All">All Statuses</option>
                            {allStatuses.map((status) => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                    </div>

                    {/* Treatment Type Filter */}
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

                {/* Active Filters Summary */}
                {(statusFilter !== 'All' || treatmentFilter !== 'All' || searchQuery) && (
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm text-gray-500">Active filters:</span>
                        {statusFilter !== 'All' && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                                Status: {statusFilter}
                                <button onClick={() => setStatusFilter('All')} className="hover:text-blue-900">×</button>
                            </span>
                        )}
                        {treatmentFilter !== 'All' && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                                Treatment: {treatmentFilter}
                                <button onClick={() => setTreatmentFilter('All')} className="hover:text-purple-900">×</button>
                            </span>
                        )}
                        {searchQuery && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                                Search: "{searchQuery}"
                                <button onClick={() => setSearchQuery('')} className="hover:text-gray-900">×</button>
                            </span>
                        )}
                        <button
                            onClick={() => {
                                setStatusFilter('All');
                                setTreatmentFilter('All');
                                setSearchQuery('');
                            }}
                            className="text-sm text-[#4A90D9] hover:underline"
                        >
                            Clear all
                        </button>
                    </div>
                )}
            </div>

            {/* Results Summary */}
            <div className="text-sm text-gray-500">
                Showing {filteredAppointments.length} of {appointments.length} appointments
            </div>

            {/* Appointments List - Large Cards */}
            <div className="space-y-4">
                {isLoading ? (
                    <div className="space-y-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-pulse">
                                <div className="h-20 bg-gray-100 rounded-xl" />
                            </div>
                        ))}
                    </div>
                ) : filteredAppointments.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
                        <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Appointments Found</h3>
                        <p className="text-gray-600">
                            {appointments.length === 0
                                ? 'There are no appointments scheduled for this period.'
                                : 'No appointments match your current filters.'}
                        </p>
                    </div>
                ) : (
                    filteredAppointments.map((appointment) => (
                        <div
                            key={appointment._id}
                            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center justify-between gap-4 flex-wrap">
                                {/* Time & Patient Info */}
                                <div className="flex items-center gap-6">
                                    <div className="text-center bg-gray-50 px-4 py-3 rounded-xl min-w-[80px]">
                                        <p className="text-2xl font-bold text-[#4A90D9]">
                                            {formatTime(appointment.appointmentDateTime)}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {formatDate(appointment.appointmentDateTime)}
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900">
                                            {appointment.patientId?.name || 'Unknown Patient'}
                                        </h3>
                                        <p className="text-gray-600">{appointment.treatmentType}</p>
                                        {appointment.patientId?.mobileNumber && (
                                            <p className="text-sm text-gray-500">
                                                {appointment.patientId.countryCode || '+91'} {appointment.patientId.mobileNumber}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Status & Actions */}
                                <div className="flex items-center gap-3 flex-wrap">
                                    <span className={`px-4 py-2 rounded-full text-sm font-medium ${statusColors[appointment.status] || 'bg-gray-100 text-gray-700'}`}>
                                        {appointment.status}
                                    </span>

                                    {/* View Details Button */}
                                    <button
                                        onClick={() => openViewModal(appointment)}
                                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-700 font-medium transition-colors"
                                    >
                                        <Eye className="w-4 h-4" />
                                        View
                                    </button>

                                    {/* Status Change Dropdown */}
                                    <div className="relative">
                                        <button
                                            onClick={() => setStatusDropdown(statusDropdown === appointment._id ? null : appointment._id)}
                                            className="flex items-center gap-2 px-5 py-3 bg-[#4A90D9] hover:bg-[#357ABD] rounded-xl text-white font-medium transition-colors"
                                            disabled={isUpdating}
                                        >
                                            Change Status
                                            <ChevronDown className={`w-5 h-5 transition-transform ${statusDropdown === appointment._id ? 'rotate-180' : ''}`} />
                                        </button>

                                        {statusDropdown === appointment._id && (
                                            <>
                                                <div className="fixed inset-0 z-10" onClick={() => setStatusDropdown(null)} />
                                                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-20">
                                                    {allStatuses.map((status) => (
                                                        <button
                                                            key={status}
                                                            onClick={() => updateStatus(appointment._id, status)}
                                                            className={`w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors ${appointment.status === status ? 'bg-gray-50 font-medium' : ''
                                                                }`}
                                                        >
                                                            <span className={`inline-block w-2 h-2 rounded-full mr-2 ${status === 'Scheduled' ? 'bg-blue-500' :
                                                                status === 'Confirmed' ? 'bg-green-500' :
                                                                    status === 'Checked-In' ? 'bg-yellow-500' :
                                                                        status === 'In Treatment' ? 'bg-purple-500' :
                                                                            status === 'Completed' ? 'bg-emerald-500' :
                                                                                status === 'Cancelled' ? 'bg-red-500' :
                                                                                    'bg-gray-500'
                                                                }`} />
                                                            {status}
                                                        </button>
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* View Details Modal */}
            {showViewModal && selectedAppointment && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-lg">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Appointment Details</h2>
                            <button onClick={() => setShowViewModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {/* Patient Info */}
                            <div className="p-4 bg-gray-50 rounded-xl">
                                <p className="text-sm text-gray-500 mb-1">Patient</p>
                                <p className="font-semibold text-gray-900 text-lg">{selectedAppointment.patientId?.name || 'Unknown'}</p>
                                {selectedAppointment.patientId?.mobileNumber && (
                                    <p className="text-gray-600">
                                        {selectedAppointment.patientId.countryCode || '+91'} {selectedAppointment.patientId.mobileNumber}
                                    </p>
                                )}
                            </div>

                            {/* Date & Time */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-gray-50 rounded-xl">
                                    <p className="text-sm text-gray-500 mb-1">Date</p>
                                    <p className="font-semibold text-gray-900">{formatFullDate(selectedAppointment.appointmentDateTime)}</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-xl">
                                    <p className="text-sm text-gray-500 mb-1">Time</p>
                                    <p className="font-semibold text-gray-900 text-lg">{formatTime(selectedAppointment.appointmentDateTime)}</p>
                                </div>
                            </div>

                            {/* Treatment & Status */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-gray-50 rounded-xl">
                                    <p className="text-sm text-gray-500 mb-1">Treatment</p>
                                    <p className="font-semibold text-gray-900">{selectedAppointment.treatmentType}</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-xl">
                                    <p className="text-sm text-gray-500 mb-1">Status</p>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[selectedAppointment.status]}`}>
                                        {selectedAppointment.status}
                                    </span>
                                </div>
                            </div>

                            {/* Fee */}
                            {selectedAppointment.feeAmount && (
                                <div className="p-4 bg-gray-50 rounded-xl">
                                    <p className="text-sm text-gray-500 mb-1">Fee Amount</p>
                                    <p className="font-semibold text-gray-900 text-lg">₹{selectedAppointment.feeAmount.toLocaleString()}</p>
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

                            {/* Notes */}
                            {selectedAppointment.notes && (
                                <div className="p-4 bg-gray-50 rounded-xl">
                                    <p className="text-sm text-gray-500 mb-1">Notes</p>
                                    <p className="text-gray-700">{selectedAppointment.notes}</p>
                                </div>
                            )}

                            <button
                                onClick={() => setShowViewModal(false)}
                                className="w-full py-3 bg-gradient-to-r from-[#4A90D9] to-[#7EC8E3] text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Payment Modal */}
            {showPaymentModal && paymentAppointment && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Collect Payment</h2>
                            <button
                                onClick={() => setShowPaymentModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Appointment Info */}
                        <div className="p-4 bg-gray-50 rounded-xl mb-6">
                            <p className="font-semibold text-gray-900">{paymentAppointment.patientId?.name}</p>
                            <p className="text-sm text-gray-600">{paymentAppointment.treatmentType}</p>
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
                                    onClick={() => setShowPaymentModal(false)}
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
