"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false); // ✅ modal state

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid email or password");
        return;
      }

      // ✅ sync auth state
      await refreshUser();

      // ✅ after login, try to sync guest cart (if any)
      let redirected = false;
      if (typeof window !== "undefined") {
        try {
          const raw = window.localStorage.getItem("guest_cart");
          if (raw) {
            const guestItems = JSON.parse(raw);
            if (Array.isArray(guestItems) && guestItems.length > 0) {
              const syncRes = await fetch("/api/cart/sync", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ items: guestItems }),
              });

              if (syncRes.ok) {
                window.localStorage.removeItem("guest_cart");
                router.push("/cart");
                redirected = true;
              }
            }
          }
        } catch (err) {
          console.error("Guest cart sync failed", err);
        }
      }

      if (!redirected) {
        // ✅ show success modal when there was no guest cart to sync
        setShowSuccess(true);
      }
    } catch (err) {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="auth-page">
        <h1>Welcome Back</h1>
        <p className="auth-subtitle">
          Login to continue your wellness journey
        </p>

        {error && <p className="error">{error}</p>}

        <form onSubmit={handleLogin} className="auth-form">
          <input
            type="email"
            placeholder="Email address"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="auth-switch">
          Don’t have an account? <Link href="/signup">Sign up</Link>
        </p>
      </section>

      {/* ✅ SUCCESS MODAL */}
      {showSuccess && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>🎉 Login Successful!</h2>
            <p>Welcome back to HUREKA.</p>

            <button
              className="modal-btn"
              onClick={() => router.push("/")}
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </>
  );
}