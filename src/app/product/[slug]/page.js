"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import CartPopup from "@/components/CartPopup";
import { getProductBySlug } from "@/lib/wooCommerce";

export default function ProductDetailsPage() {
  const { slug } = useParams();
  const router = useRouter();

  const { addToCart } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [rating, setRating] = useState(0);

  useEffect(() => {
    if (!slug) return;

    const fetchProduct = async () => {
      try {
        const p = await getProductBySlug(slug);

        if (!p) {
          setProduct(null);
          return;
        }

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
          slug: p.slug, // ✅ use slug everywhere
          name: p.name,
          price: Number(p.price),
          mrp: Number(p.regular_price),
          image: p.images?.[0]?.src || "/placeholder.png",
          category: p.categories?.[0]?.name || "",
          shortDescription: p.short_description,
          description: p.description,
          attributes,
          cod: true,
        });

        setActiveTab("description");
      } catch (error) {
        console.error("Failed to load product", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  if (loading) return <p style={{ padding: 80 }}>Loading product...</p>;
  if (!product) return <p style={{ padding: 80 }}>Product not found</p>;

  const requireLogin = () => {
    alert("Please login to continue");
    router.push("/login");
  };

  const handleAddToCart = (redirect = false) => {
    if (!user) {
      requireLogin();
      return;
    }

    addToCart({
      productId: product.slug,   // ✅ ALWAYS use slug
      name: product.name,
      price: product.price,
      image: product.image,
      type: "product",
    });

    if (redirect) {
      router.push("/checkout");
    } else {
      setShowPopup(true);
    }
  };

  return (
    <section className="product-details-page">
      <div className="product-details">

        <div className="details-image">
          <img src={product.image} alt={product.name} />
        </div>

        <div className="details-info">
          <p className="category">{product.category}</p>
          <h1>{product.name}</h1>

          <div className="price-box">
            {product.mrp && (
              <span className="mrp">₹{product.mrp}</span>
            )}
            <span className="price">₹{product.price}</span>
          </div>

          {product.cod && (
            <p className="cod">✔ Cash on Delivery Available</p>
          )}

          {product.shortDescription && (
            <div
              className="combo-subtitle"
              dangerouslySetInnerHTML={{
                __html: product.shortDescription,
              }}
            />
          )}

          <div className="actions">
            <button onClick={() => handleAddToCart(false)}>
              Add to Cart
            </button>

            <button
              className="buy-now"
              onClick={() => handleAddToCart(true)}
            >
              Buy Now
            </button>
          </div>

          <div className="product-tabs">
            <div className="tab-headers">
              <button
                className={activeTab === "description" ? "active" : ""}
                onClick={() => setActiveTab("description")}
              >
                Description
              </button>

              {product.attributes.map((attr) => (
                <button
                  key={attr.key}
                  className={activeTab === attr.key ? "active" : ""}
                  onClick={() => setActiveTab(attr.key)}
                >
                  {attr.label}
                </button>
              ))}

              <button
                className={activeTab === "reviews" ? "active" : ""}
                onClick={() => setActiveTab("reviews")}
              >
                Reviews
              </button>
            </div>

            <div className="tab-content">
              {activeTab === "description" && (
                <div
                  className="combo-full-description"
                  dangerouslySetInnerHTML={{
                    __html: product.description,
                  }}
                />
              )}

              {product.attributes.map(
                (attr) =>
                  activeTab === attr.key && (
                    <ul key={attr.key} className="tab-list">
                      {attr.values.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  )
              )}

              {activeTab === "reviews" && (
                <div className="reviews-section">
                  <h2>Customer Reviews</h2>
                  <p>Be the first to write a review</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <CartPopup
        show={showPopup}
        onClose={() => setShowPopup(false)}
      />
    </section>
  );
}