import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiEnvelope, HiMapPin, HiPhone, HiPaperAirplane } from 'react-icons/hi2';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <main className="min-h-screen bg-white dark:bg-bg-dark theme-transition">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-gray-900 dark:text-white mb-4">
            Get in Touch
          </h1>
          <p className="max-w-xl mx-auto text-gray-600 dark:text-gray-400">
            Have a question or need help with your order? We'd love to hear from you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-8"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-primary/10 dark:bg-primary-light/10 text-primary dark:text-primary-light">
                <HiMapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif font-semibold text-gray-900 dark:text-white mb-1">Visit Us</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  123 Fashion Avenue<br />
                  Mumbai, Maharashtra 400001
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-primary/10 dark:bg-primary-light/10 text-primary dark:text-primary-light">
                <HiEnvelope className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif font-semibold text-gray-900 dark:text-white mb-1">Email</h3>
                <a href="mailto:hello@ginniethnicwear.com" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light">
                  hello@ginniethnicwear.com
                </a>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-primary/10 dark:bg-primary-light/10 text-primary dark:text-primary-light">
                <HiPhone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif font-semibold text-gray-900 dark:text-white mb-1">Phone</h3>
                <a href="tel:+911234567890" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light">
                  +91 123 456 7890
                </a>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="rounded-2xl border border-gray-200 dark:border-gray-800 p-8 sm:p-10 bg-gray-50/50 dark:bg-gray-900/50">
              {sent ? (
                <div className="text-center py-12">
                  <p className="font-serif text-xl text-gray-900 dark:text-white mb-2">Thank you for reaching out.</p>
                  <p className="text-gray-600 dark:text-gray-400">We'll get back to you soon.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <input
                      type="text"
                      name="name"
                      placeholder="Your name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 focus:border-primary dark:focus:border-primary-light outline-none transition"
                    />
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 focus:border-primary dark:focus:border-primary-light outline-none transition"
                    />
                  </div>
                  <input
                    type="text"
                    name="subject"
                    placeholder="Subject"
                    value={form.subject}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 focus:border-primary dark:focus:border-primary-light outline-none transition"
                  />
                  <textarea
                    name="message"
                    placeholder="Message"
                    value={form.message}
                    onChange={handleChange}
                    rows={5}
                    required
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 focus:border-primary dark:focus:border-primary-light outline-none transition resize-none"
                  />
                  <motion.button
                    type="submit"
                    className="flex items-center gap-2 rounded-xl bg-primary dark:bg-primary-light px-8 py-3.5 text-white font-medium hover:opacity-90 transition-opacity"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Send Message
                    <HiPaperAirplane className="w-4 h-4" />
                  </motion.button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
