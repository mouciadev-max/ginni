import { motion } from 'framer-motion';
import { HiMoon, HiSun } from 'react-icons/hi2';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <motion.button
      type="button"
      onClick={toggleTheme}
      className="relative p-2 rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-primary-light hover:border-primary/30 dark:hover:border-primary-light/50 transition-colors"
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.05 }}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <motion.span
        initial={false}
        animate={{ rotate: isDark ? 0 : 180, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="block"
      >
        {isDark ? (
          <HiMoon className="w-5 h-5 text-primary-light" />
        ) : (
          <HiSun className="w-5 h-5 text-primary" />
        )}
      </motion.span>
    </motion.button>
  );
}
