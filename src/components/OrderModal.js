"use client";

export default function OrderModal({
  open,
  items = [],
  subtotal = 0,
  tax = 0,
  total = 0,
  confirming = false,
  onConfirm,
  onClose,
}) {
  if (!open) return null;

  const handleOverlayClick = () => {
    if (confirming) return;
    onClose?.();
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div
        className="modal order-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="modal-close"
          onClick={handleOverlayClick}
          disabled={confirming}
        >
          ×
        </button>

        <h2 className="order-modal-title">Confirm your order</h2>
        <p className="order-modal-subtitle">
          Review your items and address details before placing the order.
        </p>

        <div className="order-modal-items">
          {items.map((item, index) => (
            <div
              key={item.productId || item.slug || index}
              className="order-modal-item"
            >
              <div className="order-modal-item-main">
                <div className="order-modal-item-image-wrap">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="order-modal-item-image"
                  />
                </div>
                <div className="order-modal-item-info">
                  <p className="order-modal-item-name">{item.name}</p>
                  <p className="order-modal-item-qty">
                    Qty: <span>{item.qty}</span>
                  </p>
                </div>
              </div>

              <div className="order-modal-item-price">
                ₹{Number(item.price) * (item.qty || 1)}
              </div>
            </div>
          ))}
        </div>

        <div className="order-modal-summary">
          <div className="order-modal-row">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>
          <div className="order-modal-row">
            <span>Estimated taxes</span>
            <span>₹{tax}</span>
          </div>
          <div className="order-modal-row order-modal-row-total">
            <span>Total payable</span>
            <span>₹{total}</span>
          </div>
        </div>

        <div className="order-modal-actions">
          <button
            type="button"
            className="order-modal-cancel"
            onClick={handleOverlayClick}
            disabled={confirming}
          >
            Review Again
          </button>
          <button
            type="button"
            className="modal-btn order-modal-confirm"
            onClick={onConfirm}
            disabled={confirming}
          >
            {confirming ? "Placing order..." : "Confirm Order"}
          </button>
        </div>
      </div>
    </div>
  );
}
