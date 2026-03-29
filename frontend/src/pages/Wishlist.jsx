import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Wishlist() {
  return (
    <main className="min-h-screen bg-white dark:bg-bg-dark theme-transition flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center px-4"
      >
        <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-white mb-2">
          Your wishlist is empty
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Save your favourite pieces by clicking the heart on any product.
        </p>
        <Link
          to="/collections"
          className="inline-block rounded-xl bg-primary dark:bg-primary-light px-8 py-3 text-white font-medium hover:opacity-90"
        >
          Explore Collections
        </Link>
      </motion.div>
    </main>
  );
}
