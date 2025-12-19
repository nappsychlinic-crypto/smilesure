"use client";

import { createContext, useContext, useState, useRef, useEffect, useCallback, ReactNode } from "react";
import Vapi from "@vapi-ai/web";

interface Message {
    role: "assistant" | "user";
    content: string;
}

interface VapiContextType {
    isCallActive: boolean;
    isConnecting: boolean;
    isSpeaking: boolean;
    messages: Message[];
    showTranscript: boolean;
    startCall: (language?: "en" | "hi") => Promise<void>;
    endCall: () => void;
}

const VapiContext = createContext<VapiContextType | null>(null);

export function useVapi() {
    const context = useContext(VapiContext);
    if (!context) {
        throw new Error("useVapi must be used within a VapiProvider");
    }
    return context;
}

// Get today's date for calculating available slots
const getAvailableSlots = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfter = new Date(today);
    dayAfter.setDate(dayAfter.getDate() + 2);

    const formatDate = (date: Date) => {
        return date.toLocaleDateString("en-IN", {
            weekday: "long",
            month: "long",
            day: "numeric",
        });
    };

    return `
Available appointment slots:
1. Tomorrow (${formatDate(tomorrow)}) - Evening slot: 6:00 PM to 8:00 PM
2. Day after tomorrow (${formatDate(dayAfter)}) - Morning slot: 10:00 AM to 12:00 PM  
3. Day after tomorrow (${formatDate(dayAfter)}) - Afternoon slot: 2:00 PM to 4:00 PM
`;
};

const getAssistantConfig = (language: "en" | "hi") => {
    const isHindi = language === "hi";

    return {
        name: isHindi ? "SmileSure Hindi Assistant" : "SmileSure Appointment Assistant",
        model: {
            provider: "openai" as const,
            model: "gpt-4o-mini" as const,
            messages: [
                {
                    role: "system" as const,
                    content: isHindi
                        ? `You are a friendly and professional appointment booking assistant for SmileSure Dental Care, a dental clinic located in Sector 120, Noida. Speak in Hinglish (a mix of Hindi and English) which is natural for Indian speakers.
                        
The clinic is run by Dr. Shrestha Singh, who is a Consultant Orthodontist.

Your job is to help patients book dental appointments. Be warm, conversational, and helpful.

${getAvailableSlots()}

When booking an appointment, collect:
1. Patient's full name
2. Phone number (for confirmation)
3. Preferred slot from the available options
4. Brief reason for visit

After collecting all details, confirm the booking by repeating back the information and let them know they'll receive a confirmation call from the clinic.

Keep responses concise and natural.

Clinic contact: ${process.env.NEXT_PUBLIC_CLINIC_PHONE || "+918799773806"}
Clinic hours: Monday to Saturday, 10 AM to 8 PM
Address: Shop No. 1, Market Complex, Amrapali Zodiac, Sector 120, Noida`
                        : `You are a friendly and professional appointment booking assistant for SmileSure Dental Care, a dental clinic located in Sector 120, Noida. The clinic is run by Dr. Shrestha Singh, who is a Consultant Orthodontist with a BDS and MDS in Orthodontics and Dentofacial Orthopaedics.

Your job is to help patients book dental appointments. Be warm, conversational, and helpful.

${getAvailableSlots()}

When booking an appointment, collect:
1. Patient's full name
2. Phone number (for confirmation)
3. Preferred slot from the available options
4. Brief reason for visit (checkup, toothache, cleaning, braces consultation, etc.)

After collecting all details, confirm the booking by repeating back the information and let them know they'll receive a confirmation call from the clinic.

Keep responses concise and natural - this is a voice conversation. Avoid long monologues.

Clinic contact: ${process.env.NEXT_PUBLIC_CLINIC_PHONE || "+918799773806"}
Clinic hours: Monday to Saturday, 10 AM to 8 PM
Address: Shop No. 1, Market Complex, Amrapali Zodiac, Sector 120, Noida`,
                },
            ],
        },
        voice: {
            provider: "11labs" as const,
            voiceId: isHindi ? "H6QPv2pQZDcGqLwDTIJQ" : "21m00Tcm4TlvDq8ikWAM",
            model: isHindi ? ("eleven_multilingual_v2" as const) : ("eleven_turbo_v2_5" as const),
        },
        firstMessage: isHindi
            ? "Namaste! SmileSure Dental Care mein swagat hai. Main Dr. Shrestha Singh ke saath appointment book karne mein aapki madad kar sakti hoon. Bataiye main kaise madad karoon?"
            : "Hello! Welcome to SmileSure Dental Care. I'm here to help you book an appointment with Dr. Shrestha Singh. How can I assist you today?",
        transcriber: {
            provider: "deepgram" as const,
            model: isHindi ? "nova-3" : "nova-2",
            language: isHindi ? ("multi" as const) : ("en-IN" as const),
        },
    };
};

export function VapiProvider({ children }: { children: ReactNode }) {
    const [isCallActive, setIsCallActive] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [showTranscript, setShowTranscript] = useState(false);
    const vapiRef = useRef<Vapi | null>(null);

    useEffect(() => {
        const publicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;
        if (!publicKey) {
            console.error("VAPI public key not configured");
            return;
        }

        vapiRef.current = new Vapi(publicKey);

        const vapi = vapiRef.current;

        vapi.on("call-start", () => {
            setIsConnecting(false);
            setIsCallActive(true);
            setShowTranscript(true);
        });

        vapi.on("call-end", () => {
            setIsCallActive(false);
            setIsConnecting(false);
            setIsSpeaking(false);
        });

        vapi.on("speech-start", () => {
            setIsSpeaking(true);
        });

        vapi.on("speech-end", () => {
            setIsSpeaking(false);
        });

        vapi.on("message", (message) => {
            if (message.type === "transcript" && message.transcriptType === "final") {
                setMessages((prev) => [
                    ...prev,
                    {
                        role: message.role as "assistant" | "user",
                        content: message.transcript,
                    },
                ]);
            }
        });

        vapi.on("error", (error) => {
            console.error("Vapi error:", error);
            setIsCallActive(false);
            setIsConnecting(false);
        });

        return () => {
            if (vapiRef.current) {
                vapiRef.current.stop();
            }
        };
    }, []);

    const startCall = useCallback(async (language: "en" | "hi" = "en") => {
        if (!vapiRef.current) {
            console.error("Vapi not initialized");
            return;
        }

        setIsConnecting(true);
        setMessages([]);

        try {
            await vapiRef.current.start(getAssistantConfig(language));
        } catch (error) {
            console.error("Failed to start call:", error);
            setIsConnecting(false);
        }
    }, []);

    const endCall = useCallback(() => {
        if (vapiRef.current) {
            vapiRef.current.stop();
        }
        setShowTranscript(false);
    }, []);

    return (
        <VapiContext.Provider
            value={{
                isCallActive,
                isConnecting,
                isSpeaking,
                messages,
                showTranscript,
                startCall,
                endCall,
            }}
        >
            {children}
        </VapiContext.Provider>
    );
}
