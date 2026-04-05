import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiHeart, HiShoppingCart, HiXMark } from 'react-icons/hi2';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

function formatPrice(price) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);
}

export default function Wishlist() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (wishlist.length === 0) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center px-4"
        >
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <HiHeart className="w-10 h-10 text-primary" />
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-gray-900 mb-2">
            Your wishlist is empty
          </h1>
          <p className="text-gray-600 mb-8">
            Save your favourite pieces by clicking the heart on any product.
          </p>
          <Link
            to="/collections"
            className="inline-block rounded-xl bg-primary px-8 py-3 text-white font-medium hover:bg-primary-dark transition-colors"
          >
            Explore Collections
          </Link>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-ginni-bg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-900">
            My Wishlist
          </h1>
          <p className="text-gray-500 text-sm mt-1">{wishlist.length} item{wishlist.length !== 1 ? 's' : ''} saved</p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {wishlist.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group relative rounded-xl bg-white overflow-hidden shadow-card hover:shadow-card-hover transition-shadow"
            >
              {/* Remove Button */}
              <button
                onClick={() => removeFromWishlist(product.id)}
                className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-white/90 text-gray-500 hover:text-red-500 hover:bg-red-50 shadow-sm transition-colors"
                aria-label="Remove from wishlist"
              >
                <HiXMark className="w-4 h-4" />
              </button>

              {/* Image */}
              <Link to={`/product/${product.id}`} className="block aspect-[3/4] overflow-hidden bg-gray-50">
                <img
                  src={product.images?.[0] || product.image || '/images/hero1.png'}
                  alt={product.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </Link>

              {/* Info */}
              <div className="p-3 sm:p-4">
                <Link to={`/product/${product.id}`}>
                  <h3 className="font-sans text-xs sm:text-sm font-semibold text-gray-900 line-clamp-2 uppercase leading-snug group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                </Link>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="font-sans text-sm sm:text-base font-bold text-primary">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xs text-gray-400 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>
                <motion.button
                  type="button"
                  onClick={() => addToCart(product)}
                  whileTap={{ scale: 0.95 }}
                  className="mt-3 w-full flex items-center justify-center gap-2 rounded-lg bg-primary text-white py-2 text-xs sm:text-sm font-semibold hover:bg-primary-dark transition-colors"
                >
                  <HiShoppingCart className="w-4 h-4" />
                  Add to Cart
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
