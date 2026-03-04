"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import AuthSuccessModal from "@/components/AuthSuccessModal";

export default function LoginPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false); // ✅ modal state
  const [redirectPath, setRedirectPath] = useState("/");

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

      let redirected = false;
      let pendingProduct = null;
      let guestCartSynced = false;

      let nextRoute = "/";

      if (typeof window !== "undefined") {
        // Read any pending Buy Now product stored before login
        try {
          const pendingRaw = window.sessionStorage.getItem(
            "pendingBuyNow"
          );
          if (pendingRaw) {
            pendingProduct = JSON.parse(pendingRaw);
          }
        } catch (err) {
          console.error("Invalid pendingBuyNow data", err);
        }

        // First, try to sync any guest cart items
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
                guestCartSynced = true;
              }
            }
          }
        } catch (err) {
          console.error("Guest cart sync failed", err);
        }

        // If there was a pending Buy Now product, add it to the DB cart
        if (pendingProduct) {
          try {
            const addRes = await fetch("/api/cart", {
              method: "POST",
              credentials: "include",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                productId: pendingProduct.productId,
                name: pendingProduct.name,
                price: pendingProduct.price,
                image: pendingProduct.image,
                type: pendingProduct.type || "product",
              }),
            });

            if (addRes.ok) {
              window.sessionStorage.removeItem("pendingBuyNow");
              router.push("/checkout");
              redirected = true;
            }
          } catch (err) {
            console.error(
              "Failed to add Buy Now item after login",
              err
            );
          }
        } else if (guestCartSynced) {
          // No pending Buy Now, but guest cart was synced: go to cart
          nextRoute = "/cart";
          router.push("/cart");
          redirected = true;
        }
      }

      if (!redirected) {
        // ✅ show success modal when there was no special redirect
        setRedirectPath(nextRoute);
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

      <AuthSuccessModal
        show={showSuccess}
        title="Login Successful"
        message="Welcome back to HUREKA."
        buttonLabel="Continue"
        onContinue={() => {
          setShowSuccess(false);
          router.push(redirectPath || "/");
        }}
      />
    </>
  );
}