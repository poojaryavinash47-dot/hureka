"use client";

import { useRouter } from "next/navigation";

export default function LoginRequiredModal({ show, onClose }) {
  const router = useRouter();

  if (!show) return null;

  return (
    <div className="login-modal-overlay" onClick={onClose}>
      <div
        className="login-modal-card modal-open"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="login-modal-icon">🔒</div>

        <h3 className="login-modal-title">Login Required</h3>
        <p className="login-modal-text">Please login to continue.</p>

        <div className="buttons-container">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>

          <button
            className="login-btn"
            onClick={() => router.push("/login")}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}