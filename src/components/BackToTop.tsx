import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { Language } from '../types';

interface BackToTopProps {
  language?: Language;
}

export const BackToTop: React.FC<BackToTopProps> = ({ language = 'vi' }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 240) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) return null;

  return (
    <button
      id="btn-back-to-top"
      onClick={scrollToTop}
      aria-label="Back to top"
      title={language === 'vi' ? 'Cuộn lên đầu trang' : 'Scroll back to top'}
      className="fixed bottom-6 right-6 z-40 p-3 rounded-full bg-stone-900/90 text-amber-300 hover:bg-amber-600 hover:text-stone-950 border border-amber-500/40 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-110 cursor-pointer flex items-center justify-center group"
    >
      <ArrowUp className="w-5 h-5 transition-transform group-hover:-translate-y-0.5" />
    </button>
  );
};
