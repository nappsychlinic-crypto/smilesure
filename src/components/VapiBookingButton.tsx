"use client";

import { Bot, Loader2, PhoneOff } from "lucide-react";
import { useVapi } from "./VapiContext";

export default function VapiBookingButton() {
    const { isCallActive, isConnecting, startCall, endCall } = useVapi();

    return (
        <button
            onClick={isCallActive ? endCall : startCall}
            disabled={isConnecting}
            className={`group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:-translate-y-1 ${isCallActive
                    ? "bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/25"
                    : isConnecting
                        ? "bg-gray-400 text-white cursor-wait"
                        : "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30"
                }`}
        >
            {isConnecting ? (
                <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Connecting...
                </>
            ) : isCallActive ? (
                <>
                    <PhoneOff className="w-5 h-5" />
                    End Call
                </>
            ) : (
                <>
                    <Bot className="w-5 h-5" />
                    Book with AI
                </>
            )}
        </button>
    );
}
