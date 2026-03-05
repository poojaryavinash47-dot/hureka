"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { addItemToGuestCart } from "@/lib/guestCart";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);

  const mapItems = (items) =>
    (items || []).map((item) => ({
      ...item,
      qty: item.qty || 1,
      selected: item.selected ?? true,
    }));

  useEffect(() => {
    if (!user) {
      setCartItems([]);
      setCartLoading(false);
      return;
    }

    const fetchCart = async () => {
      setCartLoading(true);
      try {
        const res = await fetch("/api/cart", {
          credentials: "include",
        });
        const data = await res.json();
        setCartItems(mapItems(data.items));
      } catch (error) {
        console.error("Failed to fetch cart", error);
        setCartItems([]);
      } finally {
        setCartLoading(false);
      }
    };

    fetchCart();
  }, [user]);

  const addToCart = async (product) => {
    // Guest user: store in localStorage guest cart
    if (!user) {
      addItemToGuestCart(product);
      return;
    }

    const res = await fetch("/api/cart", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });

    const data = await res.json();
    setCartItems(mapItems(data.items));
  };

  const updateQty = async (productId, qty) => {
    const res = await fetch("/api/cart", {
      method: "PUT",
      credentials: "include", // 🔥 IMPORTANT
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, qty }),
    });

    const data = await res.json();
    setCartItems(mapItems(data.items));
  };

  const removeFromCart = async (productId) => {
    const res = await fetch("/api/cart", {
      method: "DELETE",
      credentials: "include", // 🔥 IMPORTANT
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    });

    const data = await res.json();
    setCartItems(mapItems(data.items));
  };

  const clearCart = async () => {
    const res = await fetch("/api/cart/clear", {
      method: "DELETE",
      credentials: "include",
    });

    if (!res.ok) {
      console.error("Failed to clear cart");
      return;
    }

    setCartItems([]);
  };

  const toggleSelection = (productId) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.productId === productId
          ? { ...item, selected: !item.selected }
          : item
      )
    );
  };

  const clearPurchasedItems = async (productIds = []) => {
    for (const id of productIds) {
      await removeFromCart(id);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartLoading,
        addToCart,
        updateQty,
        removeFromCart,
        toggleSelection,
        clearCart,
        clearPurchasedItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);