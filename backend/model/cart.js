import mongoose from "mongoose";

const CartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    require: true,
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
        default: 1,
      },
      price: {
        type: Number,
        required: true,

      },
    },
  ],
  totalPrice: {
    type: Number,
    // default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const cartModel = mongoose.model("Cart", CartSchema);
