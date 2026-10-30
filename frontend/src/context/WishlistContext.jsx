import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('suvi_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sync with backend if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      api.get('/wishlist')
        .then((res) => {
          if (Array.isArray(res.data)) {
            setWishlist(res.data.map((p) => p.id));
          }
        })
        .catch((err) => console.error('Error fetching wishlist:', err));
    }
  }, [isAuthenticated]);

  // Persist to local storage
  useEffect(() => {
    localStorage.setItem('suvi_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = async (productId) => {
    const isPresent = wishlist.includes(productId);
    const updated = isPresent
      ? wishlist.filter((id) => id !== productId)
      : [...wishlist, productId];
    setWishlist(updated);

    if (isAuthenticated) {
      try {
        await api.post('/wishlist/toggle', { product_id: productId });
      } catch (err) {
        console.error('Error syncing wishlist with backend:', err);
      }
    }
  };

  const isInWishlist = (productId) => wishlist.includes(productId);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        toggleWishlist,
        isInWishlist,
        wishlistCount: wishlist.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
