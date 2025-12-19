import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, MessageCircle } from "lucide-react";
import siteData from "@/data/siteData.json";

export default function Footer() {
    return (
        <footer className="bg-gradient-to-b from-gray-50 to-gray-100 pt-16 pb-24 lg:pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Brand */}
                    <div className="space-y-4">
                        <Link href="/" className="block">
                            <div className="relative h-24 w-80">
                                <Image
                                    src="/logo1.png"
                                    alt="SmileSure Dental Care"
                                    fill
                                    className="object-contain object-left"
                                />
                            </div>
                        </Link>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            {siteData.clinic.description}
                        </p>
                        {/* Social Icons */}
                        <div className="flex gap-4 pt-2">
                            <a
                                href={siteData.social.facebook}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-[#1877F2] hover:bg-[#1877F2] hover:text-white transition-all duration-300 hover:-translate-y-1"
                                aria-label="Facebook"
                            >
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a
                                href={siteData.social.instagram}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-[#E4405F] hover:bg-gradient-to-br hover:from-[#833AB4] hover:via-[#FD1D1D] hover:to-[#F77737] hover:text-white transition-all duration-300 hover:-translate-y-1"
                                aria-label="Instagram"
                            >
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a
                                href={siteData.social.whatsapp}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-[#25D366] hover:bg-[#25D366] hover:text-white transition-all duration-300 hover:-translate-y-1"
                                aria-label="WhatsApp"
                            >
                                <MessageCircle className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">
                            Quick Links
                        </h4>
                        <ul className="space-y-3">
                            {siteData.navigation.map((item) => (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        className="text-gray-600 hover:text-[#4A90D9] transition-colors text-sm"
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">
                            Contact Us
                        </h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-[#4A90D9] shrink-0 mt-0.5" />
                                <span className="text-gray-600 text-sm">
                                    {siteData.clinic.fullAddress}
                                </span>
                            </li>
                            <li>
                                <a
                                    href={`tel:${siteData.clinic.phone}`}
                                    className="flex items-center gap-3 text-gray-600 hover:text-[#4A90D9] transition-colors"
                                >
                                    <Phone className="w-5 h-5 text-[#4A90D9]" />
                                    <span className="text-sm">{siteData.clinic.phone}</span>
                                </a>
                            </li>
                            <li>
                                <a
                                    href={`mailto:${siteData.clinic.email}`}
                                    className="flex items-center gap-3 text-gray-600 hover:text-[#4A90D9] transition-colors"
                                >
                                    <Mail className="w-5 h-5 text-[#4A90D9]" />
                                    <span className="text-sm">{siteData.clinic.email}</span>
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Timings */}
                    <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">
                            Clinic Timings
                        </h4>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3">
                                <Clock className="w-5 h-5 text-[#4A90D9] shrink-0 mt-0.5" />
                                <div className="text-sm">
                                    <p className="text-gray-900 font-medium">Mon - Fri</p>
                                    <p className="text-gray-600">{siteData.clinic.timings.weekdays}</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <Clock className="w-5 h-5 text-[#4A90D9] shrink-0 mt-0.5" />
                                <div className="text-sm">
                                    <p className="text-gray-900 font-medium">Saturday</p>
                                    <p className="text-gray-600">{siteData.clinic.timings.saturday}</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <Clock className="w-5 h-5 text-[#4A90D9] shrink-0 mt-0.5" />
                                <div className="text-sm">
                                    <p className="text-gray-900 font-medium">Sunday</p>
                                    <p className="text-gray-600">{siteData.clinic.timings.sunday}</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t border-gray-200">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-gray-500 text-sm">
                            © {new Date().getFullYear()} {siteData.clinic.fullName}. All rights reserved.
                        </p>
                        <div className="flex gap-6 text-sm text-gray-500">
                            <Link href="/privacy" className="hover:text-[#4A90D9] transition-colors">
                                Privacy Policy
                            </Link>
                            <Link href="/disclaimer" className="hover:text-[#4A90D9] transition-colors">
                                Medical Disclaimer
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
