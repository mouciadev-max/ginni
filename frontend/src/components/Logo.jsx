import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Logo({ variant = 'dark', className = '' }) {
  const isDark = variant === 'dark';
  return (
    <Link to="/" className={`inline-block ${className}`} aria-label="Ginni Ethnic Wear - Home">
      <motion.div
        initial={{ opacity: 1 }}
        whileHover={{ opacity: 0.9 }}
        transition={{ duration: 0.2 }}
        className="flex flex-col items-center"
      >
        <span className={`font-script text-3xl sm:text-4xl font-bold tracking-wide ${isDark ? 'text-white' : 'text-primary'}`}>
          Ginni
        </span>
        <span className={`text-[8px] sm:text-[9px] font-sans font-semibold tracking-[0.3em] uppercase -mt-1 ${isDark ? 'text-golden-light/80' : 'text-golden-dark'}`}>
          Ethnic Wear
        </span>
      </motion.div>
    </Link>
  );
}
