import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, X, SlidersHorizontal, Search, RotateCcw } from 'lucide-react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import { inr } from '../utils/formatters';

const CATEGORIES = [
  'All',
  'Rings',
  'Earrings',
  'Necklaces',
  'Bangles',
  'Bracelets',
  'Bridal Jewellery',
];

const METALS = [
  'All',
  '18k Yellow Gold',
  '18k Rose Gold',
  '18k White Gold',
];

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // Filter states
  const categoryParam = searchParams.get('category') || 'All';
  const queryParam = searchParams.get('q') || '';
  const tagParam = searchParams.get('tag') || '';

  const [selectedCat, setSelectedCat] = useState(categoryParam);
  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [selectedMetal, setSelectedMetal] = useState('All');
  const [maxPrice, setMaxPrice] = useState(250000);
  const [selectedTag, setSelectedTag] = useState(tagParam);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortOrder, setSortOrder] = useState('f');

  // Sync state if URL query params change
  useEffect(() => {
    if (searchParams.get('category')) {
      setSelectedCat(searchParams.get('category'));
    }
    if (searchParams.get('q')) {
      setSearchQuery(searchParams.get('q'));
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchAllProducts = async () => {
      setLoading(true);
      try {
        const res = await api.get('/products');
        setProducts(res.data);
      } catch (err) {
        console.error('Error fetching catalog:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllProducts();
  }, []);

  const resetFilters = () => {
    setSelectedCat('All');
    setSearchQuery('');
    setSelectedMetal('All');
    setMaxPrice(250000);
    setSelectedTag('');
    setInStockOnly(false);
    setSortOrder('f');
    setSearchParams({});
  };

  // Filter & Sort
  const filteredProducts = useMemo(() => {
    let result = products.filter((p) => {
      // Category
      if (selectedCat !== 'All' && p.category_name !== selectedCat) return false;
      // Search
      if (
        searchQuery &&
        !p.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !p.description.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      // Metal
      if (selectedMetal !== 'All' && !p.metal_type?.includes(selectedMetal)) return false;
      // Price
      if (p.price > maxPrice) return false;
      // Tag
      if (selectedTag && p.tag !== selectedTag) return false;
      // In Stock
      if (inStockOnly && p.stock <= 0) return false;

      return true;
    });

    if (sortOrder === 'l') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'h') {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (sortOrder === 'r') {
      result = [...result].sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [products, selectedCat, searchQuery, selectedMetal, maxPrice, selectedTag, inStockOnly, sortOrder]);

  return (
    <div className="pt-28 pb-24 min-h-screen bg-ivory">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-5 md:px-8 mb-10 text-center">
        <p className="text-[11px] tracking-[.5em] uppercase text-gold font-medium">
          Surat Atelier Catalog
        </p>
        <h1 className="font-serif text-5xl md:text-6xl mt-2 text-ink">
          The Fine Jewellery Collection
        </h1>
        <p className="mt-3 text-ink/70 text-sm max-w-lg mx-auto font-light">
          Each piece is uniquely handcrafted in hallmarked 18k gold with natural certified diamonds.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-5 md:px-8">
        {/* Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-gold/30 mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setFilterDrawerOpen(true)}
              className="lg:hidden flex items-center gap-2 border border-gold/50 px-4 py-2 text-xs tracking-wider uppercase"
            >
              <Filter size={14} /> Filter & Refine
            </button>
            <p className="text-xs text-ink/70 tracking-wider">
              Showing <span className="font-semibold text-ink">{filteredProducts.length}</span> pieces
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-ink/60 uppercase tracking-wider hidden sm:inline">
              Sort by:
            </span>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="bg-transparent border border-gold/40 px-3 py-1.5 text-xs outline-none cursor-pointer"
            >
              <option value="f">Featured Creations</option>
              <option value="l">Price: Low to High</option>
              <option value="h">Price: High to Low</option>
              <option value="r">Highest Rated</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 items-start">
          {/* Desktop Sidebar Filters */}
          <aside className="hidden lg:block space-y-8 pr-6 border-r border-gold/20 sticky top-28">
            <div className="flex justify-between items-center pb-2 border-b border-gold/30">
              <h3 className="font-serif text-2xl">Refine</h3>
              <button
                onClick={resetFilters}
                className="text-[10px] tracking-wider uppercase text-gold hover:text-ink flex items-center gap-1"
              >
                <RotateCcw size={11} /> Reset
              </button>
            </div>

            {/* Keyword Search */}
            <div>
              <label className="block text-[11px] tracking-[.25em] uppercase text-ink/70 mb-2 font-medium">
                Keyword Search
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. Solitaire, Tiara…"
                  className="w-full bg-cream/40 border border-gold/40 px-3 py-2 text-xs outline-none focus:border-gold"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-2.5 text-ink/40 hover:text-ink"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>
            </div>

            {/* Categories */}
            <div>
              <label className="block text-[11px] tracking-[.25em] uppercase text-ink/70 mb-3 font-medium">
                Category
              </label>
              <div className="space-y-1.5">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCat(cat)}
                    className={`block w-full text-left py-1 text-xs tracking-wider transition-colors ${
                      selectedCat === cat
                        ? 'text-gold font-semibold translate-x-1'
                        : 'text-ink/70 hover:text-ink'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-[11px] tracking-[.25em] uppercase text-ink/70 font-medium">
                  Max Price
                </label>
                <span className="text-xs font-semibold text-ink">{inr(maxPrice)}</span>
              </div>
              <input
                type="range"
                min="20000"
                max="250000"
                step="5000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#b8935a] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-ink/50 mt-1">
                <span>₹20,000</span>
                <span>₹2,50,000+</span>
              </div>
            </div>

            {/* Metal Options */}
            <div>
              <label className="block text-[11px] tracking-[.25em] uppercase text-ink/70 mb-2 font-medium">
                Metal Alloy
              </label>
              <div className="space-y-1.5">
                {METALS.map((metal) => (
                  <label key={metal} className="flex items-center gap-2 text-xs text-ink/80 cursor-pointer">
                    <input
                      type="radio"
                      name="metal"
                      checked={selectedMetal === metal}
                      onChange={() => setSelectedMetal(metal)}
                      className="accent-[#b8935a]"
                    />
                    {metal}
                  </label>
                ))}
              </div>
            </div>

            {/* In-Stock Only */}
            <div className="pt-2 border-t border-gold/20">
              <label className="flex items-center gap-2 text-xs text-ink/80 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="accent-[#b8935a]"
                />
                In Stock Ready to Ship
              </label>
            </div>
          </aside>

          {/* Product Grid Area */}
          <main className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div key={n} className="aspect-[4/5] bg-cream/70 animate-pulse rounded-sm" />
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 md:gap-x-6 gap-y-12">
                {filteredProducts.map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} />
                ))}
              </div>
            ) : (
              <div className="text-center py-24 bg-cream/30 border border-gold/20 p-10">
                <p className="font-serif text-3xl text-ink/70">No matching creations found</p>
                <p className="text-xs text-ink/50 mt-2 max-w-sm mx-auto">
                  Try broadening your price filters or searching for alternative jewellery categories.
                </p>
                <button
                  onClick={resetFilters}
                  className="mt-6 px-6 py-2.5 bg-ink text-ivory text-[11px] tracking-[.25em] uppercase hover:bg-gold transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
