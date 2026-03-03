"use client";

import { useRouter } from "next/navigation";

export default function LoginRequiredModal({ show, onClose }) {
  const router = useRouter();

  if (!show) return null;

  return (
    <div className="login-modal-overlay" onClick={onClose}>
      <div
        className="login-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <h3>Please login to continue</h3>
        <p>You need to be logged in to perform this action.</p>

        <div className="login-modal-actions">
          <button className="btn-cancel" onClick={onClose}>
            Cancel
          </button>

          <button
            className="btn-login"
            onClick={() => router.push("/login")}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}