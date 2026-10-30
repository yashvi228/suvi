import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const { showToast } = useCart();

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail) {
      showToast('Thank you for subscribing to SUVI private previews.');
      setNewsletterEmail('');
    }
  };

  const categories = [
    { name: 'Rings', path: '/shop?category=Rings' },
    { name: 'Earrings', path: '/shop?category=Earrings' },
    { name: 'Necklaces', path: '/shop?category=Necklaces' },
    { name: 'Bangles', path: '/shop?category=Bangles' },
    { name: 'Bracelets', path: '/shop?category=Bracelets' },
    { name: 'Bridal Jewellery', path: '/shop?category=Bridal+Jewellery' },
  ];

  const helpLinks = [
    'Complimentary Insured Shipping',
    '30-Day Easy Returns',
    'Diamond & Ring Size Guide',
    'Jewellery Care & Cleaning',
    'Authenticity & IGI Certificate',
  ];

  return (
    <footer id="contact" className="bg-ink text-ivory/80 pt-16 pb-10 px-5 md:px-8 border-t border-gold/30">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-12">
        {/* Brand Column */}
        <div className="space-y-4">
          <Link to="/" className="inline-block">
            <span className="font-serif text-3xl tracking-[.4em] gold-t block">SUVI</span>
            <span className="text-[8px] tracking-[.45em] uppercase text-ivory/60 block mt-1">
              Surat · Mumbai · Delhi
            </span>
          </Link>
          <p className="text-sm leading-relaxed text-ivory/70 pt-2">
            12 Ring Road, Diamond City,<br />
            Surat, Gujarat 395002<br />
            +91 98765 43210<br />
            care@suvijewels.in
          </p>
          <div className="flex gap-4 pt-2 text-xs tracking-wider text-ivory/60 uppercase">
            {['Instagram', 'Pinterest', 'Facebook', 'YouTube'].map((social) => (
              <a
                key={social}
                href="#"
                className="hover:text-gold2 transition-colors duration-200"
              >
                {social}
              </a>
            ))}
          </div>
        </div>

        {/* Shop Links */}
        <div>
          <h4 className="text-[11px] tracking-[.3em] uppercase text-gold2 mb-4 font-medium">
            Shop Collections
          </h4>
          <ul className="space-y-2">
            {categories.map((cat) => (
              <li key={cat.name}>
                <Link
                  to={cat.path}
                  className="text-sm py-1 block hover:text-gold2 transition-colors text-ivory/75"
                >
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Client Care */}
        <div>
          <h4 className="text-[11px] tracking-[.3em] uppercase text-gold2 mb-4 font-medium">
            Client Care
          </h4>
          <ul className="space-y-2">
            {helpLinks.map((item) => (
              <li key={item}>
                <a
                  href="#contact"
                  className="text-sm py-1 block hover:text-gold2 transition-colors text-ivory/75"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter Signup */}
        <div>
          <h4 className="text-[11px] tracking-[.3em] uppercase text-gold2 mb-4 font-medium">
            Private Previews
          </h4>
          <p className="text-sm text-ivory/70 mb-4 leading-relaxed">
            Receive private exhibition invitations, seasonal lookbooks, and 10% off your inaugural heirloom.
          </p>
          <form onSubmit={handleNewsletterSubmit} className="flex border-b border-gold2/60 pb-1">
            <input
              required
              type="email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="Your email address"
              className="bg-transparent flex-1 py-1.5 outline-none text-sm text-ivory placeholder:text-ivory/40 min-w-0 font-sans"
            />
            <button
              type="submit"
              className="text-gold2 text-xs tracking-[.25em] uppercase px-3 py-1 hover:text-ivory transition-colors font-medium"
            >
              Join
            </button>
          </form>
          <p className="text-[10px] text-ivory/40 mt-3">
            By subscribing you agree to our Privacy Policy. Unsubscribe anytime.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-ivory/10 mt-14 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-ivory/50 gap-4">
        <p>© 2026 SUVI Fine Jewellery Ltd. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:underline">Privacy Policy</a>
          <a href="#" className="hover:underline">Terms of Service</a>
          <a href="#" className="hover:underline">BIS Hallmarking</a>
        </div>
      </div>
    </footer>
  );
}
