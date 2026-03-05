"use client";

import OrderTracker from "./OrderTracker";

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

  const imageSrc =
    firstItem.image ||
    "/products/default.png"; // fallback; replace with existing asset if needed

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
