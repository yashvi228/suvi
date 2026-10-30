import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { inr } from '../utils/formatters';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import JewelBadge from './JewelBadge';

export default function ProductCard({ product, index = 0 }) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [imgError, setImgError] = useState(false);

  const isWished = isInWishlist(product.id);
  const primaryImg = product.images && product.images.length > 0 ? product.images[0] : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="group flex flex-col justify-between"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-cream shadow-sm">
        {/* Product Media: Image or JewelBadge */}
        <Link to={`/product/${product.id}`} className="block w-full h-full">
          <div className="w-full h-full transition-transform duration-1000 ease-out group-hover:scale-105 flex items-center justify-center">
            {primaryImg && !imgError ? (
              <img
                src={primaryImg}
                alt={product.name}
                onError={() => setImgError(true)}
                className="w-full h-full object-cover object-center"
                loading="lazy"
              />
            ) : (
              <JewelBadge category={product.category_name || 'Rings'} index={index} />
            )}
          </div>
        </Link>

        {/* Wishlist Heart Button */}
        <button
          aria-label="Wishlist"
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product.id);
          }}
          className={`absolute top-3 right-3 w-9 h-9 grid place-items-center rounded-full bg-ivory/85 backdrop-blur-md shadow-sm transition hover:scale-110 z-10 ${
            isWished ? 'text-gold fill-gold' : 'text-ink/60 hover:text-ink'
          }`}
        >
          <Heart
            size={18}
            className={isWished ? 'fill-gold text-gold' : 'text-ink/70'}
            strokeWidth={1.5}
          />
        </button>

        {/* Tag Badges */}
        {product.tag === 'new' && (
          <span className="absolute top-3 left-3 text-[9px] tracking-[.25em] uppercase bg-ink text-ivory px-2 py-1 font-medium shadow-sm">
            New
          </span>
        )}
        {product.tag === 'best' && (
          <span className="absolute top-3 left-3 text-[9px] tracking-[.25em] uppercase bg-gold text-ivory px-2 py-1 font-medium shadow-sm">
            Bestseller
          </span>
        )}
        {product.tag === 'trend' && (
          <span className="absolute top-3 left-3 text-[9px] tracking-[.25em] uppercase bg-[#9a7440] text-ivory px-2 py-1 font-medium shadow-sm">
            Trending
          </span>
        )}

        {/* Desktop Quick Add To Cart Slide-up */}
        <button
          onClick={() => addToCart(product)}
          className="absolute inset-x-0 bottom-0 py-3 text-[11px] tracking-[.25em] uppercase bg-ink/95 text-ivory translate-y-full group-hover:translate-y-0 transition-transform duration-400 hidden md:block hover:bg-gold transition-colors"
        >
          Add to Cart
        </button>
      </div>

      {/* Product Information */}
      <div className="pt-4 text-center">
        <p className="text-[10px] tracking-[.3em] uppercase text-gold font-medium">
          {product.category_name}
        </p>
        <Link to={`/product/${product.id}`} className="hover:text-gold transition-colors">
          <h3 className="font-serif text-lg md:text-xl mt-1 line-clamp-1">{product.name}</h3>
        </Link>
        <div className="flex items-center justify-center gap-2 mt-1">
          <p className="text-ink/80 text-sm font-medium">{inr(product.price)}</p>
          {product.original_price && product.original_price > product.price && (
            <p className="text-ink/40 text-xs line-through">{inr(product.original_price)}</p>
          )}
        </div>

        {/* Mobile Add to Cart Button */}
        <button
          onClick={() => addToCart(product)}
          className="md:hidden mt-3 w-full border border-ink/80 py-2 text-[11px] tracking-[.25em] uppercase hover:bg-ink hover:text-ivory transition-colors"
        >
          Add to Cart
        </button>
      </div>
    </motion.div>
  );
}
