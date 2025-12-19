"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FAQItem {
    id: number;
    question: string;
    answer: string;
}

interface FAQAccordionProps {
    faqs: FAQItem[];
}

export default function FAQAccordion({ faqs }: FAQAccordionProps) {
    const [openId, setOpenId] = useState<number | null>(1);

    const toggle = (id: number) => {
        setOpenId(openId === id ? null : id);
    };

    return (
        <div className="space-y-4">
            {faqs.map((faq) => (
                <div
                    key={faq.id}
                    className={`bg-white rounded-2xl border transition-all duration-300 ${openId === faq.id
                            ? "border-[#4A90D9]/30 shadow-lg"
                            : "border-gray-100 hover:border-gray-200"
                        }`}
                >
                    <button
                        onClick={() => toggle(faq.id)}
                        className="w-full px-6 py-5 flex items-center justify-between text-left"
                        aria-expanded={openId === faq.id}
                    >
                        <span className={`font-semibold text-lg transition-colors ${openId === faq.id ? "text-[#4A90D9]" : "text-gray-900"
                            }`}>
                            {faq.question}
                        </span>
                        <ChevronDown
                            className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${openId === faq.id ? "rotate-180 text-[#4A90D9]" : ""
                                }`}
                        />
                    </button>
                    <div
                        className={`overflow-hidden transition-all duration-300 ${openId === faq.id ? "max-h-96" : "max-h-0"
                            }`}
                    >
                        <p className="px-6 pb-6 text-gray-600 leading-relaxed">
                            {faq.answer}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}
