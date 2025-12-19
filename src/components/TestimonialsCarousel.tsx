"use client";

import { useState, useEffect, useCallback } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import testimonialsData from "@/data/testimonials.json";

export default function TestimonialsCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const testimonials = testimonialsData.testimonials;

    const nextSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, [testimonials.length]);

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    useEffect(() => {
        if (!isAutoPlaying) return;
        const interval = setInterval(nextSlide, 5000);
        return () => clearInterval(interval);
    }, [isAutoPlaying, nextSlide]);

    return (
        <section className="py-20 bg-gradient-to-b from-sky-50/50 to-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="inline-block px-4 py-1 bg-[#4A90D9]/10 text-[#4A90D9] rounded-full text-sm font-medium mb-4">
                        Testimonials
                    </span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                        What Our <span className="text-[#4A90D9]">Patients Say</span>
                    </h2>
                    <p className="text-lg text-gray-600">
                        We value the trust our patients place in us. Here are a few words from people who have visited our clinic.
                    </p>
                </div>

                {/* Carousel */}
                <div
                    className="relative"
                    onMouseEnter={() => setIsAutoPlaying(false)}
                    onMouseLeave={() => setIsAutoPlaying(true)}
                >
                    {/* Cards Container */}
                    <div className="relative overflow-visible pt-8 pb-4">
                        <div
                            className="flex transition-transform duration-500 ease-out"
                            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                        >
                            {testimonials.map((testimonial) => (
                                <div
                                    key={testimonial.id}
                                    className="w-full flex-shrink-0 px-4"
                                >
                                    <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-8 md:p-12 relative mt-4">
                                        {/* Quote Icon */}
                                        <div className="absolute -top-4 left-8 w-12 h-12 bg-gradient-to-br from-[#4A90D9] to-[#7EC8E3] rounded-2xl flex items-center justify-center shadow-lg">
                                            <Quote className="w-6 h-6 text-white" />
                                        </div>

                                        {/* Stars */}
                                        <div className="flex gap-1 mb-6 justify-center">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`w-6 h-6 ${i < testimonial.rating
                                                        ? "text-yellow-400 fill-yellow-400"
                                                        : "text-gray-300"
                                                        }`}
                                                />
                                            ))}
                                        </div>

                                        {/* Testimonial Text */}
                                        <blockquote className="text-lg md:text-xl text-gray-700 text-center leading-relaxed mb-8">
                                            &ldquo;{testimonial.text}&rdquo;
                                        </blockquote>

                                        {/* Author */}
                                        <div className="flex flex-col items-center">
                                            <div className="w-16 h-16 bg-gradient-to-br from-[#4A90D9] to-[#7EC8E3] rounded-full flex items-center justify-center text-white text-2xl font-bold mb-3">
                                                {testimonial.name.charAt(0)}
                                            </div>
                                            <p className="font-semibold text-gray-900">{testimonial.name}</p>
                                            <p className="text-sm text-gray-500">{testimonial.location}</p>
                                            <span className="mt-2 px-3 py-1 bg-[#4A90D9]/10 text-[#4A90D9] rounded-full text-xs font-medium">
                                                {testimonial.treatment}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Buttons */}
                    <button
                        onClick={prevSlide}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:translate-x-0 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-[#4A90D9] hover:shadow-xl transition-all duration-300 z-10"
                        aria-label="Previous testimonial"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-0 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-[#4A90D9] hover:shadow-xl transition-all duration-300 z-10"
                        aria-label="Next testimonial"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>

                    {/* Dots */}
                    <div className="flex justify-center gap-2 mt-8">
                        {testimonials.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentIndex
                                    ? "bg-[#4A90D9] w-8"
                                    : "bg-gray-300 hover:bg-gray-400"
                                    }`}
                                aria-label={`Go to testimonial ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
