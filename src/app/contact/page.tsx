import { Metadata } from "next";
import { Phone, Mail, MapPin, Clock, MessageCircle, Navigation } from "lucide-react";
import siteData from "@/data/siteData.json";

export const metadata: Metadata = {
    title: "Contact Us",
    description:
        "Contact SmileSure Dental Care in Sector 120, Noida. Phone, WhatsApp, email, and directions. Open Mon-Sat 10 AM - 8 PM.",
};

export default function ContactPage() {
    return (
        <>
            {/* Hero */}
            <section className="py-20 bg-gradient-to-b from-sky-50/50 to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <span className="inline-block px-4 py-1 bg-[#4A90D9]/10 text-[#4A90D9] rounded-full text-sm font-medium mb-4">
                        Contact
                    </span>
                    <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
                        Get in <span className="text-[#4A90D9]">Touch</span>
                    </h1>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        We&apos;re here to help with all your dental needs. Reach out to us through any of the options below.
                    </p>
                </div>
            </section>

            {/* Contact Cards */}
            <section className="py-12 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Phone */}
                        <a
                            href={`tel:${siteData.clinic.phone}`}
                            className="group bg-white rounded-2xl p-6 border border-gray-100 hover:border-[#4A90D9] shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 text-center"
                        >
                            <div className="w-14 h-14 bg-[#4A90D9]/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-[#4A90D9] transition-colors">
                                <Phone className="w-7 h-7 text-[#4A90D9] group-hover:text-white transition-colors" />
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
                            <p className="text-[#4A90D9] font-medium">{siteData.clinic.phone}</p>
                        </a>

                        {/* WhatsApp */}
                        <a
                            href={`https://wa.me/${siteData.clinic.whatsapp}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group bg-white rounded-2xl p-6 border border-gray-100 hover:border-[#25D366] shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 text-center"
                        >
                            <div className="w-14 h-14 bg-[#25D366]/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-[#25D366] transition-colors">
                                <MessageCircle className="w-7 h-7 text-[#25D366] group-hover:text-white transition-colors" />
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-1">WhatsApp</h3>
                            <p className="text-[#25D366] font-medium">Chat with us</p>
                        </a>

                        {/* Email */}
                        <a
                            href={`mailto:${siteData.clinic.email}`}
                            className="group bg-white rounded-2xl p-6 border border-gray-100 hover:border-[#4A90D9] shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 text-center"
                        >
                            <div className="w-14 h-14 bg-[#4A90D9]/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-[#4A90D9] transition-colors">
                                <Mail className="w-7 h-7 text-[#4A90D9] group-hover:text-white transition-colors" />
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                            <p className="text-[#4A90D9] font-medium text-sm">{siteData.clinic.email}</p>
                        </a>

                        {/* Directions */}
                        <a
                            href={siteData.clinic.mapUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group bg-white rounded-2xl p-6 border border-gray-100 hover:border-[#4A90D9] shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 text-center"
                        >
                            <div className="w-14 h-14 bg-[#4A90D9]/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-[#4A90D9] transition-colors">
                                <Navigation className="w-7 h-7 text-[#4A90D9] group-hover:text-white transition-colors" />
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-1">Directions</h3>
                            <p className="text-[#4A90D9] font-medium">Get directions</p>
                        </a>
                    </div>
                </div>
            </section>

            {/* Map & Details */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* Map */}
                        <div className="bg-white rounded-3xl shadow-lg overflow-hidden h-[400px]">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3504.897!2d77.391!3d28.585!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDM1JzA0LjkiTiA3N8KwMjMnMjguMCJF!5e0!3m2!1sen!2sin!4v1"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="SmileSure Dental Care Location"
                            />
                        </div>

                        {/* Details */}
                        <div className="space-y-6">
                            {/* Address */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-[#4A90D9]/10 rounded-xl flex items-center justify-center shrink-0">
                                        <MapPin className="w-6 h-6 text-[#4A90D9]" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-2">Clinic Address</h3>
                                        <p className="text-gray-600">{siteData.clinic.address.line1}</p>
                                        <p className="text-gray-600">{siteData.clinic.address.line2}</p>
                                        <p className="text-gray-600">{siteData.clinic.address.city}, {siteData.clinic.address.state} - {siteData.clinic.address.pincode}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Timings */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-[#4A90D9]/10 rounded-xl flex items-center justify-center shrink-0">
                                        <Clock className="w-6 h-6 text-[#4A90D9]" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900 mb-3">Clinic Timings</h3>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Monday - Friday</span>
                                                <span className="font-medium text-gray-900">{siteData.clinic.timings.weekdays}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Saturday</span>
                                                <span className="font-medium text-gray-900">{siteData.clinic.timings.saturday}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Sunday</span>
                                                <span className="font-medium text-gray-900">{siteData.clinic.timings.sunday}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Parking */}
                            <div className="bg-[#4A90D9]/5 rounded-2xl p-6">
                                <p className="text-[#4A90D9] font-medium">
                                    🚗 {siteData.clinic.parking}
                                </p>
                            </div>

                            {/* Emergency */}
                            <div className="bg-red-50 rounded-2xl p-6 border border-red-100">
                                <h3 className="font-semibold text-red-800 mb-2">Dental Emergency?</h3>
                                <p className="text-red-700 text-sm mb-3">
                                    For urgent dental concerns, please call us directly. We try our best to accommodate emergency cases.
                                </p>
                                <a
                                    href={`tel:${siteData.clinic.phone}`}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                                >
                                    <Phone className="w-4 h-4" />
                                    Call Now
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
