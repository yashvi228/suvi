import React, { useState } from 'react';
import { X, Lock, Mail, User, Phone, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function AuthModal({ isOpen, onClose }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();
  const { showToast } = useCart();

  const handleFillDemo = (type) => {
    setError('');
    setIsRegister(false);
    if (type === 'admin') {
      setEmail('admin@suvi.com');
      setPassword('admin123');
    } else {
      setEmail('ananya@suvi.com');
      setPassword('password123');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        await register({ email, password, full_name: fullName, phone });
        showToast('Welcome to SUVI Fine Jewellery.');
      } else {
        await login(email, password);
        showToast('Welcome back.');
      }
      onClose();
    } catch (err) {
      setError(err.response?.data?.detail || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4 bg-ink/65 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-ivory w-full max-w-md p-8 md:p-10 shadow-2xl border border-gold/40 relative max-h-[90vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-ink/60 hover:text-ink transition-colors p-1"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {/* Modal Brand Title */}
        <div className="text-center mb-6">
          <span className="font-serif text-3xl tracking-[.4em] pl-[.4em] gold-t inline-block">
            SUVI
          </span>
          <p className="text-[10px] tracking-[.3em] uppercase text-ink/60 mt-1">
            {isRegister ? 'Join The Heirloom Circle' : 'Client Authentication'}
          </p>
        </div>

        {/* Quick Demo Credentials for Reviewer */}
        <div className="mb-6 p-3 bg-cream/70 border border-gold/40 rounded-sm text-xs">
          <p className="font-medium text-ink mb-1.5 text-center tracking-wider uppercase text-[10px] text-gold">
            Quick Fill Demo Accounts
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleFillDemo('customer')}
              className="py-1.5 px-2 bg-ivory border border-gold/50 text-[10px] tracking-wider uppercase hover:border-ink transition-colors text-ink text-center"
            >
              Customer Demo
            </button>
            <button
              type="button"
              onClick={() => handleFillDemo('admin')}
              className="py-1.5 px-2 bg-ivory border border-gold/50 text-[10px] tracking-wider uppercase hover:border-ink transition-colors text-ink text-center"
            >
              Admin Demo
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <>
              <div>
                <label className="block text-[10px] tracking-[.2em] uppercase text-ink/70 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-3 text-gold" />
                  <input
                    required
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ananya Sharma"
                    className="w-full bg-cream/40 border border-gold/40 pl-9 pr-3 py-2 text-sm outline-none focus:border-gold transition-colors font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] tracking-[.2em] uppercase text-ink/70 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3 top-3 text-gold" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98200 12345"
                    className="w-full bg-cream/40 border border-gold/40 pl-9 pr-3 py-2 text-sm outline-none focus:border-gold transition-colors font-sans"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-[10px] tracking-[.2em] uppercase text-ink/70 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-3 text-gold" />
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-cream/40 border border-gold/40 pl-9 pr-3 py-2 text-sm outline-none focus:border-gold transition-colors font-sans"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] tracking-[.2em] uppercase text-ink/70 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-3 text-gold" />
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-cream/40 border border-gold/40 pl-9 pr-3 py-2 text-sm outline-none focus:border-gold transition-colors font-sans"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-ink text-ivory py-3.5 mt-2 text-[11px] tracking-[.3em] uppercase hover:bg-gold transition-colors duration-300 disabled:opacity-50 font-medium"
          >
            {loading ? 'Authenticating…' : isRegister ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-ink/70">
          {isRegister ? (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsRegister(false);
                  setError('');
                }}
                className="text-gold underline hover:text-ink transition-colors font-medium ml-1"
              >
                Sign In
              </button>
            </p>
          ) : (
            <p>
              New to SUVI?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsRegister(true);
                  setError('');
                }}
                className="text-gold underline hover:text-ink transition-colors font-medium ml-1"
              >
                Register Here
              </button>
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
