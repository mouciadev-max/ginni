import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const titles = {
  '/shipping': 'Shipping & Returns',
  '/size-guide': 'Size Guide',
  '/privacy': 'Privacy Policy',
  '/terms': 'Terms of Service',
};

export default function Policy() {
  const location = useLocation();
  const title = titles[location.pathname] || 'Policy';

  return (
    <main className="min-h-screen bg-white dark:bg-bg-dark theme-transition">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-16 sm:py-24">
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-serif text-3xl font-semibold text-gray-900 dark:text-white mb-8"
        >
          {title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-gray-600 dark:text-gray-400 leading-relaxed"
        >
          This is a placeholder. Content will be added when you integrate with your backend or CMS.
        </motion.p>
        <Link
          to="/"
          className="inline-block mt-8 text-primary dark:text-primary-light hover:underline"
        >
          ← Back to Home
        </Link>
      </div>
    </main>
  );
}
