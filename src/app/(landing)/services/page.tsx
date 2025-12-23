import { Metadata } from "next";
import {
    Stethoscope, Sparkles, Scan, CircleDot, Activity, Crown,
    Sun, Palette, Minus, Pin, AlignCenter, Baby, Clock, Check, AlertCircle
} from "lucide-react";
import servicesData from "@/data/services.json";

export const metadata: Metadata = {
    title: "Dental Services",
    description:
        "Complete range of dental services at SmileSure Dental Care - Check-ups, Root Canal, Teeth Whitening, Orthodontics, Implants, and more in Sector 120, Noida.",
};

const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
    Stethoscope,
    Sparkles,
    Scan,
    CircleDot,
    Activity,
    Crown,
    Sun,
    Palette,
    Minus,
    Pin,
    AlignCenter,
    Baby,
};

export default function ServicesPage() {
    return (
        <>
            {/* Hero */}
            <section className="py-20 bg-gradient-to-b from-sky-50/50 to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <span className="inline-block px-4 py-1 bg-[#4A90D9]/10 text-[#4A90D9] rounded-full text-sm font-medium mb-4">
                        Our Services
                    </span>
                    <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
                        Complete Dental Care <span className="text-[#4A90D9]">Under One Roof</span>
                    </h1>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        We offer a comprehensive range of dental services for individuals and families.
                        Each treatment is planned carefully based on your dental needs, comfort, and long-term oral health.
                    </p>
                </div>
            </section>

            {/* Services by Category */}
            {servicesData.categories.map((category) => {
                const categoryServices = servicesData.services.filter(
                    (s) => s.category === category.id
                );
                if (categoryServices.length === 0) return null;

                return (
                    <section key={category.id} className="py-16 bg-white even:bg-gray-50/50">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            {/* Category Header */}
                            <div className="mb-12">
                                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                    {category.name}
                                </h2>
                                <p className="text-gray-600">{category.description}</p>
                            </div>

                            {/* Services Grid */}
                            <div className="space-y-8">
                                {categoryServices.map((service) => {
                                    const IconComponent = iconMap[service.icon] || Stethoscope;
                                    return (
                                        <div
                                            key={service.id}
                                            id={service.id}
                                            className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 p-8 border border-gray-100"
                                        >
                                            <div className="grid lg:grid-cols-3 gap-8">
                                                {/* Main Info */}
                                                <div className="lg:col-span-2 space-y-4">
                                                    <div className="flex items-start gap-4">
                                                        <div className="w-14 h-14 bg-gradient-to-br from-[#4A90D9] to-[#7EC8E3] rounded-2xl flex items-center justify-center shrink-0">
                                                            <IconComponent className="w-7 h-7 text-white" />
                                                        </div>
                                                        <div>
                                                            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                                                {service.name}
                                                            </h3>
                                                            <span className="px-3 py-1 bg-[#4A90D9]/10 text-[#4A90D9] rounded-full text-sm font-medium">
                                                                {service.category}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <p className="text-gray-600 text-lg leading-relaxed">
                                                        {service.description}
                                                    </p>

                                                    {/* When Needed / Benefits / Symptoms */}
                                                    {(service.whenNeeded || service.benefits || service.symptoms) && (
                                                        <div className="pt-4">
                                                            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                                                <AlertCircle className="w-5 h-5 text-[#4A90D9]" />
                                                                {service.symptoms ? "Common Symptoms" : service.whenNeeded ? "When is it needed" : "Benefits"}
                                                            </h4>
                                                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                                {(service.whenNeeded || service.benefits || service.symptoms || []).map((item, i) => (
                                                                    <li key={i} className="flex items-center gap-2 text-gray-600">
                                                                        <Check className="w-4 h-4 text-green-500 shrink-0" />
                                                                        {item}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Quick Info Sidebar */}
                                                <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
                                                    <h4 className="font-semibold text-gray-900">Quick Info</h4>

                                                    <div className="space-y-3">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                                                <Clock className="w-5 h-5 text-[#4A90D9]" />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm text-gray-500">Duration</p>
                                                                <p className="font-medium text-gray-900">{service.duration || "Varies"}</p>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                                                <svg className="w-5 h-5 text-[#4A90D9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                </svg>
                                                            </div>
                                                            <div>
                                                                <p className="text-sm text-gray-500">Visits</p>
                                                                <p className="font-medium text-gray-900">{service.sittings || "1 visit"}</p>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                                                <svg className="w-5 h-5 text-[#4A90D9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                                </svg>
                                                            </div>
                                                            <div>
                                                                <p className="text-sm text-gray-500">Comfort Level</p>
                                                                <p className="font-medium text-gray-900">{service.painLevel || "Comfortable"}</p>
                                                            </div>
                                                        </div>

                                                        {service.aftercare && (
                                                            <div className="pt-3 border-t border-gray-200">
                                                                <p className="text-sm text-gray-500 mb-1">After-care</p>
                                                                <p className="text-sm text-gray-700">{service.aftercare}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </section>
                );
            })}
        </>
    );
}
