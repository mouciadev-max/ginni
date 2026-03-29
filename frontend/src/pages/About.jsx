import { motion } from 'framer-motion';
import { HiSparkles, HiHeart, HiGlobeAlt } from 'react-icons/hi2';

const values = [
  {
    icon: HiSparkles,
    title: 'Craftsmanship',
    text: 'Every piece is chosen for its quality, craftsmanship, and timeless appeal. We work with skilled artisans to bring you the finest ethnic wear for women and girls.',
  },
  {
    icon: HiHeart,
    title: 'For The Queen Within You',
    text: 'Our tagline is our promise. We believe every woman deserves to feel regal, confident, and beautiful in what she wears.',
  },
  {
    icon: HiGlobeAlt,
    title: 'Heritage & Modern',
    text: 'We blend traditional craftsmanship with contemporary design, so you get pieces that honour heritage while fitting your modern life.',
  },
];

export default function About() {
  return (
    <main className="min-h-screen bg-white dark:bg-bg-dark theme-transition">
      <section className="relative py-20 sm:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/20 dark:from-primary/10 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-serif text-4xl sm:text-5xl font-semibold text-gray-900 dark:text-white text-center mb-6"
          >
            About Ginni Ethnic Wear
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-2xl mx-auto text-center text-lg text-gray-600 dark:text-gray-400 leading-relaxed"
          >
            We are a premium ethnic fashion brand dedicated to bringing you the finest ethnic wear for women and girls—sarees, lehengas, kurtis, and more for every occasion.
            Every piece is curated with care so that you can step out feeling like the queen you are.
          </motion.p>
        </div>
      </section>

      <section className="py-16 sm:py-24 border-t border-gray-200 dark:border-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-white text-center mb-12"
          >
            Our Values
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {values.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl bg-gray-50 dark:bg-gray-900/50 p-8 border border-gray-200 dark:border-gray-800 text-center"
              >
                <div className="inline-flex p-4 rounded-2xl bg-primary/10 dark:bg-primary-light/10 text-primary dark:text-primary-light mb-4">
                  <item.icon className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-xl font-semibold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 bg-gray-50 dark:bg-gray-900/30">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-serif text-2xl sm:text-3xl text-gray-800 dark:text-gray-200 italic"
          >
            "Elegance is when the inside is as beautiful as the outside."
          </motion.p>
          <p className="mt-6 text-primary dark:text-primary-light font-medium">— Ginni Ethnic Wear</p>
        </div>
      </section>
    </main>
  );
}
