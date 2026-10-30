import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Heart, ShoppingBag, User as UserIcon, Menu, X, LogOut, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onOpenAuth }) {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const { cartCount, setIsDrawerOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Collections', path: '/shop' },
    { name: 'Our Story', path: '/#story' },
    { name: 'Contact', path: '/#contact' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-40 transition-all duration-500 ${
          scrolled
            ? 'bg-ivory/95 backdrop-blur-md shadow-sm py-3'
            : 'bg-ivory/80 backdrop-blur-sm py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 md:px-8 flex items-center justify-between">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-ink p-1 hover:text-gold transition-colors"
            aria-label="Open menu"
          >
            {mobileMenuOpen ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-[12px] tracking-[.25em] uppercase flex-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="hover:text-gold transition-colors duration-300 relative py-1 group"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-gold transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                className="text-gold font-medium flex items-center gap-1.5 hover:opacity-80 transition"
              >
                <Shield size={14} /> Admin
              </Link>
            )}
          </nav>

          {/* Brand Logo matching reference */}
          <Link to="/" className="text-center leading-none select-none">
            <span className="font-serif text-3xl md:text-4xl tracking-[.45em] pl-[.45em] gold-t inline-block">
              SUVI
            </span>
            <span className="block text-[8px] md:text-[9px] tracking-[.5em] uppercase mt-1 text-ink/70">
              Fine Jewellery
            </span>
          </Link>

          {/* Right Action Icons */}
          <div className="flex items-center gap-4 md:gap-5 flex-1 justify-end">
            {/* Search Toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-1 text-ink hover:text-gold transition-colors"
              aria-label="Search"
            >
              <Search size={20} strokeWidth={1.4} />
            </button>

            {/* Wishlist Link */}
            <Link
              to="/account?tab=wishlist"
              className="relative p-1 text-ink hover:text-gold transition-colors"
              aria-label="Wishlist"
            >
              <Heart size={20} strokeWidth={1.4} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 text-[9px] bg-gold text-white rounded-full w-4 h-4 grid place-items-center font-normal shadow-sm">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Trigger */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="relative p-1 text-ink hover:text-gold transition-colors"
              aria-label="Shopping Bag"
            >
              <ShoppingBag size={20} strokeWidth={1.4} />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 text-[9px] bg-gold text-white rounded-full w-4 h-4 grid place-items-center font-normal shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Account / Profile */}
            <div className="relative">
              {isAuthenticated ? (
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-1.5 p-1 text-ink hover:text-gold transition-colors text-xs tracking-wider"
                  aria-label="Account"
                >
                  <UserIcon size={20} strokeWidth={1.4} />
                  <span className="hidden lg:inline font-medium capitalize max-w-[90px] truncate">
                    {user.full_name?.split(' ')[0]}
                  </span>
                </button>
              ) : (
                <button
                  onClick={onOpenAuth}
                  className="text-[11px] tracking-[.25em] uppercase border border-ink/40 px-3 py-1.5 hover:border-gold hover:text-gold transition-colors hidden sm:block"
                >
                  Sign In
                </button>
              )}

              {/* Account Dropdown Menu */}
              <AnimatePresence>
                {userDropdownOpen && isAuthenticated && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-3 w-48 bg-ivory border border-gold/30 shadow-xl py-2 z-50 text-xs uppercase tracking-wider"
                  >
                    <div className="px-4 py-2 border-b border-gold/20 normal-case text-ink/70">
                      <p className="font-semibold text-ink">{user.full_name}</p>
                      <p className="text-[11px] truncate">{user.email}</p>
                    </div>
                    <Link
                      to="/account?tab=orders"
                      onClick={() => setUserDropdownOpen(false)}
                      className="block px-4 py-2 hover:bg-cream text-ink transition-colors"
                    >
                      My Orders
                    </Link>
                    <Link
                      to="/account?tab=wishlist"
                      onClick={() => setUserDropdownOpen(false)}
                      className="block px-4 py-2 hover:bg-cream text-ink transition-colors"
                    >
                      Saved Pieces
                    </Link>
                    <Link
                      to="/account?tab=addresses"
                      onClick={() => setUserDropdownOpen(false)}
                      className="block px-4 py-2 hover:bg-cream text-ink transition-colors"
                    >
                      Addresses
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="block px-4 py-2 hover:bg-cream text-gold font-medium transition-colors border-t border-gold/20"
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-cream text-red-700 flex items-center gap-1.5 transition-colors border-t border-gold/20"
                    >
                      <LogOut size={13} /> Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Animated Search Bar Dropdown */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden border-t border-gold/30 mt-3 bg-ivory"
            >
              <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto px-5 py-4">
                <div className="relative flex items-center">
                  <input
                    autoFocus
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search rings, solitaire earrings, bridal necklaces…"
                    className="w-full bg-transparent border-b-2 border-gold py-2.5 pr-10 outline-none font-serif text-xl placeholder:text-ink/40 text-ink"
                  />
                  <button
                    type="submit"
                    className="absolute right-0 text-gold hover:text-ink transition-colors"
                    aria-label="Submit search"
                  >
                    <Search size={22} />
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-ivory border-t border-gold/20 px-6 py-6 flex flex-col gap-4 text-sm tracking-[.25em] uppercase shadow-lg"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-1 hover:text-gold transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-1 text-gold font-medium"
                >
                  Admin Dashboard
                </Link>
              )}
              {!isAuthenticated && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth();
                  }}
                  className="w-full py-2.5 mt-2 bg-ink text-ivory text-center text-xs tracking-[.3em] uppercase hover:bg-gold transition-colors"
                >
                  Sign In / Register
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
