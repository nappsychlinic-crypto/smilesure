import { Metadata } from "next";
import { Phone, MessageCircle, MapPin, Clock } from "lucide-react";
import AppointmentForm from "@/components/AppointmentForm";
import siteData from "@/data/siteData.json";

export const metadata: Metadata = {
    title: "Book an Appointment",
    description:
        "Schedule your dental appointment at SmileSure Dental Care in Sector 120, Noida. Call, WhatsApp, or book online. Quick and easy appointment booking.",
};

export default function AppointmentPage() {
    return (
        <>
            {/* Hero */}
            <section className="py-20 bg-gradient-to-b from-sky-50/50 to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <span className="inline-block px-4 py-1 bg-[#4A90D9]/10 text-[#4A90D9] rounded-full text-sm font-medium mb-4">
                        Book Now
                    </span>
                    <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
                        Schedule Your <span className="text-[#4A90D9]">Appointment</span>
                    </h1>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        Scheduling your dental visit is quick and easy. Choose the option most convenient for you.
                    </p>
                </div>
            </section>

            {/* Booking Options */}
            <section className="py-12 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                        {/* Call */}
                        <a
                            href={`tel:${siteData.clinic.phone}`}
                            className="group bg-white rounded-2xl p-8 border-2 border-gray-100 hover:border-[#4A90D9] shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 text-center"
                        >
                            <div className="w-16 h-16 bg-[#4A90D9]/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-[#4A90D9] transition-colors duration-300">
                                <Phone className="w-8 h-8 text-[#4A90D9] group-hover:text-white transition-colors" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Call Us</h3>
                            <p className="text-[#4A90D9] font-semibold">{siteData.clinic.phone}</p>
                            <p className="text-sm text-gray-500 mt-2">Tap to call directly</p>
                        </a>

                        {/* WhatsApp */}
                        <a
                            href={`https://wa.me/${siteData.clinic.whatsapp}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group bg-white rounded-2xl p-8 border-2 border-gray-100 hover:border-[#25D366] shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 text-center"
                        >
                            <div className="w-16 h-16 bg-[#25D366]/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-[#25D366] transition-colors duration-300">
                                <MessageCircle className="w-8 h-8 text-[#25D366] group-hover:text-white transition-colors" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">WhatsApp</h3>
                            <p className="text-[#25D366] font-semibold">Message Us</p>
                            <p className="text-sm text-gray-500 mt-2">Quick response on WhatsApp</p>
                        </a>

                        {/* Location */}
                        <a
                            href={siteData.clinic.mapUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group bg-white rounded-2xl p-8 border-2 border-gray-100 hover:border-[#4A90D9] shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 text-center"
                        >
                            <div className="w-16 h-16 bg-[#4A90D9]/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-[#4A90D9] transition-colors duration-300">
                                <MapPin className="w-8 h-8 text-[#4A90D9] group-hover:text-white transition-colors" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Visit Us</h3>
                            <p className="text-gray-600 text-sm">Sector 120, Noida</p>
                            <p className="text-sm text-gray-500 mt-2">Get directions</p>
                        </a>
                    </div>

                    {/* Appointment Form */}
                    <div className="max-w-3xl mx-auto">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-gray-900">
                                Or Fill the Form Below
                            </h2>
                            <p className="text-gray-600 mt-2">
                                Our team will confirm your appointment within 24 hours.
                            </p>
                        </div>
                        <AppointmentForm />
                    </div>
                </div>
            </section>

            {/* Clinic Info */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        <div className="bg-white rounded-2xl p-8 shadow-sm">
                            <Clock className="w-10 h-10 text-[#4A90D9] mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">Clinic Timings</h3>
                            <ul className="space-y-2 text-gray-600">
                                <li className="flex justify-between">
                                    <span>Monday - Friday</span>
                                    <span className="font-medium">{siteData.clinic.timings.weekdays}</span>
                                </li>
                                <li className="flex justify-between">
                                    <span>Saturday</span>
                                    <span className="font-medium">{siteData.clinic.timings.saturday}</span>
                                </li>
                                <li className="flex justify-between">
                                    <span>Sunday</span>
                                    <span className="font-medium">{siteData.clinic.timings.sunday}</span>
                                </li>
                            </ul>
                        </div>

                        <div className="bg-white rounded-2xl p-8 shadow-sm">
                            <MapPin className="w-10 h-10 text-[#4A90D9] mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">Location</h3>
                            <p className="text-gray-600 mb-4">{siteData.clinic.fullAddress}</p>
                            <p className="text-sm text-gray-500">{siteData.clinic.parking}</p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
