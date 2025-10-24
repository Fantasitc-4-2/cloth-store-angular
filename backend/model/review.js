import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      trim: true,
      required: [true, "review comment required"],
    },
    product: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    ratings: {
      type: Number,
      min: 1,
      max: 5,
    },
  },
  { timestamps: true }
);

const reviewModel = mongoose.model("Review", reviewSchema);

export default reviewModel;
