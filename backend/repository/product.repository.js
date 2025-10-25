import productModel from "../model/Product.js";
import mongoose from "mongoose";
export const getAllProducts = async (limit, page, searchVal, price, categoryId) => {
  // Build match conditions
  const filter = {
    $or: [{
        title: {
          $regex: searchVal,
          $options: "i"
        }
      },
      {
        description: {
          $regex: searchVal,
          $options: "i"
        }
      },
    ],
  };

  if (price !== undefined && !isNaN(price)) {
    filter.price = {
      $lte: Number(price)
    };
  }

  if (categoryId) {
    filter.category = new mongoose.Types.ObjectId(categoryId);
  }

  // First, count total documents for pagination
  const totalCount = await productModel.countDocuments(filter);

  // Then get paginated results with category and review info
  const products = await productModel.aggregate([
    {
      $match: filter
    },
    {
      $lookup: {
        from: "categories", // Join with categories collection
        localField: "category",
        foreignField: "_id",
        as: "categoryInfo"
      }
    },
    {
      $lookup: {
        from: "reviews",
        localField: "_id",
        foreignField: "product",
        as: "reviews"
      }
    },
    {
      $addFields: {
        categoryName: { $arrayElemAt: ["$categoryInfo.name", 0] },
        reviewCount: { $size: "$reviews" },
        averageRating: {
          $divide: [
            {
              $round: {
                $multiply: [
                  { $ifNull: [{ $avg: "$reviews.ratings" }, 0] },
                  2
                ]
              }
            },
            2
          ]
        }
      }
    },
    {
      $project: {
        reviews: 0,
        categoryInfo: 0 // Remove the full category info array
      }
    },
    {
      $skip: (page - 1) * limit
    },
    {
      $limit: limit
    }
  ]);

  return {
    products,
    total: totalCount,
    currentPage: page,
    pages: Math.ceil(totalCount / limit)
  };
};

export const getProductById = async (id) => {
  return await productModel.findById(id);
};

export const saveProduct = async (product) => {
  return await productModel.create(product);
};

export const deleteProductById = async (id) => {
  return await productModel.findByIdAndDelete(id);
}

export const updateProductById = (id, updateData) => {
  return Product.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true
  });
};


export const getProductsByCategory = async (categoryId) => {
  return await productModel
    .find({ category: categoryId })
    .populate("category", "name") // populate category name only
};
