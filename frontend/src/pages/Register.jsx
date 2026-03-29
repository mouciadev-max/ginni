import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await register(formData);
      if (success) {
        navigate('/login');
      } else {
        setError('Registration failed');
      }
    } catch (err) {
      setError('Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-golden/20"
      >
        <div>
          <h2 className="mt-2 text-center text-3xl font-serif font-bold tracking-tight text-primary">
            Create an Account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 font-sans">
            Join Ginni Ethnic Wear today.
          </p>
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm text-center border border-red-200">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label className="block text-sm font-medium text-gray-700 font-sans mb-1">Full Name</label>
              <input
                type="text" required
                value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="relative block w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-golden focus:outline-none focus:ring-1 focus:ring-golden sm:text-sm transition-all"
                placeholder="Jane Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 font-sans mb-1">Email address</label>
              <input
                type="email" required
                value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="relative block w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-golden focus:outline-none focus:ring-1 focus:ring-golden sm:text-sm transition-all"
                placeholder="you@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 font-sans mb-1">Phone Number</label>
              <input
                type="tel" required
                value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="relative block w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-golden focus:outline-none focus:ring-1 focus:ring-golden sm:text-sm transition-all"
                placeholder="9876543210"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 font-sans mb-1">Password</label>
              <input
                type="password" required minLength="6"
                value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="relative block w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-golden focus:outline-none focus:ring-1 focus:ring-golden sm:text-sm transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <button
              type="submit" disabled={loading}
              className="group relative flex w-full justify-center rounded-xl bg-primary py-3 px-4 text-sm font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-golden focus:ring-offset-2 transition-all disabled:opacity-70"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600 font-sans">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-golden hover:text-primary transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
