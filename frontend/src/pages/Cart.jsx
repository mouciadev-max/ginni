import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiTrash, HiMinus, HiPlus } from 'react-icons/hi2';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

function formatPrice(price) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);
}

export default function Cart() {
  const { items, removeFromCart, updateQuantity, cartSubtotal, cartDeliveryCharge, cartTotal, cartCount } = useCart();
  const { user } = useAuth();

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-ginni-bg flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center px-4"
        >
          <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-primary mb-2">
            Your cart is empty
          </h1>
          <p className="text-gray-600 mb-8">Discover our ethnic wear and add something beautiful.</p>
          <Link
            to="/collections/all"
            className="inline-block rounded-xl bg-primary px-8 py-3 text-white font-medium hover:bg-primary-dark transition-colors"
          >
              Shop Ethnic Wear
          </Link>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-ginni-bg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-serif text-3xl sm:text-4xl font-semibold text-primary mb-8"
        >
          Shopping Cart ({cartCount} {cartCount === 1 ? 'item' : 'items'})
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-6">
            {items.map((item, index) => (
              <motion.div
                key={`${item.id}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex gap-6 rounded-2xl border border-gray-200 p-4 sm:p-6 bg-white shadow-sm"
              >
                <img
                  src={item.image || (item.images && item.images.length > 0 ? item.images[0] : null) || 'https://images.unsplash.com/photo-1594633312681-4250c5e2d0f6?w=600'}
                  alt={item.name}
                  className="w-28 h-36 sm:w-32 sm:h-40 object-cover rounded-xl flex-shrink-0 bg-gray-100"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-serif font-semibold text-gray-900 line-clamp-2">{item.name}</h3>
                  <p className="mt-1 text-primary font-medium">{formatPrice(item.price)}</p>
                  <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex items-center w-max rounded-lg border border-gray-200 bg-gray-50">
                      <button
                        type="button"
                        onClick={() => updateQuantity(index, item.quantity - 1)}
                        className="p-2 text-gray-600 hover:text-primary transition-colors"
                      >
                        <HiMinus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(index, item.quantity + 1)}
                        className="p-2 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light"
                      >
                        <HiPlus className="w-4 h-4" />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFromCart(index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
                      aria-label="Remove"
                    >
                      <HiTrash className="w-4 h-4" />
                      <span className="text-sm font-medium sm:hidden">Remove</span>
                    </button>
                  </div>
                </div>
                <p className="font-semibold text-gray-900 flex-shrink-0 text-lg">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-24 rounded-2xl border border-gray-200 p-6 bg-white shadow-sm">
              <h2 className="font-serif text-xl font-semibold text-primary mb-4 pb-2 border-b border-gray-100">Order Summary</h2>
              <div className="flex justify-between text-gray-600 mb-3">
                <span>Items Subtotal</span>
                <span className="font-medium text-gray-900">{formatPrice(cartSubtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600 mb-4">
                <span>Delivery Charge</span>
                <span className="font-medium text-gray-900">{cartDeliveryCharge > 0 ? `+ ${formatPrice(cartDeliveryCharge)}` : 'Free'}</span>
              </div>
              <div className="border-t border-gray-200 mt-2 pt-4 flex justify-between items-center">
                <span className="font-serif text-lg font-semibold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-primary">{formatPrice(cartTotal)}</span>
              </div>
              <Link
                to={user ? "/checkout" : "/login"}
                state={!user ? { redirect: "/checkout" } : null}
                className="mt-6 block w-full rounded-xl bg-primary py-4 text-center font-bold text-white shadow-md hover:bg-primary-dark hover:shadow-lg transition-all"
              >
                Proceed to Checkout
              </Link>
              <Link to="/collections/all" className="mt-4 block text-center text-primary hover:text-primary-dark font-medium underline-offset-4 hover:underline text-sm transition-colors">
                Continue Shopping
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
