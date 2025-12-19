import { Metadata } from "next";
import Image from "next/image";
import { Award, GraduationCap, Heart, Shield, Sparkles, Users } from "lucide-react";
import siteData from "@/data/siteData.json";

export const metadata: Metadata = {
    title: "About Dr. Shrestha Singh",
    description:
        "Meet Dr. Shrestha Singh, BDS, MDS - Consultant Orthodontist at SmileSure Dental Care in Sector 120, Noida. Patient-first approach to ethical dental care.",
};

export default function AboutPage() {
    return (
        <>
            {/* Hero Section */}
            <section className="py-20 bg-gradient-to-b from-sky-50/50 to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Image */}
                        <div className="relative">
                            <div className="aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-[#4A90D9] to-[#7EC8E3] relative">
                                {/* Doctor Image */}
                                <Image
                                    src="/doctor-profile.jpg"
                                    alt={siteData.doctor.name}
                                    fill
                                    className="object-cover object-top"
                                    priority
                                />
                                {/* Fallback overlay - shows if image fails */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-0">
                                    <div className="text-center text-white p-8">
                                        <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <span className="text-6xl font-bold">SS</span>
                                        </div>
                                        <h3 className="text-2xl font-bold">{siteData.doctor.name}</h3>
                                        <p className="text-white/90">{siteData.doctor.designation}</p>
                                    </div>
                                </div>
                            </div>
                            {/* Floating Badge */}
                            <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                        <Award className="w-6 h-6 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">DCI Registered</p>
                                        <p className="text-sm text-gray-500">ID: {siteData.doctor.dciId}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="space-y-6">
                            <span className="inline-block px-4 py-1 bg-[#4A90D9]/10 text-[#4A90D9] rounded-full text-sm font-medium">
                                Meet Your Dentist
                            </span>
                            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">
                                {siteData.doctor.name}
                            </h1>
                            <div className="flex flex-wrap gap-3">
                                <span className="px-4 py-2 bg-gray-100 rounded-full text-sm font-medium text-gray-700">
                                    {siteData.doctor.degrees}
                                </span>
                                <span className="px-4 py-2 bg-[#4A90D9]/10 text-[#4A90D9] rounded-full text-sm font-medium">
                                    {siteData.doctor.designation}
                                </span>
                            </div>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                {siteData.doctor.bio}
                            </p>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                {siteData.doctor.approach}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Philosophy Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-[#4A90D9] to-[#7EC8E3] rounded-full flex items-center justify-center mx-auto mb-8">
                            <Heart className="w-10 h-10 text-white" />
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                            Treatment Philosophy
                        </h2>
                        <blockquote className="text-2xl text-gray-700 italic leading-relaxed">
                            &ldquo;{siteData.doctor.philosophy}&rdquo;
                        </blockquote>
                        <p className="mt-6 text-[#4A90D9] font-semibold">
                            — {siteData.doctor.name}
                        </p>
                    </div>
                </div>
            </section>

            {/* Specializations */}
            <section className="py-20 bg-gradient-to-b from-white to-sky-50/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="inline-block px-4 py-1 bg-[#4A90D9]/10 text-[#4A90D9] rounded-full text-sm font-medium mb-4">
                            Expertise
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                            Areas of Specialization
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {siteData.doctor.specializations.map((spec, index) => {
                            const icons = [GraduationCap, Sparkles, Shield, Users];
                            const Icon = icons[index % icons.length];
                            return (
                                <div
                                    key={index}
                                    className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 text-center"
                                >
                                    <div className="w-16 h-16 bg-gradient-to-br from-[#4A90D9] to-[#7EC8E3] rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <Icon className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900">{spec}</h3>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Credentials */}
            <section className="py-20 bg-sky-50/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                            Credentials & Registration
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                        <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
                            <GraduationCap className="w-12 h-12 text-[#4A90D9] mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Education</h3>
                            <p className="text-gray-600">BDS, MDS (Orthodontics and Dentofacial Orthopaedics)</p>
                        </div>
                        <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
                            <Award className="w-12 h-12 text-[#4A90D9] mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">DCI Registration</h3>
                            <p className="text-gray-600">ID: {siteData.doctor.dciId}</p>
                        </div>
                        <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
                            <Shield className="w-12 h-12 text-[#4A90D9] mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Specialty</h3>
                            <p className="text-gray-600">{siteData.doctor.designation}</p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
