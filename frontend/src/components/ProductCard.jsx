import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiHeart, HiEye, HiStar, HiShoppingCart } from 'react-icons/hi2';
import { useCart } from '../context/CartContext';
import Modal from './Modal';

function formatPrice(price) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);
}

export default function ProductCard({ product, index = 0 }) {
  const [wishlisted, setWishlisted] = useState(false);
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const { addToCart } = useCart();

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <>
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.4, delay: index * 0.03 }}
        className="group relative rounded-xl bg-white overflow-hidden shadow-card hover:shadow-card-hover transition-shadow duration-400"
      >
        {/* Image */}
        <Link to={`/product/${product.id}`} className="block aspect-[3/4] overflow-hidden bg-gray-50 relative">
          <img
            src={product.images && product.images.length > 0 ? product.images[0] : product.image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {/* New tag - top right */}
          {product.isNew && (
            <span className="absolute top-2 right-2 rounded-md bg-green-500 px-2 py-0.5 text-[10px] sm:text-xs font-bold text-white shadow-sm">
              New
            </span>
          )}

          {/* Cart icon - bottom left */}
          <motion.button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              addToCart(product);
            }}
            className="absolute bottom-2 left-2 p-2 sm:p-2.5 rounded-lg bg-white/90 text-gray-700 hover:bg-primary hover:text-white shadow-md transition-all duration-200 backdrop-blur-sm"
            whileTap={{ scale: 0.9 }}
            aria-label="Add to cart"
          >
            <HiShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
          </motion.button>

          {/* Discount badge - bottom right */}
          {discount > 0 && (
            <span className="absolute bottom-2 right-2 rounded-md bg-primary px-2 py-0.5 text-[10px] sm:text-xs font-bold text-white shadow-sm sale-badge">
              {discount}% off
            </span>
          )}

          {/* Quick view + wishlist overlay on hover */}
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 pointer-events-none">
            <motion.button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setQuickViewOpen(true);
              }}
              className="pointer-events-auto opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-300 p-2.5 rounded-full bg-white text-gray-700 hover:text-primary shadow-md"
              aria-label="Quick view"
            >
              <HiEye className="w-5 h-5" />
            </motion.button>
            <motion.button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setWishlisted(!wishlisted);
              }}
              className={`pointer-events-auto opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-300 delay-75 p-2.5 rounded-full shadow-md ${wishlisted ? 'bg-primary text-white' : 'bg-white text-gray-700 hover:text-primary'}`}
              aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <HiHeart className={`w-5 h-5 ${wishlisted ? 'fill-current' : ''}`} />
            </motion.button>
          </div>
        </Link>

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
          <div className="mt-1.5 flex items-center gap-1">
            <div className="flex items-center gap-0.5 text-golden">
              {[...Array(5)].map((_, i) => (
                <HiStar key={i} className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-200'}`} />
              ))}
            </div>
            <span className="text-[10px] sm:text-xs text-gray-400">({product.reviewCount})</span>
          </div>
        </div>
      </motion.article>

      <Modal isOpen={quickViewOpen} onClose={() => setQuickViewOpen(false)} title="Quick View">
        <div className="flex flex-col sm:flex-row gap-6">
          <img
            src={product.images && product.images.length > 0 ? product.images[0] : product.image}
            alt={product.name}
            className="w-full sm:w-72 aspect-[3/4] object-cover rounded-xl"
          />
          <div className="flex-1">
            <h3 className="font-serif text-xl font-bold text-gray-900">{product.name}</h3>
            <p className="mt-2 text-sm text-gray-500 font-sans">{product.description}</p>
            <div className="mt-1.5 flex items-center gap-1">
              <div className="flex items-center gap-0.5 text-golden">
                {[...Array(5)].map((_, i) => (
                  <HiStar key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-200'}`} />
                ))}
              </div>
              <span className="text-sm text-gray-400">({product.reviewCount} reviews)</span>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="font-sans text-2xl font-bold text-primary">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-gray-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
            <div className="mt-6 flex gap-3">
              <Link to={`/product/${product.id}`}>
                <motion.span
                  className="inline-block rounded-xl border-2 border-primary px-6 py-2.5 text-sm font-semibold text-primary hover:bg-primary/5 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  View Details
                </motion.span>
              </Link>
              <motion.button
                type="button"
                onClick={() => {
                  addToCart(product);
                  setQuickViewOpen(false);
                }}
                className="rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Add to Cart
              </motion.button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
