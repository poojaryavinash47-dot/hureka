"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import CartPopup from "./CartPopup";

export default function ProductCard({ product }) {
  const { name, category, image, price, mrp, discount, slug } = product;

  const { addToCart } = useCart();
  const { user, loading } = useAuth();
  const router = useRouter();

  const [showPopup, setShowPopup] = useState(false);

  /* ================= ADD TO CART ================= */
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (loading) return;

    addToCart({
      productId: slug,              // ✅ UNIQUE STRING ID
      name: name,
      price: Number(price),         // ✅ Always number
      image: image,
      type: "product",
    });

    setShowPopup(true);
  };

  /* ================= BUY NOW ================= */
  const handleBuyNow = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (loading) return;

    const payload = {
      productId: slug,
      name,
      price: Number(price),
      image,
      qty: 1,
      fromCart: false,
      type: "product",
    };

    if (typeof window === "undefined") return;

    // Always store the Buy Now product for checkout
    sessionStorage.setItem("buyNowProduct", JSON.stringify(payload));

    if (!user) {
      // Also mark it as pending so we can add it to DB cart after login
      sessionStorage.setItem("pendingBuyNow", JSON.stringify(payload));
      router.push("/login");
      return;
    }

    router.push("/checkout");
  };

  return (
    <>
      <div className="product-card">

        {/* PRODUCT LINK */}
        <Link href={`/product/${slug}`} className="product-link">
          <div className="product-image">
            <img src={image} alt={name} />
          </div>

          <div className="product-info">
            <p className="product-category">{category}</p>
            <h3 className="product-name">{name}</h3>

            <div className="product-price">
              {mrp && <span className="mrp">₹{mrp}</span>}
              <span className="price">₹{price}</span>
              {discount && (
                <span className="discount">{discount}% OFF</span>
              )}
            </div>
          </div>
        </Link>

        {/* ACTION BUTTONS */}
        <div className="product-actions">
          <button
            className="btn-cart"
            onClick={handleAddToCart}
            disabled={loading}
          >
            {loading ? "Please wait..." : "Add to Cart"}
          </button>

          <button
            className="btn-buy"
            onClick={handleBuyNow}
            disabled={loading}
          >
            Buy Now
          </button>
        </div>
      </div>

      {/* CART POPUP */}
      <CartPopup
        show={showPopup}
        onClose={() => setShowPopup(false)}
      />
    </>
  );
}