import { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiAdjustmentsHorizontal, HiChevronDown } from 'react-icons/hi2';
import axios from 'axios';
import ProductGrid from '../components/ProductGrid';

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest' },
  { value: 'rating', label: 'Rating' },
];

export default function Collection() {
  const { slug } = useParams();
  const [sort, setSort] = useState('featured');
  const [sortOpen, setSortOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [dynamicCollections, setDynamicCollections] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [prodRes, catRes] = await Promise.all([
          axios.get('${import.meta.env.VITE_API_URL}/api/products?limit=200'),
          axios.get('${import.meta.env.VITE_API_URL}/api/categories')
        ]);
        if (prodRes.data?.success) setProducts(prodRes.data.data.products);
        if (catRes.data?.success) setDynamicCollections(catRes.data.data);
      } catch (error) {
        console.error('Failed to fetch data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  const fallbackName = slug === 'all' ? 'All Collections' : (slug ? slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' ') : 'Collections');
  const matchedCategory = dynamicCollections.find((c) => c.slug === slug);
  const collection = matchedCategory || { name: fallbackName, slug: slug || 'all' };
  const showProductGrid = !!slug;

  const filteredAndSorted = useMemo(() => {
    if (!showProductGrid) return [];

    let list;
    if (!slug || slug === 'all') {
      // All Collections — show everything
      list = products;
    } else if (matchedCategory) {
      // Match by category ID (most reliable since products store categoryId)
      const catId = matchedCategory._id || matchedCategory.id;
      list = products.filter((p) => {
        const pCatId = p.categoryId?._id || p.categoryId?.id || p.categoryId;
        const pCat = p.category;
        return (
          (pCatId && pCatId.toString() === catId.toString()) ||
          (pCat?.name && pCat.name.toLowerCase() === matchedCategory.name.toLowerCase()) ||
          (pCat?.slug && pCat.slug === slug)
        );
      });
    } else {
      // Fallback: try by name/slug match
      list = products.filter((p) =>
        p.category?.slug === slug ||
        p.category?.name?.toLowerCase().replace(/\s+/g, '-') === slug
      );
    }

    if (sort === 'price-asc') list = [...list].sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') list = [...list].sort((a, b) => b.price - a.price);
    if (sort === 'newest') list = [...list].reverse();
    if (sort === 'rating') list = [...list].sort((a, b) => b.rating - a.rating);
    return list;
  }, [slug, matchedCategory, sort, products, showProductGrid]);

  if (!showProductGrid) {
    return (
      <main className="min-h-screen bg-ginni-bg">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-serif text-3xl sm:text-4xl font-semibold text-gray-900 text-center mb-12"
          >
            Collections
          </motion.h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Link to="/collections/all" className="group block rounded-xl overflow-hidden bg-gray-100 aspect-[4/5] relative">
                <img src="https://images.unsplash.com/photo-1594633312681-4250c5e2d0f6?w=600" alt="All Ethnic Wear" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-maroon/70 via-primary-dark/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                  <h3 className="font-serif text-xl font-semibold text-white">Shop All Items</h3>
                  <span className="inline-block mt-2 text-sm text-golden font-medium">Shop now →</span>
                </div>
              </Link>
            </motion.div>
            {dynamicCollections.map((col, i) => (
              <motion.div
                key={col._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (i + 1) * 0.08 }}
              >
                <Link
                  to={`/collections/${col.slug}`}
                  className="group block rounded-xl overflow-hidden bg-gray-100 aspect-[4/5] relative"
                >
                  <img
                    src={`https://source.unsplash.com/600x800/?ethnic,${col.slug},traditional`}
                    alt={col.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-maroon/70 via-primary-dark/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                    <h3 className="font-serif text-xl font-semibold text-white">{col.name}</h3>
                    <span className="inline-block mt-2 text-sm text-golden font-medium">Shop now →</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-ginni-bg">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-6 sm:py-10">
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-serif text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-900 mb-1"
        >
          {collection.name}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-gray-500 text-sm"
        >
          {filteredAndSorted.length} products
        </motion.p>

        {/* Filters & Sort */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mt-6 flex flex-wrap items-center gap-3"
        >
          <button
            type="button"
            onClick={() => setFilterOpen((o) => !o)}
            className="flex items-center gap-2 rounded-lg border border-golden/20 px-4 py-2.5 text-sm text-gray-700 hover:border-primary/50 transition-colors bg-white"
          >
            <HiAdjustmentsHorizontal className="w-4 h-4" />
            Filter
          </button>
          <div className="relative">
            <button
              type="button"
              onClick={() => setSortOpen((o) => !o)}
              className="flex items-center gap-2 rounded-lg border border-golden/20 px-4 py-2.5 text-sm text-gray-700 hover:border-primary/50 transition-colors bg-white"
            >
              Sort by: {sortOptions.find((o) => o.value === sort)?.label}
              <HiChevronDown className={`w-4 h-4 transition-transform ${sortOpen ? 'rotate-180' : ''}`} />
            </button>
            {sortOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setSortOpen(false)} aria-hidden />
                <div className="absolute right-0 top-full z-20 mt-1 w-56 rounded-xl border border-golden/10 bg-white shadow-lg py-1">
                  {sortOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        setSort(opt.value);
                        setSortOpen(false);
                      }}
                      className={`block w-full text-left px-4 py-2 text-sm ${sort === opt.value ? 'text-primary font-medium' : 'text-gray-700 hover:text-primary'}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-6"
        >
          <ProductGrid products={filteredAndSorted} loading={loading} />
        </motion.div>
      </div>
    </main>
  );
}
