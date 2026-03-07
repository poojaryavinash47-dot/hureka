"use client";

import { useEffect, useState } from "react";
import OrderTracker from "./OrderTracker";
import { getProductById, getWooPlaceholderImage } from "@/lib/wooCommerce";

function formatDate(dateString) {
  if (!dateString) return "-";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
}

function formatStatus(status) {
  if (!status) return "-";
  const clean = status.replace(/_/g, " ");
  return clean.charAt(0).toUpperCase() + clean.slice(1);
}

export default function OrderCard({ order }) {
  const items = order?.line_items || [];
  const firstItem = items[0] || {};
  const remainingCount = Math.max(items.length - 1, 0);

  const [imageSrc, setImageSrc] = useState(() => {
    if (typeof firstItem.image === "string" && /^https?:\/\//.test(firstItem.image)) {
      return firstItem.image;
    }
    return getWooPlaceholderImage();
  });

  useEffect(() => {
    let isMounted = true;

    // If API already gave us a proper URL, use it directly
    if (typeof firstItem.image === "string" && /^https?:\/\//.test(firstItem.image)) {
      setImageSrc(firstItem.image);
      return () => {
        isMounted = false;
      };
    }

    // Otherwise, fetch the product thumbnail using product_id
    const productId = firstItem.product_id;
    if (!productId) {
      setImageSrc(getWooPlaceholderImage());
      return () => {
        isMounted = false;
      };
    }

    (async () => {
      try {
        const product = await getProductById(productId);
        const src = product?.images?.[0]?.src || getWooPlaceholderImage();
        if (isMounted) {
          setImageSrc(src);
        }
      } catch (err) {
        console.error("Failed to load product thumbnail for order item", err);
        if (isMounted) {
          setImageSrc(getWooPlaceholderImage());
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [firstItem.image, firstItem.product_id]);

  const orderNumber = order.number || order.id;

  return (
    <div className="order-card">
      <div className="order-card-top">
        <div className="order-card-main">
          <div className="order-card-image-wrap">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageSrc}
              alt={firstItem.name || "Product"}
              className="order-card-image"
            />
          </div>

          <div className="order-card-info">
            <p className="order-card-title">
              {firstItem.name || "Order"}
            </p>
            <div className="order-card-items-list">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="order-card-item-row"
                >
                  <span className="order-card-item-name">{item.name}</span>
                  <span className="order-card-item-qty">
                    Qty: {item.quantity}
                  </span>
                  <span className="order-card-item-price">₹{item.total}</span>
                </div>
              ))}
            </div>
            {remainingCount > 0 && (
              <p className="order-card-subtitle">
                +{remainingCount} more item{remainingCount > 1 ? "s" : ""}
              </p>
            )}
            <p className="order-card-id">Order ID: #{orderNumber}</p>
            <p className="order-card-date">
              Ordered on {formatDate(order.date_created)}
            </p>
          </div>
        </div>

        <div className="order-card-meta">
          <div className="order-card-price">₹{order.total}</div>
          <div
            className={`order-card-status status-${(order.status || "").toLowerCase()}`}
          >
            {formatStatus(order.status)}
          </div>
        </div>
      </div>

      <OrderTracker status={order.status} />
    </div>
  );
}
