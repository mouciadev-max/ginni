import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';

function formatPrice(price) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);
}

// Load Razorpay script dynamically
function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function Checkout() {
  const navigate = useNavigate();
  const { items, cartTotal, cartSubtotal, cartDeliveryCharge, clearCart } = useCart();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    pincode: '',
    phone: '',
    paymentMethod: 'cod', // 'cod' or 'online'
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const getOrderPayload = () => ({
    addressInfo: {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: form.phone,
      street: form.address,
      city: form.city,
      zip: form.pincode,
      state: 'State',
      country: 'India'
    },
    items: items.map(i => ({ productId: i.id, quantity: i.quantity, price: i.price, deliveryCharge: i.deliveryCharge || 0 }))
  });

  const handleCOD = async () => {
    const token = localStorage.getItem('accessToken');
    const response = await fetch('${import.meta.env.VITE_API_URL}/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ...getOrderPayload(), paymentMethod: 'COD' })
    });
    if (!response.ok) throw new Error('Failed to place order');
    setSubmitted(true);
    clearCart();
    setTimeout(() => navigate('/'), 3000);
  };

  const handleRazorpay = async () => {
    const token = localStorage.getItem('accessToken');

    // 1. Load Razorpay script
    const loaded = await loadRazorpayScript();
    if (!loaded) throw new Error('Razorpay SDK failed to load. Please check your internet connection.');

    // 2. Create Razorpay order on backend
    const createRes = await fetch('${import.meta.env.VITE_API_URL}/api/orders/razorpay/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ amount: cartTotal })
    });
    const createData = await createRes.json();
    if (!createRes.ok) throw new Error(createData.message || 'Could not create payment order');

    const { order_id, key_id } = createData.data;

    // 3. Open Razorpay popup
    return new Promise((resolve, reject) => {
      const options = {
        key: key_id,
        amount: Math.round(cartTotal * 100),
        currency: 'INR',
        name: 'Ginni Ethnic Wear',
        description: `Order for ${items.length} item(s)`,
        order_id,
        prefill: {
          name: `${form.firstName} ${form.lastName}`,
          email: form.email,
          contact: form.phone,
        },
        theme: { color: '#8B1A1A' },
        handler: async (paymentResponse) => {
          try {
            // 4. Verify payment on backend and place order
            const verifyRes = await fetch('${import.meta.env.VITE_API_URL}/api/orders/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
              body: JSON.stringify({
                razorpay_order_id: paymentResponse.razorpay_order_id,
                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                razorpay_signature: paymentResponse.razorpay_signature,
                orderData: getOrderPayload(),
              })
            });
            if (!verifyRes.ok) throw new Error('Payment verification failed');
            resolve();
          } catch (err) {
            reject(err);
          }
        },
        modal: {
          ondismiss: () => reject(new Error('Payment cancelled by user')),
        }
      };
      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('Please login to complete your order.');
      navigate('/login', { state: { from: '/checkout' } });
      setLoading(false);
      return;
    }
    try {
      if (form.paymentMethod === 'cod') {
        await handleCOD();
      } else {
        await handleRazorpay();
        setSubmitted(true);
        clearCart();
        setTimeout(() => navigate('/'), 3000);
      }
    } catch (error) {
      console.error(error);
      if (error.message !== 'Payment cancelled by user') {
        alert(error.message || 'Failed to place order. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0 && !submitted) {
    return (
      <main className="min-h-screen bg-ginni-bg flex items-center justify-center">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center px-4">
          <h1 className="font-serif text-2xl text-gray-900 mb-4">Your cart is empty</h1>
          <Link to="/collections/all" className="text-primary hover:underline">
            Shop Ethnic Wear
          </Link>
        </motion.div>
      </main>
    );
  }

  if (submitted) {
    return (
      <main className="min-h-screen bg-ginni-bg flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md px-4"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-8 relative"
          >
            <motion.svg
              viewBox="0 0 50 50"
              className="w-12 h-12 text-primary absolute"
              initial="hidden"
              animate="visible"
            >
              <motion.path
                fill="none"
                strokeWidth="4"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14 27l7 7 16-16"
                variants={{
                  hidden: { pathLength: 0, opacity: 0 },
                  visible: {
                    pathLength: 1,
                    opacity: 1,
                    transition: { duration: 0.8, ease: "easeOut", delay: 0.3 }
                  }
                }}
              />
            </motion.svg>
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-primary/30"
              initial={{ scale: 0.8, opacity: 1 }}
              animate={{ scale: 1.6, opacity: 0 }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
            />
          </motion.div>
          <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-gray-900 mb-2">
            Thank you for your order!
          </h1>
          <p className="text-gray-600 mb-8">
            We've received your order and will process it shortly.
            {form.paymentMethod === 'cod' ? ' Payment will be collected on delivery.' : ' Your payment was successful.'}
          </p>
          <Link
            to="/"
            className="inline-block rounded-xl bg-primary px-8 py-3 text-white font-medium hover:opacity-90 transition-opacity shadow-lg shadow-primary/30"
          >
            Back to Home
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
          className="font-serif text-3xl sm:text-4xl font-semibold text-gray-900 mb-8 section-title"
        >
          Checkout
        </motion.h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left — Contact, Shipping, Payment */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-golden/10">
              <h2 className="font-serif text-xl font-semibold text-gray-900 mb-6">Contact &amp; Shipping</h2>

              <div className="space-y-4">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all shadow-sm"
                />

                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First name"
                    value={form.firstName}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all shadow-sm"
                  />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last name"
                    value={form.lastName}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all shadow-sm"
                  />
                </div>

                <input
                  type="text"
                  name="address"
                  placeholder="Address"
                  value={form.address}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all shadow-sm"
                />

                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={form.city}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all shadow-sm"
                  />
                  <input
                    type="text"
                    name="pincode"
                    placeholder="Pincode"
                    value={form.pincode}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all shadow-sm"
                  />
                </div>

                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all shadow-sm"
                />
              </div>

              {/* Payment Section — 2 options only */}
              <div className="mt-8">
                <h3 className="font-serif text-lg font-semibold text-gray-900 mb-4 border-t border-gray-100 pt-6">Payment Method</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  {/* Cash on Delivery */}
                  <label
                    className={`relative flex cursor-pointer flex-col rounded-2xl border-2 p-5 shadow-sm transition-all ${form.paymentMethod === 'cod'
                        ? 'border-primary bg-primary/5 ring-1 ring-primary'
                        : 'border-gray-200 bg-white hover:border-primary/40'
                      }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={form.paymentMethod === 'cod'}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${form.paymentMethod === 'cod' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'}`}>
                        {/* Truck icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 3h15v13H1z" /><path d="M16 8h4l3 3v5h-7V8z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
                        </svg>
                      </div>
                      <span className="font-bold text-gray-900">Cash on Delivery</span>
                    </div>
                    <p className="text-xs text-gray-500 ml-13 pl-1">Pay when your order arrives at your door</p>
                    {form.paymentMethod === 'cod' && (
                      <div className="absolute top-3 right-3">
                        <svg className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </label>

                  {/* Online Payment */}
                  <label
                    className={`relative flex cursor-pointer flex-col rounded-2xl border-2 p-5 shadow-sm transition-all ${form.paymentMethod === 'online'
                        ? 'border-primary bg-primary/5 ring-1 ring-primary'
                        : 'border-gray-200 bg-white hover:border-primary/40'
                      }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="online"
                      checked={form.paymentMethod === 'online'}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${form.paymentMethod === 'online' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'}`}>
                        {/* Credit card icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" />
                        </svg>
                      </div>
                      <span className="font-bold text-gray-900">Online Payment</span>
                    </div>
                    <p className="text-xs text-gray-500">UPI, Cards, Wallets via Razorpay</p>
                    {/* Razorpay badge */}
                    <div className="mt-3 flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Secured by Razorpay</span>
                    </div>
                    {form.paymentMethod === 'online' && (
                      <div className="absolute top-3 right-3">
                        <svg className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </label>

                </div>
              </div>

            </div>
          </motion.div>

          {/* Right — Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="sticky top-24 rounded-2xl border border-golden/20 p-6 sm:p-8 bg-ivory shadow-lg">
              <h2 className="font-serif text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
              <ul className="space-y-4 mb-6">
                {items.map((item, i) => (
                  <li key={i} className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-18 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
                        <img
                          src={item.image || (item.images && item.images.length > 0 ? item.images[0] : null) || 'https://images.unsplash.com/photo-1594633312681-4250c5e2d0f6?w=200'}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1594633312681-4250c5e2d0f6?w=200'; }}
                        />
                      </div>
                      <span className="text-gray-700 font-medium line-clamp-2 max-w-[160px]">{item.name}</span>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-gray-500 text-xs mb-1">Qty: {item.quantity}</p>
                      <p className="font-semibold text-gray-900">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="border-t border-golden/20 pt-4 space-y-2 mb-4">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(cartSubtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Delivery Charge</span>
                  {cartDeliveryCharge > 0 ? (
                    <span className="font-medium text-gray-900">{formatPrice(cartDeliveryCharge)}</span>
                  ) : (
                    <span className="text-green-600 font-medium">Free</span>
                  )}
                </div>
              </div>

              <div className="border-t border-golden/20 pt-4 flex justify-between font-serif text-xl font-bold">
                <span className="text-gray-900">Total</span>
                <span className="text-primary">{formatPrice(cartTotal)}</span>
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                className="mt-8 w-full rounded-xl bg-primary py-4 text-white font-bold hover:bg-primary-dark shadow-red transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                whileHover={{ scale: loading ? 1 : 1.01 }}
                whileTap={{ scale: loading ? 1 : 0.99 }}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Processing...
                  </>
                ) : (
                  form.paymentMethod === 'online' ? `Pay ${formatPrice(cartTotal)} via Razorpay` : 'Place Order (Cash on Delivery)'
                )}
              </motion.button>

              <p className="text-center text-xs text-gray-500 mt-4 flex items-center justify-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Secure 256-bit SSL encryption
              </p>
            </div>
          </motion.div>
        </form>
      </div>
    </main>
  );
}
