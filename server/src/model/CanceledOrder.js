import mongoose from "mongoose";

const canceledOrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    reason: {
      type: String,
      default: "User cancelled order",
    },
  },
  { timestamps: true },
);

export default mongoose.model("CanceledOrder", canceledOrderSchema);
