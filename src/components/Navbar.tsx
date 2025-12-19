"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Phone, MessageCircle } from "lucide-react";
import siteData from "@/data/siteData.json";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

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
                            <a
                                href={`tel:${siteData.clinic.phone}`}
                                className="flex items-center gap-2 text-[#4A90D9] hover:text-[#357ABD] font-medium transition-colors"
                            >
                                <Phone className="w-4 h-4" />
                                <span>{siteData.clinic.phone}</span>
                            </a>
                            <Link
                                href="/appointment"
                                className="bg-gradient-to-r from-[#4A90D9] to-[#7EC8E3] text-white px-6 py-2.5 rounded-full font-semibold hover:shadow-lg hover:shadow-[#4A90D9]/30 transition-all duration-300 hover:-translate-y-0.5"
                            >
                                Book Appointment
                            </Link>
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
                        <div className="pt-4 border-t border-gray-100">
                            <Link
                                href="/appointment"
                                onClick={() => setIsOpen(false)}
                                className="block w-full text-center bg-gradient-to-r from-[#4A90D9] to-[#7EC8E3] text-white px-6 py-3 rounded-full font-semibold"
                            >
                                Book Appointment
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Sticky CTA */}
            <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
                <div className="flex">
                    <a
                        href={`tel:${siteData.clinic.phone}`}
                        className="flex-1 flex items-center justify-center gap-2 py-4 text-[#4A90D9] font-semibold hover:bg-gray-50 transition-colors"
                    >
                        <Phone className="w-5 h-5" />
                        Call Now
                    </a>
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
