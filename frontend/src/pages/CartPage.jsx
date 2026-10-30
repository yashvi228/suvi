import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck, Tag, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { inr } from '../utils/formatters';
import JewelBadge from '../components/JewelBadge';

export default function CartPage() {
  const {
    cart,
    cartCount,
    subtotal,
    tax,
    discountAmount,
    total,
    coupon,
    updateQuantity,
    removeFromCart,
    clearCart,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [applying, setApplying] = useState(false);
  const navigate = useNavigate();

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setApplying(true);
    await applyCoupon(couponCode.trim());
    setApplying(false);
    setCouponCode('');
  };

  if (cart.length === 0) {
    return (
      <div className="pt-36 pb-28 min-h-screen bg-ivory text-center px-5">
        <div className="max-w-md mx-auto space-y-5">
          <div className="w-20 h-20 mx-auto rounded-full bg-cream grid place-items-center">
            <JewelBadge category="Rings" index={0} className="w-12 h-12" />
          </div>
          <h1 className="font-serif text-4xl text-ink">Your Bag is Empty</h1>
          <p className="text-xs text-ink/65 leading-relaxed">
            Your shopping bag awaits exceptional pieces. Discover our curated heirloom solitaire rings, diamond necklaces, and bridal sets.
          </p>
          <Link
            to="/shop"
            className="inline-block mt-4 px-8 py-3.5 bg-ink text-ivory text-[11px] tracking-[.3em] uppercase hover:bg-gold transition-colors font-medium"
          >
            Explore Collections
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-24 min-h-screen bg-ivory">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="border-b border-gold/30 pb-6 mb-10 flex flex-wrap justify-between items-end gap-4">
          <div>
            <p className="text-[11px] tracking-[.4em] uppercase text-gold font-medium">
              Review Bag
            </p>
            <h1 className="font-serif text-4xl md:text-5xl mt-1 text-ink">
              Your Selected Pieces
            </h1>
          </div>
          <button
            onClick={clearCart}
            className="text-xs text-ink/50 hover:text-red-700 underline tracking-wider uppercase"
          >
            Clear Entire Bag
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          {/* Items List */}
          <div className="lg:col-span-2 space-y-6">
            {cart.map((item, index) => {
              const p = item.product;
              const img = p.images && p.images.length > 0 ? p.images[0] : null;

              return (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row gap-5 p-5 bg-cream/30 border border-gold/30 rounded-sm relative"
                >
                  {/* Thumbnail */}
                  <Link
                    to={`/product/${p.id}`}
                    className="w-24 h-28 sm:w-28 sm:h-32 bg-cream shrink-0 overflow-hidden block"
                  >
                    {img ? (
                      <img src={img} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                      <JewelBadge category={p.category_name} index={index} />
                    )}
                  </Link>

                  {/* Detail */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <p className="text-[10px] tracking-[.3em] uppercase text-gold font-medium">
                            {p.category_name}
                          </p>
                          <Link to={`/product/${p.id}`}>
                            <h3 className="font-serif text-xl sm:text-2xl text-ink hover:text-gold transition">
                              {p.name}
                            </h3>
                          </Link>
                        </div>
                        <p className="font-serif text-xl font-medium text-ink">
                          {inr(p.price * item.quantity)}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-2 text-xs text-ink/70">
                        <span className="bg-ivory px-2 py-0.5 border border-gold/30">
                          {item.selectedMetal || p.metal_type}
                        </span>
                        <span className="bg-ivory px-2 py-0.5 border border-gold/30">
                          {item.selectedSize}
                        </span>
                        <span className="bg-ivory px-2 py-0.5 border border-gold/30">
                          Unit: {inr(p.price)}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-4 pt-3 border-t border-gold/20">
                      {/* Quantity Selector */}
                      <div className="flex items-center border border-gold/50 bg-ivory">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 grid place-items-center hover:bg-cream transition"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="w-9 text-center text-xs font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 grid place-items-center hover:bg-cream transition"
                        >
                          <Plus size={13} />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-xs text-ink/60 hover:text-red-700 flex items-center gap-1.5 transition"
                      >
                        <Trash2 size={13} /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="p-4 bg-cream/40 border border-gold/30 rounded-sm flex items-center gap-3 text-xs text-ink/75">
              <ShieldCheck size={20} className="text-gold shrink-0" />
              <div>
                <p className="font-semibold text-ink">Complimentary Insured Delivery</p>
                <p className="font-light">Every SUVI order travels in tamper-proof security cases with full transit insurance.</p>
              </div>
            </div>
          </div>

          {/* Order Summary & Coupon Card */}
          <div className="space-y-6">
            <div className="p-6 md:p-8 bg-cream/60 border border-gold/40 shadow-sm space-y-6">
              <h3 className="font-serif text-2xl pb-3 border-b border-gold/30">
                Order Summary
              </h3>

              {/* Coupon Input */}
              <div>
                <label className="block text-[10px] tracking-[.25em] uppercase text-ink/70 mb-2 font-medium">
                  Promotion Code
                </label>
                {coupon ? (
                  <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-300 text-xs text-emerald-900 rounded-sm">
                    <div className="flex items-center gap-1.5 font-medium">
                      <Tag size={13} />
                      <span>{coupon.code} ({coupon.discount_percent}% applied)</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-emerald-700 hover:text-red-700"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="e.g. SUVI10"
                      className="flex-1 bg-ivory border border-gold/40 px-3 py-2 text-xs uppercase outline-none focus:border-gold font-sans"
                    />
                    <button
                      type="submit"
                      disabled={applying}
                      className="px-4 py-2 bg-ink text-ivory text-[10px] tracking-[.2em] uppercase hover:bg-gold transition disabled:opacity-50 font-medium"
                    >
                      {applying ? 'Applying…' : 'Apply'}
                    </button>
                  </form>
                )}
                <p className="text-[10px] text-ink/50 mt-1.5">
                  Try <button type="button" onClick={() => setCouponCode('SUVI10')} className="underline text-gold">SUVI10</button> for 10% off orders over ₹20,000.
                </p>
              </div>

              {/* Calculation Breakdown */}
              <div className="space-y-3 pt-3 border-t border-gold/20 text-xs">
                <div className="flex justify-between">
                  <span className="text-ink/70">Subtotal ({cartCount} items)</span>
                  <span className="font-medium text-ink">{inr(subtotal)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-ink/70">Precious Metal GST (3%)</span>
                  <span className="font-medium text-ink">{inr(tax)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-ink/70">Insured Atelier Courier</span>
                  <span className="text-emerald-700 font-medium uppercase tracking-wider">
                    Free
                  </span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-800 font-medium">
                    <span>Coupon Savings</span>
                    <span>- {inr(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between items-baseline pt-4 border-t border-gold/30">
                  <span className="font-serif text-2xl text-ink">Total Payable</span>
                  <span className="font-serif text-2xl font-bold text-ink">{inr(total)}</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-ink text-ivory py-4 text-[12px] tracking-[.3em] uppercase hover:bg-gold transition-colors duration-300 font-medium flex items-center justify-center gap-2 group shadow-md"
              >
                Proceed to Checkout
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
