"use client";

import { useRouter } from "next/navigation";

export default function CartPopup({ show, onClose }) {
  const router = useRouter();

  if (!show) return null;

  return (
    <div className="hureka-modal-overlay">
      <div className="hureka-modal">

        {/* HEADER */}
        <div className="hureka-modal-header">
          <h4>Added to Cart</h4>
          <button className="hureka-close-btn" onClick={onClose}>×</button>
        </div>

        {/* BODY */}
        <p className="hureka-modal-text">
          This product has been added to your cart.
        </p>

        {/* ACTIONS */}
        <div className="hureka-modal-actions">
          <button className="hureka-secondary-btn" onClick={onClose}>
            Continue Shopping
          </button>

          <button
            className="hureka-primary-btn"
            onClick={() => {
              onClose();
              router.push("/cart");
            }}
          >
            View Cart
          </button>
        </div>

      </div>
    </div>
  );
}