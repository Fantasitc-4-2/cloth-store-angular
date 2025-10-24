import productModel from "../model/Product.js";
import mongoose from "mongoose";
export const getAllProducts = async (limit, page, searchVal, price, categoryId) => {
  const skip = (page - 1) * limit;
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

  const products = await productModel.aggregate([{
      $match: filter
    },
    {
      $lookup: {
        from: "reviews", // collection name (auto-created from model "Review")
        localField: "_id",
        foreignField: "product",
        as: "reviews",
      },
    },
    {
      $addFields: {
        reviewCount: {
          $size: "$reviews"
        },
        averageRating: {
          $divide: [{
              $round: {
                $multiply: [{
                    $ifNull: [{
                      $avg: "$reviews.ratings"
                    }, 0]
                  },
                  2
                ]
              }
            },
            2
          ]
        },
      },
    },
    {
      $project: {
        reviews: 0, // exclude review list from response
      },
    },
    {
      $skip: skip
    },
    {
      $limit: limit
    },
  ]);

  return products;
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
