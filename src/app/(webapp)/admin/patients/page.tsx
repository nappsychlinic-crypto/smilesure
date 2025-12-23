'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Users, Search, UserPlus, Phone, CheckCircle, XCircle, Plus } from 'lucide-react';

interface Patient {
    _id: string;
    name: string;
    mobileNumber: string;
    countryCode?: string;
    email?: string;
    isActive: boolean;
    createdAt: string;
}

export default function AdminPatients() {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [createError, setCreateError] = useState('');
    const [newUser, setNewUser] = useState({ name: '', mobileNumber: '', countryCode: '+91', password: '' });

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/users?role=USER');
            const data = await response.json();
            if (data.success) {
                setPatients(data.data);
            }
        } catch (error) {
            console.error('Error fetching patients:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsCreating(true);
        setCreateError('');

        try {
            const response = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...newUser, role: 'USER' }),
            });

            const data = await response.json();

            if (response.ok) {
                setShowCreateModal(false);
                setNewUser({ name: '', mobileNumber: '', countryCode: '+91', password: '' });
                fetchPatients();
            } else {
                setCreateError(data.error || 'Failed to create patient');
            }
        } catch (err) {
            setCreateError('An unexpected error occurred');
        } finally {
            setIsCreating(false);
        }
    };

    const filteredPatients = patients.filter(pt => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
            pt.name?.toLowerCase().includes(query) ||
            pt.mobileNumber?.includes(query) ||
            pt.email?.toLowerCase().includes(query)
        );
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Patients</h1>
                    <p className="text-gray-600 mt-1">Manage patient records</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 bg-gradient-to-r from-[#4A90D9] to-[#7EC8E3] text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                    <Plus className="w-5 h-5" />
                    Add Patient
                </button>
            </div>

            {/* Search */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name or mobile number..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4A90D9] focus:border-transparent"
                    />
                </div>
            </div>

            {/* Patients Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {isLoading ? (
                    [...Array(6)].map((_, i) => (
                        <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-pulse">
                            <div className="h-20 bg-gray-100 rounded-xl" />
                        </div>
                    ))
                ) : filteredPatients.length === 0 ? (
                    <div className="col-span-full bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
                        <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Patients Found</h3>
                        <p className="text-gray-600">No patients match your search criteria.</p>
                    </div>
                ) : (
                    filteredPatients.map((patient) => (
                        <div key={patient._id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#4A90D9] to-[#7EC8E3] flex items-center justify-center text-white font-semibold text-lg">
                                    {patient.name?.charAt(0).toUpperCase() || '?'}
                                </div>
                                {patient.isActive ? (
                                    <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                        <CheckCircle className="w-3 h-3" /> Active
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                        <XCircle className="w-3 h-3" /> Inactive
                                    </span>
                                )}
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">{patient.name}</h3>
                            <div className="space-y-1 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                    <Phone className="w-4 h-4" />
                                    <span>{patient.countryCode || '+91'} {patient.mobileNumber}</span>
                                </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-gray-100">
                                <Link
                                    href={`/admin/patients/${patient._id}`}
                                    className="w-full block text-center py-2 text-[#4A90D9] hover:bg-[#4A90D9]/5 rounded-lg font-medium transition-colors"
                                >
                                    View Profile
                                </Link>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Create Patient Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Create New Patient</h2>

                        {createError && (
                            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-xl text-sm">{createError}</div>
                        )}

                        <form onSubmit={handleCreateUser} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    value={newUser.name}
                                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4A90D9]"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                                <div className="flex">
                                    <div className="flex items-center px-4 bg-gray-100 border border-r-0 border-gray-200 rounded-l-xl text-gray-600 font-medium">
                                        +91
                                    </div>
                                    <input
                                        type="tel"
                                        inputMode="numeric"
                                        pattern="[0-9]{10}"
                                        maxLength={10}
                                        value={newUser.mobileNumber}
                                        onChange={(e) => setNewUser({ ...newUser, mobileNumber: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-r-xl focus:ring-2 focus:ring-[#4A90D9]"
                                        placeholder="Enter 10-digit mobile number"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <input
                                    type="password"
                                    value={newUser.password}
                                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4A90D9]"
                                    required
                                    minLength={8}
                                />
                                <p className="text-xs text-gray-500 mt-1">Minimum 8 characters</p>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="flex-1 py-2.5 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isCreating}
                                    className="flex-1 py-2.5 bg-gradient-to-r from-[#4A90D9] to-[#7EC8E3] text-white rounded-xl font-medium disabled:opacity-50"
                                >
                                    {isCreating ? 'Creating...' : 'Create Patient'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
