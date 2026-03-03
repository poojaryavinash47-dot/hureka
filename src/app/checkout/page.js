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

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading]);

  if (loading) return null;

  if (!cartItems || cartItems.length === 0) {
    return <p className="empty-cart">Your cart is empty</p>;
  }

  const item = cartItems[0];
  const subtotal = Number(item.price) * item.qty;
  const tax = Math.round(subtotal * 0.09);
  const total = subtotal + tax;

  const handlePayment = async () => {
    setProcessing(true);

    const res = await fetch("/api/orders/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: cartItems, subtotal, tax, total }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert("Failed to create order");
      setProcessing(false);
      return;
    }

    window.location.href =
      `https://siddartha123.nxtwat.in/checkout?orderId=${data.orderId}`;
  };

return (
  <section className="checkout-page">

    {/* LEFT SIDE */}
    <div className="checkout-left">

      <div className="checkout-header">
        <h2>Contact</h2>
        
      </div>

      <input
        type="text"
        className="input-field"
        placeholder="Email or mobile phone number"
      />

     <label className="checkbox-row">
  <input type="checkbox" />
  <span>Save this information for next time</span>
</label>

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
        <select className="input-field">
          <option>Karnataka</option>
        </select>
        <input className="input-field" placeholder="PIN code" />
      </div>

      <label className="checkbox-row">
        <input type="checkbox" />
        <span>Save this information for next time</span>
      </label>

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
      <div className="summary-item">
        <img src={item.image} alt={item.name} />
        <div>
          <p>{item.name}</p>
          <span>Qty {item.qty}</span>
        </div>
      </div>

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