import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMagnifyingGlass, HiHeart, HiShoppingBag, HiBars3, HiXMark, HiUser, HiArrowRightOnRectangle } from 'react-icons/hi2';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import Logo from './Logo';

export default function Navbar() {
  const [navLinks, setNavLinks] = useState([
    { to: '/', label: 'Home' },
    { to: '/collections', label: 'Collections' }
  ]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredMenu, setHoveredMenu] = useState(null);
  const [searchResults, setSearchResults] = useState({ products: [], categories: [], subcategories: [] });
  const [searchLoading, setSearchLoading] = useState(false);
  const [allCategories, setAllCategories] = useState([]);
  const searchTimerRef = useRef(null);
  const searchRef = useRef(null);
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/categories`);
        if (data && data.success) {
          setAllCategories(data.data || []);
          const STATIC_SLUGS = ['sarees', 'lehengas', 'unstitched-suits-suits', 'girls-ethnic-wear', 'wedding-collection', 'festive-collection'];
          const STATIC_NAMES = ['Sarees', 'Lehengas', 'Unstitched Suits & Suits', 'Girls\' Ethnic Wear', 'Wedding Collection', 'Festive Collection'];
          
          const dynamicLinks = STATIC_SLUGS.map((slug, idx) => {
            const cat = data.data.find(c => c.slug === slug);
            return {
              to: `/collections/${slug}`,
              label: STATIC_NAMES[idx],
              submenu: cat?.subcategories?.length > 0 ? cat.subcategories.map(sub => ({
                to: `/collections/${sub.slug}`,
                label: sub.name
              })) : null
            };
          });

          const visibleCategories = dynamicLinks.slice(0, 3);
          const remainingCategories = dynamicLinks.slice(3);

          const moreLink = {
            to: '#', // Prevents active styling
            label: 'More',
            submenu: remainingCategories.map(cat => ({
              to: cat.to,
              label: cat.label
            }))
          };

          setNavLinks([
            { to: '/', label: 'Home' },
            ...visibleCategories,
            moreLink,
            { to: '/collections/all', label: 'All Collections' }
          ]);
        }
      } catch (error) {
        console.error("Failed to load navbar categories", error);
      }
    };
    fetchCategories();
  }, []);

  // Debounced search
  const performSearch = useCallback(async (query) => {
    if (!query || query.trim().length < 2) {
      setSearchResults({ products: [], categories: [], subcategories: [] });
      setSearchLoading(false);
      return;
    }

    setSearchLoading(true);
    const q = query.trim().toLowerCase();

    try {
      // Search products from API
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/products?search=${encodeURIComponent(q)}&limit=6`);
      const products = data.success ? (data.data.products || []) : [];

      // Search categories locally
      const cats = allCategories.filter(c => c.name.toLowerCase().includes(q));
      
      // Search subcategories locally
      const subs = [];
      allCategories.forEach(c => {
        (c.subcategories || []).forEach(sc => {
          if (sc.name.toLowerCase().includes(q)) {
            subs.push({ ...sc, parentName: c.name, parentSlug: c.slug });
          }
        });
      });

      setSearchResults({ products, categories: cats.slice(0, 4), subcategories: subs.slice(0, 4) });
    } catch (err) {
      console.error('Search failed', err);
      setSearchResults({ products: [], categories: [], subcategories: [] });
    } finally {
      setSearchLoading(false);
    }
  }, [allCategories]);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => performSearch(val), 350);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/collections/all?search=${encodeURIComponent(searchQuery.trim())}`);
      closeSearch();
    }
  };

  const closeSearch = () => {
    setSearchOpen(false);
    setSearchQuery('');
    setSearchResults({ products: [], categories: [], subcategories: [] });
  };

  const hasResults = searchResults.products.length > 0 || searchResults.categories.length > 0 || searchResults.subcategories.length > 0;

  const closeMobile = () => setMobileMenuOpen(false);

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="sticky top-0 z-40 w-full bg-white border-b border-golden/20 shadow-sm"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 sm:h-16 items-center justify-between gap-4">
            {/* Mobile: hamburger left */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((o) => !o)}
              className="lg:hidden p-2 rounded-full text-gray-700 hover:text-primary hover:bg-ivory transition-colors"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <HiXMark className="w-6 h-6" /> : <HiBars3 className="w-6 h-6" />}
            </button>

            {/* Logo - centered on mobile, left on desktop */}
            <div className="flex-1 flex justify-center lg:justify-start lg:flex-none">
              <Logo variant="light" />
            </div>

            {/* Center nav - desktop */}
            <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center" aria-label="Main">
              {navLinks.map(({ to, label, submenu, highlight }) => (
                <div
                  key={to}
                  className="relative"
                  onMouseEnter={() => submenu && setHoveredMenu(label)}
                  onMouseLeave={() => setHoveredMenu(null)}
                >
                  <NavLink
                    to={to}
                    className={({ isActive }) =>
                      `px-3 py-2 font-sans text-sm font-medium rounded-lg transition-all duration-200 ${highlight
                        ? 'text-primary font-semibold hover:bg-primary/5'
                        : isActive
                          ? 'text-primary bg-primary/5'
                          : 'text-gray-700 hover:text-primary hover:bg-ivory'
                      }`
                    }
                  >
                    {label}
                  </NavLink>
                  {/* Dropdown */}
                  <AnimatePresence>
                    {submenu && hoveredMenu === label && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 mt-1 w-56 bg-white rounded-xl shadow-lg border border-golden/10 py-2 z-50"
                      >
                        {submenu.map((item) => (
                          <Link
                            key={item.to}
                            to={item.to}
                            className="block px-4 py-2.5 text-sm text-gray-700 hover:text-primary hover:bg-ivory transition-colors"
                          >
                            {item.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              <motion.button
                type="button"
                onClick={() => setSearchOpen((o) => !o)}
                className="p-2.5 rounded-full text-gray-600 hover:text-primary hover:bg-ivory transition-colors"
                whileTap={{ scale: 0.95 }}
                aria-label="Search"
              >
                <HiMagnifyingGlass className="w-5 h-5" />
              </motion.button>
              <Link
                to="/wishlist"
                className="relative p-2.5 rounded-full text-gray-600 hover:text-primary hover:bg-ivory transition-colors hidden sm:flex"
                aria-label="Wishlist"
              >
                <HiHeart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                    {wishlistCount > 9 ? '9+' : wishlistCount}
                  </span>
                )}
              </Link>
              {user ? (
                <div className="relative group hidden sm:flex">
                  <Link to="/profile" className="text-gray-600 hover:text-primary transition-colors cursor-pointer p-2" aria-label="Account">
                    <HiUser className="w-6 h-6" />
                    <span className="absolute -top-1 right-1 w-2 h-2 bg-primary rounded-full scale-0 group-hover:scale-100 transition-transform hidden sm:block"></span>
                  </Link>
                  <div className="absolute top-full right-0 mt-1 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200">
                    <div className="bg-white rounded shadow border border-gray-100 py-1 overflow-hidden min-w-[120px]">
                      {user.role === 'ADMIN' && (
                        <Link to="/admin" className="px-4 py-2 hover:bg-ivory text-gray-700 text-sm flex items-center gap-2 w-full text-left border-b border-gray-100">
                          Admin Panel
                        </Link>
                      )}
                      <button onClick={logout} className="px-4 py-2 hover:bg-ivory text-red-600 text-sm flex items-center gap-2 w-full text-left">
                        <HiArrowRightOnRectangle className="w-4 h-4" /> Logout
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link to="/login" className="text-gray-600 hover:text-primary transition-colors cursor-pointer group p-2 hidden sm:flex" aria-label="Login">
                  <HiUser className="w-6 h-6" />
                </Link>
              )}
              <Link
                to="/cart"
                className="relative p-2.5 rounded-full text-gray-600 hover:text-primary hover:bg-ivory transition-colors"
                aria-label={`Cart, ${cartCount} items`}
              >
                <HiShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>

        {/* Search bar expand */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-visible border-t border-golden/10 bg-ivory"
              ref={searchRef}
            >
              <div className="mx-auto max-w-2xl px-4 py-3 relative">
                <form onSubmit={handleSearchSubmit}>
                  <input
                    type="search"
                    placeholder="Search products, categories, subcategories..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="w-full rounded-xl border border-golden/30 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-golden focus:ring-2 focus:ring-golden/20 outline-none transition font-sans text-sm"
                    autoFocus
                  />
                </form>

                {/* Search Results Dropdown */}
                {searchQuery.trim().length >= 2 && (
                  <div className="absolute left-0 right-0 top-full mt-1 mx-4 bg-white rounded-xl shadow-2xl border border-golden/20 z-50 max-h-[400px] overflow-y-auto">
                    {searchLoading && (
                      <div className="p-4 text-center text-gray-400 text-sm">Searching...</div>
                    )}

                    {!searchLoading && !hasResults && (
                      <div className="p-4 text-center text-gray-400 text-sm">No results found for "{searchQuery}"</div>
                    )}

                    {!searchLoading && hasResults && (
                      <>
                        {/* Categories */}
                        {searchResults.categories.length > 0 && (
                          <div className="border-b border-gray-100">
                            <p className="px-4 pt-3 pb-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Categories</p>
                            {searchResults.categories.map(c => (
                              <Link
                                key={c.slug}
                                to={`/collections/${c.slug}`}
                                onClick={closeSearch}
                                className="flex items-center gap-3 px-4 py-2.5 hover:bg-ivory transition-colors"
                              >
                                {c.image ? (
                                  <img src={c.image} alt={c.name} className="w-8 h-8 rounded-full object-cover border border-golden/20" />
                                ) : (
                                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">{c.name.charAt(0)}</div>
                                )}
                                <span className="text-sm font-medium text-gray-800">{c.name}</span>
                              </Link>
                            ))}
                          </div>
                        )}

                        {/* Subcategories */}
                        {searchResults.subcategories.length > 0 && (
                          <div className="border-b border-gray-100">
                            <p className="px-4 pt-3 pb-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Subcategories</p>
                            {searchResults.subcategories.map(sc => (
                              <Link
                                key={sc.slug}
                                to={`/collections/${sc.slug}`}
                                onClick={closeSearch}
                                className="flex items-center gap-3 px-4 py-2.5 hover:bg-ivory transition-colors"
                              >
                                {sc.image ? (
                                  <img src={sc.image} alt={sc.name} className="w-8 h-8 rounded-full object-cover border border-golden/20" />
                                ) : (
                                  <div className="w-8 h-8 rounded-full bg-golden/10 flex items-center justify-center text-golden text-xs font-bold">{sc.name.charAt(0)}</div>
                                )}
                                <div>
                                  <span className="text-sm font-medium text-gray-800 block">{sc.name}</span>
                                  <span className="text-[10px] text-gray-400">in {sc.parentName}</span>
                                </div>
                              </Link>
                            ))}
                          </div>
                        )}

                        {/* Products */}
                        {searchResults.products.length > 0 && (
                          <div>
                            <p className="px-4 pt-3 pb-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Products</p>
                            {searchResults.products.map(p => (
                              <Link
                                key={p.id}
                                to={`/product/${p.id}`}
                                onClick={closeSearch}
                                className="flex items-center gap-3 px-4 py-2.5 hover:bg-ivory transition-colors"
                              >
                                <img
                                  src={p.images?.[0] || '/images/hero1.png'}
                                  alt={p.name}
                                  className="w-10 h-12 object-cover rounded-lg border border-gray-100"
                                />
                                <div className="flex-1 min-w-0">
                                  <span className="text-sm font-medium text-gray-800 truncate block">{p.name}</span>
                                  <span className="text-xs text-primary font-semibold">₹{p.price}</span>
                                </div>
                              </Link>
                            ))}
                          </div>
                        )}

                        {/* View All Link */}
                        <Link
                          to={`/collections/all?search=${encodeURIComponent(searchQuery.trim())}`}
                          onClick={closeSearch}
                          className="block text-center py-3 text-primary text-sm font-semibold hover:bg-ivory transition-colors border-t border-gray-100"
                        >
                          View all results →
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-30 bg-black/40 lg:hidden"
              onClick={closeMobile}
              aria-hidden
            />
            <motion.nav
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed left-0 top-0 z-40 h-full w-80 max-w-[85vw] bg-white border-r border-golden/20 lg:hidden overflow-y-auto"
              aria-label="Mobile menu"
            >
              <div className="p-6 pt-6">
                <div className="flex items-center justify-between mb-8">
                  <Logo variant="light" />
                  <button onClick={closeMobile} className="p-2 rounded-full hover:bg-ivory">
                    <HiXMark className="w-6 h-6 text-gray-600" />
                  </button>
                </div>
                <div className="mb-6 flex flex-col gap-2">
                  {user ? (
                    <>
                      <Link
                        to="/profile"
                        className="flex items-center gap-4 text-gray-700 hover:text-primary transition-colors text-lg font-sans py-2"
                        onClick={closeMobile}
                      >
                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center border border-golden/50 shadow-md">
                          <HiUser className="w-5 h-5 text-golden" />
                        </div>
                        <span className="tracking-wide">My Account</span>
                      </Link>
                      {user.role === 'ADMIN' && (
                        <Link
                          to="/admin"
                          className="flex items-center gap-4 text-gray-700 hover:text-primary transition-colors text-lg font-sans py-2"
                          onClick={closeMobile}
                        >
                          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
                            <span className="font-bold text-gray-600">A</span>
                          </div>
                          <span className="tracking-wide">Admin Panel</span>
                        </Link>
                      )}
                      <button
                        onClick={() => { logout(); closeMobile(); }}
                        className="flex items-center gap-4 text-gray-700 hover:text-primary transition-colors text-lg font-sans py-2 text-left"
                      >
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                          <HiArrowRightOnRectangle className="w-5 h-5 text-gray-500" />
                        </div>
                        <span className="tracking-wide">Logout</span>
                      </button>
                    </>
                  ) : (
                    <Link
                      to="/login"
                      className="flex items-center gap-4 text-gray-700 hover:text-primary transition-colors text-lg font-sans py-2"
                      onClick={closeMobile}
                    >
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200 shadow-sm">
                        <HiUser className="w-5 h-5 text-gray-500" />
                      </div>
                      <span className="tracking-wide">Login / Signup</span>
                    </Link>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  {navLinks.map(({ to, label, submenu, highlight }) => (
                    <div key={to}>
                      <NavLink
                        to={to}
                        onClick={closeMobile}
                        className={({ isActive }) =>
                          `block py-3 px-3 rounded-lg font-sans text-base font-medium transition-colors ${highlight
                            ? 'text-primary font-semibold'
                            : isActive
                              ? 'text-primary bg-primary/5'
                              : 'text-gray-700 hover:text-primary hover:bg-ivory'
                          }`
                        }
                      >
                        {label}
                      </NavLink>
                      {submenu && (
                        <div className="ml-4 border-l-2 border-golden/20 pl-3">
                          {submenu.map((item) => (
                            <Link
                              key={item.to}
                              to={item.to}
                              onClick={closeMobile}
                              className="block py-2 text-sm text-gray-500 hover:text-primary transition-colors"
                            >
                              {item.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-8 pt-6 border-t border-golden/10">
                  <div className="flex gap-3">
                    <Link to="/wishlist" onClick={closeMobile} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-ivory text-gray-700 hover:text-primary transition-colors text-sm font-medium">
                      <HiHeart className="w-5 h-5" />
                      Wishlist
                    </Link>
                    <Link to="/cart" onClick={closeMobile} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-white text-sm font-medium">
                      <HiShoppingBag className="w-5 h-5" />
                      Cart ({cartCount})
                    </Link>
                  </div>
                </div>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
