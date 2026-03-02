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
  const { user } = useAuth(); // ✅ auth state
  const router = useRouter();
  const [showPopup, setShowPopup] = useState(false);

  const requireLogin = () => {
    alert("Please login to continue");
    router.push("/login");
  };

  const handleAddToCart = (e) => {
    e.stopPropagation(); // 🔥 IMPORTANT
    e.preventDefault();

    if (!user) {
      requireLogin();
      return;
    }

    addToCart(product);
    setShowPopup(true);
  };

  const handleBuyNow = (e) => {
    e.stopPropagation(); // 🔥 IMPORTANT
    e.preventDefault();

    if (!user) {
      requireLogin();
      return;
    }

    addToCart(product);
    router.push("/checkout");
  };

  return (
    <>
      <div className="product-card">

        {/* ✅ LINK ONLY WHERE NAVIGATION IS NEEDED */}
        <Link href={`/product/${slug}`} className="product-link">
          <div className="product-image">
            <img src={image} alt={name} />
          </div>

          <div className="product-info">
            <p className="product-category">{category}</p>
            <h3 className="product-name">{name}</h3>

            <div className="product-price">
              <span className="mrp">₹{mrp}</span>
              <span className="price">₹{price}</span>
              {discount && (
                <span className="discount">{discount}% OFF</span>
              )}
            </div>
          </div>
        </Link>

        {/* ✅ ACTIONS OUTSIDE LINK */}
        <div className="product-actions">
          <button className="btn-cart" onClick={handleAddToCart}>
            Add to Cart
          </button>

          <button className="btn-buy" onClick={handleBuyNow}>
            Buy Now
          </button>
        </div>
      </div>

      {/* POPUP */}
      <CartPopup
        show={showPopup}
        onClose={() => setShowPopup(false)}
        product={product}
      />
    </>
  );
}