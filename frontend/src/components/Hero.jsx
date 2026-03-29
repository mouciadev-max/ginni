import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const heroSlides = [
  {
    image: '/images/hero1.png',
    subtitle: 'As Seen On',
    title: 'GINNI ETHNIC WEAR',
    highlights: ['✔ Direct From Artisans', '✔ Over 50,000+ Reviews', '✔ 3 Step Quality Check'],
    cta: 'LOWEST PRICE GUARANTEED',
    ctaLink: '/collections/festive',
  },
  {
    image: '/images/hero2.png',
    subtitle: 'Premium Heritage',
    title: 'Banarasi Collection',
    highlights: ['✔ Handwoven by Master Artisans', '✔ Pure Silk Guarantee', '✔ Free Shipping'],
    cta: 'EXPLORE COLLECTION',
    ctaLink: '/collections/banarasi',
  },
  {
    image: '/images/hero3.png',
    subtitle: 'Designer Collection',
    title: 'For The Queen Within',
    highlights: ['✔ Premium Designer Wear', '✔ Exclusive Designs', '✔ Festival Ready'],
    cta: 'VIEW ALL',
    ctaLink: '/collections',
  },
];

const SLIDE_INTERVAL_MS = 5000;

export default function Hero() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % heroSlides.length);
    }, SLIDE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

  const currentSlide = heroSlides[activeIndex];

  return (
    <section className="relative w-full overflow-hidden">
      {/* Compact banner */}
      <div className="relative h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 flex"
          >
            {/* Left image area */}
            <div className="w-1/2 sm:w-2/5 relative overflow-hidden">
              <img
                src={currentSlide.image}
                alt={currentSlide.title}
                loading="eager"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>

            {/* Right content area - red/maroon gradient */}
            <div className="w-1/2 sm:w-3/5 bg-gradient-to-r from-maroon via-primary-dark to-primary flex items-center">
              <div className="px-4 sm:px-8 lg:px-12 py-4">
                <motion.span
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-golden text-xs sm:text-sm font-semibold italic"
                >
                  {currentSlide.subtitle}
                </motion.span>
                <motion.h2
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-1 sm:mt-2 font-serif text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight"
                >
                  {currentSlide.title}
                </motion.h2>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mt-2 sm:mt-3 space-y-1"
                >
                  {currentSlide.highlights.map((h, i) => (
                    <p key={i} className="text-white/80 text-xs sm:text-sm font-sans">
                      {h}
                    </p>
                  ))}
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mt-3 sm:mt-5"
                >
                  <Link to={currentSlide.ctaLink}>
                    <span className="inline-block rounded-md bg-golden px-4 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-maroon hover:bg-golden-light transition-colors shadow-golden">
                      {currentSlide.cta}
                    </span>
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Slide indicators */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`h-2 rounded-full transition-all duration-500 ${
                i === activeIndex ? 'w-8 bg-golden' : 'w-2 bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
