"use client";

import { useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const {
    cartItems,
    increaseQty,
    decreaseQty,
    removeFromCart,
  } = useCart();

  const { user } = useAuth(); // ✅ AUTH CHECK
  const router = useRouter();

  /* 🔒 PROTECT CART PAGE */
  useEffect(() => {
    if (!user) {
      router.replace("/login");
    }
  }, [user, router]);

  // While redirecting (prevents flicker)
  if (!user) return null;

  return (
    <section className="cart-page">
      <h1>Your Cart</h1>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="cart-grid">
          {cartItems.map((product) => (
            <div key={product.id} className="cart-product-card">

              {/* IMAGE */}
              <div className="product-image">
                <img
                  src={product.image || "/placeholder.png"}
                  alt={product.name}
                />
              </div>

              {/* INFO */}
              <div className="product-info">
                {product.category && (
                  <p className="product-category">
                    {product.category}
                  </p>
                )}

                <h3 className="product-name">{product.name}</h3>

                {/* PRICE */}
                <div className="product-price">
                  <span className="price">
                    ₹{Number(product.price) * product.qty}
                  </span>
                </div>

                {/* QUANTITY CONTROLS */}
                <div className="qty-control">
                  Qty:
                  <button
                    onClick={() => decreaseQty(product.id)}
                    disabled={product.qty === 1}
                  >
                    −
                  </button>

                  <span>{product.qty}</span>

                  <button onClick={() => increaseQty(product.id)}>
                    +
                  </button>
                </div>

                {/* ACTIONS */}
                <div className="cart-actions">
                  <button
                    className="cart-buy-btn"
                    onClick={() => router.push("/checkout")}
                  >
                    Buy Now
                  </button>

                  <button
                    className="cart-remove-btn"
                    onClick={() => removeFromCart(product.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}