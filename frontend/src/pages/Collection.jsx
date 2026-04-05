import { useState, useMemo, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiAdjustmentsHorizontal, HiChevronDown, HiXMark } from 'react-icons/hi2';
import axios from 'axios';
import ProductGrid from '../components/ProductGrid';

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest' },
  { value: 'rating', label: 'Rating' },
];

const priceRanges = [
  { label: 'Under ₹599', min: 0, max: 599 },
  { label: '₹600 – ₹999', min: 600, max: 999 },
  { label: '₹1,000 – ₹1,999', min: 1000, max: 1999 },
  { label: '₹2,000 – ₹4,999', min: 2000, max: 4999 },
  { label: '₹5,000+', min: 5000, max: Infinity },
];

export default function Collection() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const [sort, setSort] = useState('featured');
  const [sortOpen, setSortOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [dynamicCollections, setDynamicCollections] = useState([]);

  // Filter states
  const [selectedPriceRange, setSelectedPriceRange] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [prodRes, catRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/api/products?limit=200`),
          axios.get(`${import.meta.env.VITE_API_URL}/api/categories`)
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

  const toggleCategory = (catId) => {
    setSelectedCategories(prev =>
      prev.includes(catId) ? prev.filter(id => id !== catId) : [...prev, catId]
    );
  };

  const toggleSubcategory = (subSlug) => {
    setSelectedSubcategories(prev =>
      prev.includes(subSlug) ? prev.filter(s => s !== subSlug) : [...prev, subSlug]
    );
  };

  const clearFilters = () => {
    setSelectedPriceRange(null);
    setSelectedCategories([]);
    setSelectedSubcategories([]);
  };

  const hasActiveFilters = selectedPriceRange !== null || selectedCategories.length > 0 || selectedSubcategories.length > 0;

  const filteredAndSorted = useMemo(() => {
    if (!showProductGrid) return [];

    // Helper to extract category ID string from a product
    const getCatId = (p) => {
      if (p.category?._id) return p.category._id.toString();
      if (p.category?.id) return p.category.id.toString();
      if (p.categoryId?._id) return p.categoryId._id.toString();
      if (p.categoryId?.id) return p.categoryId.id.toString();
      if (typeof p.categoryId === 'string') return p.categoryId;
      return null;
    };

    const getCatSlug = (p) => p.category?.slug || p.categoryId?.slug || null;
    const getSubSlug = (p) => p.subcategory?.slug || p.subcategoryId?.slug || null;

    let list;
    if (!slug || slug === 'all') {
      list = [...products];
    } else if (matchedCategory) {
      const catId = (matchedCategory._id || matchedCategory.id).toString();
      list = products.filter((p) => {
        return (
          getCatId(p) === catId ||
          getCatSlug(p) === slug ||
          getSubSlug(p) === slug
        );
      });
    } else {
      // Try matching by subcategory slug or category name-slug
      list = products.filter((p) =>
        getCatSlug(p) === slug ||
        getSubSlug(p) === slug ||
        p.category?.name?.toLowerCase().replace(/\s+/g, '-') === slug
      );
    }

    // Apply search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p =>
        p.name?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
      );
    }

    // Apply price filter
    if (selectedPriceRange !== null) {
      const range = priceRanges[selectedPriceRange];
      list = list.filter(p => Number(p.price) >= range.min && Number(p.price) <= range.max);
    }

    // Apply category filter (checkboxes)
    if (selectedCategories.length > 0) {
      list = list.filter(p => {
        const pCatId = getCatId(p);
        return pCatId && selectedCategories.includes(pCatId);
      });
    }

    // Apply subcategory filter (checkboxes)
    if (selectedSubcategories.length > 0) {
      list = list.filter(p => {
        const subSlug = getSubSlug(p);
        return subSlug && selectedSubcategories.includes(subSlug);
      });
    }

    // Sort
    if (sort === 'price-asc') list = [...list].sort((a, b) => Number(a.price) - Number(b.price));
    if (sort === 'price-desc') list = [...list].sort((a, b) => Number(b.price) - Number(a.price));
    if (sort === 'newest') list = [...list].reverse();
    if (sort === 'rating') list = [...list].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    return list;
  }, [slug, matchedCategory, sort, products, showProductGrid, selectedPriceRange, selectedCategories, selectedSubcategories, searchQuery]);

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
                    src={col.image || `https://source.unsplash.com/600x800/?ethnic,${col.slug},traditional`}
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
          {searchQuery ? `Results for "${searchQuery}"` : collection.name}
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
            className={`flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm transition-colors bg-white ${filterOpen ? 'border-primary text-primary' : 'border-golden/20 text-gray-700 hover:border-primary/50'}`}
          >
            <HiAdjustmentsHorizontal className="w-4 h-4" />
            Filter
            {hasActiveFilters && (
              <span className="ml-1 w-5 h-5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">
                {(selectedPriceRange !== null ? 1 : 0) + selectedCategories.length + selectedSubcategories.length}
              </span>
            )}
          </button>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="flex items-center gap-1 text-sm text-primary hover:text-primary-dark transition-colors"
            >
              <HiXMark className="w-4 h-4" />
              Clear All
            </button>
          )}
          <div className="relative ml-auto">
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

        {/* Filter Panel */}
        <AnimatePresence>
          {filterOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="mt-4 p-4 sm:p-6 bg-white rounded-xl border border-golden/20 shadow-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  
                  {/* Price Range */}
                  <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Price Range</h3>
                    <div className="space-y-2">
                      {priceRanges.map((range, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSelectedPriceRange(selectedPriceRange === idx ? null : idx)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${selectedPriceRange === idx
                            ? 'bg-primary text-white'
                            : 'bg-gray-50 text-gray-700 hover:bg-ivory hover:text-primary'
                          }`}
                        >
                          {range.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Categories */}
                  <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Categories</h3>
                    <div className="space-y-2">
                      {dynamicCollections.map((cat) => {
                        const catId = (cat._id || cat.id).toString();
                        const isChecked = selectedCategories.includes(catId);
                        return (
                          <label key={catId} className="flex items-center gap-2.5 cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleCategory(catId)}
                              className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/30"
                            />
                            <span className={`text-sm ${isChecked ? 'text-primary font-semibold' : 'text-gray-700 group-hover:text-primary'} transition-colors`}>
                              {cat.name}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Subcategories */}
                  <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Subcategories</h3>
                    <div className="space-y-2 max-h-44 overflow-y-auto">
                      {dynamicCollections.flatMap(cat => 
                        (cat.subcategories || []).map(sub => {
                          const isChecked = selectedSubcategories.includes(sub.slug);
                          return (
                            <label key={sub.slug} className="flex items-center gap-2.5 cursor-pointer group">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => toggleSubcategory(sub.slug)}
                                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/30"
                              />
                              <span className={`text-sm ${isChecked ? 'text-primary font-semibold' : 'text-gray-700 group-hover:text-primary'} transition-colors`}>
                                {sub.name}
                              </span>
                              <span className="text-[10px] text-gray-400 ml-auto">{cat.name}</span>
                            </label>
                          );
                        })
                      )}
                      {dynamicCollections.flatMap(c => c.subcategories || []).length === 0 && (
                        <p className="text-sm text-gray-400">No subcategories available</p>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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
