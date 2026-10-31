import React, { useState, useEffect } from 'react';
import { Shield, DollarSign, ShoppingBag, Users, AlertTriangle, Plus, Trash2, Edit3, CheckCircle, RefreshCw, Upload } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { inr, formatDate } from '../utils/formatters';

export default function AdminDashboard({ onOpenAuth }) {
  const { user, isAdmin, isAuthenticated } = useAuth();

  const [analytics, setAnalytics] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'products', 'customers'
  const [loading, setLoading] = useState(true);

  // Add Product Modal
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdSlug, setNewProdSlug] = useState('');
  const [newProdCatId, setNewProdCatId] = useState(1);
  const [newProdPrice, setNewProdPrice] = useState(45000);
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdMetal, setNewProdMetal] = useState('18k Yellow Gold');
  const [newProdDiamond, setNewProdDiamond] = useState('0.50 ct');
  const [newProdStock, setNewProdStock] = useState(10);
  const [newProdTag, setNewProdTag] = useState('new');
  const [newProdImage, setNewProdImage] = useState('https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80');

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [anRes, ordRes, prodRes, custRes, catRes] = await Promise.all([
        api.get('/admin/analytics'),
        api.get('/admin/orders'),
        api.get('/products'),
        api.get('/admin/customers'),
        api.get('/categories'),
      ]);

      setAnalytics(anRes.data);
      setOrders(ordRes.data);
      setProducts(prodRes.data);
      setCustomers(custRes.data);
      setCategories(catRes.data);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchAdminData();
    }
  }, [isAdmin]);

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="pt-36 pb-28 min-h-screen bg-ivory text-center px-5">
        <div className="max-w-md mx-auto space-y-4">
          <Shield size={40} className="mx-auto text-gold" />
          <h2 className="font-serif text-3xl">Atelier Admin Clearance Required</h2>
          <p className="text-xs text-ink/70">
            You must be signed in with administrative credentials (e.g. admin@suvi.com) to access store operations.
          </p>
          <button
            onClick={onOpenAuth}
            className="mt-4 px-8 py-3 bg-ink text-ivory text-xs tracking-[.25em] uppercase hover:bg-gold transition-colors"
          >
            Authenticate Admin
          </button>
        </div>
      </div>
    );
  }

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.patch(`/orders/${orderId}/status`, { order_status: newStatus });
      setOrders(orders.map((o) => (o.id === orderId ? { ...o, order_status: newStatus } : o)));
    } catch (err) {
      alert('Failed to update order status');
    }
  };

  const handleDeleteProduct = async (prodId) => {
    if (!window.confirm('Are you sure you want to retire this jewellery creation?')) return;
    try {
      await api.delete(`/products/${prodId}`);
      setProducts(products.filter((p) => p.id !== prodId));
    } catch (err) {
      alert('Failed to delete product');
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setNewProdImage(res.data.url);
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: newProdName,
        slug: newProdSlug || newProdName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        category_id: Number(newProdCatId),
        price: Number(newProdPrice),
        description: newProdDesc,
        metal_type: newProdMetal,
        diamond_weight: newProdDiamond,
        stock: Number(newProdStock),
        tag: newProdTag || null,
        images: newProdImage ? [newProdImage] : [],
        is_featured: true,
      };

      const res = await api.post('/products', payload);
      setProducts([res.data, ...products]);
      setShowAddProductModal(false);
      alert('Creation added to the catalog!');
      setNewProdName('');
      setNewProdDesc('');
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to create product');
    }
  };

  return (
    <div className="pt-28 pb-24 min-h-screen bg-ivory">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        {/* Admin Header */}
        <div className="border-b border-gold/30 pb-6 mb-8 flex flex-wrap justify-between items-end gap-4">
          <div>
            <div className="flex items-center gap-2 text-gold">
              <Shield size={16} />
              <p className="text-[11px] tracking-[.4em] uppercase font-medium">
                Atelier Administration
              </p>
            </div>
            <h1 className="font-serif text-3xl md:text-5xl mt-1 text-ink">
              SUVI Atelier Operations
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchAdminData}
              className="p-2 border border-gold/40 hover:bg-cream transition"
              title="Refresh Analytics"
            >
              <RefreshCw size={15} />
            </button>
            <button
              onClick={() => setShowAddProductModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-ink text-ivory text-xs tracking-wider uppercase hover:bg-gold transition font-medium"
            >
              <Plus size={15} /> Add New Creation
            </button>
          </div>
        </div>

        {/* Analytics KPI Cards */}
        {analytics && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="p-6 bg-cream/60 border border-gold/30 rounded-sm space-y-2">
              <div className="flex justify-between items-center text-ink/60">
                <span className="text-[10px] uppercase tracking-wider font-semibold">Total Revenue</span>
                <DollarSign size={16} className="text-gold" />
              </div>
              <p className="font-serif text-3xl font-bold text-ink">{inr(analytics.total_revenue)}</p>
              <p className="text-[10px] text-emerald-800 font-medium">Verified Paid Sales</p>
            </div>

            <div className="p-6 bg-cream/60 border border-gold/30 rounded-sm space-y-2">
              <div className="flex justify-between items-center text-ink/60">
                <span className="text-[10px] uppercase tracking-wider font-semibold">Total Orders</span>
                <ShoppingBag size={16} className="text-gold" />
              </div>
              <p className="font-serif text-3xl font-bold text-ink">{analytics.total_orders}</p>
              <p className="text-[10px] text-ink/60 font-medium">Active client commissions</p>
            </div>

            <div className="p-6 bg-cream/60 border border-gold/30 rounded-sm space-y-2">
              <div className="flex justify-between items-center text-ink/60">
                <span className="text-[10px] uppercase tracking-wider font-semibold">Registered Patrons</span>
                <Users size={16} className="text-gold" />
              </div>
              <p className="font-serif text-3xl font-bold text-ink">{analytics.total_customers}</p>
              <p className="text-[10px] text-ink/60 font-medium">Surat atelier clientele</p>
            </div>

            <div className="p-6 bg-cream/60 border border-gold/30 rounded-sm space-y-2">
              <div className="flex justify-between items-center text-ink/60">
                <span className="text-[10px] uppercase tracking-wider font-semibold">Catalog Creations</span>
                <AlertTriangle size={16} className="text-gold" />
              </div>
              <p className="font-serif text-3xl font-bold text-ink">{analytics.total_products}</p>
              <p className="text-[10px] text-amber-800 font-medium">{analytics.low_stock_products} low in stock</p>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex border-b border-gold/30 mb-8 gap-8 text-xs uppercase tracking-[.25em]">
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 border-b-2 transition ${
              activeTab === 'orders' ? 'border-gold text-ink font-semibold' : 'border-transparent text-ink/50'
            }`}
          >
            Order Management ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`pb-3 border-b-2 transition ${
              activeTab === 'products' ? 'border-gold text-ink font-semibold' : 'border-transparent text-ink/50'
            }`}
          >
            Inventory & Catalog ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('customers')}
            className={`pb-3 border-b-2 transition ${
              activeTab === 'customers' ? 'border-gold text-ink font-semibold' : 'border-transparent text-ink/50'
            }`}
          >
            Registered Patrons ({customers.length})
          </button>
        </div>

        {/* Tab 1: Orders Management */}
        {activeTab === 'orders' && (
          <div className="overflow-x-auto bg-cream/30 border border-gold/30 rounded-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-cream border-b border-gold/30 text-[10px] uppercase tracking-wider text-ink/70">
                <tr>
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Patron</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Payment</th>
                  <th className="p-4">Status & Dispatch</th>
                  <th className="p-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold/15">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-cream/40 transition">
                    <td className="p-4 font-serif text-sm font-bold text-ink">{ord.order_number}</td>
                    <td className="p-4">
                      <p className="font-medium text-ink">{ord.customer_name}</p>
                      <p className="text-[10px] text-ink/60">{ord.customer_phone}</p>
                    </td>
                    <td className="p-4 font-serif text-sm font-semibold">{inr(ord.final_amount)}</td>
                    <td className="p-4">
                      <span className="inline-block px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-medium rounded-sm">
                        {ord.payment_status} ({ord.payment_method})
                      </span>
                    </td>
                    <td className="p-4">
                      <select
                        value={ord.order_status}
                        onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                        className="bg-ivory border border-gold/40 px-2.5 py-1 text-xs outline-none cursor-pointer"
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="PROCESSING">PROCESSING</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </td>
                    <td className="p-4 text-ink/60">{formatDate(ord.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Products Catalog CRUD */}
        {activeTab === 'products' && (
          <div className="overflow-x-auto bg-cream/30 border border-gold/30 rounded-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-cream border-b border-gold/30 text-[10px] uppercase tracking-wider text-ink/70">
                <tr>
                  <th className="p-4">Piece Name</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Alloy & Specs</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold/15">
                {products.map((prod) => (
                  <tr key={prod.id} className="hover:bg-cream/40 transition">
                    <td className="p-4">
                      <p className="font-serif text-sm font-bold text-ink">{prod.name}</p>
                      <p className="text-[10px] text-ink/50">{prod.slug}</p>
                    </td>
                    <td className="p-4 text-gold font-medium">{prod.category_name}</td>
                    <td className="p-4 font-serif text-sm">{inr(prod.price)}</td>
                    <td className="p-4">
                      <p>{prod.metal_type}</p>
                      <p className="text-[10px] text-ink/60">{prod.diamond_weight}</p>
                    </td>
                    <td className="p-4">
                      <span className={`font-semibold ${prod.stock <= 5 ? 'text-amber-800' : 'text-emerald-800'}`}>
                        {prod.stock} in stock
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDeleteProduct(prod.id)}
                        className="text-red-700 hover:text-red-900 p-1"
                        title="Delete Product"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 3: Registered Patrons */}
        {activeTab === 'customers' && (
          <div className="overflow-x-auto bg-cream/30 border border-gold/30 rounded-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-cream border-b border-gold/30 text-[10px] uppercase tracking-wider text-ink/70">
                <tr>
                  <th className="p-4">Patron Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">Membership Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold/15">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-cream/40 transition">
                    <td className="p-4 font-serif text-sm font-bold text-ink">{c.full_name}</td>
                    <td className="p-4">{c.email}</td>
                    <td className="p-4 text-ink/70">{c.phone || 'N/A'}</td>
                    <td className="p-4 text-ink/60">{formatDate(c.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal: Add New Creation */}
        {showAddProductModal && (
          <div className="fixed inset-0 z-50 grid place-items-center p-4 bg-ink/60 backdrop-blur-sm">
            <div className="bg-ivory max-w-lg w-full p-8 border border-gold/40 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
              <h3 className="font-serif text-3xl">Craft New Jewellery Creation</h3>
              <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-ink/70 mb-1">Creation Title</label>
                  <input
                    required
                    value={newProdName}
                    onChange={(e) => {
                      setNewProdName(e.target.value);
                      setNewProdSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                    }}
                    placeholder="e.g. Royal Emerald Choker"
                    className="w-full bg-cream/40 border border-gold/40 p-2 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-ink/70 mb-1">Category</label>
                    <select
                      value={newProdCatId}
                      onChange={(e) => setNewProdCatId(Number(e.target.value))}
                      className="w-full bg-cream/40 border border-gold/40 p-2 outline-none"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-ink/70 mb-1">Price (INR)</label>
                    <input
                      required
                      type="number"
                      value={newProdPrice}
                      onChange={(e) => setNewProdPrice(e.target.value)}
                      className="w-full bg-cream/40 border border-gold/40 p-2 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-ink/70 mb-1">Description</label>
                  <textarea
                    required
                    rows={3}
                    value={newProdDesc}
                    onChange={(e) => setNewProdDesc(e.target.value)}
                    placeholder="Detailed artisanal craftsmanship description…"
                    className="w-full bg-cream/40 border border-gold/40 p-2 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-ink/70 mb-1">Metal Alloy</label>
                    <input
                      value={newProdMetal}
                      onChange={(e) => setNewProdMetal(e.target.value)}
                      placeholder="18k Yellow Gold"
                      className="w-full bg-cream/40 border border-gold/40 p-2 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-ink/70 mb-1">Diamond Carat</label>
                    <input
                      value={newProdDiamond}
                      onChange={(e) => setNewProdDiamond(e.target.value)}
                      placeholder="0.75 ct (VVS1)"
                      className="w-full bg-cream/40 border border-gold/40 p-2 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-ink/70 mb-1">Initial Stock</label>
                    <input
                      type="number"
                      value={newProdStock}
                      onChange={(e) => setNewProdStock(e.target.value)}
                      className="w-full bg-cream/40 border border-gold/40 p-2 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-ink/70 mb-1">Highlight Tag</label>
                    <select
                      value={newProdTag}
                      onChange={(e) => setNewProdTag(e.target.value)}
                      className="w-full bg-cream/40 border border-gold/40 p-2 outline-none"
                    >
                      <option value="new">New Arrival</option>
                      <option value="best">Bestseller</option>
                      <option value="trend">Trending</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-ink/70 mb-1">
                    Jewellery Photography (Upload Image or Paste URL)
                  </label>
                  <div className="flex gap-2">
                    <input
                      value={newProdImage}
                      onChange={(e) => setNewProdImage(e.target.value)}
                      placeholder="https://... or /uploads/... or /images/..."
                      className="flex-1 bg-cream/40 border border-gold/40 p-2 outline-none font-sans"
                    />
                    <label className="cursor-pointer bg-ink text-ivory px-3 py-2 text-[10px] uppercase tracking-wider hover:bg-gold transition flex items-center gap-1.5 shrink-0 font-medium">
                      <Upload size={12} />
                      <span>{uploadingImage ? 'Uploading…' : 'Upload File'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                        disabled={uploadingImage}
                      />
                    </label>
                  </div>
                  {newProdImage && (
                    <div className="mt-2.5 flex items-center gap-3 p-2 bg-cream/30 border border-gold/30 rounded-sm">
                      <div className="w-12 h-14 bg-cream overflow-hidden rounded-sm border border-gold/40 shrink-0">
                        <img src={newProdImage} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                      <div className="truncate text-[10px] text-ink/70">
                        <p className="font-medium text-ink truncate">Image Preview Loaded</p>
                        <p className="truncate text-ink/50">{newProdImage}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-3">
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-ink text-ivory text-xs uppercase tracking-wider hover:bg-gold transition"
                  >
                    Publish to Storefront
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddProductModal(false)}
                    className="px-5 py-3 border border-ink/40 text-xs uppercase tracking-wider"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
