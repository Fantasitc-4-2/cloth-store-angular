import { catchAsyncError } from "../middleware/catchAsyncError.js";
import reviewModel from "../model/review.js";
import { AppError } from "../utils/AppError.js";
import * as reviewRepository from "../repository/review.repository.js";

export const getAllReview = catchAsyncError(async (req, res, next) => {
  let result = await reviewModel.find();
  res.json({ message: "Success", result });
});
export const getOneReview = catchAsyncError(async (req, res, next) => {
     const { id } = req.params
        let result = await reviewModel.findById(id)

        !result && next(new AppError(`Review not found`, 404))
        result && res.status(200).json({ message: "success", result })

});

export const addReview = catchAsyncError(async (req, res, next) => {
  req.body.user = req.user.id;

  let isExist = await reviewModel.findOne({
    user: req.user.id,
    product: req.body.product,
  });
  if (isExist)
    return next(new AppError(`you have created a review before`, 409));
  let result = new reviewModel(req.body);
  await result.save();
  res.json({ message: "Success", result });
});
export const deleteReview = catchAsyncError(async (req, res, next) => {
  let review = await reviewModel.findById(req.params.id);
  if (!review) return next(new AppError(`review not found`, 404));



  if (req.user.roles.includes("admin") || review.user == req.user.id) {
    let result = await reviewModel.findByIdAndDelete(req.params.id);
    res.json({ message: "Success", result });
  } else {
    return next(new AppError(`You can not do this action`, 409));
  }
  // res.json({ message: "Success" });
});


export const updateReview = catchAsyncError(async (req, res, next) => {
  let review = await reviewModel.findById(req.params.id);
  if (!review) return next(new AppError(`review not found`, 404));



  if (req.user.roles.includes("admin") || review.user.toString() == req.user.id) {
    let result = await reviewModel.findByIdAndUpdate(req.params.id,req.body,{new:true});
    res.json({ message: "Success", result });
  } else {
    return next(new AppError(`You can not do this action`, 409));
  }
  // res.json({ message: "Success" });
});

export const getReviewsForProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await reviewRepository.getReviewsByProductId(productId);

    if (!reviews || reviews.length === 0) {
      return res.status(404).json({ message: "No reviews found for this product" });
    }
     const totalRating = reviews.reduce((sum, review) => sum + review.ratings, 0);
    const averageRating = (totalRating / reviews.length).toFixed(1);

    res.status(200).json({ 
      count: reviews.length,
      averageRating: Number(averageRating),
      reviews 
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ error: "Server error" });
  }
};