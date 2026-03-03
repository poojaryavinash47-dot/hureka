import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        productId: String,
        name: String,
        price: Number,
        image: String,
        qty: Number,
      },
    ],
    subtotal: Number,
    tax: Number,
    total: Number,
    status: {
      type: String,
      default: "pending", // pending | paid | failed
    },
    paymentProvider: String,
  },
  { timestamps: true }
);

export default mongoose.models.Order ||
  mongoose.model("Order", orderSchema);