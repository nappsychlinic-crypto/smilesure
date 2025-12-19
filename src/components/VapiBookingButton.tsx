"use client";

import { Bot, Loader2, PhoneOff } from "lucide-react";
import { useVapi } from "./VapiContext";

export default function VapiBookingButton() {
    const { isCallActive, isConnecting, startCall, endCall } = useVapi();

    if (isCallActive || isConnecting) {
        return (
            <button
                onClick={endCall}
                disabled={isConnecting}
                className={`group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:-translate-y-1 ${isCallActive
                        ? "bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/25"
                        : "bg-gray-400 text-white cursor-wait"
                    }`}
            >
                {isConnecting ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Connecting...
                    </>
                ) : (
                    <>
                        <PhoneOff className="w-5 h-5" />
                        End Call
                    </>
                )}
            </button>
        );
    }

    return (
        <div className="flex flex-col sm:flex-row gap-4">
            <button
                onClick={() => startCall("en")}
                className="group inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full font-semibold text-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300 hover:-translate-y-1"
            >
                <Bot className="w-5 h-5" />
                Book with AI - English
            </button>
            <button
                onClick={() => startCall("hi")}
                className="group inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full font-semibold text-lg bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30 transition-all duration-300 hover:-translate-y-1"
            >
                <Bot className="w-5 h-5" />
                Book with AI - Hindi
            </button>
        </div>
    );
}
