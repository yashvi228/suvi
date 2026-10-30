import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Plus, Minus, Trash2, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { inr } from '../utils/formatters';
import JewelBadge from './JewelBadge';

export default function CartDrawer() {
  const {
    cart,
    cartCount,
    subtotal,
    total,
    isDrawerOpen,
    setIsDrawerOpen,
    updateQuantity,
    removeFromCart,
  } = useCart();

  const navigate = useNavigate();

  const handleCheckout = () => {
    setIsDrawerOpen(false);
    navigate('/checkout');
  };

  const handleViewCart = () => {
    setIsDrawerOpen(false);
    navigate('/cart');
  };

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsDrawerOpen(false)}
            className="fixed inset-0 bg-ink/60 backdrop-blur-sm z-50"
          />

          {/* Drawer Panel */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-ivory z-50 flex flex-col shadow-2xl border-l border-gold/30"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-gold/30">
              <div>
                <h3 className="font-serif text-3xl">Your Bag</h3>
                <p className="text-xs tracking-[.2em] uppercase text-ink/60 mt-0.5">
                  {cartCount} {cartCount === 1 ? 'Piece' : 'Pieces'}
                </p>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-2 text-ink hover:text-gold transition-colors"
                aria-label="Close bag"
              >
                <X size={24} strokeWidth={1.5} />
              </button>
            </div>

            {/* Bag Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="text-center py-24 space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-full bg-cream grid place-items-center text-gold">
                    <JewelBadge category="Rings" index={0} className="w-10 h-10" />
                  </div>
                  <p className="font-serif text-2xl text-ink/80">Your bag is empty.</p>
                  <p className="text-xs text-ink/60 max-w-xs mx-auto">
                    Explore our heirloom solitaires, bridal collections, and 18k gold creations.
                  </p>
                  <button
                    onClick={() => {
                      setIsDrawerOpen(false);
                      navigate('/shop');
                    }}
                    className="inline-block mt-4 px-6 py-2.5 border border-ink text-[11px] tracking-[.25em] uppercase hover:bg-ink hover:text-ivory transition-colors"
                  >
                    Discover Jewellery
                  </button>
                </div>
              ) : (
                cart.map((item, i) => {
                  const p = item.product;
                  const itemImg = p.images && p.images.length > 0 ? p.images[0] : null;

                  return (
                    <div
                      key={item.id}
                      className="flex gap-4 items-center pb-5 border-b border-gold/20 last:border-b-0"
                    >
                      {/* Image */}
                      <div className="w-20 h-24 shrink-0 bg-cream overflow-hidden rounded-sm relative">
                        {itemImg ? (
                          <img
                            src={itemImg}
                            alt={p.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <JewelBadge category={p.category_name} index={i} />
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-serif text-lg leading-tight truncate text-ink">
                          {p.name}
                        </h4>
                        <p className="text-xs text-gold mt-0.5">{item.selectedMetal || p.metal_type}</p>
                        <p className="text-sm font-medium text-ink/80 mt-1">{inr(p.price)}</p>

                        {/* Quantity controls */}
                        <div className="flex items-center gap-3 mt-2.5">
                          <div className="flex items-center border border-gold/50 bg-ivory">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-7 h-7 grid place-items-center text-xs hover:bg-cream transition-colors"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="w-8 text-center text-xs font-medium">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-7 h-7 grid place-items-center text-xs hover:bg-cream transition-colors"
                            >
                              <Plus size={12} />
                            </button>
                          </div>

                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-ink/40 hover:text-red-700 transition-colors p-1"
                            title="Remove item"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      {/* Line Total */}
                      <div className="text-right">
                        <p className="font-serif text-lg text-ink font-medium">
                          {inr(p.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Sticky Footer */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-gold/30 bg-cream/50 space-y-4">
                <div className="flex items-center gap-2 text-xs text-ink/70">
                  <ShieldCheck size={16} className="text-gold shrink-0" />
                  <span>Complimentary Insured Delivery & IGI Certificate Included</span>
                </div>

                <div className="flex justify-between items-baseline pt-2 border-t border-gold/20">
                  <span className="font-serif text-2xl">Total</span>
                  <span className="font-serif text-2xl font-semibold text-ink">{inr(total)}</span>
                </div>

                <div className="space-y-2 pt-1">
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-ink text-ivory py-4 text-[12px] tracking-[.3em] uppercase hover:bg-gold transition-colors duration-300 flex items-center justify-center gap-2 group font-medium"
                  >
                    Proceed to Checkout
                    <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                  </button>

                  <button
                    onClick={handleViewCart}
                    className="w-full border border-ink/40 py-2.5 text-[11px] tracking-[.25em] uppercase hover:border-gold hover:text-gold transition-colors text-ink/80"
                  >
                    View Bag Details
                  </button>
                </div>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
