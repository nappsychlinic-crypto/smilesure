'use client';

import { useEffect, useState } from 'react';
import { Wallet, Calendar, Search, Filter, User, IndianRupee, CreditCard, Banknote } from 'lucide-react';

interface Patient {
    _id: string;
    name: string;
    mobileNumber?: string;
    countryCode?: string;
}

interface Appointment {
    _id: string;
    treatmentType: string;
    appointmentDateTime: string;
}

interface Payment {
    _id: string;
    appointmentId: Appointment;
    patientId: Patient;
    amount: number;
    paymentMode: 'CASH' | 'ONLINE';
    transactionNumber?: string;
    paymentDate: string;
    createdBy: {
        _id: string;
        name: string;
    };
}

const paymentModeColors = {
    CASH: 'bg-green-100 text-green-700',
    ONLINE: 'bg-blue-100 text-blue-700',
};

export default function AdminPayments() {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Filters
    const [dateFilter, setDateFilter] = useState('this-month');
    const [modeFilter, setModeFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchPayments();
    }, [dateFilter]);

    const fetchPayments = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/payments');
            const data = await response.json();
            if (data.success) {
                setPayments(data.data);
            }
        } catch (error) {
            console.error('Error fetching payments:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const getDateRange = () => {
        const now = new Date();
        let startDate: Date;
        const endDate = new Date(); // End of today

        switch (dateFilter) {
            case 'today':
                startDate = new Date();
                startDate.setHours(0, 0, 0, 0);
                break;
            case 'this-week':
                startDate = new Date();
                startDate.setDate(startDate.getDate() - startDate.getDay());
                startDate.setHours(0, 0, 0, 0);
                break;
            case 'this-month':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                break;
            case 'this-year':
                startDate = new Date(now.getFullYear(), 0, 1);
                break;
            case 'all':
            default:
                return null;
        }

        return { startDate, endDate };
    };

    const filterByDate = (paymentDate: string) => {
        const range = getDateRange();
        if (!range) return true;

        const date = new Date(paymentDate);
        return date >= range.startDate && date <= range.endDate;
    };

    // Apply filters
    const filteredPayments = payments.filter(payment => {
        // Date filter
        if (!filterByDate(payment.paymentDate)) return false;

        // Mode filter
        if (modeFilter !== 'All' && payment.paymentMode !== modeFilter) return false;

        // Search query
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            const nameMatch = payment.patientId?.name?.toLowerCase().includes(query);
            const mobileMatch = payment.patientId?.mobileNumber?.includes(query);
            const transactionMatch = payment.transactionNumber?.toLowerCase().includes(query);
            const treatmentMatch = payment.appointmentId?.treatmentType?.toLowerCase().includes(query);
            if (!nameMatch && !mobileMatch && !transactionMatch && !treatmentMatch) return false;
        }

        return true;
    });

    // Calculate totals
    const totalAmount = filteredPayments.reduce((sum, p) => sum + p.amount, 0);
    const cashAmount = filteredPayments.filter(p => p.paymentMode === 'CASH').reduce((sum, p) => sum + p.amount, 0);
    const onlineAmount = filteredPayments.filter(p => p.paymentMode === 'ONLINE').reduce((sum, p) => sum + p.amount, 0);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
                <p className="text-gray-600 mt-1">View and manage all payment records</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-[#4A90D9] to-[#7EC8E3] rounded-xl flex items-center justify-center">
                            <IndianRupee className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total Collection</p>
                            <p className="text-2xl font-bold text-gray-900">₹{totalAmount.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                            <Banknote className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Cash Payments</p>
                            <p className="text-2xl font-bold text-green-600">₹{cashAmount.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                            <CreditCard className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Online Payments</p>
                            <p className="text-2xl font-bold text-blue-600">₹{onlineAmount.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
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

                {/* Search and Mode Filter */}
                <div className="flex flex-wrap gap-4 pt-2 border-t border-gray-100">
                    <div className="flex-1 min-w-[200px]">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by patient, treatment, or transaction..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4A90D9] focus:border-transparent"
                            />
                        </div>
                    </div>
                    <div className="min-w-[150px]">
                        <select
                            value={modeFilter}
                            onChange={(e) => setModeFilter(e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4A90D9] bg-white"
                        >
                            <option value="All">All Modes</option>
                            <option value="CASH">Cash Only</option>
                            <option value="ONLINE">Online Only</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Results Summary */}
            <div className="text-sm text-gray-500">
                Showing {filteredPayments.length} payment{filteredPayments.length !== 1 ? 's' : ''}
            </div>

            {/* Payments Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Patient</th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Treatment</th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Amount</th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Mode</th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Transaction #</th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Date</th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Collected By</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan={7} className="px-6 py-12 text-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4A90D9] mx-auto"></div>
                                </td>
                            </tr>
                        ) : filteredPayments.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                                    <Wallet className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                    <p>No payments found</p>
                                </td>
                            </tr>
                        ) : (
                            filteredPayments.map((payment) => (
                                <tr key={payment._id} className="border-b border-gray-50 hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="font-medium text-gray-900">{payment.patientId?.name || 'Unknown'}</p>
                                            <p className="text-sm text-gray-500">
                                                {payment.patientId?.mobileNumber
                                                    ? `${payment.patientId.countryCode || '+91'} ${payment.patientId.mobileNumber}`
                                                    : '-'
                                                }
                                            </p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-700">{payment.appointmentId?.treatmentType || '-'}</td>
                                    <td className="px-6 py-4">
                                        <span className="font-semibold text-gray-900">₹{payment.amount.toLocaleString()}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${paymentModeColors[payment.paymentMode]}`}>
                                            {payment.paymentMode === 'CASH' ? '💵 Cash' : '📱 Online'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-700 font-mono text-sm">
                                        {payment.transactionNumber || '-'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-gray-900">{formatDate(payment.paymentDate)}</p>
                                        <p className="text-sm text-gray-500">{formatTime(payment.paymentDate)}</p>
                                    </td>
                                    <td className="px-6 py-4 text-gray-700">{payment.createdBy?.name || 'Unknown'}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
