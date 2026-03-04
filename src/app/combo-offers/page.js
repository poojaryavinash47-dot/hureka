"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import CartPopup from "@/components/CartPopup";
import LoginRequiredModal from "@/components/LoginRequiredModal";
import { getProducts } from "@/lib/wooCommerce";

export default function ComboOffersPage() {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const [showPopup, setShowPopup] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [combos, setCombos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCombos = async () => {
      try {
        const products = await getProducts();

        const comboProducts = products
          .filter((p) =>
            p.categories?.some(
              (cat) =>
                cat.slug === "combo-offers" ||
                cat.name.toLowerCase() === "combo offers"
            )
          )
          .map((p) => ({
            name: p.name,
            slug: p.slug,
            price: Number(p.price),
            mrp: Number(p.regular_price),
            image: p.images?.[0]?.src || "/placeholder.png",
            description: p.short_description,
          }));

        setCombos(comboProducts);
      } catch (error) {
        console.error("Failed to load combos", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCombos();
  }, []);

  const handleAddToCart = (combo, redirect = false) => {
    // BUY NOW path for guests: save product and redirect to login
    if (!user && redirect) {
      const payload = {
        productId: combo.slug,
        name: combo.name,
        price: combo.price,
        image: combo.image,
        qty: 1,
        fromCart: false,
        type: "combo",
      };

      if (typeof window !== "undefined") {
        sessionStorage.setItem("buyNowProduct", JSON.stringify(payload));
        sessionStorage.setItem("pendingBuyNow", JSON.stringify(payload));
      }

      router.push("/login");
      return;
    }

    if (!user) {
      setShowLoginModal(true);
      return;
    }

    addToCart({
      productId: combo.slug,   // ✅ SLUG as unique ID
      name: combo.name,
      price: combo.price,
      image: combo.image,
      type: "combo",
    });

    if (redirect) {
      router.push("/checkout");
    } else {
      setShowPopup(true);
    }
  };

  if (loading) {
    return <p style={{ padding: "80px" }}>Loading combos...</p>;
  }

  return (
    <>
      <section className="combo-page">

        <div className="combo-header">
          <h1>Combo Offers</h1>
          <p>Save more with our carefully curated health combos</p>
        </div>

        <div className="combo-grid">
          {combos.length > 0 ? (
            combos.map((combo) => (
              <Link
                key={combo.slug}
                href={`/combo/${combo.slug}`}
                className="combo-link"
              >
                <div className="combo-card">

                  <div className="combo-image">
                    <img src={combo.image} alt={combo.name} />
                  </div>

                  <div className="combo-info">
                    <h3>{combo.name}</h3>

                    <div
                      dangerouslySetInnerHTML={{
                        __html: combo.description,
                      }}
                    />

                    <div className="combo-price">
                      <span className="combo-final">₹{combo.price}</span>

                      {combo.mrp && (
                        <>
                          <span className="combo-mrp">₹{combo.mrp}</span>
                          <span className="combo-save">
                            Save ₹{combo.mrp - combo.price}
                          </span>
                        </>
                      )}
                    </div>

                    <div className="combo-actions">
                      <button
                        className="combo-btn combo-cart"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleAddToCart(combo);
                        }}
                      >
                        Add to Cart
                      </button>

                      <button
                        className="combo-btn combo-buy"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleAddToCart(combo, true);
                        }}
                      >
                        Buy Now
                      </button>
                    </div>

                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p>No combo offers available</p>
          )}
        </div>

        <CartPopup
          show={showPopup}
          onClose={() => setShowPopup(false)}
        />

      </section>

      <LoginRequiredModal
        show={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </>
  );
}