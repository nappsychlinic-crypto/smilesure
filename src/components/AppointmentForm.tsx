"use client";

import { useState } from "react";
import { Phone, MessageCircle, Calendar, User, Clock, FileText, Send, CheckCircle } from "lucide-react";
import siteData from "@/data/siteData.json";
import servicesData from "@/data/services.json";

export default function AppointmentForm() {
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        date: "",
        time: "",
        service: "",
        message: "",
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate form submission
        await new Promise((resolve) => setTimeout(resolve, 1500));

        setIsLoading(false);
        setIsSubmitted(true);
    };

    if (isSubmitted) {
        return (
            <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Appointment Request Received!
                </h3>
                <p className="text-gray-600 mb-6">
                    Thank you for booking with SmileSure Dental Care. Our team will contact you shortly to confirm your appointment.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                        href={`tel:${siteData.clinic.phone}`}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#4A90D9] text-white rounded-full font-semibold hover:bg-[#357ABD] transition-colors"
                    >
                        <Phone className="w-5 h-5" />
                        Call Now
                    </a>
                    <a
                        href={`https://wa.me/${siteData.clinic.whatsapp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#25D366] text-white rounded-full font-semibold hover:bg-[#20BD5A] transition-colors"
                    >
                        <MessageCircle className="w-5 h-5" />
                        WhatsApp Us
                    </a>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="relative">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                    </label>
                    <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            id="name"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your name"
                            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4A90D9] focus:border-transparent outline-none transition-all"
                        />
                    </div>
                </div>

                {/* Phone */}
                <div className="relative">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                    </label>
                    <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            required
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+91 98765 43210"
                            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4A90D9] focus:border-transparent outline-none transition-all"
                        />
                    </div>
                </div>

                {/* Date */}
                <div className="relative">
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                        Preferred Date
                    </label>
                    <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="date"
                            id="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4A90D9] focus:border-transparent outline-none transition-all"
                        />
                    </div>
                </div>

                {/* Time */}
                <div className="relative">
                    <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
                        Preferred Time
                    </label>
                    <div className="relative">
                        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <select
                            id="time"
                            name="time"
                            value={formData.time}
                            onChange={handleChange}
                            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4A90D9] focus:border-transparent outline-none transition-all appearance-none bg-white"
                        >
                            <option value="">Select time</option>
                            <option value="10:00 AM">10:00 AM</option>
                            <option value="11:00 AM">11:00 AM</option>
                            <option value="12:00 PM">12:00 PM</option>
                            <option value="2:00 PM">2:00 PM</option>
                            <option value="3:00 PM">3:00 PM</option>
                            <option value="4:00 PM">4:00 PM</option>
                            <option value="5:00 PM">5:00 PM</option>
                            <option value="6:00 PM">6:00 PM</option>
                            <option value="7:00 PM">7:00 PM</option>
                        </select>
                    </div>
                </div>

                {/* Service */}
                <div className="relative md:col-span-2">
                    <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-2">
                        Service Required
                    </label>
                    <div className="relative">
                        <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <select
                            id="service"
                            name="service"
                            value={formData.service}
                            onChange={handleChange}
                            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4A90D9] focus:border-transparent outline-none transition-all appearance-none bg-white"
                        >
                            <option value="">Select a service (optional)</option>
                            {servicesData.services.map((service) => (
                                <option key={service.id} value={service.name}>
                                    {service.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Message */}
                <div className="relative md:col-span-2">
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                        Additional Message
                    </label>
                    <textarea
                        id="message"
                        name="message"
                        rows={4}
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell us about your dental concerns or any questions you have..."
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4A90D9] focus:border-transparent outline-none transition-all resize-none"
                    />
                </div>
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-8 inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-[#4A90D9] to-[#7EC8E3] text-white rounded-xl font-semibold text-lg shadow-lg shadow-[#4A90D9]/25 hover:shadow-xl hover:shadow-[#4A90D9]/30 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {isLoading ? (
                    <>
                        <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Submitting...
                    </>
                ) : (
                    <>
                        <Send className="w-5 h-5" />
                        Submit Appointment Request
                    </>
                )}
            </button>

            <p className="mt-4 text-sm text-gray-500 text-center">
                Our team will confirm your appointment within 24 hours.
            </p>
        </form>
    );
}
