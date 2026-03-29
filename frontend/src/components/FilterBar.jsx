import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiAdjustmentsHorizontal } from 'react-icons/hi2';
import axios from 'axios';

const priceFilters = [
  { label: 'Under ₹599', max: 599 },
  { label: 'Under ₹799', max: 799 },
  { label: 'Under ₹999', max: 999 },
  { label: 'Under ₹1499', max: 1499 },
  { label: 'Under ₹1999', max: 1999 },
  { label: 'Under ₹2999', max: 2999 },
];

const defaultImages = [
  '/images/cat-silk.png',
  '/images/cat-essentials.png',
  '/images/cat-readytowear.png',
  '/images/cat-designer.png',
  '/images/hero2.png',
  '/images/hero3.png',
  '/images/hero1.png'
];

export default function FilterBar({ productCount = 0, onPriceFilter, onCategoryFilter }) {
  const [activePrice, setActivePrice] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get('/api/categories');
        if (data && data.data) {
          const mapImages = data.data.map((cat, idx) => ({
            ...cat,
            image: defaultImages[idx % defaultImages.length]
          }));
          setCategories(mapImages);
        }
      } catch (err) {
        console.error('Failed to load dynamic categories:', err);
      }
    };
    fetchCategories();
  }, []);

  const handlePriceClick = (filter) => {
    const next = activePrice === filter.max ? null : filter.max;
    setActivePrice(next);
    onPriceFilter?.(next);
  };

  const handleCategoryClick = (slug) => {
    const next = activeCategory === slug ? null : slug;
    setActiveCategory(next);
    onCategoryFilter?.(next);
  };

  return (
    <div className="bg-white">
      {/* Filter and Sort Button - Red/Primary */}
      <button className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-white font-sans text-sm font-semibold tracking-wider hover:bg-primary-dark transition-colors">
        <HiAdjustmentsHorizontal className="w-5 h-5" />
        FILTER AND SORT
      </button>

      {/* Price Filter Pills */}
      <div className="border-b border-golden/10">
        <div className="flex gap-2 px-3 py-3 overflow-x-auto hide-scrollbar">
          {priceFilters.map((filter) => (
            <motion.button
              key={filter.max}
              type="button"
              onClick={() => handlePriceClick(filter)}
              className={`flex-shrink-0 px-4 py-2 rounded-full border text-xs sm:text-sm font-medium transition-all ${
                activePrice === filter.max
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-primary/30 hover:text-primary'
              }`}
              whileTap={{ scale: 0.95 }}
            >
              {filter.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Category Circular Thumbnails */}
      <div className="border-b border-golden/10">
        <div
          ref={scrollRef}
          className="flex gap-4 px-3 py-4 overflow-x-auto hide-scrollbar"
        >
          {categories.map((cat) => (
            <motion.button
              key={cat.slug}
              type="button"
              onClick={() => handleCategoryClick(cat.slug)}
              className="flex flex-col items-center gap-1.5 flex-shrink-0 min-w-[64px]"
              whileTap={{ scale: 0.95 }}
            >
              <div
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 transition-colors ${
                  activeCategory === cat.slug
                    ? 'border-primary shadow-red'
                    : 'border-golden/30 hover:border-primary/40'
                }`}
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <span className={`text-[10px] sm:text-xs font-medium text-center leading-tight whitespace-pre-line ${
                activeCategory === cat.slug ? 'text-primary font-semibold' : 'text-gray-600'
              }`}>
                {cat.name}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Product Count */}
      <div className="px-4 pt-3 pb-2">
        <p className="text-sm text-gray-500 font-sans">
          <span className="font-semibold text-gray-800">{productCount}</span> products
        </p>
      </div>
    </div>
  );
}
