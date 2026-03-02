"use client";

import { useCart } from "@/context/CartContext";

export default function CheckoutPage() {
  const { cartItems } = useCart();

  // Safety check
  if (!cartItems || cartItems.length === 0) {
    return (
      <p style={{ padding: "80px", textAlign: "center" }}>
        Your cart is empty
      </p>
    );
  }

  // Buy Now = single product
  const item = cartItems[0];

  const subtotal = Number(item.price) * item.qty;
  const tax = Math.round(subtotal * 0.09); // example 9%
  const total = subtotal + tax;

  // 🔥 Redirect to WooCommerce Checkout
  const handlePayment = () => {
    window.location.href =
      "https://siddartha123.nxtwat.in/checkout";
  };

  return (
    <section className="checkout-page">

      {/* LEFT – CUSTOMER DETAILS */}
      <div className="checkout-left">
        <h2>Contact</h2>
        <input
          type="email"
          placeholder="Email or mobile phone number"
        />

        <label className="checkbox">
          <input type="checkbox" />
          Email me with news and offers
        </label>

        <h2>Delivery</h2>

        <select>
          <option>India</option>
        </select>

        <div className="two-col">
          <input placeholder="First name (optional)" />
          <input placeholder="Last name" />
        </div>

        <input placeholder="Address" />
        <input placeholder="Apartment, suite, etc. (optional)" />

        <div className="three-col">
          <input placeholder="City" />
          <select>
            <option>Karnataka</option>
          </select>
          <input placeholder="PIN code" />
        </div>

        <label className="checkbox">
          <input type="checkbox" />
          Save this information for next time
        </label>
      </div>

      {/* RIGHT – ORDER SUMMARY */}
      <div className="checkout-right">

        <div className="product-summary">
          <img src={item.image} alt={item.name} />

          <div className="product-info">
            <p className="name">{item.name}</p>
            <p className="variant">{item.category}</p>
            <p className="qty">Qty: {item.qty}</p>
          </div>

          <span className="price">₹{item.price}</span>
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
          <strong>₹{total}</strong>
        </div>

        {/* PAY NOW */}
        <button className="pay-now-btn" onClick={handlePayment}>
          Pay Now
        </button>

      </div>
    </section>
  );
}