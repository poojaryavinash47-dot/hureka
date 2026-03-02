"use client";

import { createContext, useContext, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  // ✅ LAZY INIT (THIS FIXES THE ERROR)
  const [cartItems, setCartItems] = useState(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem("cart_items");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // ✅ SAVE CART (this is allowed)
  const saveCart = (items) => {
    setCartItems(items);
    localStorage.setItem("cart_items", JSON.stringify(items));
  };

  /* ➕ ADD TO CART */
  const addToCart = (item) => {
    saveCart(
      cartItems.some((p) => p.id === item.id)
        ? cartItems.map((p) =>
            p.id === item.id
              ? { ...p, qty: Number(p.qty) + 1 }
              : p
          )
        : [
            ...cartItems,
            {
              ...item,
              price: Number(item.price),
              qty: 1,
            },
          ]
    );
  };

  /* ➕ INCREASE */
  const increaseQty = (id) => {
    saveCart(
      cartItems.map((item) =>
        item.id === id ? { ...item, qty: item.qty + 1 } : item
      )
    );
  };

  /* ➖ DECREASE */
  const decreaseQty = (id) => {
    saveCart(
      cartItems.map((item) =>
        item.id === id && item.qty > 1
          ? { ...item, qty: item.qty - 1 }
          : item
      )
    );
  };

  /* ❌ REMOVE */
  const removeFromCart = (id) => {
    saveCart(cartItems.filter((item) => item.id !== id));
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        increaseQty,
        decreaseQty,
        removeFromCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);