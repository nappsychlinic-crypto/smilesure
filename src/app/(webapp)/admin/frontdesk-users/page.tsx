'use client';

import { useEffect, useState } from 'react';
import { UserCog, UserPlus, Phone, Shield, X, Plus, Loader2 } from 'lucide-react';

interface FrontDeskUser {
    _id: string;
    name: string;
    mobileNumber: string;
    countryCode?: string;
    email?: string;
    isActive: boolean;
    createdAt: string;
}

export default function AdminFrontDeskUsers() {
    const [users, setUsers] = useState<FrontDeskUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
    const [selectedUser, setSelectedUser] = useState<FrontDeskUser | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({ name: '', mobileNumber: '', countryCode: '+91', password: '', isActive: true });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/users?role=FRONT_DESK');
            const data = await response.json();
            if (data.success) {
                setUsers(data.data);
            }
        } catch (error) {
            console.error('Error fetching front desk users:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const openCreateModal = () => {
        setModalMode('create');
        setFormData({ name: '', mobileNumber: '', countryCode: '+91', password: '', isActive: true });
        setError('');
        setShowModal(true);
    };

    const openEditModal = (user: FrontDeskUser) => {
        setModalMode('edit');
        setSelectedUser(user);
        setFormData({ name: user.name, mobileNumber: user.mobileNumber, countryCode: user.countryCode || '+91', password: '', isActive: user.isActive });
        setError('');
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setError('');

        try {
            if (modalMode === 'create') {
                const response = await fetch('/api/users', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...formData, role: 'FRONT_DESK' }),
                });
                const data = await response.json();
                if (!response.ok) {
                    setError(data.error || 'Failed to create user');
                    return;
                }
            } else if (selectedUser) {
                const response = await fetch(`/api/users/${selectedUser._id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: formData.name, isActive: formData.isActive }),
                });
                const data = await response.json();
                if (!response.ok) {
                    setError(data.error || 'Failed to update user');
                    return;
                }
            }

            setShowModal(false);
            fetchUsers();
        } catch (err) {
            setError('An unexpected error occurred');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Front Desk Staff</h1>
                    <p className="text-gray-600 mt-1">Manage front desk team members</p>
                </div>
                <button
                    onClick={openCreateModal}
                    className="flex items-center gap-2 bg-gradient-to-r from-[#4A90D9] to-[#7EC8E3] text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                    <Plus className="w-5 h-5" />
                    Add Staff Member
                </button>
            </div>

            {/* Staff List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {isLoading ? (
                    <div className="p-12 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4A90D9] mx-auto"></div>
                    </div>
                ) : users.length === 0 ? (
                    <div className="p-12 text-center">
                        <UserCog className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Front Desk Staff</h3>
                        <p className="text-gray-600 mb-4">Add staff members to help manage appointments.</p>
                        <button
                            onClick={openCreateModal}
                            className="inline-flex items-center gap-2 bg-[#4A90D9] text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                        >
                            <UserPlus className="w-5 h-5" />
                            Add Staff
                        </button>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Name</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Mobile Number</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user._id} className="border-b border-gray-50 hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#4A90D9] to-[#7EC8E3] flex items-center justify-center text-white font-semibold">
                                                {user.name?.charAt(0).toUpperCase() || '?'}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{user.name}</p>
                                                <span className="text-xs text-[#4A90D9] flex items-center gap-1">
                                                    <Shield className="w-3 h-3" /> Front Desk
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{user.countryCode || '+91'} {user.mobileNumber}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${user.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                            {user.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => openEditModal(user)}
                                            className="text-[#4A90D9] hover:underline font-medium"
                                        >
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Create/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-gray-900">
                                {modalMode === 'create' ? 'Add Staff Member' : 'Edit Staff Member'}
                            </h2>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {error && (
                            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-xl text-sm">{error}</div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                                        value={formData.mobileNumber}
                                        onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-r-xl focus:ring-2 focus:ring-[#4A90D9]"
                                        placeholder="Enter 10-digit mobile number"
                                        required
                                        disabled={modalMode === 'edit'}
                                    />
                                </div>
                            </div>
                            {modalMode === 'create' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                    <input
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4A90D9]"
                                        required
                                        minLength={8}
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Minimum 8 characters</p>
                                </div>
                            )}
                            {modalMode === 'edit' && (
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                    <span className="text-sm font-medium text-gray-700">Account Active</span>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.isActive}
                                            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-[#4A90D9] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                                    </label>
                                </div>
                            )}
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 py-2.5 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-[#4A90D9] to-[#7EC8E3] text-white rounded-xl font-medium disabled:opacity-50"
                                >
                                    {isSaving ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Saving...
                                        </>
                                    ) : modalMode === 'create' ? 'Create' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
