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
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        name: String,
        price: Number,
        quantity: Number,
      },
    ],

    totalAmount: Number,

    status: {
      type: String,
      enum: ["pending", "shipped", "completed", "cancelled"],
      default: "pending",
    },

    paymentMethod: { type: String, enum: ["cod", "mock"], default: "mock" },
    isPaid: { type: Boolean, default: false },
    paidAt: Date,

    isDeleted: { type: Boolean, default: false },
    deletedAt: Date,
  },
  { timestamps: true },
);

export default mongoose.model("Order", orderSchema);
