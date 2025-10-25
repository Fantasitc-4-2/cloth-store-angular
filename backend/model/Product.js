import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: [1, "price must be bigger than zero"],
  },
  discountPrice: {
    type: Number,
    min: [1, "price must be bigger than zero"]
  },
  discountRate: {
    type: Number
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cart",
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  sizes: {
    type: [String]
  },
  colors: {
    type: [String]
  },
  image: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    default: 0,
    required: [true, "product quantity required"],
    min: 0,
  },
  sold: {
    type: Number,
    default: 0,
    min: 0,
  },
});

const Product = mongoose.model("Product", productSchema);

export default Product;
