import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiStar, HiOutlineArrowUturnLeft, HiOutlineSparkles, HiOutlineCheckBadge, HiOutlineTruck } from 'react-icons/hi2';
import axios from 'axios';
import Hero from '../components/Hero';
import ProductGrid from '../components/ProductGrid';
import FilterBar from '../components/FilterBar';

const trustBadges = [
  { icon: HiOutlineArrowUturnLeft, title: 'Easy Returns' },
  { icon: HiOutlineSparkles, title: '3,000+ Styles' },
  { icon: HiOutlineCheckBadge, title: 'Genuine Quality' },
  { icon: HiOutlineTruck, title: 'Free Shipping' },
];

export default function Home() {
  const [priceMax, setPriceMax] = useState(null);
  const [categorySlug, setCategorySlug] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('${import.meta.env.VITE_API_URL}/api/products?limit=50');
        if (data.success) {
          setProducts(data.data.products);
        }
      } catch (error) {
        console.error('Failed to fetch products', error);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let list = [...products];
    if (priceMax) {
      list = list.filter(p => p.price <= priceMax);
    }
    if (categorySlug) {
      list = list.filter(p =>
        p.category?.slug === categorySlug ||
        p.category?.name?.toLowerCase().includes(categorySlug.toLowerCase()) ||
        p.subcategory?.slug === categorySlug ||
        p.subcategory?.name?.toLowerCase().includes(categorySlug.toLowerCase()) ||
        p.name.toLowerCase().includes(categorySlug.toLowerCase()) ||
        p.tags?.includes(categorySlug)
      );
    }
    return list;
  }, [priceMax, categorySlug, products]);

  const reviews = [
    { text: 'The Banarasi silk suit I ordered exceeded my expectations. The quality is exceptional and the packaging was so elegant!', name: 'Priya Sharma', location: 'Mumbai', rating: 5, avatar: '👩🏻' },
    { text: 'Ginni Ethnic Wear has become my go-to for every occasion. Their lehengas are stunning and incredibly affordable!', name: 'Ananya Reddy', location: 'Hyderabad', rating: 5, avatar: '👩🏽' },
    { text: 'From weddings to festivals, I find everything here. The silk quality and intricate zardosi work is magnificent.', name: 'Kavya Mehta', location: 'Ahmedabad', rating: 5, avatar: '👩🏻' },
    { text: 'The ready-to-wear Anarkali looks absolutely gorgeous. My friends keep asking where I got it from!', name: 'Sneha Patel', location: 'Surat', rating: 5, avatar: '👩🏽' },
  ];

  return (
    <main>
      <Hero />

      {/* FilterBar */}
      <FilterBar
        productCount={filteredProducts.length}
        onPriceFilter={setPriceMax}
        onCategoryFilter={setCategorySlug}
      />

      {/* Trust Badges Strip (Running Left to Right Marquee) */}
      <section className="py-3 border-b border-golden/20 bg-ivory overflow-hidden flex items-center">
        <div className="flex whitespace-nowrap animate-marquee w-max">
          {[...trustBadges, ...trustBadges, ...trustBadges, ...trustBadges, ...trustBadges].map((badge, i) => (
            <div key={i} className="flex items-center gap-2.5 px-6 sm:px-12">
              <badge.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" strokeWidth={1.5} />
              <span className="text-xs sm:text-sm font-semibold text-primary uppercase tracking-wider">{badge.title}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Main Items Section (Product Grid) */}
      <section className="py-8 bg-ginni-bg">
        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
          <ProductGrid products={filteredProducts} />
        </div>
      </section>

      {/* Top Categories (Square Cards from Sudathi reference) */}
      <section className="py-12 bg-white border-t border-golden/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center font-sans text-xl sm:text-2xl font-bold text-gray-900 mb-8 uppercase tracking-widest section-title">
            TOP CATEGORIES
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:gap-6 max-w-3xl mx-auto">
            {/* Kurta Card */}
            <Link to="/collections/kurtis" className="group rounded-xl overflow-hidden border-2 border-golden/20 shadow-sm hover:border-primary transition-all flex flex-col bg-white">
              <div className="aspect-square bg-white relative p-1">
                <img src="/images/hero2.png" alt="Kurta Sets" className="w-full h-full object-cover rounded-lg group-hover:scale-[1.03] transition-transform duration-500" />
              </div>
              <div className="bg-ivory py-3 text-center border-t border-golden/10">
                <span className="font-bold text-sm sm:text-lg text-primary group-hover:text-primary-dark transition-colors uppercase tracking-wide">
                  KURTAS & SETS
                </span>
              </div>
            </Link>

            {/* Lehengas Card */}
            <Link to="/collections/lehengas" className="group rounded-xl overflow-hidden border-2 border-golden/20 shadow-sm hover:border-primary transition-all flex flex-col bg-white">
              <div className="aspect-square bg-gray-900 relative p-1 rounded-t-xl">
                <img src="/images/hero1.png" alt="Festive Lehengas" className="w-full h-full object-cover rounded-lg opacity-60 group-hover:opacity-50 group-hover:scale-[1.03] transition-all duration-500" />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="font-serif text-3xl sm:text-5xl text-white text-center leading-tight drop-shadow-md">
                    Festive<br />
                    <span className="italic">Lehengas</span>
                  </span>
                </div>
              </div>
              <div className="bg-ivory py-3 text-center border-t border-golden/10">
                <span className="font-bold text-sm sm:text-lg text-primary group-hover:text-primary-dark transition-colors uppercase tracking-wide">
                  FESTIVE LEHENGAS
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Bestsellers Section (from Sudathi reference) */}
      <section className="py-12 bg-ginni-bg border-t border-golden/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center font-sans text-xl sm:text-2xl font-bold text-gray-900 mb-8 uppercase tracking-widest section-title">
            BESTSELLERS
          </h2>

          {/* Bestsellers Banner */}
          <Link to="/collections/festive" className="block relative rounded-2xl overflow-hidden mb-8 group bg-gray-900 shadow-md h-[200px] sm:h-[300px]">
            <img src="/images/hero3.png" alt="Festive Collection" className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:scale-[1.02] transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-r from-maroon/90 via-primary-dark/60 to-transparent flex items-center">
              <div className="px-6 sm:px-12 max-w-md">
                <h3 className="font-serif text-4xl sm:text-6xl text-golden-light mb-2">Festive Wear</h3>
                <p className="font-sans text-white font-medium text-sm sm:text-xl mb-4 sm:mb-6">Styles from ₹599/-</p>
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-block bg-primary text-white text-xs sm:text-sm font-bold px-6 py-2 sm:py-2.5 rounded-full shadow-red hover:bg-primary-dark transition-colors"
                >
                  SHOP NOW
                </motion.span>
              </div>
            </div>
          </Link>

          {/* Grid showing only top 4 bestsellers */}
          <ProductGrid products={filteredProducts.slice(0, 4)} />

          <div className="mt-8 text-center">
            <Link to="/collections">
              <span className="inline-block border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-3 rounded-full font-bold text-sm transition-colors uppercase tracking-wider">
                View All Bestsellers
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="py-12 sm:py-16 bg-white border-t border-golden/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 section-title">
              Words From Our Customers
            </h2>
            <p className="mt-4 text-gray-500 font-sans text-sm">Join thousands of happy queens who trust Ginni Ethnic Wear</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {reviews.map((review, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-xl bg-ivory p-5 sm:p-6 border border-golden/20 hover:shadow-card-hover transition-shadow duration-500"
              >
                <div className="flex items-center gap-0.5 text-golden mb-3">
                  {[...Array(review.rating)].map((_, j) => (
                    <HiStar key={j} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 font-sans text-sm leading-relaxed">
                  "{review.text}"
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <span className="text-2xl">{review.avatar}</span>
                  <div>
                    <p className="font-sans font-semibold text-sm text-gray-900">{review.name}</p>
                    <p className="text-xs text-gray-400">{review.location}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}
