import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
      default: "",
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    apartment: {
      type: String,
      trim: true,
      default: "",
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
    pincode: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

// Ensure a user cannot store the exact same address twice
addressSchema.index(
  {
    userId: 1,
    email: 1,
    firstName: 1,
    lastName: 1,
    address: 1,
    apartment: 1,
    city: 1,
    state: 1,
    pincode: 1,
  },
  { unique: true }
);

export default mongoose.models.Address ||
  mongoose.model("Address", addressSchema);
