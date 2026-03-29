import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const categories = [
  {
    name: 'Designer Sarees',
    slug: 'designer',
    image: '/images/cat-designer.png',
    description: 'Exclusive Gold Collection',
  },
  {
    name: 'Silk Saree Sale',
    slug: 'silk',
    image: '/images/cat-silk.png',
    description: 'Starting at ₹599',
  },
  {
    name: 'Essentials',
    slug: 'essentials',
    image: '/images/cat-essentials.png',
    description: 'Blouses & Shapewear',
  },
  {
    name: 'Ready To Wear',
    slug: 'ready-to-wear',
    image: '/images/cat-readytowear.png',
    description: 'Pre-Draped Sarees',
  },
];

export default function CategoryCards() {
  return (
    <section className="py-12 sm:py-16 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 section-title">
            The Saree Store
          </h2>
          <p className="mt-4 text-gray-500 font-sans text-sm max-w-md mx-auto">
            Explore our curated categories for every occasion and style
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                to={`/collections/${cat.slug}`}
                className="group block rounded-xl overflow-hidden relative aspect-[3/4] bg-gray-100"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                {/* Overlay - maroon/red gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-maroon/80 via-primary-dark/20 to-transparent" />
                {/* Border glow on hover */}
                <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-golden/60 transition-all duration-500" />
                {/* Text */}
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                  <p className="text-golden-light text-[10px] sm:text-xs font-sans font-medium tracking-wider uppercase mb-1">
                    {cat.description}
                  </p>
                  <h3 className="font-serif text-base sm:text-lg font-bold text-white">
                    {cat.name}
                  </h3>
                  <span className="inline-flex items-center gap-1 mt-1.5 text-xs sm:text-sm text-white/80 group-hover:text-golden-light transition-colors font-sans">
                    Shop now
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m9 18 6-6-6-6"/>
                    </svg>
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
