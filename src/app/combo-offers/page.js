"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import CartPopup from "@/components/CartPopup";
import { getProducts } from "@/lib/wooCommerce";

export default function ComboOffersPage() {
  const { addToCart } = useCart();
  const [showPopup, setShowPopup] = useState(false);
  const [combos, setCombos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCombos = async () => {
      try {
        const products = await getProducts();

        // ✅ filter only combo offers
        const comboProducts = products
          .filter((p) =>
            p.categories?.some(
              (cat) =>
                cat.slug === "combo-offers" ||
                cat.name.toLowerCase() === "combo offers"
            )
          )
          .map((p) => ({
            id: p.id,
            title: p.name,
            slug: p.slug,
            price: p.price,
            mrp: p.regular_price,
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

  const handleAddToCart = (combo) => {
    addToCart({ ...combo, qty: 1, type: "combo" });
    setShowPopup(true);
  };

  if (loading) {
    return <p style={{ padding: "80px" }}>Loading combos...</p>;
  }

  return (
    <section className="combo-page">
      {/* HEADER */}
      <div className="combo-header">
        <h1>Combo Offers</h1>
        <p>Save more with our carefully curated health combos</p>
      </div>

      {/* COMBO GRID */}
      <div className="combo-grid">
        {combos.length > 0 ? (
          combos.map((combo) => (
            <Link
              key={combo.id}
              href={`/combo/${combo.slug}`}
              className="combo-link"
            >
              <div className="combo-card">
                {/* IMAGE */}
                <div className="combo-image">
                  <img src={combo.image} alt={combo.title} />
                </div>

                {/* INFO */}
                <div className="combo-info">
                  <h3>{combo.title}</h3>

                  <div
                    dangerouslySetInnerHTML={{
                      __html: combo.description,
                    }}
                  />

                  {/* PRICE */}
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

                  {/* ACTIONS */}
                  <div className="combo-actions">
                    <button
                      className="combo-btn combo-cart"
                      onClick={(e) => {
                        e.preventDefault();
                        handleAddToCart(combo);
                      }}
                    >
                      Add to Cart
                    </button>

                    <button
                      className="combo-btn combo-buy"
                      onClick={(e) => {
                        e.preventDefault();
                        handleAddToCart(combo);
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

      {/* CART POPUP */}
      <CartPopup
        show={showPopup}
        onClose={() => setShowPopup(false)}
      />
    </section>
  );
}