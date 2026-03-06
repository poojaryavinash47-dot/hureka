"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import CartPopup from "@/components/CartPopup";
import LoginRequiredModal from "@/components/LoginRequiredModal";
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
  const [selectedImage, setSelectedImage] = useState("");
  const [rating, setRating] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);

  const fetchReviews = async (productId) => {
    try {
      const res = await fetch(`/api/reviews?productId=${productId}`);
      const data = await res.json();

      if (res.ok) {
        setReviews(data.reviews || []);
        setAverageRating(data.averageRating || 0);
        setReviewCount(data.reviewCount || 0);
      }
    } catch (err) {
      console.error("Failed to fetch reviews", err);
    }
  };

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

        const mappedProduct = {
          slug: p.slug, // ✅ use slug everywhere
          name: p.name,
          price: Number(p.price),
          mrp: Number(p.regular_price),
          image: p.images?.[0]?.src || "/placeholder.png",
          images: p.images || [],
          category: p.categories?.[0]?.name || "",
          shortDescription: p.short_description,
          description: p.description,
          attributes,
          cod: true,
        };

        setProduct(mappedProduct);

        const firstImageSrc =
          (Array.isArray(mappedProduct.images) && mappedProduct.images[0]?.src) ||
          mappedProduct.image;
        setSelectedImage(firstImageSrc || "");

        setActiveTab("description");
        // Load reviews for this product
        fetchReviews(p.slug);
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

  const galleryImages =
    product.images && product.images.length > 0
      ? product.images
      : product.image
      ? [{ src: product.image }]
      : [];

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setReviewError("");

    if (!user) {
      setShowLoginModal(true);
      return;
    }

    if (!reviewRating || !reviewComment.trim()) {
      setReviewError("Please provide a rating and comment.");
      return;
    }

    try {
      setReviewSubmitting(true);
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.slug,
          rating: reviewRating,
          comment: reviewComment.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setReviewError(data.error || "Failed to submit review.");
        return;
      }

      // Refresh reviews list after successful submission
      setReviewRating(0);
      setReviewComment("");
      await fetchReviews(product.slug);
    } catch (err) {
      setReviewError("Failed to submit review.");
    } finally {
      setReviewSubmitting(false);
    }
  };

  const handleAddToCart = () => {
    addToCart({
      productId: product.slug,   // ✅ ALWAYS use slug
      name: product.name,
      price: product.price,
      image: product.image,
      type: "product",
    });

    setShowPopup(true);
  };

  const handleBuyNow = () => {
    const payload = {
      productId: product.slug,
      name: product.name,
      price: product.price,
      image: product.image,
      qty: 1,
      fromCart: false,
      type: "product",
    };

    if (typeof window !== "undefined") {
      sessionStorage.setItem("buyNowProduct", JSON.stringify(payload));
    }

    if (!user) {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("pendingBuyNow", JSON.stringify(payload));
      }
      setShowLoginModal(true);
      return;
    }

    router.push("/checkout");
  };

  return (
    <section className="product-details-page">
      <div className="product-details">

        <div className="details-image">
          <div className="main-product-image">
            <img
              src={selectedImage || galleryImages[0]?.src || product.image}
              alt={product.name}
            />
          </div>

          {galleryImages.length > 1 && (
            <div className="product-gallery">
              {galleryImages.map((img, index) => (
                // Skip the main image at index 0 if desired, or include all
                <div
                  key={img.id || img.src || index}
                  className={`gallery-thumb ${
                    selectedImage === img.src ? "active" : ""
                  }`}
                  onClick={() => setSelectedImage(img.src)}
                >
                  <img
                    src={img.src}
                    alt={`${product.name} thumbnail ${index + 1}`}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="details-info">
          <p className="category">{product.category}</p>
          <h1>{product.name}</h1>

          <div className="product-rating">
            <div className="stars">
              {"★★★★★".slice(0, Math.round(averageRating))}
              {"☆☆☆☆☆".slice(Math.round(averageRating))}
            </div>

            <span className="rating-value">
              {averageRating.toFixed(1)}
            </span>

            <span className="rating-count">
              {reviewCount} review{reviewCount !== 1 ? "s" : ""}
            </span>
          </div>

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
            <button onClick={handleAddToCart}>
              Add to Cart
            </button>

            <button
              className="buy-now"
              onClick={handleBuyNow}
            >
              Buy Now
            </button>
          </div>
        </div>
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
              
              <div className="write-review">
                <h3>Write a Review</h3>

                {!user && (
                  <p className="reviews-login-hint">
                    Please login to rate or write a review.
                  </p>
                )}

                <form onSubmit={handleSubmitReview} className="review-form">
                  <label className="review-label">Your Rating</label>
                  <div className="star-input">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className={
                          star <= reviewRating ? "star-btn active" : "star-btn"
                        }
                        onClick={() => {
                          if (!user) {
                            setShowLoginModal(true);
                            return;
                          }
                          setReviewRating(star);
                        }}
                      >
                        ★
                      </button>
                    ))}
                  </div>

                  <label className="review-label">Your Review</label>
                  <textarea
                    className="review-textarea"
                    rows={4}
                    placeholder="Share your experience..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                  />

                  {reviewError && (
                    <p className="review-error">{reviewError}</p>
                  )}

                  <button
                    type="submit"
                    className="review-submit-btn"
                    disabled={reviewSubmitting}
                  >
                    {reviewSubmitting ? "Submitting..." : "Submit Review"}
                  </button>
                </form>
              </div>

              <h3 className="review-section-title">Customer Reviews</h3>
              <div className="reviews-list">
                {reviews.length === 0 ? (
                  <p className="no-reviews">
                    No reviews yet. Be the first to review this product.
                  </p>
                ) : (
                  reviews.map((r) => (
                    <div key={r._id} className="review-card">
                      <div className="review-header">
                        <span className="review-stars">
                          {"★★★★★".slice(0, r.rating)}
                          {"☆☆☆☆☆".slice(r.rating)}
                        </span>
                        <span className="review-username">{r.username}</span>
                        <span className="review-date">
                          {new Date(r.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="review-comment">{r.comment}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <LoginRequiredModal
        show={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />

      <CartPopup
        show={showPopup}
        onClose={() => setShowPopup(false)}
      />
    </section>
  );
}