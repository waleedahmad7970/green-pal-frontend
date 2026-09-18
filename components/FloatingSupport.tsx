"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

type Message = {
    id: string;
    role: "user" | "bot";
    text: string;
};

export default function FloatingSupport() {
    const [isHovered, setIsHovered] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "welcome-msg",
            role: "bot",
            text: "Hi there! I'm the Greenpal Assistant. How can I help you today? (Mock Mode)",
        },
    ]);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isTyping]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const newUserMsg: Message = {
            id: Date.now().toString(),
            role: "user",
            text: inputValue,
        };

        setMessages((prev) => [...prev, newUserMsg]);
        setInputValue("");
        setIsTyping(true);

        setTimeout(() => {
            let botReply = "Thanks for your message! This is a placeholder response until the real API is connected.";

            const lowerInput = newUserMsg.text.toLowerCase();
            if (lowerInput.includes("pricing") || lowerInput.includes("cost")) {
                botReply = "Our hardware pricing is tiered based on volume. You can check the hardware catalog for specific numbers!";
            } else if (lowerInput.includes("hello") || lowerInput.includes("hi")) {
                botReply = "Hello! What can I help you build today?";
            } else if (lowerInput.includes("blueprint") || lowerInput.includes("plan")) {
                botReply = "Our blueprints break down exact capital layouts, revenue shares, and ROI for different venue types.";
            }

            const newBotMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: "bot",
                text: botReply,
            };

            setMessages((prev) => [...prev, newBotMsg]);
            setIsTyping(false);
        }, 1200);
    };

    return (
        <div className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-[100] flex flex-col items-end">

            {/* --- The Chat Window --- */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95, transformOrigin: "bottom right" }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="mb-4 w-[calc(100vw-3rem)] sm:w-[380px] h-[500px] max-h-[70vh] bg-card border line-rule rounded-3xl shadow-2xl flex flex-col overflow-hidden relative z-50"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-5 border-b line-rule bg-surface/80 backdrop-blur-md shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-2.5 h-2.5 rounded-full bg-signal animate-pulse" />
                                {/* Exclusively using your custom classes: ink (dark) and sand (light) */}
                                <h3 className="font-display font-bold text-lg text-ink dark:text-sand">
                                    Greenpal Support
                                </h3>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-muted hover:text-ink dark:hover:text-sand transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Messages Area - Hidden scrollbar */}
                        <div className="flex-1 overflow-y-auto p-5 space-y-4 font-body text-sm bg-surface/50 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    <div
                                        className={`max-w-[80%] p-3.5 rounded-2xl shadow-sm ${msg.role === "user"
                                                ? "bg-signal text-ink rounded-br-sm" // User Bubble: Uses your green CTA logic (signal bg + ink text)
                                                : "bg-card border line-rule text-ink dark:text-sand rounded-bl-sm" // Bot Bubble: Native light/dark theme adaptation
                                            }`}
                                    >
                                        {msg.text}
                                    </div>
                                </div>
                            ))}

                            {/* Typing Indicator */}
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-card border line-rule p-4 rounded-2xl rounded-bl-sm flex gap-1.5 items-center shadow-sm">
                                        <motion.div className="w-1.5 h-1.5 rounded-full bg-muted" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0 }} />
                                        <motion.div className="w-1.5 h-1.5 rounded-full bg-muted" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }} />
                                        <motion.div className="w-1.5 h-1.5 rounded-full bg-muted" animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }} />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSendMessage} className="p-4 bg-card border-t line-rule shrink-0">
                            <div className="relative flex items-center">
                                {/* Exclusively using your custom classes */}
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Type a message..."
                                    className="w-full bg-surface border line-rule rounded-full pl-4 pr-12 py-3 font-body text-sm text-ink dark:text-sand placeholder:text-muted focus:outline-none focus:border-signal transition-colors"
                                />
                                <button
                                    type="submit"
                                    disabled={!inputValue.trim() || isTyping}
                                    className="absolute right-1.5 w-9 h-9 rounded-full bg-signal text-ink flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform"
                                >
                                    <svg className="w-4 h-4 translate-x-px" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                    </svg>
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* --- The Entrance Pop Button --- */}
            <motion.div
                initial={{ scale: 0, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.5 }}
                className="relative z-40"
            >
                <motion.button
                    onClick={() => setIsOpen(!isOpen)}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    animate={{ width: isOpen ? 64 : (isHovered ? 160 : 64) }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    className="relative flex items-center justify-end h-16 rounded-full border line-rule cursor-pointer group overflow-hidden bg-card shadow-lg hover:shadow-2xl hover:border-signal transition-all duration-500"
                >
                    {/* Liquid hover fill: bg-signal */}
                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-signal rounded-full transition-transform duration-[600ms] ease-signature pointer-events-none ${!isOpen ? 'scale-0 group-hover:scale-100' : 'scale-0'}`} />

                    <AnimatePresence>
                        {isHovered && !isOpen && (
                            <motion.div
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10, transition: { duration: 0.1 } }}
                                transition={{ duration: 0.3, delay: 0.05 }}
                                // Base text adapts to theme, but FORCES ink when hovered so it is readable over the green signal background
                                className="absolute left-6 whitespace-nowrap text-ink dark:text-sand group-hover:text-ink dark:group-hover:text-ink font-display font-bold text-lg tracking-wide transition-colors duration-[600ms] pointer-events-none"
                            >
                                Let's Chat
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Icon base adapts to theme, but FORCES ink when hovered over the green signal background */}
                    <div className={`relative z-10 flex items-center justify-center w-16 h-16 shrink-0 transition-colors duration-[600ms] ${isOpen ? 'text-ink dark:text-sand' : 'text-ink dark:text-sand group-hover:text-ink dark:group-hover:text-ink'}`}>
                        <motion.div
                            animate={{ rotate: isOpen ? 90 : 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                            {isOpen ? (
                                <svg className="w-6 h-6 transition-transform duration-[600ms] ease-signature" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg
                                    className="w-6 h-6 transition-transform duration-[600ms] ease-signature group-hover:-rotate-12"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={1.5}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                    />
                                </svg>
                            )}
                        </motion.div>
                    </div>
                </motion.button>
            </motion.div>
        </div>
    );
}