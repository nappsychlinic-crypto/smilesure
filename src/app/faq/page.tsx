import { Metadata } from "next";
import FAQAccordion from "@/components/FAQAccordion";
import faqsData from "@/data/faqs.json";
import Link from "next/link";
import { Phone, MessageCircle } from "lucide-react";
import siteData from "@/data/siteData.json";

export const metadata: Metadata = {
    title: "Frequently Asked Questions",
    description:
        "Common questions about dental treatment at SmileSure Dental Care. Learn about procedures, pain levels, timings, and more.",
};

export default function FAQPage() {
    return (
        <>
            {/* Hero */}
            <section className="py-20 bg-gradient-to-b from-sky-50/50 to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <span className="inline-block px-4 py-1 bg-[#4A90D9]/10 text-[#4A90D9] rounded-full text-sm font-medium mb-4">
                        FAQs
                    </span>
                    <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
                        Frequently Asked <span className="text-[#4A90D9]">Questions</span>
                    </h1>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        Find answers to common questions about our dental services and procedures.
                    </p>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-16 bg-white">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <FAQAccordion faqs={faqsData.faqs} />
                </div>
            </section>

            {/* Still Have Questions */}
            <section className="py-16 bg-gradient-to-b from-white to-sky-50/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 text-center max-w-2xl mx-auto">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            Still Have Questions?
                        </h2>
                        <p className="text-gray-600 mb-8">
                            We&apos;re here to help! Feel free to reach out to us for any queries or concerns.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href={`tel:${siteData.clinic.phone}`}
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#4A90D9] text-white rounded-full font-semibold hover:bg-[#357ABD] transition-colors"
                            >
                                <Phone className="w-5 h-5" />
                                Call Us
                            </a>
                            <a
                                href={`https://wa.me/${siteData.clinic.whatsapp}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#25D366] text-white rounded-full font-semibold hover:bg-[#20BD5A] transition-colors"
                            >
                                <MessageCircle className="w-5 h-5" />
                                WhatsApp
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
