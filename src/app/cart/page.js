"use client";

import { useEffect, useState, useCallback } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import LoginRequiredModal from "@/components/LoginRequiredModal";
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
    clearCart,
  } = useCart();

  const { user, loading } = useAuth();
  const router = useRouter();
  const [guestItems, setGuestItems] = useState(() => {
    if (typeof window === "undefined") return [];
    return getGuestCart();
  });

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showClearCartModal, setShowClearCartModal] = useState(false);
  const [tempQuantities, setTempQuantities] = useState({});

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

  const handleQtyChange = useCallback(
    (productId, rawValue, isAuthenticatedUser) => {
      const value = String(rawValue);
      // Track the raw string so the input can be temporarily empty
      setTempQuantities((prev) => ({ ...prev, [productId]: value }));

      // Allow user to clear the field (empty string) without deleting the item
      if (value === "") {
        return;
      }

      const parsed = parseInt(value, 10);

      if (Number.isNaN(parsed)) {
        return;
      }

      // If quantity becomes 0, remove the item from the cart
      if (parsed === 0) {
        if (isAuthenticatedUser) {
          removeFromCart(productId);
        } else {
          const updated = removeGuestCartItem(productId);
          setGuestItems(updated);
        }

        // Clean up any temporary quantity state for this product
        setTempQuantities((prev) => {
          const next = { ...prev };
          delete next[productId];
          return next;
        });
        return;
      }

      // For positive quantities, update the cart quantity
      if (parsed > 0) {
        if (isAuthenticatedUser) {
          updateQty(productId, parsed);
        } else {
          const updated = updateGuestCartQuantity(productId, parsed);
          setGuestItems(updated);
        }

        // Once a valid quantity is applied, revert to using cart quantity
        setTempQuantities((prev) => {
          const next = { ...prev };
          delete next[productId];
          return next;
        });
      }
    },
    [updateQty, removeFromCart, setGuestItems]
  );

  return (
    <section className="cart-page">
      <div className="cart-container">
        {itemsToRender.length > 0 && (
          <h1 className="cart-title">Your Cart</h1>
        )}

        {itemsToRender.length === 0 ? (
        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>

          <h2>Your cart is empty</h2>

          <p>
            Looks like you haven't added anything to your cart yet.
          </p>

          <button
            className="start-shopping-btn"
            onClick={() => router.push("/shop/joint-care")}
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <>
          <div className="cart-layout">
            <div className="cart-products">
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
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const newQty = product.qty - 1;

                        // If new quantity is 0 or less, remove the item
                        if (newQty <= 0) {
                          if (isAuthenticated) {
                            removeFromCart(product.productId);
                          } else {
                            const updated = removeGuestCartItem(
                              product.productId
                            );
                            setGuestItems(updated);
                          }
                        } else {
                          // Otherwise, update the quantity
                          if (isAuthenticated) {
                            updateQty(product.productId, newQty);
                          } else {
                            const updated = updateGuestCartQuantity(
                              product.productId,
                              newQty
                            );
                            setGuestItems(updated);
                          }
                        }
                      }}
                    >
                      −
                    </button>

                    <input
                      type="number"
                      min="0"
                      className="qty-input"
                      value={
                        tempQuantities[product.productId] ?? product.qty
                      }
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) =>
                        handleQtyChange(
                          product.productId,
                          e.target.value,
                          isAuthenticated
                        )
                      }
                      onBlur={() => {
                        // If the user leaves the field empty, restore the real cart quantity
                        setTempQuantities((prev) => {
                          if (prev[product.productId] === "") {
                            const next = { ...prev };
                            delete next[product.productId];
                            return next;
                          }
                          return prev;
                        });
                      }}
                    />

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

                    <button
                      type="button"
                      className="delete-item-btn"
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
                      🗑
                    </button>
                  </div>

                  {/* ACTIONS */}
                  <div className="cart-actions">
                    <button
                      className="cart-buy-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (typeof window === "undefined") return;

                        const payload = {
                          productId: product.productId,
                          name: product.name,
                          price: Number(product.price),
                          image: product.image,
                          qty: product.qty,
                          fromCart: true,
                          type: "product",
                        };

                        sessionStorage.setItem(
                          "buyNowProduct",
                          JSON.stringify(payload)
                        );

                        if (!isAuthenticated) {
                          sessionStorage.setItem(
                            "pendingBuyNow",
                            JSON.stringify(payload)
                          );
                          setShowLoginModal(true);
                          return;
                        }

                        router.push("/checkout");
                      }}
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
                ))}
              </div>

              <div className="cart-actions-row">
                <button
                  type="button"
                  className="clear-cart-btn"
                  disabled={itemsToRender.length === 0}
                  onClick={() => setShowClearCartModal(true)}
                >
                  Clear Cart
                </button>
              </div>
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
                    if (typeof window !== "undefined") {
                      // Ensure previous Buy Now flows don't override full-cart checkout
                      sessionStorage.removeItem("buyNowProduct");
                      sessionStorage.removeItem("pendingBuyNow");
                    }
                    router.push("/checkout");
                  }
                }}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </>
      )}
        <LoginRequiredModal
          show={showLoginModal}
          onClose={() => setShowLoginModal(false)}
        />

        {showClearCartModal && (
          <div className="modal-overlay">
            <div className="modal-card">
              <h3>Clear Cart</h3>
              <p>Are you sure you want to remove all items from your cart?</p>

              <div className="modal-buttons">
                <button
                  type="button"
                  onClick={() => setShowClearCartModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    if (isAuthenticated) {
                      await clearCart();
                    } else {
                      setGuestItems([]);
                      if (typeof window !== "undefined") {
                        window.localStorage.removeItem("guestCart");
                      }
                    }
                    setShowClearCartModal(false);
                  }}
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}