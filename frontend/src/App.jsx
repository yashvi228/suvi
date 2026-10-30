import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';
import { CartProvider, useCart } from './context/CartContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import AuthModal from './components/AuthModal';

import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';

function AppContent() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { toastMessage } = useCart();

  return (
    <div className="min-h-screen flex flex-col bg-ivory selection:bg-gold/20 selection:text-ink">
      {/* Global Hidden SVG Gradient Definitions matching reference */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#9a7440" />
            <stop offset="0.45" stopColor="#ecd49c" />
            <stop offset="1" stopColor="#b8935a" />
          </linearGradient>
          <linearGradient id="gem" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="0.6" stopColor="#e9eef2" />
            <stop offset="1" stopColor="#b9c7d3" />
          </linearGradient>
        </defs>
      </svg>

      <Navbar onOpenAuth={() => setAuthModalOpen(true)} />
      <CartDrawer />

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/product/:id" element={<ProductDetailPage onOpenAuth={() => setAuthModalOpen(true)} />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-confirmation/:orderNumber" element={<OrderConfirmationPage />} />
          <Route path="/account" element={<UserDashboard onOpenAuth={() => setAuthModalOpen(true)} />} />
          <Route path="/admin" element={<AdminDashboard onOpenAuth={() => setAuthModalOpen(true)} />} />
        </Routes>
      </main>

      <Footer />

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] bg-ink text-ivory px-6 py-3 text-xs tracking-widest uppercase shadow-2xl border border-gold/40 animate-fade-in">
          {toastMessage}
        </div>
      )}

      {/* Authentication Modal */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>
            <AppContent />
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </Router>
  );
}
