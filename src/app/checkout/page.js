"use client";

import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CheckoutPage() {
  const { cartItems, cartLoading, clearPurchasedItems, removeFromCart, updateQty } = useCart();
  const { user, loading } = useAuth();
  const router = useRouter();

  const [processing, setProcessing] = useState(false);
  const [items, setItems] = useState([]);
  const [initializingItems, setInitializingItems] = useState(true);
  const [isBuyNowFlow, setIsBuyNowFlow] = useState(false);

  /* 🔐 Protect Route */
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (loading || !user) return;

    if (typeof window === "undefined") return;

    const raw = sessionStorage.getItem("buyNowProduct");

    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        const item = {
          productId: parsed.productId,
          name: parsed.name,
          price: Number(parsed.price),
          image: parsed.image,
          qty: parsed.qty || 1,
          fromCart: !!parsed.fromCart,
        };

        setItems([item]);
        setIsBuyNowFlow(true);
      } catch (error) {
        console.error("Invalid buyNowProduct in sessionStorage", error);
        sessionStorage.removeItem("buyNowProduct");
        setItems([]);
        setIsBuyNowFlow(false);
      } finally {
        setInitializingItems(false);
      }

      return;
    }

    if (cartLoading) return;

    const selected = (cartItems || []).filter(
      (item) => item.selected
    );

    setItems(selected);
    setIsBuyNowFlow(false);
    setInitializingItems(false);
  }, [loading, user, cartItems, cartLoading]);

  if (loading || !user) return null;

  if (initializingItems) {
    return <p className="empty-cart">Preparing checkout...</p>;
  }

  if (!items || items.length === 0) {
    return <p className="empty-cart">Your cart is empty</p>;
  }

  const subtotal = items.reduce(
    (acc, item) => acc + Number(item.price) * item.qty,
    0
  );

  const tax = Math.round(subtotal * 0.09);
  const total = subtotal + tax;

  /* 🧮 Quantity Handlers */
  const increaseQty = (productId, currentQty, shouldSyncWithCart) => {
    const newQty = currentQty + 1;

    setItems((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, qty: newQty } : item
      )
    );

    if (shouldSyncWithCart && typeof updateQty === "function") {
      updateQty(productId, newQty);
    }
  };

  const decreaseQty = (productId, currentQty, shouldSyncWithCart) => {
    if (currentQty <= 1) return;

    const newQty = currentQty - 1;

    setItems((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, qty: newQty } : item
      )
    );

    if (shouldSyncWithCart && typeof updateQty === "function") {
      updateQty(productId, newQty);
    }
  };

  /* 💳 Payment */
  const handlePayment = async () => {
    setProcessing(true);

    try {
      const res = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          subtotal,
          tax,
          total,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert("Failed to create order");
        setProcessing(false);
        return;
      }

      if (typeof window !== "undefined") {
        const raw = sessionStorage.getItem("buyNowProduct");

        if (raw) {
          sessionStorage.removeItem("buyNowProduct");

          try {
            const parsed = JSON.parse(raw);
            if (parsed.fromCart && parsed.productId) {
              await removeFromCart(parsed.productId);
            }
          } catch (error) {
            console.error("Failed to parse buyNowProduct on payment", error);
          }
        } else {
          const purchasedIds = items.map(
            (item) => item.productId
          );
          await clearPurchasedItems(purchasedIds);
        }
      }

      window.location.href =
        `https://siddartha123.nxtwat.in/checkout?orderId=${data.orderId}`;

    } catch (error) {
      alert("Something went wrong");
      setProcessing(false);
    }
  };

  return (
    <section className="checkout-page">

      {/* LEFT SIDE */}
      <div className="checkout-left">
        <h2>Contact</h2>

        <input
          type="text"
          className="input-field"
          placeholder="Email or mobile phone number"
        />

        <h2 className="delivery-title">Delivery</h2>

        <select className="input-field">
          <option>India</option>
        </select>

        <div className="row-2">
          <input className="input-field" placeholder="First name (optional)" />
          <input className="input-field" placeholder="Last name" />
        </div>

        <input className="input-field" placeholder="Address" />
        <input className="input-field" placeholder="Apartment, suite, etc. (optional)" />

        <div className="row-3">
          <input className="input-field" placeholder="City" />
          <input className="input-field" placeholder="State" />
          <input className="input-field" placeholder="PIN code" />
        </div>

        <button
          className="pay-now-btn"
          onClick={handlePayment}
          disabled={processing}
        >
          {processing ? "Processing..." : "Pay Now"}
        </button>
      </div>

      {/* RIGHT SIDE */}
      <div className="checkout-right">
        {items.map((item, index) => {
          // For regular cart checkout, sync quantity back to cart.
          // For Buy-Now flow (coming from a "Buy" button), keep quantity local
          // to the checkout state so it doesn't get reset from the cart.
          const shouldSyncWithCart = !isBuyNowFlow;

          return (
            <div
              key={item.productId || index}
              className="product-summary"
            >
              <img
                src={item.image}
                alt={item.name}
              />

              <div>
                <p className="name">{item.name}</p>

                <div className="qty-control">
                  <button
                    onClick={() =>
                      decreaseQty(
                        item.productId,
                        item.qty,
                        shouldSyncWithCart
                      )
                    }
                    disabled={item.qty <= 1}
                  >
                    −
                  </button>

                  <span>{item.qty}</span>

                  <button
                    onClick={() =>
                      increaseQty(
                        item.productId,
                        item.qty,
                        shouldSyncWithCart
                      )
                    }
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="price">₹{Number(item.price) * item.qty}</div>
            </div>
          );
        })}

        <div className="summary-row">
          <span>Subtotal</span>
          <span>₹{subtotal}</span>
        </div>

        <div className="summary-row">
          <span>Estimated taxes</span>
          <span>₹{tax}</span>
        </div>

        <div className="summary-total">
          <span>Total</span>
          <span>₹{total}</span>
        </div>
      </div>

    </section>
  );
}