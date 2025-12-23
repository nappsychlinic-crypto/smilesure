'use client';

import { useState } from 'react';
import { User, Phone, Save, Loader2, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { useAuth } from '@/components/webapp/AuthContext';

export default function FrontDeskProfile() {
    const { user } = useAuth();
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [formData, setFormData] = useState({
        name: user?.name || '',
    });

    // Password change state
    const [showPasswordSection, setShowPasswordSection] = useState(false);
    const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage({ type: '', text: '' });

        try {
            const response = await fetch(`/api/users/${user?.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage({ type: 'success', text: 'Profile updated successfully!' });
            } else {
                setMessage({ type: 'error', text: data.error || 'Failed to update profile' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'An unexpected error occurred' });
        } finally {
            setIsSaving(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordMessage({ type: '', text: '' });

        if (passwordData.newPassword.length < 8) {
            setPasswordMessage({ type: 'error', text: 'Password must be at least 8 characters' });
            return;
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordMessage({ type: 'error', text: 'Passwords do not match' });
            return;
        }

        setIsChangingPassword(true);

        try {
            const response = await fetch('/api/auth/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setPasswordMessage({ type: 'success', text: 'Password changed successfully!' });
                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                setShowPasswordSection(false);
            } else {
                setPasswordMessage({ type: 'error', text: data.error || 'Failed to change password' });
            }
        } catch (err) {
            setPasswordMessage({ type: 'error', text: 'An unexpected error occurred' });
        } finally {
            setIsChangingPassword(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
                <p className="text-gray-600 mt-1">Manage your account information</p>
            </div>

            {/* Profile Card */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#4A90D9] to-[#7EC8E3] flex items-center justify-center text-white font-bold text-3xl">
                        {user?.name?.charAt(0).toUpperCase() || '?'}
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
                        <span className="inline-block mt-1 px-3 py-1 text-sm font-medium bg-[#4A90D9]/10 text-[#4A90D9] rounded-full">
                            Front Desk
                        </span>
                    </div>
                </div>

                {message.text && (
                    <div className={`mb-6 p-4 rounded-xl ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="flex items-center gap-2 text-lg font-medium text-gray-700 mb-3">
                            <User className="w-5 h-5" />
                            Full Name
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-4 text-lg border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4A90D9] focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-lg font-medium text-gray-700 mb-3">
                            <Phone className="w-5 h-5" />
                            Mobile Number
                        </label>
                        <div className="flex">
                            <div className="flex items-center px-4 bg-gray-100 border border-r-0 border-gray-200 rounded-l-xl text-gray-600 font-medium">
                                {user?.countryCode || '+91'}
                            </div>
                            <input
                                type="tel"
                                value={user?.mobileNumber || ''}
                                disabled
                                className="w-full px-4 py-4 text-lg border border-gray-200 rounded-r-xl bg-gray-50 text-gray-500"
                            />
                        </div>
                        <p className="text-sm text-gray-500 mt-1">Mobile number cannot be changed</p>
                    </div>



                    <button
                        type="submit"
                        disabled={isSaving}
                        className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-[#4A90D9] to-[#7EC8E3] text-white py-4 rounded-xl text-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
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
                </form>
            </div>

            {/* Change Password Card */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <Lock className="w-6 h-6 text-gray-600" />
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Change Password</h3>
                            <p className="text-sm text-gray-500">Update your account password</p>
                        </div>
                    </div>
                    {!showPasswordSection && (
                        <button
                            onClick={() => setShowPasswordSection(true)}
                            className="px-4 py-2 text-[#4A90D9] hover:bg-[#4A90D9]/5 rounded-xl font-medium transition-colors"
                        >
                            Change
                        </button>
                    )}
                </div>

                {showPasswordSection && (
                    <form onSubmit={handleChangePassword} className="space-y-4 mt-6 pt-6 border-t border-gray-100">
                        {passwordMessage.text && (
                            <div className={`p-4 rounded-xl ${passwordMessage.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                                {passwordMessage.text}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                            <div className="relative">
                                <input
                                    type={showCurrentPassword ? 'text' : 'password'}
                                    value={passwordData.currentPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                    className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4A90D9]"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2"
                                >
                                    {showCurrentPassword ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                            <div className="relative">
                                <input
                                    type={showNewPassword ? 'text' : 'password'}
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                    className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4A90D9]"
                                    required
                                    minLength={8}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2"
                                >
                                    {showNewPassword ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
                                </button>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Minimum 8 characters</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                            <input
                                type="password"
                                value={passwordData.confirmPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4A90D9]"
                                required
                            />
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowPasswordSection(false);
                                    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                                    setPasswordMessage({ type: '', text: '' });
                                }}
                                className="flex-1 py-3 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isChangingPassword}
                                className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-[#4A90D9] to-[#7EC8E3] text-white rounded-xl font-medium disabled:opacity-50"
                            >
                                {isChangingPassword ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Updating...
                                    </>
                                ) : 'Update Password'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
