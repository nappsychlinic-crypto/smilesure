"use client";

import { Heart, Zap, MessageCircle, Shield, Smile, IndianRupee } from "lucide-react";
import siteData from "@/data/siteData.json";

const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
    Heart,
    Zap,
    MessageCircle,
    Shield,
    Smile,
    IndianRupee,
};

export default function WhyChooseUs() {
    return (
        <section className="py-20 bg-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#4A90D9]/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#7EC8E3]/5 rounded-full blur-3xl" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="inline-block px-4 py-1 bg-[#4A90D9]/10 text-[#4A90D9] rounded-full text-sm font-medium mb-4">
                        Why SmileSure
                    </span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                        Why <span className="text-[#4A90D9]">Choose Us</span>
                    </h2>
                    <p className="text-lg text-gray-600">
                        {siteData.intro.content}
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {siteData.whyChooseUs.map((item, index) => {
                        const IconComponent = iconMap[item.icon] || Heart;
                        return (
                            <div
                                key={index}
                                className="group relative bg-white rounded-2xl p-8 border border-gray-100 hover:border-[#4A90D9]/30 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2"
                            >
                                {/* Icon */}
                                <div className="w-16 h-16 bg-gradient-to-br from-[#4A90D9]/10 to-[#7EC8E3]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:from-[#4A90D9] group-hover:to-[#7EC8E3] transition-all duration-300">
                                    <IconComponent className="w-8 h-8 text-[#4A90D9] group-hover:text-white transition-colors duration-300" />
                                </div>

                                {/* Content */}
                                <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-[#4A90D9] transition-colors">
                                    {item.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {item.description}
                                </p>

                                {/* Decorative Line */}
                                <div className="absolute bottom-0 left-8 right-8 h-1 bg-gradient-to-r from-[#4A90D9] to-[#7EC8E3] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
