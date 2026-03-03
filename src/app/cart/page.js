"use client";

import { useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const {
    cartItems = [],
    cartLoading,
    updateQty,
    removeFromCart,
  } = useCart();

  const { user, loading } = useAuth();
  const router = useRouter();

  /* 🔒 PROTECT CART PAGE */
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading || cartLoading) {
    return <p style={{ padding: 40 }}>Loading cart...</p>;
  }

  if (!user) return null;

  // ✅ TOTAL CALCULATION
  const totalAmount = cartItems.reduce(
    (total, item) => total + item.price * item.qty,
    0
  );

  return (
    <section className="cart-page">
      <h1>Your Cart</h1>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <div className="cart-grid">
            {cartItems.map((product) => (
              <div
                key={product.productId}
                className="cart-product-card"
              >
                {/* IMAGE */}
                <div className="product-image">
                  <img
                    src={product.image || "/placeholder.png"}
                    alt={product.name}
                  />
                </div>

                {/* INFO */}
                <div className="product-info">
                  <h3 className="product-name">
                    {product.name}
                  </h3>

                  {/* PRICE */}
                  <div className="product-price">
                    <span className="price">
                      ₹{product.price * product.qty}
                    </span>
                  </div>

                  {/* QUANTITY */}
                  <div className="qty-control">
                    Qty:

                    <button
                      onClick={() => {
                        if (product.qty > 1) {
                          updateQty(
                            product.productId,
                            product.qty - 1
                          );
                        }
                      }}
                      disabled={product.qty <= 1}
                    >
                      −
                    </button>

                    <span>{product.qty}</span>

                    <button
                      onClick={() =>
                        updateQty(
                          product.productId,
                          product.qty + 1
                        )
                      }
                    >
                      +
                    </button>
                  </div>

                  {/* ACTIONS */}
                  <div className="cart-actions">
                    <button
                      className="cart-buy-btn"
                      onClick={() =>
                        router.push("/checkout")
                      }
                    >
                      Buy Now
                    </button>

                    <button
                      className="cart-remove-btn"
                      onClick={() =>
                        removeFromCart(
                          product.productId
                        )
                      }
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ✅ CART TOTAL SECTION */}
        
        </>
      )}
    </section>
  );
}