"use client";

export default function AuthSuccessModal({
  show,
  title,
  message,
  buttonLabel = "Continue",
  onContinue,
}) {
  if (!show) return null;

  return (
    <div className="modal-overlay" onClick={onContinue}>
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="modal-close"
          onClick={onContinue}
        >
          ×
        </button>

        <h2>{title}</h2>
        <p>{message}</p>

        <button
          type="button"
          className="modal-btn"
          onClick={onContinue}
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  );
}
