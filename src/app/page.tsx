import HeroSection from "@/components/HeroSection";
import ServicesGrid from "@/components/ServicesGrid";
import WhyChooseUs from "@/components/WhyChooseUs";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";
import Link from "next/link";
import { Calendar, MapPin, Phone } from "lucide-react";
import siteData from "@/data/siteData.json";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <HeroSection />

      {/* Services Snapshot */}
      <ServicesGrid />

      {/* Why Choose Us */}
      <WhyChooseUs />

      {/* Testimonials */}
      <TestimonialsCarousel />

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#4A90D9] to-[#7EC8E3] relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center text-white">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Ready for a Healthier Smile?
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
              Book your appointment today and experience gentle, ethical dental care at SmileSure.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/appointment"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[#4A90D9] rounded-full font-semibold text-lg hover:bg-gray-100 transition-all duration-300 hover:-translate-y-1 shadow-lg"
              >
                <Calendar className="w-5 h-5" />
                Book Appointment
              </Link>
              <a
                href={siteData.clinic.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-semibold text-lg hover:bg-white hover:text-[#4A90D9] transition-all duration-300 hover:-translate-y-1"
              >
                <MapPin className="w-5 h-5" />
                Get Directions
              </a>
            </div>
          </div>

          {/* Quick Info */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center text-white">
              <MapPin className="w-8 h-8 mx-auto mb-3" />
              <p className="font-semibold">Sector 120, Noida</p>
              <p className="text-sm text-white/80">Amrapali Zodiac</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center text-white">
              <Phone className="w-8 h-8 mx-auto mb-3" />
              <p className="font-semibold">{siteData.clinic.phone}</p>
              <p className="text-sm text-white/80">Call or WhatsApp</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center text-white">
              <Calendar className="w-8 h-8 mx-auto mb-3" />
              <p className="font-semibold">Mon - Sat</p>
              <p className="text-sm text-white/80">10 AM - 8 PM</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
