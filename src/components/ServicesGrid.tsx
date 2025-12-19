"use client";

import Link from "next/link";
import {
    Stethoscope, Sparkles, Scan, CircleDot, Activity, Crown,
    Sun, Palette, Minus, Pin, AlignCenter, Baby
} from "lucide-react";
import servicesData from "@/data/services.json";

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

export default function ServicesGrid() {
    const featuredServices = servicesData.services.slice(0, 8);

    return (
        <section className="py-20 bg-gradient-to-b from-white to-sky-50/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="inline-block px-4 py-1 bg-[#4A90D9]/10 text-[#4A90D9] rounded-full text-sm font-medium mb-4">
                        Our Services
                    </span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                        Complete Dental Care <span className="text-[#4A90D9]">Under One Roof</span>
                    </h2>
                    <p className="text-lg text-gray-600">
                        We offer a comprehensive range of dental services for individuals and families,
                        delivered with care and precision.
                    </p>
                </div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {featuredServices.map((service, index) => {
                        const IconComponent = iconMap[service.icon] || Stethoscope;
                        return (
                            <Link
                                key={service.id}
                                href={`/services#${service.id}`}
                                className="group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 overflow-hidden"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                {/* Background Gradient on Hover */}
                                <div className="absolute inset-0 bg-gradient-to-br from-[#4A90D9]/5 to-[#7EC8E3]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                {/* Icon */}
                                <div className="relative w-14 h-14 bg-gradient-to-br from-[#4A90D9] to-[#7EC8E3] rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                    <IconComponent className="w-7 h-7 text-white" />
                                </div>

                                {/* Content */}
                                <h3 className="relative text-lg font-semibold text-gray-900 mb-2 group-hover:text-[#4A90D9] transition-colors">
                                    {service.name}
                                </h3>
                                <p className="relative text-sm text-gray-600 line-clamp-2">
                                    {service.shortDescription}
                                </p>

                                {/* Arrow */}
                                <div className="relative mt-4 flex items-center text-[#4A90D9] text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-[-10px] group-hover:translate-x-0">
                                    Learn more
                                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>

                                {/* Category Badge */}
                                <span className="absolute top-4 right-4 px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">
                                    {service.category}
                                </span>
                            </Link>
                        );
                    })}
                </div>

                {/* View All Button */}
                <div className="text-center mt-12">
                    <Link
                        href="/services"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-white border-2 border-[#4A90D9] text-[#4A90D9] rounded-full font-semibold hover:bg-[#4A90D9] hover:text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#4A90D9]/25"
                    >
                        View All Services
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </div>
            </div>
        </section>
    );
}
