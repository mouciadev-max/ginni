import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiXMark } from 'react-icons/hi2';

const announcements = [
  '✨ Free Shipping on All Orders Above ₹999!',
  '🔥 Up to 70% Off on Ethnic Wear — Limited Time Only',
  '🌸 New Festive Collection Just Landed!',
];

export default function AnnouncementBar() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="relative bg-maroon text-white text-center text-xs sm:text-sm py-2.5 px-8 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.p
          key={currentIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="font-medium tracking-wide"
        >
          {announcements[currentIndex]}
        </motion.p>
      </AnimatePresence>
      <button
        onClick={() => setVisible(false)}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/20 rounded-full transition-colors"
        aria-label="Close announcement"
      >
        <HiXMark className="w-4 h-4" />
      </button>
    </div>
  );
}
