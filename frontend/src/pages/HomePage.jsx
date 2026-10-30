import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Award, RotateCcw } from 'lucide-react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import JewelBadge from '../components/JewelBadge';
import { useWishlist } from '../context/WishlistContext';

const CATS = [
  ['Rings', 'Rings'],
  ['Earrings', 'Earrings'],
  ['Necklaces', 'Necklaces'],
  ['Bangles', 'Bangles'],
  ['Bracelets', 'Bracelets'],
  ['Bridal Jewellery', 'Bridal Jewellery'],
];

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCat, setSelectedCat] = useState('All');
  const [sortOrder, setSortOrder] = useState('f');
  const [wishlistOnly, setWishlistOnly] = useState(false);
  const [activeEditTab, setActiveEditTab] = useState('best');
  const [scrollY, setScrollY] = useState(0);

  const { wishlist } = useWishlist();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/products');
        setProducts(res.data);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Filtered Signature Jewellery list
  const filteredList = useMemo(() => {
    let list = products.filter((p) => {
      const matchCat = selectedCat === 'All' || p.category_name === selectedCat;
      const matchWish = !wishlistOnly || wishlist.includes(p.id);
      return matchCat && matchWish;
    });

    if (sortOrder === 'l') {
      list = [...list].sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'h') {
      list = [...list].sort((a, b) => b.price - a.price);
    }
    return list;
  }, [products, selectedCat, sortOrder, wishlistOnly, wishlist]);

  // Edit Tab pieces
  const editPieces = useMemo(() => {
    const filtered = products.filter((p) => p.tag === activeEditTab);
    return filtered.length > 0 ? [...filtered, ...filtered, ...filtered] : [];
  }, [products, activeEditTab]);

  return (
    <div id="top">
      {/* 1. Hero Section matching reference */}
      <section
        className="relative min-h-[92vh] md:min-h-screen overflow-hidden flex items-center pt-24 pb-16"
        style={{
          background: 'radial-gradient(ellipse at 75% 40%, #f1e1c3, #f9f2e4 50%, #fbf7ef)',
        }}
      >
        {/* Parallax Background Ring Accent */}
        <div
          className="absolute w-[60vw] h-[60vw] max-w-[760px] max-h-[760px] right-[-8%] top-1/2 -translate-y-1/2 rounded-full border border-gold/30 pointer-events-none transition-transform duration-700 ease-out"
          style={{ transform: `translateY(calc(-50% + ${scrollY * 0.12}px))` }}
        />

        <div className="max-w-7xl mx-auto px-5 md:px-8 grid md:grid-cols-2 gap-12 items-center relative w-full">
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 1 }}
              className="text-[11px] md:text-[12px] tracking-[.5em] uppercase text-gold font-medium"
            >
              The Heirloom Collection 2026
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 1.2 }}
              className="font-serif text-6xl md:text-8xl leading-[.95] mt-5 text-ink"
            >
              Adorned in <i className="gold-t font-normal">light</i>,<br />
              worn for<br />
              a lifetime.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="mt-6 max-w-md text-ink/75 leading-relaxed text-sm md:text-base font-light"
            >
              Hand-finished 18k gold and certified diamonds, designed in Surat and crafted for the moments you will never forget.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
              className="mt-9 flex flex-wrap gap-4 items-center"
            >
              <Link
                to="/shop"
                className="inline-block px-10 py-4 bg-ink text-ivory text-[12px] tracking-[.35em] uppercase hover:bg-gold transition-colors duration-500 shadow-md font-medium"
              >
                Shop Now
              </Link>
              <a
                href="#story"
                className="inline-block px-8 py-4 border border-ink/30 text-ink text-[12px] tracking-[.35em] uppercase hover:border-gold hover:text-gold transition-colors duration-300 font-medium"
              >
                Our Story
              </a>
            </motion.div>
          </div>

          {/* Hero Visual Showcase with Floating Badges */}
          <div
            className="relative h-[420px] md:h-[580px]"
            style={{ transform: `translateY(${scrollY * -0.06}px)` }}
          >
            {/* Main Arch Showcase */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.3 }}
              className="absolute inset-x-6 md:inset-x-12 top-0 bottom-0 rounded-t-full overflow-hidden shadow-2xl border-[6px] border-ivory bg-cream"
            >
              <img
                src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=85"
                alt="SUVI Fine Jewellery"
                className="w-full h-full object-cover scale-105 hover:scale-110 transition-transform duration-1000"
              />
            </motion.div>

            {/* Left Floating Charm (Rings) */}
            <div className="absolute -left-3 bottom-10 w-32 md:w-44 aspect-square rounded-full overflow-hidden border-4 border-ivory shadow-xl fl bg-cream">
              <JewelBadge category="Rings" index={0} />
            </div>

            {/* Right Floating Charm (Earrings) */}
            <div
              className="absolute -right-3 top-16 w-28 md:w-36 aspect-square rounded-full overflow-hidden border-4 border-ivory shadow-xl fl bg-cream"
              style={{ animationDelay: '2.5s' }}
            >
              <JewelBadge category="Earrings" index={2} />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Categories Flowing Marquee Section */}
      <section className="py-20 overflow-hidden bg-ivory border-y border-gold/20">
        <div className="text-center mb-12">
          <p className="text-[11px] tracking-[.5em] uppercase text-gold font-medium">
            Shop by
          </p>
          <h2 className="font-serif text-4xl md:text-5xl mt-2 text-ink">
            Categories
          </h2>
        </div>

        <div className="mq">
          {[...CATS, ...CATS].map(([name, cat], i) => (
            <Link
              key={i}
              to={`/shop?category=${encodeURIComponent(cat)}`}
              className="group relative w-56 md:w-64 aspect-[3/4] overflow-hidden shrink-0 text-left bg-cream shadow-sm"
            >
              <div className="w-full h-full transition duration-[1200ms] group-hover:scale-110">
                <JewelBadge category={cat} index={i} />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/20 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5">
                <span className="font-serif text-2xl text-ivory block">{name}</span>
                <span className="block text-[10px] tracking-[.3em] uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-gold2 font-sans mt-1">
                  Explore →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Signature Jewellery Section */}
      <section id="shop" className="max-w-7xl mx-auto px-5 md:px-8 py-20">
        <div className="text-center">
          <p className="text-[11px] tracking-[.5em] uppercase text-gold font-medium">
            The Collection
          </p>
          <h2 className="font-serif text-4xl md:text-6xl mt-2 text-ink">
            Signature Jewellery
          </h2>
        </div>

        {/* Filter Bar */}
        <div className="mt-12 flex flex-wrap gap-4 justify-between items-center border-y border-gold/30 py-4">
          <div className="flex flex-wrap gap-2">
            {['All', ...CATS.map((c) => c[0])].map((catName) => (
              <button
                key={catName}
                onClick={() => setSelectedCat(catName)}
                className={`px-4 py-1.5 text-[11px] tracking-[.2em] uppercase border transition-all duration-300 ${
                  selectedCat === catName
                    ? 'bg-ink text-ivory border-ink'
                    : 'border-gold/40 hover:border-ink text-ink/80'
                }`}
              >
                {catName}
              </button>
            ))}
          </div>

          <div className="flex gap-4 items-center text-xs tracking-wider">
            <label className="flex items-center gap-1.5 cursor-pointer text-ink/80 select-none">
              <input
                type="checkbox"
                checked={wishlistOnly}
                onChange={(e) => setWishlistOnly(e.target.checked)}
                className="accent-[#b8935a] w-3.5 h-3.5 cursor-pointer"
              />
              Saved Only
            </label>

            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="bg-transparent border border-gold/40 px-3 py-1.5 text-xs outline-none cursor-pointer"
            >
              <option value="f">Featured</option>
              <option value="l">Price: Low to High</option>
              <option value="h">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 md:gap-x-6 gap-y-12 mt-12">
          {filteredList.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>

        {filteredList.length === 0 && !loading && (
          <div className="text-center py-24">
            <p className="font-serif text-2xl text-ink/60">
              No pieces found in this category or filter.
            </p>
            <button
              onClick={() => {
                setSelectedCat('All');
                setWishlistOnly(false);
              }}
              className="mt-4 text-xs tracking-[.25em] uppercase text-gold underline hover:text-ink"
            >
              Reset Filters
            </button>
          </div>
        )}

        <div className="text-center mt-16">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 border border-ink px-10 py-3.5 text-[11px] tracking-[.3em] uppercase hover:bg-ink hover:text-ivory transition-colors duration-300 font-medium group"
          >
            View Full Catalog
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* 4. The Edit Tabbed Marquee */}
      <section className="py-20 bg-cream overflow-hidden border-y border-gold/20">
        <div className="text-center mb-10">
          <p className="text-[11px] tracking-[.5em] uppercase text-gold font-medium">
            The Edit
          </p>
          <div className="flex justify-center gap-6 md:gap-12 mt-4 font-serif text-2xl md:text-4xl">
            {[
              ['best', 'Bestsellers'],
              ['new', 'New Arrivals'],
              ['trend', 'Trending'],
            ].map(([key, label]) => (
              <button
                key={key}
                onClick={() => setActiveEditTab(key)}
                className={`pb-1 border-b-2 transition-all duration-300 ${
                  activeEditTab === key
                    ? 'border-gold text-ink font-normal'
                    : 'border-transparent text-ink/40 hover:text-ink/70'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="mq" key={activeEditTab} style={{ animationDuration: '40s' }}>
          {editPieces.map((product, i) => (
            <div key={i} className="w-64 md:w-72 shrink-0">
              <ProductCard product={product} index={i} />
            </div>
          ))}
        </div>
      </section>

      {/* 5. Bridal Promotional Banner matching reference */}
      <section className="py-24 px-5 md:px-8 bg-ivory">
        <div
          className="max-w-7xl mx-auto grid md:grid-cols-2 items-center gap-12 p-8 md:p-16 text-ivory rounded-sm shadow-xl"
          style={{
            background: 'linear-gradient(135deg, #3a2c1d, #6b5233 60%, #b8935a)',
          }}
        >
          <div>
            <p className="text-[11px] tracking-[.5em] uppercase text-gold2 font-medium">
              Bridal Collection
            </p>
            <h2 className="font-serif text-5xl md:text-6xl mt-3 leading-tight">
              For the day your <i className="font-serif italic text-gold2">story</i> begins
            </h2>
            <p className="mt-5 text-ivory/80 max-w-md leading-relaxed text-sm md:text-base font-light">
              Imperial tiaras, kundan-inspired heritage chokers, and solitaire heirloom sets, designed to be passed down across generations.
            </p>
            <Link
              to="/shop?category=Bridal+Jewellery"
              className="inline-block mt-8 border border-gold2 px-8 py-3.5 text-[11px] tracking-[.35em] uppercase hover:bg-gold2 hover:text-ink transition-colors duration-300 font-medium"
            >
              Explore Bridal
            </Link>
          </div>

          <div className="aspect-square max-w-md w-full mx-auto rounded-full overflow-hidden border border-gold2/60 p-3 bg-ink/20">
            <div className="w-full h-full rounded-full overflow-hidden shadow-2xl">
              <JewelBadge category="Bridal Jewellery" index={1} />
            </div>
          </div>
        </div>
      </section>

      {/* 6. Our Story & Heritage Section */}
      <section id="story" className="py-28 overflow-hidden bg-ivory">
        <div className="max-w-6xl mx-auto px-5 md:px-8 grid md:grid-cols-2 gap-14 items-center">
          <div className="relative h-[480px] overflow-hidden bg-cream border border-gold/30 shadow-lg rounded-sm">
            <img
              src="https://images.unsplash.com/photo-1611591475155-426c045b4c61?auto=format&fit=crop&w=1000&q=85"
              alt="Craftsmanship"
              className="w-full h-full object-cover scale-105"
            />
          </div>

          <div>
            <p className="text-[11px] tracking-[.5em] uppercase text-gold font-medium">
              Our Story
            </p>
            <h2 className="font-serif text-4xl md:text-5xl mt-3 leading-tight text-ink">
              Born in the city of diamonds
            </h2>
            <p className="mt-6 text-ink/75 leading-relaxed font-light text-sm md:text-base">
              SUVI began in a small Surat atelier with one belief: luxury should feel deeply personal. Every piece is drawn by hand, set by master artisans, and finished with ethically sourced stones, so it carries a little of the maker with it.
            </p>

            <div className="grid grid-cols-3 gap-6 mt-12 text-center">
              <div className="border-t border-gold pt-4">
                <p className="font-serif text-4xl gold-t font-medium">18k</p>
                <p className="text-[11px] tracking-wider uppercase text-ink/65 mt-1 font-medium">
                  Hallmarked gold
                </p>
              </div>
              <div className="border-t border-gold pt-4">
                <p className="font-serif text-4xl gold-t font-medium">IGI</p>
                <p className="text-[11px] tracking-wider uppercase text-ink/65 mt-1 font-medium">
                  Certified diamonds
                </p>
              </div>
              <div className="border-t border-gold pt-4">
                <p className="font-serif text-4xl gold-t font-medium">30d</p>
                <p className="text-[11px] tracking-wider uppercase text-ink/65 mt-1 font-medium">
                  Easy returns
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
