"use client";

import { useRef, useEffect } from "react";
import { Bot, Mic, MicOff, Phone, PhoneOff } from "lucide-react";
import { useVapi } from "./VapiContext";

export default function VapiTranscriptPanel() {
    const { isCallActive, isSpeaking, messages, endCall } = useVapi();
    const messagesContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div className="bg-white rounded-3xl shadow-2xl h-full flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-purple-500 to-pink-500">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                        {isCallActive ? (
                            <Phone className="w-5 h-5 text-white" />
                        ) : (
                            <PhoneOff className="w-5 h-5 text-white/70" />
                        )}
                    </div>
                    <div className="text-white">
                        <h3 className="font-semibold">SmileSure AI Assistant</h3>
                        <p className="text-sm text-white/80">
                            {isCallActive
                                ? isSpeaking
                                    ? "Listening..."
                                    : "Speaking..."
                                : "Call ended"}
                        </p>
                    </div>
                </div>
                {isCallActive && (
                    <button
                        onClick={endCall}
                        className="px-4 py-2 bg-white/20 text-white rounded-full text-sm font-medium hover:bg-white/30 transition-colors"
                    >
                        End Call
                    </button>
                )}
            </div>

            {/* Messages */}
            <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                        <Bot className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p>Conversation will appear here...</p>
                    </div>
                ) : (
                    messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`max-w-[85%] rounded-2xl px-4 py-2 ${msg.role === "user"
                                        ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-br-md"
                                        : "bg-white text-gray-800 rounded-bl-md shadow-sm"
                                    }`}
                            >
                                <p className="text-sm">{msg.content}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Footer with speaking indicator */}
            {isCallActive && (
                <div className="p-4 border-t bg-white">
                    <div className="flex items-center justify-center gap-2">
                        {isSpeaking ? (
                            <>
                                <Mic className="w-5 h-5 text-green-500 animate-pulse" />
                                <div className="flex gap-1">
                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-bounce" />
                                    <span
                                        className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
                                        style={{ animationDelay: "0.1s" }}
                                    />
                                    <span
                                        className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
                                        style={{ animationDelay: "0.2s" }}
                                    />
                                </div>
                                <span className="text-sm text-green-600 font-medium">
                                    Listening to you...
                                </span>
                            </>
                        ) : (
                            <>
                                <MicOff className="w-5 h-5 text-purple-500" />
                                <div className="flex gap-1">
                                    <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                                    <span
                                        className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"
                                        style={{ animationDelay: "0.15s" }}
                                    />
                                    <span
                                        className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"
                                        style={{ animationDelay: "0.3s" }}
                                    />
                                </div>
                                <span className="text-sm text-purple-600 font-medium">
                                    AI is responding...
                                </span>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
