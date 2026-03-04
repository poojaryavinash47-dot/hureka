"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import {
  getGuestCart,
  updateGuestCartQuantity,
  removeGuestCartItem,
} from "@/lib/guestCart";

export default function CartPage() {
  const {
    cartItems = [],
    cartLoading,
    updateQty,
    removeFromCart,
    toggleSelection,
  } = useCart();

  const { user, loading } = useAuth();
  const router = useRouter();
  const [guestItems, setGuestItems] = useState(() => {
    if (typeof window === "undefined") return [];
    return getGuestCart();
  });

  if (loading || cartLoading) {
    return <p style={{ padding: 40 }}>Loading cart...</p>;
  }

  const isAuthenticated = !!user;

  const normalizedGuestItems = guestItems.map((item) => ({
    productId: item.productId,
    name: item.title,
    price: item.price,
    qty: item.quantity || 1,
    image: item.image,
    selected: true,
  }));

  const itemsToRender = isAuthenticated ? cartItems : normalizedGuestItems;

  const selectedItems = isAuthenticated
    ? cartItems.filter((item) => item.selected)
    : itemsToRender;

  const hasSelectedItems = selectedItems.length > 0;

  const subtotal = selectedItems.reduce(
    (total, item) => total + item.price * (item.qty || 1),
    0
  );

  return (
    <section className="cart-page">
      <h1>Your Cart</h1>

      {itemsToRender.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <div className="cart-grid">
            {itemsToRender.map((product) => (
              <div
                key={product.productId}
                className="cart-product-card"
                onClick={() =>
                  router.push(`/product/${product.productId}`)
                }
              >
                {isAuthenticated && (
                  <div className="cart-select">
                    <input
                      type="checkbox"
                      checked={product.selected ?? true}
                      onClick={(e) => e.stopPropagation()}
                      onChange={() =>
                        toggleSelection(product.productId)
                      }
                    />
                  </div>
                )}
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
                      onClick={(e) => {
                        e.stopPropagation();
                        if (product.qty <= 1) return;

                        if (isAuthenticated) {
                          updateQty(
                            product.productId,
                            product.qty - 1
                          );
                        } else {
                          const updated = updateGuestCartQuantity(
                            product.productId,
                            product.qty - 1
                          );
                          setGuestItems(updated);
                        }
                      }}
                      disabled={product.qty <= 1}
                    >
                      −
                    </button>

                    <span>{product.qty}</span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();

                        if (isAuthenticated) {
                          updateQty(
                            product.productId,
                            product.qty + 1
                          );
                        } else {
                          const updated = updateGuestCartQuantity(
                            product.productId,
                            product.qty + 1
                          );
                          setGuestItems(updated);
                        }
                      }}
                    >
                      +
                    </button>
                  </div>

                  {/* ACTIONS */}
                  <div className="cart-actions">
                    <button
                      className="cart-buy-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isAuthenticated) {
                          router.push("/login");
                          return;
                        }

                        if (typeof window === "undefined") return;

                        const payload = {
                          productId: product.productId,
                          name: product.name,
                          price: Number(product.price),
                          image: product.image,
                          qty: product.qty,
                          fromCart: true,
                        };

                        sessionStorage.setItem(
                          "buyNowProduct",
                          JSON.stringify(payload)
                        );

                        router.push("/checkout");
                      }}
                    >
                      Buy Now
                    </button>

                    <button
                      className="cart-remove-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isAuthenticated) {
                          removeFromCart(product.productId);
                        } else {
                          const updated = removeGuestCartItem(
                            product.productId
                          );
                          setGuestItems(updated);
                        }
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ✅ CART TOTAL SECTION */}
          <div className="cart-summary">
            <div className="summary-row">
              <span>Selected items ({selectedItems.length})</span>
              <span>₹{subtotal}</span>
            </div>

            <button
              className="proceed-checkout-btn"
              disabled={!hasSelectedItems}
              onClick={() => {
                if (!isAuthenticated) {
                  router.push("/login");
                } else {
                  router.push("/checkout");
                }
              }}
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </section>
  );
}