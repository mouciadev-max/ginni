import { motion } from 'framer-motion';

export default function Loader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 dark:bg-bg-dark/90 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex flex-col items-center gap-4"
      >
        <motion.div
          className="w-12 h-12 rounded-full border-2 border-primary/30 border-t-primary dark:border-t-primary-light"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
        <p className="font-serif text-sm text-gray-600 dark:text-gray-400">Loading...</p>
      </motion.div>
    </div>
  );
}
