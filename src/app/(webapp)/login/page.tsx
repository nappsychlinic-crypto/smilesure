'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Eye, EyeOff, Phone, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '@/components/webapp/AuthContext';
import { UserRole } from '@/lib/types';

export default function LoginPage() {
    const [mobileNumber, setMobileNumber] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { login, user } = useAuth();

    const getDashboardPath = (role: UserRole) => {
        switch (role) {
            case UserRole.ADMIN:
                return '/admin/dashboard';
            case UserRole.FRONT_DESK:
                return '/frontdesk/dashboard';
            case UserRole.USER:
                return '/user/dashboard';
            default:
                return '/';
        }
    };

    const handleMobileNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Only allow digits and limit to 10
        const value = e.target.value.replace(/\D/g, '').slice(0, 10);
        setMobileNumber(value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validate mobile number
        if (mobileNumber.length !== 10) {
            setError('Please enter a valid 10-digit mobile number');
            return;
        }

        setIsLoading(true);

        try {
            const result = await login(mobileNumber, password);

            if (result.success) {
                if (result.mustResetPassword) {
                    router.push('/reset-password');
                } else {
                    // Fetch user data again to get the role
                    const meResponse = await fetch('/api/auth/me');
                    const meData = await meResponse.json();
                    if (meData.authenticated && meData.user) {
                        router.push(getDashboardPath(meData.user.role));
                    } else {
                        router.push('/');
                    }
                }
            } else {
                setError(result.error || 'Login failed');
            }
        } catch (err) {
            setError('An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-white to-[#e0f2fe] flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-block">
                        <Image
                            src="/logo1.png"
                            alt="SmileSure Dental Care"
                            width={200}
                            height={80}
                            className="mx-auto"
                        />
                    </Link>
                    <h1 className="mt-6 text-2xl font-bold text-gray-900">Welcome Back</h1>
                    <p className="mt-2 text-gray-600">Sign in to your account</p>
                </div>

                {/* Login Form */}
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
                                {error}
                            </div>
                        )}

                        {/* Mobile Number Field */}
                        <div>
                            <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700 mb-2">
                                Mobile Number
                            </label>
                            <div className="relative flex">
                                <div className="flex items-center px-4 bg-gray-100 border border-r-0 border-gray-200 rounded-l-xl text-gray-600 font-medium">
                                    +91
                                </div>
                                <div className="relative flex-1">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Phone className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="mobileNumber"
                                        type="tel"
                                        inputMode="numeric"
                                        pattern="[0-9]{10}"
                                        maxLength={10}
                                        value={mobileNumber}
                                        onChange={handleMobileNumberChange}
                                        className="block w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-r-xl focus:ring-2 focus:ring-[#4A90D9] focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
                                        placeholder="Enter 10-digit mobile number"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-12 pr-12 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4A90D9] focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
                                    placeholder="Enter your password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Forgot Password Link */}
                        <div className="flex justify-end">
                            <Link
                                href="/forgot-password"
                                className="text-sm text-[#4A90D9] hover:text-[#357ABD] font-medium transition-colors"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#4A90D9] to-[#7EC8E3] text-white py-3.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-[#4A90D9]/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    Sign In
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Register Link */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-600 text-sm">
                            New patient?{' '}
                            <Link
                                href="/appointment"
                                className="text-[#4A90D9] hover:text-[#357ABD] font-medium transition-colors"
                            >
                                Book an appointment
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <p className="mt-8 text-center text-sm text-gray-500">
                    By signing in, you agree to our{' '}
                    <Link href="/terms" className="text-[#4A90D9] hover:underline">
                        Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="text-[#4A90D9] hover:underline">
                        Privacy Policy
                    </Link>
                </p>
            </div>
        </div>
    );
}
