"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Menu, X, MessageCircle, User, LogOut, LayoutDashboard, ChevronDown } from "lucide-react";
import siteData from "@/data/siteData.json";
import { useAuth } from "@/components/webapp/AuthContext";
import { UserRole } from "@/lib/types";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const { user, isAuthenticated, logout, isLoading } = useAuth();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close user menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setUserMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const getDashboardPath = () => {
        if (!user) return "/login";
        switch (user.role) {
            case UserRole.ADMIN:
                return "/admin/dashboard";
            case UserRole.FRONT_DESK:
                return "/frontdesk/dashboard";
            case UserRole.USER:
                return "/user/dashboard";
            default:
                return "/login";
        }
    };

    const handleLogout = async () => {
        await logout();
        setUserMenuOpen(false);
        router.push("/");
    };

    return (
        <>
            <nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                    ? "bg-white/95 backdrop-blur-md shadow-lg"
                    : "bg-white"
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        {/* Logo */}
                        <Link href="/" className="flex items-center group">
                            <div className="relative h-24 w-50 transition-transform duration-300 group-hover:scale-105">
                                <Image
                                    src="/logo1.png"
                                    alt="SmileSure Dental Care"
                                    fill
                                    className="object-contain object-left"
                                    priority
                                />
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center gap-8">
                            {siteData.navigation.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="text-gray-700 hover:text-[#4A90D9] font-medium transition-colors duration-200 relative group"
                                >
                                    {item.label}
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#4A90D9] transition-all duration-300 group-hover:w-full" />
                                </Link>
                            ))}
                        </div>

                        {/* Desktop CTA */}
                        <div className="hidden lg:flex items-center gap-4">
                            {/* Login / User Menu */}
                            {isLoading ? (
                                <div className="w-24 h-10 bg-gray-100 animate-pulse rounded-full" />
                            ) : isAuthenticated && user ? (
                                <div className="relative" ref={userMenuRef}>
                                    <button
                                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                                        className="flex items-center gap-2 text-gray-700 hover:text-[#4A90D9] font-medium transition-colors px-4 py-2 rounded-full hover:bg-gray-50"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#4A90D9] to-[#7EC8E3] flex items-center justify-center text-white text-sm font-semibold">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="max-w-[120px] truncate">{user.name.split(' ')[0]}</span>
                                        <ChevronDown className={`w-4 h-4 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {/* Dropdown Menu */}
                                    {userMenuOpen && (
                                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                                            <div className="px-4 py-2 border-b border-gray-100">
                                                <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                                                <p className="text-xs text-gray-500 truncate">{user.countryCode} {user.mobileNumber}</p>
                                                <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-[#4A90D9]/10 text-[#4A90D9] rounded-full">
                                                    {user.role.replace('_', ' ')}
                                                </span>
                                            </div>
                                            <Link
                                                href={getDashboardPath()}
                                                onClick={() => setUserMenuOpen(false)}
                                                className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
                                            >
                                                <LayoutDashboard className="w-4 h-4" />
                                                <span>Go to Dashboard</span>
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                <span>Logout</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Link
                                    href="/login"
                                    className="flex items-center gap-2 text-[#4A90D9] hover:text-[#357ABD] font-medium transition-colors px-4 py-2 rounded-full hover:bg-[#4A90D9]/5"
                                >
                                    <User className="w-4 h-4" />
                                    <span>Login</span>
                                </Link>
                            )}

                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                            aria-label="Toggle menu"
                        >
                            {isOpen ? (
                                <X className="w-6 h-6 text-gray-700" />
                            ) : (
                                <Menu className="w-6 h-6 text-gray-700" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div
                    className={`lg:hidden absolute top-full left-0 right-0 bg-white shadow-lg transition-all duration-300 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"
                        }`}
                >
                    <div className="px-4 py-6 space-y-4">
                        {siteData.navigation.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className="block py-2 text-gray-700 hover:text-[#4A90D9] font-medium transition-colors"
                            >
                                {item.label}
                            </Link>
                        ))}

                        {/* Mobile Login/User Section */}
                        <div className="pt-4 border-t border-gray-100 space-y-3">
                            {isAuthenticated && user ? (
                                <>
                                    <div className="flex items-center gap-3 py-2">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#4A90D9] to-[#7EC8E3] flex items-center justify-center text-white font-semibold">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{user.name}</p>
                                            <span className="text-xs text-[#4A90D9]">{user.role.replace('_', ' ')}</span>
                                        </div>
                                    </div>
                                    <Link
                                        href={getDashboardPath()}
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center justify-center gap-2 w-full py-3 bg-gray-100 text-gray-700 rounded-full font-semibold hover:bg-gray-200 transition-colors"
                                    >
                                        <LayoutDashboard className="w-4 h-4" />
                                        Go to Dashboard
                                    </Link>
                                    <button
                                        onClick={() => { handleLogout(); setIsOpen(false); }}
                                        className="flex items-center justify-center gap-2 w-full py-3 bg-red-50 text-red-600 rounded-full font-semibold hover:bg-red-100 transition-colors"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <Link
                                    href="/login"
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center justify-center gap-2 w-full py-3 border-2 border-[#4A90D9] text-[#4A90D9] rounded-full font-semibold hover:bg-[#4A90D9]/5 transition-colors"
                                >
                                    <User className="w-4 h-4" />
                                    Login
                                </Link>
                            )}

                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Sticky CTA */}
            <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
                <div className="flex">
                    <Link
                        href={isAuthenticated ? getDashboardPath() : "/login"}
                        className="flex-1 flex items-center justify-center gap-2 py-4 text-[#4A90D9] font-semibold hover:bg-gray-50 transition-colors"
                    >
                        {isAuthenticated ? (
                            <>
                                <LayoutDashboard className="w-5 h-5" />
                                Dashboard
                            </>
                        ) : (
                            <>
                                <User className="w-5 h-5" />
                                Login
                            </>
                        )}
                    </Link>
                    <div className="w-px bg-gray-200" />
                    <a
                        href={`https://wa.me/${siteData.clinic.whatsapp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 py-4 bg-[#25D366] text-white font-semibold hover:bg-[#20BD5A] transition-colors"
                    >
                        <MessageCircle className="w-5 h-5" />
                        WhatsApp
                    </a>
                </div>
            </div>

            {/* Spacer for fixed navbar */}
            <div className="h-20" />
        </>
    );
}
