"use client";

import Image from "next/image";
import Link from "next/link";
import { Phone, MessageCircle, Calendar, Award, Shield, Clock } from "lucide-react";
import siteData from "@/data/siteData.json";
import { VapiProvider, useVapi } from "./VapiContext";
import VapiBookingButton from "./VapiBookingButton";
import VapiTranscriptPanel from "./VapiTranscriptPanel";

function HeroContent() {
    const { showTranscript } = useVapi();

    return (
        <section className="relative min-h-[calc(100vh-5rem)] flex items-center overflow-hidden bg-gradient-to-br from-white via-blue-50/30 to-sky-100/50">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#4A90D9]/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#7EC8E3]/10 rounded-full blur-3xl animate-pulse delay-1000" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-white/50 to-transparent rounded-full" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    {/* Content */}
                    <div className="space-y-8 text-center lg:text-left">
                        {/* Doctor Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md animate-fade-in">
                            <Award className="w-5 h-5 text-[#4A90D9]" />
                            <span className="text-sm font-medium text-gray-700">
                                {siteData.doctor.degrees}
                            </span>
                        </div>

                        {/* Main Headline */}
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight animate-fade-in-up">
                            {siteData.hero.headline.split(" ").map((word, i) => (
                                <span
                                    key={i}
                                    className={
                                        word === "Gentle," || word === "Ethical"
                                            ? "text-[#4A90D9]"
                                            : ""
                                    }
                                >
                                    {word}{" "}
                                </span>
                            ))}
                        </h1>

                        {/* Subheadline */}
                        <p className="text-lg sm:text-xl text-gray-600 max-w-xl mx-auto lg:mx-0 animate-fade-in-up delay-100">
                            {siteData.hero.subheadline}
                        </p>

                        {/* Doctor Info */}
                        <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start animate-fade-in-up delay-200">
                            <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-xl shadow-sm">
                                <div className="w-12 h-12 bg-gradient-to-br from-[#4A90D9] to-[#7EC8E3] rounded-full flex items-center justify-center text-white font-bold text-lg">
                                    {siteData.doctor.firstName[0]}
                                </div>
                                <div className="text-left">
                                    <p className="font-semibold text-gray-900">{siteData.doctor.name}</p>
                                    <p className="text-sm text-gray-500">{siteData.doctor.designation}</p>
                                </div>
                            </div>
                        </div>

                        {/* CTAs */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in-up delay-300">
                            <Link
                                href="/appointment"
                                className="group inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#4A90D9] to-[#7EC8E3] text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg shadow-[#4A90D9]/25 hover:shadow-xl hover:shadow-[#4A90D9]/30 transition-all duration-300 hover:-translate-y-1"
                            >
                                <Calendar className="w-5 h-5" />
                                {siteData.hero.ctaPrimary}
                            </Link>
                            <a
                                href={`https://wa.me/${siteData.clinic.whatsapp}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-2 bg-white text-[#25D366] border-2 border-[#25D366] px-8 py-4 rounded-full font-semibold text-lg hover:bg-[#25D366] hover:text-white transition-all duration-300 hover:-translate-y-1"
                            >
                                <MessageCircle className="w-5 h-5" />
                                {siteData.hero.ctaSecondary}
                            </a>
                        </div>

                        {/* AI Booking Button */}
                        <div className="flex justify-center lg:justify-start animate-fade-in-up delay-400">
                            <VapiBookingButton />
                        </div>

                        {/* Trust Indicators */}
                        <div className="flex flex-wrap gap-6 justify-center lg:justify-start pt-4 animate-fade-in-up delay-500">
                            <div className="flex items-center gap-2 text-gray-600">
                                <Shield className="w-5 h-5 text-[#4A90D9]" />
                                <span className="text-sm">Sterilized Equipment</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                                <Clock className="w-5 h-5 text-[#4A90D9]" />
                                <span className="text-sm">Flexible Timings</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                                <Phone className="w-5 h-5 text-[#4A90D9]" />
                                <span className="text-sm">Emergency Care</span>
                            </div>
                        </div>
                    </div>

                    {/* Hero Image / Transcript Panel */}
                    <div className="relative animate-fade-in-up delay-200">
                        {showTranscript ? (
                            /* Transcript Panel - replaces hero image during call */
                            <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
                                <VapiTranscriptPanel />
                            </div>
                        ) : (
                            /* Hero Image */
                            <>
                                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
                                    <Image
                                        src="/hero-image.png"
                                        alt="Happy family with bright smiles at SmileSure Dental Care"
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                    {/* Overlay gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#4A90D9]/10 to-transparent" />
                                </div>

                                {/* Floating Cards */}
                                <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 animate-float">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                            <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">500+</p>
                                            <p className="text-sm text-gray-500">Happy Patients</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="absolute -top-6 -right-6 bg-white rounded-2xl shadow-xl p-4 animate-float delay-500">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                                            <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">5.0 ★</p>
                                            <p className="text-sm text-gray-500">Patient Rating</p>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default function HeroSection() {
    return (
        <VapiProvider>
            <HeroContent />
        </VapiProvider>
    );
}
