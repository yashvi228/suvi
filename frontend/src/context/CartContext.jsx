import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import api from '../services/api';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('suvi_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [coupon, setCoupon] = useState(null); // { code, discount_amount, discount_percent }

  useEffect(() => {
    localStorage.setItem('suvi_cart', JSON.stringify(cart));
  }, [cart]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2500);
  };

  const addToCart = (product, quantity = 1, size = 'Standard', metal = '18k Yellow Gold') => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedSize === size &&
          item.selectedMetal === metal
      );

      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex].quantity += quantity;
        return next;
      } else {
        return [
          ...prev,
          {
            id: `${product.id}-${size}-${metal}`,
            product,
            quantity,
            selectedSize: size,
            selectedMetal: metal,
          },
        ];
      }
    });

    showToast('Added to your bag');
  };

  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity } : item))
    );
  };

  const removeFromCart = (itemId) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
    showToast('Item removed from bag');
  };

  const clearCart = () => {
    setCart([]);
    setCoupon(null);
  };

  // Subtotal calculation
  const subtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  }, [cart]);

  // GST 3% on precious jewellery in India
  const tax = useMemo(() => {
    return Math.round(subtotal * 0.03);
  }, [subtotal]);

  // Discount calculation
  const discountAmount = useMemo(() => {
    if (!coupon) return 0;
    const calc = (coupon.discount_percent / 100) * subtotal;
    return coupon.max_discount ? Math.min(calc, coupon.max_discount) : calc;
  }, [coupon, subtotal]);

  const total = useMemo(() => {
    return Math.max(0, subtotal + tax - discountAmount);
  }, [subtotal, tax, discountAmount]);

  const cartCount = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  }, [cart]);

  const applyCoupon = async (code) => {
    try {
      const res = await api.post('/coupons/apply', {
        code,
        order_amount: subtotal,
      });
      setCoupon(res.data);
      showToast(res.data.message || 'Coupon applied successfully!');
      return { success: true, data: res.data };
    } catch (err) {
      const msg = err.response?.data?.detail || 'Invalid coupon code';
      showToast(msg);
      return { success: false, message: msg };
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
    showToast('Coupon removed');
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        subtotal,
        tax,
        discountAmount,
        total,
        coupon,
        isDrawerOpen,
        toastMessage,
        setIsDrawerOpen,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        applyCoupon,
        removeCoupon,
        showToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
