"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import CartPopup from "@/components/CartPopup";
import { getProductBySlug } from "@/lib/wooCommerce";

export default function ComboDetailsPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [activeTab, setActiveTab] = useState("description");

  useEffect(() => {
    if (!slug) return;

    const fetchProduct = async () => {
      try {
        const p = await getProductBySlug(slug);

        if (!p) {
          setProduct(null);
          return;
        }

        // ✅ Convert ALL visible attributes into dynamic tabs
        const attributes = Array.isArray(p.attributes)
          ? p.attributes
              .filter((a) => a.visible && a.options?.length > 0)
              .map((a) => ({
                key: a.slug.toLowerCase(),
                label: a.name,
                values: a.options,
              }))
          : [];

        setProduct({
          id: p.id,
          name: p.name,
          slug: p.slug,
          price: p.price,
          mrp: p.regular_price,
          image: p.images?.[0]?.src || "/placeholder.png",

          // ✅ BOTH descriptions
          shortDescription: p.short_description,
          description: p.description,

          attributes,
        });

        setActiveTab("description");
      } catch (error) {
        console.error("Failed to load combo product", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  if (loading) {
    return <p style={{ padding: "80px" }}>Loading...</p>;
  }

  if (!product) {
    return <p style={{ padding: "80px" }}>Product not found</p>;
  }

  const handleAddToCart = () => {
    addToCart({ ...product, qty: 1, type: "combo" });
    setShowPopup(true);
  };

  return (
    <section className="combo-details-page">
      <div className="combo-details-container">

        {/* IMAGE */}
        <div className="combo-details-image">
          <img src={product.image} alt={product.name} />
        </div>

        {/* INFO */}
        <div className="combo-details-info">
          <h1 className="combo-title">{product.name}</h1>

          {/* SMALL DESCRIPTION */}
          {product.shortDescription && (
            <div
              className="combo-subtitle"
              dangerouslySetInnerHTML={{
                __html: product.shortDescription,
              }}
            />
          )}

          {/* PRICE */}
          <div className="combo-price-box">
            <span className="combo-price">₹{product.price}</span>
            {product.mrp && (
              <>
                <span className="combo-mrp">₹{product.mrp}</span>
                <span className="combo-save">
                  Save ₹{product.mrp - product.price}
                </span>
              </>
            )}
          </div>
 <div className="combo-actions">
            <button
              className="combo-cart-btn"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>

            <button
              className="combo-buy-btn"
              onClick={() => {
                handleAddToCart();
                router.push("/checkout");
              }}
            >
              Buy Now
            </button>
          </div>
          {/* TABS */}
          <div className="product-tabs">

            {/* TAB HEADERS */}
            <div className="tab-headers">
              <button
                className={activeTab === "description" ? "active" : ""}
                onClick={() => setActiveTab("description")}
              >
                Description
              </button>

              {product.attributes.length > 0 &&
                product.attributes.map((attr) => (
                  <button
                    key={attr.key}
                    className={activeTab === attr.key ? "active" : ""}
                    onClick={() => setActiveTab(attr.key)}
                  >
                    {attr.label}
                  </button>
                ))}
            </div>

            {/* TAB CONTENT */}
            <div className="tab-content">
              {activeTab === "description" && (
                <div
                  className="combo-full-description"
                  dangerouslySetInnerHTML={{
                    __html: product.description,
                  }}
                />
              )}

              {product.attributes.length > 0 &&
                product.attributes.map(
                  (attr) =>
                    activeTab === attr.key && (
                      <ul key={attr.key} className="tab-list">
                        {attr.values.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    )
                )}
            </div>
          </div>

          {/* ACTIONS */}
         
        </div>
      </div>

      <CartPopup
        show={showPopup}
        onClose={() => setShowPopup(false)}
      />
    </section>
  );
}