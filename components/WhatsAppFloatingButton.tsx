import React from 'react';

export const WhatsAppFloatingButton: React.FC = () => {
    const whatsappMessage = encodeURIComponent(
        "Hello, I am looking to get more details about using or setting up a Greenpal station. Could you please guide me on how to get started?"
    );

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <a
                href={`https://wa.me/+17807770519?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat on WhatsApp"
                className="
          flex items-center justify-center 
          bg-[#25D366] text-white 
          font-body font-bold 
          p-3.5 sm:px-6 sm:py-3.5 
          rounded-full 
          shadow-lg shadow-[#25D366]/30 
          hover:bg-[#1ebe5a] hover:scale-105 
          active:scale-95
          transition-all duration-300 ease-in-out
        "
            >
                {/* WhatsApp Icon */}
                <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.87 9.87 0 004.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2zm0 18.06h-.01a8.2 8.2 0 01-4.18-1.14l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 01-1.26-4.3c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.18 8.18 0 012.41 5.83c0 4.55-3.7 8.24-8.25 8.24zm4.52-6.17c-.25-.12-1.47-.72-1.7-.81-.23-.08-.4-.12-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.48-1.39-1.73-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43-.14-.01-.31-.01-.48-.01-.17 0-.43.06-.66.31-.23.25-.86.84-.86 2.05 0 1.21.88 2.38 1 2.54.12.17 1.73 2.64 4.2 3.7.59.25 1.05.4 1.41.52.59.19 1.13.16 1.55.1.47-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.15-1.18-.06-.11-.23-.17-.48-.29z" />
                </svg>

                {/* Text: Hidden on mobile (hidden), shows as flex on desktop (sm:inline) */}
                <span className="hidden sm:inline ml-3 text-base tracking-wide">
                    Chat on WhatsApp
                </span>
            </a>
        </div>
    );
};