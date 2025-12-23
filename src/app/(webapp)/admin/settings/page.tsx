'use client';

import { useState } from 'react';
import { Settings, Bell, Shield, Palette, Save, Loader2 } from 'lucide-react';

export default function AdminSettings() {
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState('');

    const handleSave = async () => {
        setIsSaving(true);
        // Simulate save
        await new Promise(resolve => setTimeout(resolve, 1000));
        setMessage('Settings saved successfully!');
        setIsSaving(false);
        setTimeout(() => setMessage(''), 3000);
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                <p className="text-gray-600 mt-1">Configure your clinic settings</p>
            </div>

            {message && (
                <div className="p-4 bg-green-50 text-green-700 border border-green-200 rounded-xl">
                    {message}
                </div>
            )}

            <div className="grid gap-6">
                {/* Clinic Information */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-blue-50 rounded-xl">
                            <Settings className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">Clinic Information</h2>
                            <p className="text-sm text-gray-500">Basic clinic details</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Clinic Name</label>
                            <input
                                type="text"
                                defaultValue="SmileSure Dental Care"
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4A90D9] focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                            <input
                                type="tel"
                                defaultValue="+91 98765 43210"
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4A90D9] focus:border-transparent"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                            <textarea
                                defaultValue="Sector 120, Noida, Uttar Pradesh"
                                rows={2}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4A90D9] focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>

                {/* Notification Settings */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-purple-50 rounded-xl">
                            <Bell className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
                            <p className="text-sm text-gray-500">Configure reminder settings</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                            <div>
                                <p className="font-medium text-gray-900">Appointment Reminders</p>
                                <p className="text-sm text-gray-500">Send WhatsApp reminders to patients</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" defaultChecked className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4A90D9]"></div>
                            </label>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                            <div>
                                <p className="font-medium text-gray-900">Reminder Timing</p>
                                <p className="text-sm text-gray-500">Hours before appointment</p>
                            </div>
                            <select className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#4A90D9]">
                                <option>24 hours</option>
                                <option>12 hours</option>
                                <option>2 hours</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Security Settings */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-green-50 rounded-xl">
                            <Shield className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">Security</h2>
                            <p className="text-sm text-gray-500">Account security settings</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <button className="w-full text-left p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors">
                            <p className="font-medium text-gray-900">Change Password</p>
                            <p className="text-sm text-gray-500">Update your account password</p>
                        </button>
                        <button className="w-full text-left p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors">
                            <p className="font-medium text-gray-900">Active Sessions</p>
                            <p className="text-sm text-gray-500">Manage your logged-in devices</p>
                        </button>
                    </div>
                </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 bg-gradient-to-r from-[#4A90D9] to-[#7EC8E3] text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                >
                    {isSaving ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="w-5 h-5" />
                            Save Settings
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
