import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { CheckCircle, Package, Truck, ShieldCheck, ArrowRight } from 'lucide-react';
import api from '../services/api';
import { inr, formatDate } from '../utils/formatters';

export default function OrderConfirmationPage() {
  const { orderNumber } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!order);

  useEffect(() => {
    if (!order && orderNumber) {
      api.get(`/orders/${orderNumber}`)
        .then((res) => setOrder(res.data))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [order, orderNumber]);

  if (loading) {
    return (
      <div className="pt-36 pb-24 text-center">
        <p className="font-serif text-2xl">Retrieving order details…</p>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-24 min-h-screen bg-ivory">
      <div className="max-w-3xl mx-auto px-5 md:px-8 text-center">
        {/* Success Icon */}
        <div className="w-16 h-16 mx-auto rounded-full bg-cream border border-gold grid place-items-center mb-6">
          <CheckCircle size={32} className="text-gold" />
        </div>

        <p className="text-[11px] tracking-[.5em] uppercase text-gold font-medium">
          Order Confirmed
        </p>
        <h1 className="font-serif text-4xl md:text-6xl mt-2 text-ink">
          Thank you for your order
        </h1>
        <p className="mt-3 text-ink/70 text-sm max-w-md mx-auto font-light">
          Your bespoke piece has entered creation at our Surat atelier. A confirmation receipt has been sent to your email.
        </p>

        {/* Order Details Card */}
        {order && (
          <div className="mt-10 p-6 md:p-8 bg-cream/50 border border-gold/40 text-left space-y-6 shadow-sm">
            <div className="flex flex-wrap justify-between items-center gap-4 pb-4 border-b border-gold/30">
              <div>
                <p className="text-[10px] tracking-wider uppercase text-ink/50">Order Number</p>
                <p className="font-serif text-xl font-bold text-ink">{order.order_number}</p>
              </div>
              <div>
                <p className="text-[10px] tracking-wider uppercase text-ink/50">Tracking Number</p>
                <p className="text-sm font-medium text-gold">{order.tracking_number || 'Pending Allocation'}</p>
              </div>
              <div>
                <p className="text-[10px] tracking-wider uppercase text-ink/50">Order Status</p>
                <span className="inline-block px-2.5 py-0.5 bg-ink text-ivory text-[10px] tracking-wider uppercase font-medium">
                  {order.order_status}
                </span>
              </div>
            </div>

            {/* Items */}
            <div>
              <p className="text-[10px] tracking-[.25em] uppercase text-ink/70 font-semibold mb-3">
                Purchased Pieces
              </p>
              <div className="divide-y divide-gold/15">
                {order.items.map((item, idx) => (
                  <div key={idx} className="py-3 flex justify-between items-center text-xs">
                    <div>
                      <p className="font-medium text-ink">{item.name}</p>
                      <p className="text-[10px] text-ink/60">
                        Qty: {item.quantity} · {item.selected_metal || '18k Gold'} ({item.selected_size || 'Standard'})
                      </p>
                    </div>
                    <span className="font-serif text-sm font-semibold">{inr(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Address & Payment Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gold/30 text-xs">
              <div>
                <p className="text-[10px] tracking-wider uppercase text-ink/50 mb-1">
                  Shipping Destination
                </p>
                <p className="font-medium text-ink">{order.shipping_address.full_name}</p>
                <p className="text-ink/70 mt-0.5 leading-relaxed">
                  {order.shipping_address.address_line},<br />
                  {order.shipping_address.city}, {order.shipping_address.state} - {order.shipping_address.postal_code}
                </p>
                <p className="text-ink/70 mt-1">Phone: {order.shipping_address.phone}</p>
              </div>

              <div>
                <p className="text-[10px] tracking-wider uppercase text-ink/50 mb-1">
                  Payment Summary
                </p>
                <p className="font-medium text-ink">Method: {order.payment_method}</p>
                <p className="text-ink/70 mt-0.5">Payment Status: {order.payment_status}</p>
                <p className="font-serif text-2xl font-bold text-ink mt-3">
                  {inr(order.final_amount)}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            to="/shop"
            className="px-8 py-3.5 bg-ink text-ivory text-[11px] tracking-[.3em] uppercase hover:bg-gold transition-colors font-medium shadow-md"
          >
            Continue Shopping
          </Link>
          <Link
            to="/account?tab=orders"
            className="px-8 py-3.5 border border-ink text-ink text-[11px] tracking-[.3em] uppercase hover:border-gold hover:text-gold transition-colors font-medium"
          >
            View in Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
