"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    if (!user) {
      setCartItems([]);
      return;
    }

    const fetchCart = async () => {
      const res = await fetch("/api/cart", {
        credentials: "include", // 🔥 IMPORTANT
      });
      const data = await res.json();
      setCartItems(data.items || []);
    };

    fetchCart();
  }, [user]);

 const addToCart = async (product) => {
  console.log("ADDING:", product);

  const res = await fetch("/api/cart", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });

  console.log("STATUS:", res.status);

  const data = await res.json();
  console.log("RESPONSE:", data);

  setCartItems(data.items || []);
};

  const updateQty = async (productId, qty) => {
    const res = await fetch("/api/cart", {
      method: "PUT",
      credentials: "include", // 🔥 IMPORTANT
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, qty }),
    });

    const data = await res.json();
    setCartItems(data.items || []);
  };

  const removeFromCart = async (productId) => {
    const res = await fetch("/api/cart", {
      method: "DELETE",
      credentials: "include", // 🔥 IMPORTANT
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    });

    const data = await res.json();
    setCartItems(data.items || []);
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, updateQty, removeFromCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);