"use client";

const STEPS = ["Ordered", "Shipped", "Delivered"];

function getActiveStep(status) {
  const normalized = (status || "").toLowerCase();

  switch (normalized) {
    case "pending":
      return 1;
    case "processing":
      return 2;
    case "completed":
      return 3;
    case "cancelled":
    case "refunded":
    case "failed":
      return 1;
    default:
      return 1;
  }
}

export default function OrderTracker({ status }) {
  const activeStep = getActiveStep(status);

  return (
    <div className="order-tracker">
      {STEPS.map((label, index) => {
        const stepIndex = index + 1;
        const isCompleted = stepIndex <= activeStep;

        return (
          <div
            key={label}
            className={`order-tracker-step ${
              isCompleted ? "completed" : ""
            }`}
          >
            <div className="order-tracker-icon">
              {isCompleted ? "✓" : stepIndex}
            </div>
            <span className="order-tracker-label">{label}</span>
          </div>
        );
      })}
    </div>
  );
}
