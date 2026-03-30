import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiCamera, HiPencil, HiCheck, HiOutlineShoppingBag, HiOutlineUser, HiOutlineTruck, HiStar } from 'react-icons/hi2';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function formatPrice(price) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);
}

export default function Profile() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('info');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState({}); // { orderId: reviewData }
  const [reviewForms, setReviewForms] = useState({}); // { orderId: { rating, comment, submitting, submitted } }
  const [profile, setProfile] = useState({
    name: '',
    gender: 'Other',
    email: '',
    phone: '',
    address: '',
    avatar: '👩🏽',
  });

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        navigate('/login');
        return;
      }
      try {
        setLoading(true);
        const [profileRes, ordersRes] = await Promise.all([
          axios.get('${import.meta.env.VITE_API_URL}/api/user/profile', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('${import.meta.env.VITE_API_URL}/api/orders', { headers: { Authorization: `Bearer ${token}` } })
        ]);

        const userData = profileRes.data.data;
        setProfile({
          name: userData.name || '',
          gender: userData.gender || 'Female',
          email: userData.email || '',
          phone: userData.phone || '',
          address: userData.address || '',
          avatar: userData.avatar || '👩🏽',
        });

        setOrders(ordersRes.data.data || []);

        // Fetch existing reviews for DELIVERED orders
        const deliveredOrders = (ordersRes.data.data || []).filter(o => o.status === 'DELIVERED');
        const reviewResults = await Promise.allSettled(
          deliveredOrders.map(o =>
            axios.get(`${import.meta.env.VITE_API_URL}/api/orders/${o.id}/review`, { headers: { Authorization: `Bearer ${token}` } })
          )
        );
        const reviewMap = {};
        deliveredOrders.forEach((o, i) => {
          const result = reviewResults[i];
          if (result.status === 'fulfilled' && result.value.data?.data) {
            reviewMap[o.id] = result.value.data.data;
          }
        });
        setReviews(reviewMap);
      } catch (error) {
        console.error('Failed to fetch user data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const handleChange = (e) => {
    setProfile((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('accessToken');
      await axios.put('${import.meta.env.VITE_API_URL}/api/user/profile', {
        name: profile.name,
        phone: profile.phone,
        address: profile.address,
        gender: profile.gender
      }, { headers: { Authorization: `Bearer ${token}` } });
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile.");
    }
  };

  const handleReviewChange = (orderId, field, value) => {
    setReviewForms(prev => ({
      ...prev,
      [orderId]: { rating: 5, comment: '', ...prev[orderId], [field]: value }
    }));
  };

  const handleReviewSubmit = async (orderId) => {
    const form = reviewForms[orderId] || { rating: 5, comment: '' };
    if (!form.comment?.trim()) return alert('Please write a comment.');
    setReviewForms(prev => ({ ...prev, [orderId]: { ...prev[orderId], submitting: true } }));
    try {
      const token = localStorage.getItem('accessToken');
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/orders/${orderId}/review`, {
        rating: form.rating || 5,
        comment: form.comment
      }, { headers: { Authorization: `Bearer ${token}` } });
      setReviews(prev => ({ ...prev, [orderId]: res.data.data }));
      setReviewForms(prev => ({ ...prev, [orderId]: { ...prev[orderId], submitting: false, submitted: true } }));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit review.');
      setReviewForms(prev => ({ ...prev, [orderId]: { ...prev[orderId], submitting: false } }));
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-ginni-bg py-10 sm:py-16 flex items-center justify-center">
        <p className="text-gray-500 font-serif text-xl">Loading your profile...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-ginni-bg py-10 sm:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">

        {/* Navigation Tabs */}
        <div className="flex space-x-2 sm:space-x-6 mb-8 justify-center sm:justify-start">
          <button
            onClick={() => setActiveTab('info')}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-sans font-semibold transition-all ${activeTab === 'info'
                ? 'bg-primary text-white shadow-red border-2 border-primary'
                : 'bg-white text-gray-600 border-2 border-golden/20 hover:border-primary/50'
              }`}
          >
            <HiOutlineUser className="w-5 h-5" />
            Personal Info
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-sans font-semibold transition-all ${activeTab === 'orders'
                ? 'bg-primary text-white shadow-red border-2 border-primary'
                : 'bg-white text-gray-600 border-2 border-golden/20 hover:border-primary/50'
              }`}
          >
            <HiOutlineShoppingBag className="w-5 h-5" />
            My Orders
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'info' && (
            <motion.div
              key="info"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="bg-white rounded-2xl shadow-sm border border-golden/10 overflow-hidden"
            >
              {/* Header Banner */}
              <div className="h-32 sm:h-48 bg-gradient-to-r from-maroon via-primary to-primary-dark relative">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
              </div>

              <div className="px-6 sm:px-10 pb-10 relative">
                {/* Avatar Section */}
                <div className="flex justify-between items-end -mt-16 sm:-mt-20 mb-8 z-10 relative">
                  <div className="relative">
                    <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white bg-ivory flex items-center justify-center text-6xl shadow-md overflow-hidden">
                      <span>{profile.avatar}</span>
                    </div>
                    {isEditing && (
                      <button className="absolute bottom-2 right-2 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center shadow-lg hover:bg-primary-dark transition-colors">
                        <HiCamera className="w-5 h-5" />
                      </button>
                    )}
                  </div>

                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 px-6 py-2.5 bg-ivory border border-golden/30 text-primary font-semibold rounded-full hover:bg-golden/10 transition-colors shadow-sm"
                    >
                      <HiPencil className="w-4 h-4" />
                      Edit Profile
                    </button>
                  ) : (
                    <button
                      onClick={handleSave}
                      className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white font-semibold rounded-full hover:bg-primary-dark transition-colors shadow-md shadow-red/20"
                    >
                      <HiCheck className="w-5 h-5" />
                      Save Changes
                    </button>
                  )}
                </div>

                {/* Form Section */}
                <form onSubmit={handleSave} className="space-y-8">
                  <div>
                    <h2 className="font-serif text-2xl font-semibold text-gray-900 mb-6">Personal Details</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                      {/* Name */}
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="name"
                            value={profile.name}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all shadow-sm"
                          />
                        ) : (
                          <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 border border-transparent">{profile.name || 'Not provided'}</p>
                        )}
                      </div>

                      {/* Gender */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                        {isEditing ? (
                          <select
                            name="gender"
                            value={profile.gender}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all shadow-sm"
                          >
                            <option value="Female">Female</option>
                            <option value="Male">Male</option>
                            <option value="Other">Other</option>
                          </select>
                        ) : (
                          <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 border border-transparent">{profile.gender}</p>
                        )}
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        {isEditing ? (
                          <input
                            type="tel"
                            name="phone"
                            value={profile.phone}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all shadow-sm"
                          />
                        ) : (
                          <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 border border-transparent">{profile.phone || 'Not provided'}</p>
                        )}
                      </div>

                      {/* Email (Full width) */}
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        {isEditing ? (
                          <input
                            type="email"
                            name="email"
                            value={profile.email}
                            disabled
                            className="w-full rounded-xl border border-gray-300 bg-gray-100 px-4 py-3 text-gray-500 outline-none shadow-sm cursor-not-allowed"
                            title="Email cannot be changed"
                          />
                        ) : (
                          <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 border border-transparent">{profile.email}</p>
                        )}
                      </div>

                      {/* Address (Full width) */}
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Address</label>
                        {isEditing ? (
                          <textarea
                            name="address"
                            value={profile.address}
                            onChange={handleChange}
                            rows={3}
                            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all shadow-sm resize-none"
                          />
                        ) : (
                          <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 border border-transparent whitespace-pre-wrap">{profile.address || 'No address saved.'}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </motion.div>
          )}

          {activeTab === 'orders' && (
            <motion.div
              key="orders"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="space-y-6"
            >
              {orders.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-golden/10">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <HiOutlineShoppingBag className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="font-serif text-2xl font-semibold text-gray-900 mb-2">No Orders Yet</h3>
                  <p className="text-gray-500 mb-6">Looks like you haven't made your first purchase yet.</p>
                  <Link to="/collections/all" className="inline-block px-8 py-3 bg-primary text-white font-semibold rounded-full hover:bg-primary-dark transition-colors shadow-md my-2">
                    Start Shopping
                  </Link>
                </div>
              ) : (
                orders.map((order) => (
                  <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-golden/10 overflow-hidden">
                    {/* Order Header */}
                    <div className="bg-ivory border-b border-golden/10 px-6 py-4 flex flex-wrap justify-between items-center gap-4">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Order #{order.id.slice(-8).toUpperCase()}</p>
                        <p className="text-xs text-gray-500">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Total Amount</p>
                        <p className="font-semibold text-primary">{formatPrice(order.totalAmount)}</p>
                      </div>
                    </div>

                    {/* Order Body */}
                    <div className="p-6">
                      {/* Tracking Timeline */}
                      <div className="mb-8">
                        <div className="flex items-center justify-between relative">
                          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 z-0"></div>

                          {/* Progress Line */}
                          <div
                            className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-green-500 z-0 transition-all duration-500"
                            style={{
                              width: order.status === 'DELIVERED' ? '100%' :
                                order.status === 'SHIPPED' ? '50%' :
                                  order.status === 'CANCELLED' ? '0%' : '10%'
                            }}
                          ></div>

                          {['PENDING', 'SHIPPED', 'DELIVERED'].map((step, idx) => {
                            const isCompleted =
                              order.status === 'DELIVERED' ||
                              (order.status === 'SHIPPED' && (step === 'PENDING' || step === 'SHIPPED')) ||
                              (order.status === 'PENDING' && step === 'PENDING') ||
                              (order.status === 'CONFIRMED' && step === 'PENDING');

                            const isCancelled = order.status === 'CANCELLED';

                            return (
                              <div key={step} className="z-10 flex flex-col items-center bg-white px-2">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-4 border-white ${isCancelled ? 'bg-red-500 text-white' :
                                    isCompleted ? 'bg-green-500 text-white' : 'bg-gray-300 text-transparent'
                                  }`}>
                                  <HiCheck className="w-4 h-4" />
                                </div>
                                <span className={`text-[10px] sm:text-xs font-semibold mt-2 ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                                  {isCancelled ? 'CANCELLED' : step}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Items */}
                      <div className="space-y-4">
                        <h4 className="font-serif text-lg font-semibold text-gray-800">Items</h4>
                        {order.orderItems?.map((item) => (
                          <div key={item.id} className="flex items-center gap-4 py-2 border-b border-gray-50 last:border-0">
                            {/* Assuming we populated productId locally or backend, if not we fallback */}
                            <div className="w-16 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                              <img src={item.image || '/images/hero1.png'} alt="Product" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold text-gray-900 text-sm sm:text-base line-clamp-1">{item.name || 'Ethnic Wear Item'}</p>
                              <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-gray-900">{formatPrice(item.price)}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Feedback Form for DELIVERED orders */}
                      {order.status === 'DELIVERED' && (
                        <div className="mt-6 pt-4 border-t border-dashed border-golden/20">
                          {reviews[order.id] ? (
                            // Already reviewed — show submitted review
                            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                              <p className="text-sm font-semibold text-green-700 flex items-center gap-2 mb-2">
                                <HiCheck className="w-4 h-4" /> Feedback Submitted
                              </p>
                              <div className="flex gap-0.5 mb-2">
                                {[1, 2, 3, 4, 5].map(s => (
                                  <HiStar key={s} className={`w-4 h-4 ${s <= reviews[order.id].rating ? 'text-yellow-400' : 'text-gray-300'}`} />
                                ))}
                              </div>
                              <p className="text-sm text-gray-700 italic">"{reviews[order.id].comment}"</p>
                            </div>
                          ) : (
                            // Show feedback form
                            <div>
                              <h5 className="font-serif text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                <HiStar className="w-5 h-5 text-yellow-400" />
                                Rate Your Experience
                              </h5>
                              {/* Star Rating */}
                              <div className="flex gap-1 mb-3">
                                {[1, 2, 3, 4, 5].map(star => (
                                  <button
                                    key={star}
                                    type="button"
                                    onClick={() => handleReviewChange(order.id, 'rating', star)}
                                    className="transition-transform hover:scale-110"
                                  >
                                    <HiStar
                                      className={`w-7 h-7 ${star <= (reviewForms[order.id]?.rating ?? 5)
                                          ? 'text-yellow-400'
                                          : 'text-gray-300'
                                        }`}
                                    />
                                  </button>
                                ))}
                              </div>
                              {/* Comment */}
                              <textarea
                                placeholder="Tell us about your experience with this order..."
                                value={reviewForms[order.id]?.comment || ''}
                                onChange={e => handleReviewChange(order.id, 'comment', e.target.value)}
                                rows={3}
                                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition resize-none"
                              />
                              <button
                                onClick={() => handleReviewSubmit(order.id)}
                                disabled={reviewForms[order.id]?.submitting}
                                className="mt-3 px-6 py-2.5 bg-primary text-white text-sm font-semibold rounded-full hover:bg-primary-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
                              >
                                {reviewForms[order.id]?.submitting ? (
                                  <><svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg> Submitting...</>
                                ) : 'Submit Feedback'}
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Footer Actions */}
                      <div className="mt-6 pt-4 border-t border-gray-50 flex gap-4 justify-between items-center sm:justify-end">
                        <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 border border-gray-200 text-xs font-bold rounded uppercase">
                          {order.paymentMethod}
                        </span>
                        <button className="flex items-center gap-2 text-primary font-semibold hover:text-primary-dark transition-colors text-sm">
                          <HiOutlineTruck className="w-4 h-4" />
                          Track Package
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
