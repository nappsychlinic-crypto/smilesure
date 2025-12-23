import { Metadata } from "next";
import { Star, Quote } from "lucide-react";
import testimonialsData from "@/data/testimonials.json";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Patient Testimonials",
    description:
        "Read what our patients say about their experience at SmileSure Dental Care. Real reviews from real patients in Sector 120, Noida.",
};

export default function TestimonialsPage() {
    return (
        <>
            {/* Hero */}
            <section className="py-20 bg-gradient-to-b from-sky-50/50 to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <span className="inline-block px-4 py-1 bg-[#4A90D9]/10 text-[#4A90D9] rounded-full text-sm font-medium mb-4">
                        Testimonials
                    </span>
                    <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
                        What Our <span className="text-[#4A90D9]">Patients Say</span>
                    </h1>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        We value the trust our patients place in us. Here are a few words from people who have visited our clinic.
                    </p>
                </div>
            </section>

            {/* Testimonials Grid */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {testimonialsData.testimonials.map((testimonial) => (
                            <div
                                key={testimonial.id}
                                className="group bg-white rounded-2xl p-8 border border-gray-100 hover:border-[#4A90D9]/30 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 relative"
                            >
                                {/* Quote Icon */}
                                <div className="absolute -top-4 left-6 w-10 h-10 bg-gradient-to-br from-[#4A90D9] to-[#7EC8E3] rounded-xl flex items-center justify-center shadow-md">
                                    <Quote className="w-5 h-5 text-white" />
                                </div>

                                {/* Stars */}
                                <div className="flex gap-1 mb-4 pt-2">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-5 h-5 ${i < testimonial.rating
                                                    ? "text-yellow-400 fill-yellow-400"
                                                    : "text-gray-300"
                                                }`}
                                        />
                                    ))}
                                </div>

                                {/* Text */}
                                <p className="text-gray-700 leading-relaxed mb-6">
                                    &ldquo;{testimonial.text}&rdquo;
                                </p>

                                {/* Author */}
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-[#4A90D9] to-[#7EC8E3] rounded-full flex items-center justify-center text-white font-bold">
                                        {testimonial.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">{testimonial.name}</p>
                                        <p className="text-sm text-gray-500">{testimonial.location}</p>
                                    </div>
                                </div>

                                {/* Treatment Badge */}
                                <span className="absolute bottom-4 right-4 px-3 py-1 bg-[#4A90D9]/10 text-[#4A90D9] rounded-full text-xs font-medium">
                                    {testimonial.treatment}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 bg-gradient-to-b from-white to-sky-50/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        Join Our Happy Patients
                    </h2>
                    <p className="text-gray-600 mb-8 max-w-xl mx-auto">
                        Experience the SmileSure difference. Book your appointment today and see why our patients love us.
                    </p>
                    <Link
                        href="/appointment"
                        className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-[#4A90D9] to-[#7EC8E3] text-white rounded-full font-semibold text-lg shadow-lg shadow-[#4A90D9]/25 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    >
                        Book Your Appointment
                    </Link>
                </div>
            </section>
        </>
    );
}
