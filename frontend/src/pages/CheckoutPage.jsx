import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, CreditCard, Smartphone, Building, Banknote, ArrowLeft } from 'lucide-react';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { inr } from '../utils/formatters';

export default function CheckoutPage() {
  const { cart, subtotal, discountAmount, total, coupon, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Shipping form state
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [addressLine, setAddressLine] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Gujarat');
  const [postalCode, setPostalCode] = useState('');

  // Payment selection
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState('');

  // Pre-fill if addresses exist
  useEffect(() => {
    if (isAuthenticated) {
      api.get('/user/addresses')
        .then((res) => {
          if (res.data && res.data.length > 0) {
            const def = res.data.find((a) => a.is_default) || res.data[0];
            setFullName(def.full_name || user?.full_name || '');
            setPhone(def.phone || user?.phone || '');
            setAddressLine(def.address_line || '');
            setCity(def.city || '');
            setState(def.state || 'Gujarat');
            setPostalCode(def.postal_code || '');
          }
        })
        .catch(() => {});
    }
  }, [isAuthenticated, user]);

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError('');
    setPlacingOrder(true);

    const orderPayload = {
      items: cart.map((item) => ({
        product_id: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        selected_size: item.selectedSize,
        selected_metal: item.selectedMetal,
        image: item.product.images?.[0] || null,
      })),
      shipping_address: {
        full_name: fullName,
        phone,
        address_line: addressLine,
        city,
        state,
        postal_code: postalCode,
      },
      total_amount: subtotal,
      discount_amount: discountAmount,
      final_amount: total,
      payment_method: paymentMethod,
      coupon_code: coupon?.code || null,
    };

    try {
      const res = await api.post('/orders', orderPayload);
      clearCart();
      navigate(`/order-confirmation/${res.data.order_number}`, { state: { order: res.data } });
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to place order. Please try again.');
      setPlacingOrder(false);
    }
  };

  return (
    <div className="pt-28 pb-24 min-h-screen bg-ivory">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="border-b border-gold/30 pb-4 mb-8">
          <p className="text-[11px] tracking-[.4em] uppercase text-gold font-medium">
            Secure Checkout
          </p>
          <h1 className="font-serif text-3xl md:text-5xl mt-1 text-ink">
            Order Placement
          </h1>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Form Information */}
          <div className="lg:col-span-2 space-y-10">
            {/* 1. Shipping Address */}
            <div className="bg-cream/40 p-6 md:p-8 border border-gold/30 rounded-sm space-y-4">
              <h3 className="font-serif text-2xl text-ink border-b border-gold/20 pb-3">
                1. Atelier Delivery Address
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] tracking-[.25em] uppercase text-ink/70 mb-1">
                    Recipient Full Name
                  </label>
                  <input
                    required
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ananya Sharma"
                    className="w-full bg-ivory border border-gold/40 px-3 py-2 text-sm outline-none focus:border-gold font-sans"
                  />
                </div>

                <div>
                  <label className="block text-[10px] tracking-[.25em] uppercase text-ink/70 mb-1">
                    Contact Phone Number
                  </label>
                  <input
                    required
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98200 12345"
                    className="w-full bg-ivory border border-gold/40 px-3 py-2 text-sm outline-none focus:border-gold font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] tracking-[.25em] uppercase text-ink/70 mb-1">
                  Street Address & Residence
                </label>
                <input
                  required
                  type="text"
                  value={addressLine}
                  onChange={(e) => setAddressLine(e.target.value)}
                  placeholder="Flat No, Building Name, Street / Avenue"
                  className="w-full bg-ivory border border-gold/40 px-3 py-2 text-sm outline-none focus:border-gold font-sans"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] tracking-[.25em] uppercase text-ink/70 mb-1">
                    City
                  </label>
                  <input
                    required
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Mumbai / Surat"
                    className="w-full bg-ivory border border-gold/40 px-3 py-2 text-sm outline-none focus:border-gold font-sans"
                  />
                </div>

                <div>
                  <label className="block text-[10px] tracking-[.25em] uppercase text-ink/70 mb-1">
                    State
                  </label>
                  <input
                    required
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="Maharashtra / Gujarat"
                    className="w-full bg-ivory border border-gold/40 px-3 py-2 text-sm outline-none focus:border-gold font-sans"
                  />
                </div>

                <div>
                  <label className="block text-[10px] tracking-[.25em] uppercase text-ink/70 mb-1">
                    PIN Code
                  </label>
                  <input
                    required
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="400018"
                    className="w-full bg-ivory border border-gold/40 px-3 py-2 text-sm outline-none focus:border-gold font-sans"
                  />
                </div>
              </div>
            </div>

            {/* 2. Payment Method */}
            <div className="bg-cream/40 p-6 md:p-8 border border-gold/30 rounded-sm space-y-4">
              <h3 className="font-serif text-2xl text-ink border-b border-gold/20 pb-3">
                2. Select Payment Method
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { id: 'UPI', label: 'UPI / QR Instant', icon: Smartphone, desc: 'Google Pay, PhonePe, Paytm, BHIM' },
                  { id: 'Credit / Debit Card', label: 'Credit or Debit Card', icon: CreditCard, desc: 'Visa, MasterCard, Amex, RuPay' },
                  { id: 'Net Banking', label: 'Net Banking', icon: Building, desc: 'All major Indian banks supported' },
                  { id: 'Cash on Delivery', label: 'Cash on Delivery', icon: Banknote, desc: 'Verification call before dispatch' },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <label
                      key={item.id}
                      className={`flex items-start gap-3 p-4 border cursor-pointer transition ${
                        paymentMethod === item.id
                          ? 'border-gold bg-gold/10'
                          : 'border-gold/30 bg-ivory hover:border-gold/70'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={item.id}
                        checked={paymentMethod === item.id}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="accent-[#b8935a] mt-1"
                      />
                      <div>
                        <div className="flex items-center gap-1.5 font-medium text-sm text-ink">
                          <Icon size={15} className="text-gold" />
                          <span>{item.label}</span>
                        </div>
                        <p className="text-[11px] text-ink/60 mt-0.5">{item.desc}</p>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Summary */}
          <div className="space-y-6">
            <div className="p-6 md:p-8 bg-cream/70 border border-gold/40 shadow-sm space-y-6 sticky top-28">
              <h3 className="font-serif text-2xl pb-3 border-b border-gold/30">
                Order Review
              </h3>

              {/* Items List */}
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-xs">
                    <div className="truncate pr-2">
                      <p className="font-medium text-ink truncate">{item.product.name}</p>
                      <p className="text-[10px] text-ink/50">
                        Qty: {item.quantity} · {item.selectedMetal}
                      </p>
                    </div>
                    <span className="font-serif text-sm shrink-0">
                      {inr(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Total Calculation */}
              <div className="space-y-2 pt-4 border-t border-gold/20 text-xs">
                <div className="flex justify-between text-ink/70">
                  <span>Subtotal</span>
                  <span>{inr(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-800 font-medium">
                    <span>Discount ({coupon?.code})</span>
                    <span>- {inr(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-ink/70">
                  <span>Insured Courier</span>
                  <span className="text-emerald-700 font-medium uppercase">Free</span>
                </div>
                <div className="flex justify-between items-baseline pt-3 border-t border-gold/30">
                  <span className="font-serif text-xl">Total Amount</span>
                  <span className="font-serif text-2xl font-bold text-ink">{inr(total)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={placingOrder}
                className="w-full bg-ink text-ivory py-4 text-[12px] tracking-[.3em] uppercase hover:bg-gold transition-colors duration-300 font-medium disabled:opacity-50 shadow-md"
              >
                {placingOrder ? 'Confirming Order…' : `Authorize & Pay ${inr(total)}`}
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-ink/60 pt-2">
                <Lock size={12} className="text-gold" />
                <span>256-Bit SSL Encrypted Luxury Checkout</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
