"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import AuthSuccessModal from "@/components/AuthSuccessModal";

export default function SignupPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [redirectPath, setRedirectPath] = useState("/");

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      // ✅ User created and JWT cookie set; refresh auth state
      await refreshUser();

      let pendingProduct = null;
      let guestCartSynced = false;

      let nextRoute = "/";

      if (typeof window !== "undefined") {
        // Read any pending Buy Now product (edge case if user signed up from that flow)
        try {
          const pendingRaw = window.sessionStorage.getItem(
            "pendingBuyNow"
          );
          if (pendingRaw) {
            pendingProduct = JSON.parse(pendingRaw);
          }
        } catch (err) {
          console.error("Invalid pendingBuyNow data on signup", err);
        }

        // Sync any guest cart items into the new account
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
          console.error("Guest cart sync failed on signup", err);
        }

        // If there was a pending Buy Now product, add it to the DB cart and go to checkout
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
              nextRoute = "/checkout";
            }
          } catch (err) {
            console.error(
              "Failed to add Buy Now item after signup",
              err
            );
          }
        } else if (guestCartSynced) {
          // No pending Buy Now, but guest cart was synced: go to cart
          nextRoute = "/cart";
        }
      }

      // Show success modal once and redirect when user continues
      setRedirectPath(nextRoute);
      setShowSuccess(true);
    } catch (err) {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="auth-page">
        <h1>Create Account</h1>
        <p className="auth-subtitle">
          Join HUREKA for a personalized wellness experience
        </p>

        {error && <p className="error">{error}</p>}

        <form onSubmit={handleSignup} className="auth-form">
          <input
            type="text"
            placeholder="Full Name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email address"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password (min 6 characters)"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link href="/login">Login</Link>
        </p>
      </section>

      <AuthSuccessModal
        show={showSuccess}
        title="Account Created Successfully"
        message="Welcome! Your account has been created and you are now logged in."
        buttonLabel="Continue"
        onContinue={() => {
          setShowSuccess(false);
          router.push(redirectPath || "/");
        }}
      />
    </>
  );
}