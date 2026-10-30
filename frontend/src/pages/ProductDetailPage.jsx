import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart, ShieldCheck, Truck, RotateCcw, Award, Star, Check, ArrowLeft, Plus, Minus } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';
import { inr } from '../utils/formatters';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import JewelBadge from '../components/JewelBadge';
import ProductCard from '../components/ProductCard';

export default function ProductDetailPage({ onOpenAuth }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  // User selections
  const [selectedMetal, setSelectedMetal] = useState('18k Yellow Gold');
  const [selectedSize, setSelectedSize] = useState('Size 12 (52mm)');
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Review form
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const { addToCart, setIsDrawerOpen, showToast } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      try {
        const [prodRes, revRes, allRes] = await Promise.all([
          api.get(`/products/${id}`),
          api.get(`/products/${id}/reviews`),
          api.get('/products'),
        ]);

        setProduct(prodRes.data);
        setSelectedMetal(prodRes.data.metal_type || '18k Yellow Gold');
        setReviews(revRes.data);

        // Related pieces in same category
        const rel = allRes.data.filter(
          (p) => p.id !== Number(id) && p.category_name === prodRes.data.category_name
        );
        setRelated(rel.slice(0, 4));
      } catch (err) {
        console.error('Error fetching product detail:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
    window.scrollTo(0, 0);
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity, selectedSize, selectedMetal);
    setIsDrawerOpen(true);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      onOpenAuth();
      return;
    }
    if (!reviewComment.trim()) return;

    setSubmittingReview(true);
    try {
      const res = await api.post(`/products/${id}/reviews`, {
        rating: reviewRating,
        comment: reviewComment.trim(),
      });
      setReviews([res.data, ...reviews]);
      setReviewComment('');
      showToast('Thank you for sharing your experience!');
    } catch (err) {
      showToast(err.response?.data?.detail || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-36 pb-24 max-w-7xl mx-auto px-5 grid md:grid-cols-2 gap-12 animate-pulse">
        <div className="aspect-[4/5] bg-cream rounded-sm" />
        <div className="space-y-6">
          <div className="h-6 w-32 bg-cream" />
          <div className="h-12 w-3/4 bg-cream" />
          <div className="h-8 w-40 bg-cream" />
          <div className="h-32 w-full bg-cream" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-36 pb-24 text-center">
        <h2 className="font-serif text-3xl">Creation Not Found</h2>
        <Link to="/shop" className="mt-4 inline-block text-gold underline uppercase text-xs">
          Return to Collections
        </Link>
      </div>
    );
  }

  const isWished = isInWishlist(product.id);
  const images = product.images && product.images.length > 0 ? product.images : [];
  const currentImg = images[activeImageIndex];

  return (
    <div className="pt-28 pb-24 bg-ivory">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-5 md:px-8 mb-8 text-xs tracking-wider uppercase text-ink/50 flex items-center gap-2">
        <Link to="/" className="hover:text-ink">Home</Link>
        <span>/</span>
        <Link to={`/shop?category=${encodeURIComponent(product.category_name)}`} className="hover:text-ink">
          {product.category_name}
        </Link>
        <span>/</span>
        <span className="text-ink truncate max-w-xs">{product.name}</span>
      </div>

      <div className="max-w-7xl mx-auto px-5 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-start">
        {/* Left Column: Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-[4/5] bg-cream overflow-hidden shadow-lg border border-gold/30">
            {currentImg ? (
              <img
                src={currentImg}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
            ) : (
              <JewelBadge category={product.category_name} index={0} />
            )}

            <button
              onClick={() => toggleWishlist(product.id)}
              className="absolute top-4 right-4 w-11 h-11 rounded-full bg-ivory/90 backdrop-blur-md shadow-md grid place-items-center hover:scale-110 transition"
              aria-label="Wishlist"
            >
              <Heart
                size={22}
                className={isWished ? 'fill-gold text-gold' : 'text-ink/70'}
                strokeWidth={1.5}
              />
            </button>
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-3">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-20 h-24 bg-cream overflow-hidden border-2 transition ${
                    activeImageIndex === idx ? 'border-gold' : 'border-transparent opacity-70'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Information & Actions */}
        <div className="space-y-6">
          <div>
            <p className="text-[11px] tracking-[.35em] uppercase text-gold font-medium">
              {product.category_name} · 18k Fine Jewellery
            </p>
            <h1 className="font-serif text-3xl md:text-5xl mt-2 text-ink leading-tight">
              {product.name}
            </h1>

            {/* Rating Stars & Count */}
            <div className="flex items-center gap-2 mt-3 text-sm text-ink/70">
              <div className="flex text-gold">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={15}
                    className={i < Math.floor(product.rating) ? 'fill-gold text-gold' : 'text-gold/40'}
                  />
                ))}
              </div>
              <span className="font-medium text-xs">
                {product.rating} ({product.review_count} client reviews)
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-4 pt-2 border-t border-gold/20">
            <span className="font-serif text-3xl md:text-4xl text-ink font-semibold">
              {inr(product.price)}
            </span>
            {product.original_price && product.original_price > product.price && (
              <span className="text-ink/40 line-through text-lg">
                {inr(product.original_price)}
              </span>
            )}
            <span className="text-xs text-ink/60 uppercase tracking-wider">
              (Inclusive of all precious metal taxes)
            </span>
          </div>

          {/* Description */}
          <p className="text-ink/80 text-sm leading-relaxed font-light">
            {product.description}
          </p>

          {/* Metal Alloy Selector */}
          <div>
            <label className="block text-[11px] tracking-[.25em] uppercase text-ink/70 mb-2 font-medium">
              Select Gold Alloy
            </label>
            <div className="grid grid-cols-3 gap-3">
              {['18k Yellow Gold', '18k Rose Gold', '18k White Gold'].map((metal) => (
                <button
                  key={metal}
                  onClick={() => setSelectedMetal(metal)}
                  className={`py-2 px-3 text-xs tracking-wider uppercase border text-center transition ${
                    selectedMetal === metal
                      ? 'bg-ink text-ivory border-ink'
                      : 'border-gold/40 hover:border-ink text-ink/80 bg-cream/30'
                  }`}
                >
                  {metal}
                </button>
              ))}
            </div>
          </div>

          {/* Size Selector */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-[11px] tracking-[.25em] uppercase text-ink/70 font-medium">
                Size / Dimension
              </label>
              <button className="text-[11px] text-gold underline tracking-wider">
                Size Guide
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {['Size 10 (50mm)', 'Size 12 (52mm)', 'Size 14 (54mm)', 'Size 16 (56mm)', 'Custom Fitting'].map((sz) => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(sz)}
                  className={`px-3 py-1.5 text-xs tracking-wider border transition ${
                    selectedSize === sz
                      ? 'border-gold bg-gold/10 text-ink font-semibold'
                      : 'border-gold/30 hover:border-gold text-ink/70'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Stock Indicator */}
          <div className="flex items-center gap-2 text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
            <span className="text-emerald-800 font-medium tracking-wider">
              {product.stock > 0
                ? `In Stock · Ready to dispatch from Surat atelier (${product.stock} pieces)`
                : 'Crafted to Order (3-5 business days)'}
            </span>
          </div>

          {/* Quantity & CTA Buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex gap-4">
              {/* Quantity */}
              <div className="flex items-center border border-gold/50 bg-ivory">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-12 grid place-items-center hover:bg-cream transition"
                >
                  <Minus size={14} />
                </button>
                <span className="w-10 text-center font-medium text-sm">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-12 grid place-items-center hover:bg-cream transition"
                >
                  <Plus size={14} />
                </button>
              </div>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-ink text-ivory py-3.5 text-[12px] tracking-[.3em] uppercase hover:bg-gold transition-colors duration-300 font-medium shadow-md"
              >
                Add to Bag · {inr(product.price * quantity)}
              </button>
            </div>

            <button
              onClick={() => {
                addToCart(product, quantity, selectedSize, selectedMetal);
                navigate('/checkout');
              }}
              className="w-full border border-gold bg-cream/40 py-3.5 text-[12px] tracking-[.3em] uppercase hover:bg-gold hover:text-ivory transition-colors duration-300 font-medium"
            >
              Express Checkout
            </button>
          </div>

          {/* Luxury Guarantees */}
          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gold/20 text-xs text-ink/80">
            <div className="flex items-center gap-2.5">
              <Award size={18} className="text-gold shrink-0" />
              <span>100% Certified Diamonds & BIS Hallmarked</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Truck size={18} className="text-gold shrink-0" />
              <span>Complimentary Insured All-India Transit</span>
            </div>
            <div className="flex items-center gap-2.5">
              <RotateCcw size={18} className="text-gold shrink-0" />
              <span>30-Day Hassle-free Exchange Policy</span>
            </div>
            <div className="flex items-center gap-2.5">
              <ShieldCheck size={18} className="text-gold shrink-0" />
              <span>Lifetime Maintenance & Polish</span>
            </div>
          </div>

          {/* Technical Specifications Table */}
          <div className="pt-6 border-t border-gold/20">
            <h3 className="font-serif text-2xl mb-4">Gemological Specifications</h3>
            <div className="divide-y divide-gold/15 text-xs">
              <div className="py-2.5 flex justify-between">
                <span className="text-ink/60 uppercase tracking-wider">Metal Purity</span>
                <span className="font-medium text-ink">{product.purity || '18 KT (750)'}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-ink/60 uppercase tracking-wider">Diamond Weight & Clarity</span>
                <span className="font-medium text-ink">{product.diamond_weight || '0.65 ct'}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-ink/60 uppercase tracking-wider">Gross Weight (approx.)</span>
                <span className="font-medium text-ink">{product.gross_weight || '4.20 g'}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-ink/60 uppercase tracking-wider">Certification</span>
                <span className="font-medium text-ink">IGI / SGL Physical Certificate Included</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-ink/60 uppercase tracking-wider">Atelier Origin</span>
                <span className="font-medium text-ink">Surat, Gujarat, India</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <section className="max-w-7xl mx-auto px-5 md:px-8 mt-24 pt-16 border-t border-gold/30">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-[11px] tracking-[.4em] uppercase text-gold font-medium">
              Client Testimonials
            </p>
            <h2 className="font-serif text-3xl md:text-4xl mt-1 text-ink">
              Verified Patron Reviews
            </h2>
          </div>

          {/* Review Submission Form */}
          <form onSubmit={handleReviewSubmit} className="mb-12 p-6 bg-cream/50 border border-gold/30 space-y-4">
            <h4 className="font-serif text-xl">Leave Your Impression</h4>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider text-ink/70">Rating:</span>
              <div className="flex gap-1 text-gold">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setReviewRating(num)}
                    className="p-1 hover:scale-110 transition"
                  >
                    <Star
                      size={18}
                      className={num <= reviewRating ? 'fill-gold text-gold' : 'text-gold/40'}
                    />
                  </button>
                ))}
              </div>
            </div>
            <textarea
              required
              rows={3}
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder="Share the beauty, craftsmanship, or wearing experience of this piece…"
              className="w-full bg-ivory border border-gold/40 p-3 text-xs outline-none focus:border-gold font-sans"
            />
            <button
              type="submit"
              disabled={submittingReview}
              className="px-6 py-2.5 bg-ink text-ivory text-[11px] tracking-[.25em] uppercase hover:bg-gold transition-colors disabled:opacity-50 font-medium"
            >
              {submittingReview ? 'Submitting…' : 'Submit Review'}
            </button>
          </form>

          {/* Reviews List */}
          <div className="space-y-6">
            {reviews.length > 0 ? (
              reviews.map((rev) => (
                <div key={rev.id} className="pb-6 border-b border-gold/20 last:border-b-0 space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="font-medium text-sm text-ink">{rev.user_name}</p>
                    <div className="flex text-gold">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} size={13} className="fill-gold" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-ink/75 leading-relaxed font-light">{rev.comment}</p>
                </div>
              ))
            ) : (
              <p className="text-center text-xs text-ink/50 py-6">
                Be the first to leave a review for this heirloom creation.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Related Creations */}
      {related.length > 0 && (
        <section className="max-w-7xl mx-auto px-5 md:px-8 mt-24 pt-16 border-t border-gold/30">
          <div className="text-center mb-10">
            <p className="text-[11px] tracking-[.4em] uppercase text-gold font-medium">
              Complementary Pieces
            </p>
            <h2 className="font-serif text-3xl md:text-4xl mt-1 text-ink">
              Complete the Ensemble
            </h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
