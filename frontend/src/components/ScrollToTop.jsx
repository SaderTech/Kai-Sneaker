import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-[998]"> {/* Để z-index thấp hơn Contact một chút */}
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="bg-black text-white p-3.5 rounded-full shadow-xl hover:bg-gray-800 transition-all duration-300 hover:scale-110 active:scale-95 border border-white/10 group"
          title="Lên đầu trang"
        >
          <ChevronUp className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
        </button>
      )}
    </div>
  );
};

export default ScrollToTop;