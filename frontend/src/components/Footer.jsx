import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaInstagram, FaPinterest, FaFacebookF, FaYoutube, FaLinkedinIn, FaWhatsapp } from 'react-icons/fa';

const footerLinks = {
  popularSearches: [
    { to: '/collections/sarees', label: 'Designer Sarees' },
    { to: '/collections/sarees', label: 'Silk Saree Sale' },
    { to: '/collections/wedding', label: 'Wedding Collection' },
    { to: '/collections/kurtis', label: 'Ready To Wear' },
    { to: '/collections/festive', label: 'Festive Collection' },
  ],
  information: [
    { to: '/about', label: 'About Us' },
    { to: '/contact', label: 'Contact Us' },
    { to: '/shipping', label: 'Shipping Policy' },
    { to: '/privacy', label: 'Privacy Policy' },
    { to: '/terms', label: 'Terms of Service' },
  ],
  customerCare: [
    { to: '/contact', label: 'Help & Support' },
    { to: '/shipping', label: 'Return Policy' },
    { to: '/size-guide', label: 'Size Guide' },
    { to: '#', label: 'Track Order' },
    { to: '#', label: 'FAQs' },
  ],
};

const social = [
  { icon: FaInstagram, href: '#', label: 'Instagram' },
  { icon: FaFacebookF, href: '#', label: 'Facebook' },
  { icon: FaPinterest, href: '#', label: 'Pinterest' },
  { icon: FaYoutube, href: '#', label: 'YouTube' },
  { icon: FaLinkedinIn, href: '#', label: 'LinkedIn' },
];

export default function Footer() {
  return (
    <footer className="bg-maroon text-white">
      {/* Main footer */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <div className="mb-4">
              <Link to="/" className="inline-block">
                <span className="font-script text-4xl font-bold text-golden tracking-wide">Ginni</span>
                <span className="block text-[10px] text-golden-light/70 font-sans tracking-[0.25em] uppercase">
                  Ethnic Wear
                </span>
              </Link>
            </div>
            <p className="text-sm text-white/60 max-w-xs font-sans leading-relaxed">
              India's leading fashion brand offering the best and latest ethnic wear accessible to all, with outstanding quality at affordable prices.
            </p>
            <div className="mt-6 flex items-center gap-3 text-sm text-white/70">
              <FaWhatsapp className="w-5 h-5 text-green-400" />
              <span className="font-sans">WhatsApp Us: +91 98765 43210</span>
            </div>
            <p className="mt-2 text-xs text-white/50 font-sans">
              Working Hours: 10:00 AM - 6:30 PM (Mon–Sat)
            </p>
            <div className="mt-6 flex gap-3">
              {social.map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="p-2.5 rounded-full bg-white/10 text-white/70 hover:bg-golden/20 hover:text-golden transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          <div>
            <h3 className="font-serif font-bold text-golden text-sm uppercase tracking-wider mb-4">
              Popular Searches
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.popularSearches.map(({ to, label }) => (
                <li key={to + label}>
                  <Link to={to} className="text-sm text-white/60 hover:text-golden transition-colors font-sans">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-serif font-bold text-golden text-sm uppercase tracking-wider mb-4">
              Information
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.information.map(({ to, label }) => (
                <li key={to + label}>
                  <Link to={to} className="text-sm text-white/60 hover:text-golden transition-colors font-sans">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-serif font-bold text-golden text-sm uppercase tracking-wider mb-4">
              Customer Care
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.customerCare.map(({ to, label }) => (
                <li key={to + label}>
                  <Link to={to} className="text-sm text-white/60 hover:text-golden transition-colors font-sans">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-12 pt-10 border-t border-white/10">
          <div className="max-w-lg">
            <h3 className="font-serif font-bold text-white text-lg mb-1">Subscribe to Our Newsletter</h3>
            <p className="text-sm text-white/50 mb-4 font-sans">
              Get updates about latest offers, new arrivals & exclusive deals
            </p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/40 focus:border-golden focus:ring-1 focus:ring-golden/50 outline-none transition font-sans backdrop-blur-sm"
              />
              <motion.button
                type="submit"
                className="rounded-xl bg-golden-gradient px-6 py-3 text-sm font-bold text-maroon hover:shadow-golden transition-shadow"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Subscribe
              </motion.button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-white/40 font-sans">
          <p>© {new Date().getFullYear()} Ginni Ethnic Wear. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-golden transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-golden transition-colors">Terms of Service</Link>
            <Link to="/shipping" className="hover:text-golden transition-colors">Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
