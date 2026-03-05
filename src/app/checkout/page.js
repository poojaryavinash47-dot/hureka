"use client";

import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import OrderModal from "@/components/OrderModal";

export default function CheckoutPage() {
  const { cartItems, cartLoading, clearPurchasedItems, removeFromCart, updateQty } = useCart();
  const { user, loading } = useAuth();
  const router = useRouter();

  const [processing, setProcessing] = useState(false);
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [addressLoading, setAddressLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [initializingItems, setInitializingItems] = useState(true);
  const [isBuyNowFlow, setIsBuyNowFlow] = useState(false);

  const [form, setForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [saveAddress, setSaveAddress] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  /* 🔐 Protect Route */
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  // Prefill address from saved data (if any)
  useEffect(() => {
    if (loading || !user) return;

    let cancelled = false;

    const loadAddress = async () => {
      try {
        const res = await fetch("/api/address/user", {
          credentials: "include",
        });

        if (!res.ok) {
          // even on error, fall back to basic user info
          if (!cancelled) {
            setForm((prev) => ({
              ...prev,
              email: prev.email || user.email || "",
              firstName:
                prev.firstName || (user.name ? user.name.split(" ")[0] : ""),
            }));
          }
          return;
        }

        const data = await res.json();
        if (cancelled) return;

        if (data?.address) {
          const a = data.address;
          setForm((prev) => ({
            ...prev,
            email: a.email || prev.email || user.email || "",
            firstName: a.firstName || prev.firstName || "",
            lastName: a.lastName || prev.lastName || "",
            address: a.address || prev.address || "",
            apartment: a.apartment || prev.apartment || "",
            city: a.city || prev.city || "",
            state: a.state || prev.state || "",
            pincode: a.pincode || prev.pincode || "",
          }));
          setSaveAddress(true);
        } else {
          // no saved address, at least prefill email / first name
          setForm((prev) => ({
            ...prev,
            email: prev.email || user.email || "",
            firstName:
              prev.firstName || (user.name ? user.name.split(" ")[0] : ""),
          }));
        }
      } catch (err) {
        console.error("Load address error", err);
        setForm((prev) => ({
          ...prev,
          email: prev.email || user.email || "",
          firstName:
            prev.firstName || (user.name ? user.name.split(" ")[0] : ""),
        }));
      } finally {
        if (!cancelled) setAddressLoading(false);
      }
    };

    loadAddress();

    return () => {
      cancelled = true;
    };
  }, [loading, user]);

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

  const isFormValid =
    form.email &&
    form.firstName &&
    form.address &&
    form.city &&
    form.state &&
    form.pincode;

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
    if (!isFormValid || processing) return;
    setProcessing(true);

    try {
      if (saveAddress && user) {
        try {
          await fetch("/api/address/save", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              userId: user._id,
              email: form.email,
              firstName: form.firstName,
              lastName: form.lastName,
              address: form.address,
              apartment: form.apartment,
              city: form.city,
              state: form.state,
              pincode: form.pincode,
            }),
          });
        } catch (err) {
          console.error("Save address failed", err);
        }
      }

      // Open confirmation modal; actual WooCommerce order will be created
      // only after user clicks "Confirm Order".
      setShowOrderModal(true);
    } catch (error) {
      console.error("Checkout payment error", error);
    } finally {
      setProcessing(false);
    }
  };

  const handleConfirmOrder = async () => {
    if (submittingOrder) return;
    setSubmittingOrder(true);

    try {
      const billing = {
        email: form.email,
        firstName: form.firstName,
        lastName: form.lastName,
        address: form.address,
        apartment: form.apartment,
        city: form.city,
        state: form.state,
        pincode: form.pincode,
      };

      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          billing,
          items,
          subtotal,
          tax,
          total,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data?.success) {
        const message = data?.error || "Order creation failed";
        console.error("Order creation failed", data);
        throw new Error(message);
      }

      const createdOrder = data.order;

      // Clear purchased items from cart for regular checkout
      try {
        const productIdsToClear = items
          .filter((item) => item.productId)
          .map((item) => item.productId);

        if (productIdsToClear.length && typeof clearPurchasedItems === "function") {
          await clearPurchasedItems(productIdsToClear);
        }
      } catch (err) {
        console.error("Failed to clear purchased items", err);
      }

      setShowOrderModal(false);
      setShowSuccess(true);
    } catch (err) {
      console.error("Confirm order error", err);
      alert(err.message || "Something went wrong while confirming your order.");
    } finally {
      setSubmittingOrder(false);
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
          value={form.email}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, email: e.target.value }))
          }
        />

        <h2 className="delivery-title">Delivery</h2>

        <select className="input-field">
          <option>India</option>
        </select>

        <div className="name-row">
          <input
            className="input-field"
            placeholder="First name"
            value={form.firstName}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, firstName: e.target.value }))
            }
          />
          <input
            className="input-field"
            placeholder="Last name (optional)"
            value={form.lastName}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, lastName: e.target.value }))
            }
          />
        </div>

        <input
          className="input-field"
          placeholder="Address"
          value={form.address}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, address: e.target.value }))
          }
        />
        <input
          className="input-field"
          placeholder="Apartment, suite, etc. (optional)"
          value={form.apartment}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, apartment: e.target.value }))
          }
        />

        <div className="location-row">
          <input
            className="input-field"
            placeholder="City"
            value={form.city}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, city: e.target.value }))
            }
          />
          <input
            className="input-field"
            placeholder="State"
            value={form.state}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, state: e.target.value }))
            }
          />
          <input
            className="input-field"
            placeholder="PIN code"
            value={form.pincode}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, pincode: e.target.value }))
            }
          />
        </div>

        <div className="checkbox-row">
          <input
            type="checkbox"
            id="saveAddress"
            checked={saveAddress}
            onChange={(e) => setSaveAddress(e.target.checked)}
          />
          <span>Save this address for future orders</span>
        </div>

        <button
          className="pay-now-btn"
          onClick={handlePayment}
          disabled={processing || !isFormValid || addressLoading}
        >
          {processing ? "Processing..." : "Pay"}
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
        {/* Mobile-only: collapsible order summary */}
        <div
          className="mobile-summary-toggle"
          onClick={() => setShowSummary((prev) => !prev)}
        >
          <span>Order Summary</span>
          <span className={`arrow ${showSummary ? "open" : ""}`}>
            ▼
          </span>
        </div>

        {showSummary && (
          <div className="order-summary-mobile">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>

            <div className="summary-row">
              <span>Estimated taxes</span>
              <span>₹{tax}</span>
            </div>

            <div className="summary-row total">
              <span>Total</span>
              <span>₹{total}</span>
            </div>
          </div>
        )}

        {/* Desktop summary (unchanged) */}
        <div className="order-summary-desktop">
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

        {/* Mobile-only Pay Now button below summary */}
        <button
          className="pay-now-btn pay-now-mobile"
          onClick={handlePayment}
          disabled={processing || !isFormValid || addressLoading}
        >
          {processing ? "Processing..." : "Pay"}
        </button>
      </div>
      <OrderModal
        open={showOrderModal}
        items={items}
        subtotal={subtotal}
        tax={tax}
        total={total}
        confirming={submittingOrder}
        onConfirm={handleConfirmOrder}
        onClose={() => (!submittingOrder ? setShowOrderModal(false) : null)}
      />
      {showSuccess && (
        <div className="payment-modal-overlay">
          <div className="payment-modal">
            <h2>Payment Successful 🎉</h2>
            <p>Your order has been placed successfully.</p>
            <button
              className="payment-modal-btn"
              onClick={() => {
                setShowSuccess(false);
                router.push("/");
              }}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </section>
  );
}