import { Metadata } from "next";
import { Shield, Sparkles, Baby, Wind, Scan, Armchair, Check } from "lucide-react";
import siteData from "@/data/siteData.json";

export const metadata: Metadata = {
    title: "Our Clinic & Facilities",
    description:
        "Modern, hygienic dental clinic at SmileSure Dental Care in Sector 120, Noida. State-of-the-art equipment, strict sterilization protocols, and comfortable environment.",
};

const facilities = [
    {
        icon: Shield,
        title: "Strict Sterilization",
        description: "All instruments are sterilized using autoclave and UV sterilization for every patient.",
    },
    {
        icon: Scan,
        title: "Digital X-rays",
        description: "Low-radiation digital radiography for accurate diagnosis with minimal exposure.",
    },
    {
        icon: Armchair,
        title: "Modern Dental Chair",
        description: "Ergonomic, comfortable dental chairs with advanced treatment capabilities.",
    },
    {
        icon: Wind,
        title: "Well-Ventilated",
        description: "Clean, well-ventilated treatment rooms with air purification systems.",
    },
    {
        icon: Baby,
        title: "Child-Friendly",
        description: "Welcoming environment designed to make children feel comfortable and safe.",
    },
    {
        icon: Sparkles,
        title: "Spotless Hygiene",
        description: "Immaculate cleanliness maintained throughout the clinic at all times.",
    },
];

export default function ClinicPage() {
    return (
        <>
            {/* Hero */}
            <section className="py-20 bg-gradient-to-b from-sky-50/50 to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <span className="inline-block px-4 py-1 bg-[#4A90D9]/10 text-[#4A90D9] rounded-full text-sm font-medium mb-4">
                        Our Clinic
                    </span>
                    <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
                        Modern Facilities for <span className="text-[#4A90D9]">Your Comfort</span>
                    </h1>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        Our clinic has been designed to ensure patient comfort, cleanliness, and safety.
                        We follow strict sterilization protocols for all instruments and treatment areas.
                    </p>
                </div>
            </section>

            {/* Facilities Grid */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {facilities.map((facility, index) => {
                            const Icon = facility.icon;
                            return (
                                <div
                                    key={index}
                                    className="group bg-white rounded-2xl p-8 border border-gray-100 hover:border-[#4A90D9]/30 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2"
                                >
                                    <div className="w-16 h-16 bg-gradient-to-br from-[#4A90D9]/10 to-[#7EC8E3]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:from-[#4A90D9] group-hover:to-[#7EC8E3] transition-all duration-300">
                                        <Icon className="w-8 h-8 text-[#4A90D9] group-hover:text-white transition-colors duration-300" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                        {facility.title}
                                    </h3>
                                    <p className="text-gray-600">{facility.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-20 bg-gradient-to-b from-white to-sky-50/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Image Placeholder */}
                        <div className="relative">
                            <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-[#4A90D9] to-[#7EC8E3]">
                                <div className="w-full h-full flex items-center justify-center">
                                    <div className="text-center text-white p-8">
                                        <Shield className="w-24 h-24 mx-auto mb-6 opacity-50" />
                                        <h3 className="text-2xl font-bold">Clean & Safe Environment</h3>
                                        <p className="text-white/80 mt-2">Your safety is our priority</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="space-y-6">
                            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                                Why Hygiene Matters
                            </h2>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                Modern dental equipment allows us to diagnose and treat conditions accurately
                                while minimizing discomfort. From the waiting area to the treatment room,
                                every space is maintained to high hygiene standards so patients feel safe
                                and relaxed during their visit.
                            </p>

                            <div className="space-y-4">
                                <h3 className="font-semibold text-gray-900">Our Clinic Features:</h3>
                                <ul className="space-y-3">
                                    {siteData.clinicFeatures.map((feature, index) => (
                                        <li key={index} className="flex items-center gap-3 text-gray-600">
                                            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                                                <Check className="w-4 h-4 text-green-600" />
                                            </div>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Safety Banner */}
            <section className="py-16 bg-[#4A90D9]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
                    <Shield className="w-16 h-16 mx-auto mb-6 opacity-90" />
                    <h2 className="text-3xl font-bold mb-4">Your Safety is Our Priority</h2>
                    <p className="text-xl text-white/90 max-w-2xl mx-auto">
                        We follow all recommended safety protocols to ensure a safe dental experience for every patient.
                    </p>
                </div>
            </section>
        </>
    );
}
