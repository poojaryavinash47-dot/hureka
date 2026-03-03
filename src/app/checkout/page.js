"use client";

import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CheckoutPage() {
  const { cartItems } = useCart();
  const { user, loading } = useAuth();
  const router = useRouter();
  const [processing, setProcessing] = useState(false);

  // 🔐 Protect route
  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading]);

  if (loading) return null;

  if (!cartItems || cartItems.length === 0) {
    return <p style={{ padding: "80px", textAlign: "center" }}>Your cart is empty</p>;
  }

  const item = cartItems[0];
  const subtotal = Number(item.price) * item.qty;
  const tax = Math.round(subtotal * 0.09);
  const total = subtotal + tax;

  // ✅ Production payment handler
  const handlePayment = async () => {
    setProcessing(true);

    const res = await fetch("/api/orders/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: cartItems,
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

    // 🔥 Redirect to payment gateway with order ID
    window.location.href =
      `https://siddartha123.nxtwat.in/checkout?orderId=${data.orderId}`;
  };

  return (
    <section className="checkout-page">
      {/* YOUR UI REMAINS SAME */}

      <button
        className="pay-now-btn"
        onClick={handlePayment}
        disabled={processing}
      >
        {processing ? "Processing..." : "Pay Now"}
      </button>
    </section>
  );
}