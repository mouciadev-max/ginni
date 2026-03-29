import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiHeart, HiStar, HiMinus, HiPlus, HiOutlineSparkles, HiOutlineTruck, HiOutlineArrowUturnLeft } from 'react-icons/hi2';
import axios from 'axios';
import { useCart } from '../context/CartContext';

function formatPrice(price) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);
}

export default function Product() {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/products/${id}`);
        if (data.success) {
          setProduct(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch product', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-ginni-bg">
        <div className="text-center font-serif text-xl text-gray-500">Loading Product...</div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-ginni-bg">
        <div className="text-center bg-white p-12 rounded-2xl shadow-sm border border-golden/10">
          <h1 className="font-serif text-2xl text-gray-900 mb-4">Product not found</h1>
          <Link to="/collections/all" className="inline-block mt-4 text-primary font-semibold hover:underline border-b border-primary">
            Back to Collections
          </Link>
        </div>
      </main>
    );
  }

  const images = product.images?.length > 0 ? product.images : [product.image || '/images/hero1.png'];
  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <main className="min-h-screen bg-ginni-bg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-golden/10"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
            {/* Gallery */}
            <div className="space-y-4">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-ivory border border-golden/20 shadow-inner group">
                <motion.img
                  key={selectedImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  src={images[selectedImage]}
                  alt={product.name}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSelectedImage(i)}
                      className={`flex-shrink-0 w-20 h-24 rounded-xl overflow-hidden border-2 transition-all shadow-sm ${
                        selectedImage === i ? 'border-primary ring-2 ring-primary/20 scale-105' : 'border-transparent hover:border-golden/40'
                      }`}
                    >
                      <img src={img} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex flex-col py-2">
              <div className="mb-2">
                <Link to="/collections/all" className="text-xs uppercase tracking-widest text-gray-400 font-sans font-bold hover:text-primary transition-colors">
                  {product.category?.name || 'Ethnic Collection'}
                </Link>
              </div>

              <motion.h1
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-gray-900 leading-tight"
              >
                {product.name}
              </motion.h1>
              
              <div className="mt-4 flex items-center gap-2">
                <div className="flex items-center gap-1 bg-green-50 px-2.5 py-1 rounded-full border border-green-100">
                  <span className="font-bold text-sm text-green-700">{product.rating || '4.8'}</span>
                  <HiStar className="w-4 h-4 text-green-600" />
                </div>
                <span className="text-sm font-sans text-gray-500 underline decoration-gray-300">
                  {product.reviewCount || '24'} verified reviews
                </span>
              </div>

              <div className="mt-8 flex items-end gap-4">
                <span className="font-serif text-3xl font-semibold text-primary">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice > product.price && (
                  <>
                    <span className="text-xl font-sans text-gray-400 line-through mb-0.5">
                      {formatPrice(product.originalPrice)}
                    </span>
                    <span className="text-sm font-bold text-green-600 mb-1 lg:ml-2 bg-green-50 px-2 py-0.5 rounded uppercase tracking-wide">
                      ({discount}% OFF)
                    </span>
                  </>
                )}
              </div>
              
              <p className="mt-2 text-xs text-gray-500 font-sans">Inclusive of all taxes</p>

              <div className="mt-8 pt-8 border-t border-golden/10">
                <p className="text-gray-600 font-sans leading-relaxed">
                  {product.description || 'Premium quality ethnic wear crafted with intricate detailing. Perfect for any special occasion. Experience elegance and comfort fused into one timeless piece.'}
                </p>
              </div>

              {/* Quantity Selector */}
              <div className="mt-8 flex items-center gap-6">
                <span className="text-sm font-bold font-sans text-gray-900 tracking-wide uppercase">Select Quantity</span>
                <div className="flex items-center rounded-full border-2 border-golden/20 bg-ivory shadow-inner">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-3 w-12 flex items-center justify-center text-gray-600 hover:text-primary transition-colors"
                  >
                    <HiMinus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center font-bold text-gray-900">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="p-3 w-12 flex items-center justify-center text-gray-600 hover:text-primary transition-colors"
                  >
                    <HiPlus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-10 flex flex-wrap gap-4">
                <motion.button
                  type="button"
                  onClick={() => addToCart({ ...product }, quantity)}
                  className="flex-1 min-w-[200px] rounded-full bg-primary py-4 text-sm font-bold tracking-widest text-white hover:bg-primary-dark transition-colors shadow-red uppercase"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                >
                  ADD TO CART
                </motion.button>
                <motion.button
                  type="button"
                  onClick={() => setWishlisted(!wishlisted)}
                  className={`p-4 rounded-full border-2 shadow-sm transition-all ${
                    wishlisted ? 'border-primary bg-primary/10 text-primary' : 'border-golden/30 bg-white text-gray-400 hover:border-primary/50 hover:text-primary'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <HiHeart className={`w-6 h-6 ${wishlisted ? 'fill-current scale-110' : ''} transition-transform`} />
                </motion.button>
              </div>

              {/* Trust Badges */}
              <div className="mt-12 pt-8 border-t border-golden/10 grid grid-cols-3 gap-2">
                <div className="flex flex-col items-center text-center gap-2 p-2 rounded-xl border border-golden/5 bg-ivory">
                  <HiOutlineSparkles className="w-6 h-6 text-golden" />
                  <span className="text-xs font-semibold text-gray-700">100% Genuine</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2 p-2 rounded-xl border border-golden/5 bg-ivory">
                  <HiOutlineTruck className="w-6 h-6 text-golden" />
                  <span className="text-xs font-semibold text-gray-700">Fast Shipping</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2 p-2 rounded-xl border border-golden/5 bg-ivory">
                  <HiOutlineArrowUturnLeft className="w-6 h-6 text-golden" />
                  <span className="text-xs font-semibold text-gray-700">Easy Returns</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
