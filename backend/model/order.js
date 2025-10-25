import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "deliverd", "cancelled"],
      default: "pending",
    },
    payment: {
      method: {
        type: String,
        enum: ["cash on deleviry", "card"],
        default: "cash on deleviry",
      },
      status: {
        type: String,
        enum: ["pending", "paid", "failed"],
        default: "pending",
      },
    },
    shipping: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String },
      postal_code: { type: String },
      country: { type: String, required: true },
    },
    totalOrderPrice: Number,

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          require: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    paidAt: Date,
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", OrderSchema);

export default Order;
