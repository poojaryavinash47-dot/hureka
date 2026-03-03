"use client";

import { useRouter } from "next/navigation";

export default function PromoSection() {
  const router = useRouter();

  return (
    <section className="promo-section">
      <div className="promo-wrapper">

        {/* IMAGE */}
        <img
          className="promo-img"
          src="/products/promo-lotion.png"
          alt="Sunscreen Lotion"
        />

        {/* CONTENT */}
        <div className="promo-content">
          <h2>Hureka Anti-Dandruff Herbal Shampoo</h2>
          <h4>Protect Your Glow. Every Single Day.</h4>

          <p>
            Hureka Sunscreen Lotion SPF 30 offers broad-spectrum protection against harmful
            UVA and UVB rays while keeping your skin hydrated and smooth.
          </p>

          <button
            className="promo-btn"
            onClick={() => router.push("/shop/hair-care")}
          >
            SHOP NOW
          </button>
        </div>

      </div>
    </section>
  );
}