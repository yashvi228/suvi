import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Package, Heart, MapPin, User, Plus, Trash2, ArrowRight, ShieldCheck, LogOut } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { inr, formatDate } from '../utils/formatters';
import JewelBadge from '../components/JewelBadge';
import ProductCard from '../components/ProductCard';

export default function UserDashboard({ onOpenAuth }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'orders';

  const { user, isAuthenticated, logout, setUser } = useAuth();
  const { addToCart, showToast } = useCart();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Address modal form
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newFullName, setNewFullName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newAddressLine, setNewAddressLine] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newState, setNewState] = useState('Gujarat');
  const [newPostalCode, setNewPostalCode] = useState('');
  const [newIsDefault, setNewIsDefault] = useState(false);

  // Profile edit form
  const [editName, setEditName] = useState(user?.full_name || '');
  const [editPhone, setEditPhone] = useState(user?.phone || '');
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }
    setEditName(user?.full_name || '');
    setEditPhone(user?.phone || '');

    const fetchData = async () => {
      setLoading(true);
      try {
        const [ordersRes, addrRes, prodsRes] = await Promise.all([
          api.get('/orders/my'),
          api.get('/user/addresses'),
          api.get('/products'),
        ]);

        setOrders(ordersRes.data);
        setAddresses(addrRes.data);
        setWishlistProducts(prodsRes.data.filter((p) => wishlist.includes(p.id)));
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, user, wishlist]);

  if (!isAuthenticated) {
    return (
      <div className="pt-36 pb-28 min-h-screen bg-ivory text-center px-5">
        <div className="max-w-md mx-auto space-y-4">
          <h2 className="font-serif text-3xl">Client Access Required</h2>
          <p className="text-xs text-ink/70">
            Please sign in to view your orders, saved heirloom pieces, and addresses.
          </p>
          <button
            onClick={onOpenAuth}
            className="mt-4 px-8 py-3 bg-ink text-ivory text-xs tracking-[.25em] uppercase hover:bg-gold transition-colors"
          >
            Sign In / Register
          </button>
        </div>
      </div>
    );
  }

  const handleCreateAddress = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/user/addresses', {
        full_name: newFullName,
        phone: newPhone,
        address_line: newAddressLine,
        city: newCity,
        state: newState,
        postal_code: newPostalCode,
        is_default: newIsDefault,
      });
      setAddresses([...addresses, res.data]);
      setShowAddressModal(false);
      showToast('Address saved successfully.');
      setNewFullName('');
      setNewPhone('');
      setNewAddressLine('');
      setNewCity('');
      setNewPostalCode('');
    } catch (err) {
      showToast(err.response?.data?.detail || 'Failed to save address');
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      await api.delete(`/user/addresses/${id}`);
      setAddresses(addresses.filter((a) => a.id !== id));
      showToast('Address removed');
    } catch (err) {
      showToast('Failed to remove address');
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await api.put('/user/profile', {
        full_name: editName,
        phone: editPhone,
      });
      setUser(res.data);
      showToast('Profile updated successfully.');
    } catch (err) {
      showToast('Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const tabs = [
    { id: 'orders', label: 'My Orders', icon: Package, count: orders.length },
    { id: 'wishlist', label: 'Saved Pieces', icon: Heart, count: wishlistProducts.length },
    { id: 'addresses', label: 'Addresses', icon: MapPin, count: addresses.length },
    { id: 'profile', label: 'Profile Details', icon: User },
  ];

  return (
    <div className="pt-28 pb-24 min-h-screen bg-ivory">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        {/* Welcome Header */}
        <div className="border-b border-gold/30 pb-6 mb-8 flex flex-wrap justify-between items-end gap-4">
          <div>
            <p className="text-[11px] tracking-[.4em] uppercase text-gold font-medium">
              Client Portal
            </p>
            <h1 className="font-serif text-3xl md:text-5xl mt-1 text-ink">
              Namaste, {user.full_name}
            </h1>
            <p className="text-xs text-ink/60 mt-1">Surat Atelier Patron · {user.email}</p>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 text-xs text-red-700 hover:text-red-900 uppercase tracking-wider transition"
          >
            <LogOut size={14} /> Sign Out
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-gold/30 mb-10 overflow-x-auto gap-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSearchParams({ tab: tab.id })}
                className={`flex items-center gap-2 pb-3 text-xs tracking-[.25em] uppercase border-b-2 whitespace-nowrap transition-all duration-300 ${
                  isActive
                    ? 'border-gold text-ink font-semibold'
                    : 'border-transparent text-ink/50 hover:text-ink'
                }`}
              >
                <Icon size={15} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className="text-[10px] bg-cream px-2 py-0.5 rounded-full text-ink">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab 1: Orders */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {orders.length === 0 ? (
              <div className="text-center py-20 bg-cream/30 border border-gold/20 p-8">
                <p className="font-serif text-2xl text-ink">No orders placed yet</p>
                <p className="text-xs text-ink/60 mt-1">
                  When you acquire an heirloom from SUVI, you can follow its creation and transit here.
                </p>
                <Link
                  to="/shop"
                  className="inline-block mt-4 px-6 py-2.5 bg-ink text-ivory text-[11px] tracking-[.25em] uppercase hover:bg-gold transition"
                >
                  Browse Creations
                </Link>
              </div>
            ) : (
              orders.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-cream/40 border border-gold/30 p-6 md:p-8 rounded-sm space-y-4"
                >
                  <div className="flex flex-wrap justify-between items-center gap-4 pb-4 border-b border-gold/20 text-xs">
                    <div>
                      <p className="text-[10px] text-ink/50 uppercase tracking-wider">Order Reference</p>
                      <p className="font-serif text-lg font-bold text-ink">{ord.order_number}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-ink/50 uppercase tracking-wider">Placed Date</p>
                      <p className="font-medium text-ink">{formatDate(ord.created_at)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-ink/50 uppercase tracking-wider">Status</p>
                      <span className="inline-block px-2.5 py-0.5 bg-ink text-ivory text-[10px] tracking-wider uppercase font-medium">
                        {ord.order_status}
                      </span>
                    </div>
                    <div>
                      <p className="text-[10px] text-ink/50 uppercase tracking-wider">Total Value</p>
                      <p className="font-serif text-xl font-bold text-ink">{inr(ord.final_amount)}</p>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="space-y-3 pt-2">
                    {ord.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs">
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

                  <div className="pt-3 border-t border-gold/20 flex justify-between items-center text-xs text-ink/70">
                    <p>
                      Tracking ID: <span className="text-gold font-medium">{ord.tracking_number || 'TRK-ASSIGNING'}</span>
                    </p>
                    <p className="text-emerald-700 font-medium">Payment: {ord.payment_status} ({ord.payment_method})</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 2: Wishlist */}
        {activeTab === 'wishlist' && (
          <div>
            {wishlistProducts.length === 0 ? (
              <div className="text-center py-20 bg-cream/30 border border-gold/20 p-8">
                <p className="font-serif text-2xl text-ink">No saved pieces in your wishlist</p>
                <p className="text-xs text-ink/60 mt-1">
                  Click the heart icon on any jewellery piece to curate your private collection.
                </p>
                <Link
                  to="/shop"
                  className="inline-block mt-4 px-6 py-2.5 bg-ink text-ivory text-[11px] tracking-[.25em] uppercase hover:bg-gold transition"
                >
                  Discover Collections
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {wishlistProducts.map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Saved Addresses */}
        {activeTab === 'addresses' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-serif text-2xl">Delivery Addresses</h3>
              <button
                onClick={() => setShowAddressModal(true)}
                className="flex items-center gap-1.5 px-4 py-2 border border-ink text-xs tracking-wider uppercase hover:bg-ink hover:text-ivory transition"
              >
                <Plus size={14} /> Add New Address
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className="p-6 bg-cream/40 border border-gold/30 rounded-sm relative space-y-2 text-xs"
                >
                  {addr.is_default && (
                    <span className="inline-block px-2 py-0.5 bg-gold text-white text-[9px] uppercase tracking-wider font-medium mb-1">
                      Default Delivery
                    </span>
                  )}
                  <p className="font-serif text-lg font-bold text-ink">{addr.full_name}</p>
                  <p className="text-ink/80 leading-relaxed">
                    {addr.address_line},<br />
                    {addr.city}, {addr.state} - {addr.postal_code}
                  </p>
                  <p className="text-ink/70">Phone: {addr.phone}</p>
                  <div className="pt-3 border-t border-gold/20 flex justify-end">
                    <button
                      onClick={() => handleDeleteAddress(addr.id)}
                      className="text-red-700 hover:text-red-900 flex items-center gap-1 text-[11px] uppercase tracking-wider"
                    >
                      <Trash2 size={12} /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Address Modal */}
            {showAddressModal && (
              <div className="fixed inset-0 z-50 grid place-items-center p-4 bg-ink/60 backdrop-blur-sm">
                <div className="bg-ivory max-w-md w-full p-6 border border-gold/40 shadow-xl space-y-4">
                  <h4 className="font-serif text-2xl">New Delivery Destination</h4>
                  <form onSubmit={handleCreateAddress} className="space-y-3">
                    <input
                      required
                      placeholder="Full Name"
                      value={newFullName}
                      onChange={(e) => setNewFullName(e.target.value)}
                      className="w-full bg-cream/40 border border-gold/40 p-2 text-xs outline-none"
                    />
                    <input
                      required
                      placeholder="Phone Number"
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      className="w-full bg-cream/40 border border-gold/40 p-2 text-xs outline-none"
                    />
                    <input
                      required
                      placeholder="Street Address, Apt / Floor"
                      value={newAddressLine}
                      onChange={(e) => setNewAddressLine(e.target.value)}
                      className="w-full bg-cream/40 border border-gold/40 p-2 text-xs outline-none"
                    />
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        required
                        placeholder="City"
                        value={newCity}
                        onChange={(e) => setNewCity(e.target.value)}
                        className="bg-cream/40 border border-gold/40 p-2 text-xs outline-none"
                      />
                      <input
                        required
                        placeholder="State"
                        value={newState}
                        onChange={(e) => setNewState(e.target.value)}
                        className="bg-cream/40 border border-gold/40 p-2 text-xs outline-none"
                      />
                      <input
                        required
                        placeholder="PIN Code"
                        value={newPostalCode}
                        onChange={(e) => setNewPostalCode(e.target.value)}
                        className="bg-cream/40 border border-gold/40 p-2 text-xs outline-none"
                      />
                    </div>
                    <label className="flex items-center gap-2 text-xs cursor-pointer pt-1">
                      <input
                        type="checkbox"
                        checked={newIsDefault}
                        onChange={(e) => setNewIsDefault(e.target.checked)}
                        className="accent-[#b8935a]"
                      />
                      Set as primary default address
                    </label>
                    <div className="flex gap-2 pt-3">
                      <button
                        type="submit"
                        className="flex-1 py-2.5 bg-ink text-ivory text-xs uppercase tracking-wider hover:bg-gold transition"
                      >
                        Save Address
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAddressModal(false)}
                        className="px-4 py-2.5 border border-ink/30 text-xs uppercase tracking-wider"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Profile Details */}
        {activeTab === 'profile' && (
          <div className="max-w-xl bg-cream/40 border border-gold/30 p-8 rounded-sm space-y-6">
            <h3 className="font-serif text-2xl">Personal Information</h3>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-[10px] tracking-[.25em] uppercase text-ink/70 mb-1">
                  Full Name
                </label>
                <input
                  required
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-ivory border border-gold/40 px-3 py-2 text-sm outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-[10px] tracking-[.25em] uppercase text-ink/70 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full bg-ivory border border-gold/40 px-3 py-2 text-sm outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-[10px] tracking-[.25em] uppercase text-ink/70 mb-1">
                  Email Address (Verified)
                </label>
                <input
                  disabled
                  value={user.email}
                  className="w-full bg-ivory/60 border border-gold/20 px-3 py-2 text-sm outline-none opacity-70 cursor-not-allowed text-ink/70"
                />
              </div>

              <button
                type="submit"
                disabled={savingProfile}
                className="w-full py-3 bg-ink text-ivory text-[11px] tracking-[.25em] uppercase hover:bg-gold transition disabled:opacity-50 font-medium"
              >
                {savingProfile ? 'Saving…' : 'Update Profile'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
