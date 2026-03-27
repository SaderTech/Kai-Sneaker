import React from 'react';
import { Phone } from 'lucide-react';

const ContactWidget = () => {
    return (
        <div className="fixed bottom-24 right-6 z-[999] flex flex-col gap-4">

            <a
                href="https://zalo.me/0369335908"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex items-center justify-center transition-transform duration-300 hover:scale-110"
            >
                <div className="absolute right-full mr-3 px-2 py-1 bg-black text-white text-[10px] rounded opacity-0 group-hover:opacity-100 whitespace-nowrap">
                    Zalo tư vấn
                </div>

                <img
                    src="data:image/png;base64,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"
                    className="w-12 h-12 object-contain"
                    alt="Zalo"
                />
            </a>

            <a
                href="tel:0369335908"
                className="group relative flex items-center justify-center w-12 h-12 bg-green-500 text-white rounded-full shadow-lg hover:scale-110 transition-all"
            >
                <div className="absolute right-full mr-3 px-2 py-1 bg-black text-white text-[10px] rounded opacity-0 group-hover:opacity-100 whitespace-nowrap">
                    Gọi hotline
                </div>
                <Phone className="w-5 h-5 fill-current" />
            </a>

        </div>
    );
};

export default ContactWidget;