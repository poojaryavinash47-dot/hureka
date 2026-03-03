"use client";

import { useRouter } from "next/navigation";

export default function OilFreeSection() {
  const router = useRouter();

  return (
    <section className="oilfree-section">
      <div className="oilfree-wrapper">

        {/* LEFT CONTENT */}
        <div className="oilfree-content">
          <h2>Hureka Joint Care Capsules</h2>
          <h4>Move Freely. Live Comfortably.</h4>

          <p>
            Hureka Joint Care Capsules are formulated with a powerful blend of herbal
            extracts and essential nutrients to support joint flexibility and mobility.
            Designed to reduce stiffness and improve overall joint health, this advanced
            formula promotes daily comfort and long-term strength. Ideal for adults
            seeking natural joint support.
          </p>

          <button
            className="oilfree-btn"
            onClick={() => router.push("/shop/joint-care")}
          >
            SHOP NOW
          </button>
        </div>

        {/* RIGHT IMAGE */}
        <img
          className="oilfree-img"
          src="/products/oilfree.png"
          alt="Joint Care Capsules"
        />

      </div>
    </section>
  );
}