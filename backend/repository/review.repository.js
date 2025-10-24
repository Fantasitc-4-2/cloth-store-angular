import  reviewModel from "../model/review.js";
import mongoose from "mongoose";

export const getReviewsByProductId = async (id) => {
    if(mongoose.Types.ObjectId.isValid(id)) {
        return await reviewModel.find(
            {product: new mongoose.Types.ObjectId(id)}
        );
    } else {
        return [];
    }
}
export const getReviewsForProduct = async (productId) => {
  const reviews = await getReviewsByProductId(productId);

  if (!reviews || reviews.length === 0) {
    return {
      count: 0,
      averageRating: 0,
      reviews: [],
    };
  }

  const totalRatings = reviews.reduce((sum, r) => sum + r.ratings, 0);
  const averageRating =
    Math.round((totalRatings / reviews.length) * 2) / 2;

  return {
    count: reviews.length,
    averageRating,
    reviews,
  };
};