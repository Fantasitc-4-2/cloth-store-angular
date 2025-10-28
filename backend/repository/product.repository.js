import productModel from "../model/Product.js";
import mongoose from "mongoose";
export const getAllProducts = async (limit, page, searchVal, price, categoryId, sizes, availability, colors, minPrice, maxPrice) => {
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

  // Price filtering: support minPrice/maxPrice range or legacy `price` (max)
  if ((minPrice !== undefined && !isNaN(minPrice)) || (maxPrice !== undefined && !isNaN(maxPrice))) {
    filter.price = {};
    if (minPrice !== undefined && !isNaN(minPrice)) filter.price.$gte = Number(minPrice);
    if (maxPrice !== undefined && !isNaN(maxPrice)) filter.price.$lte = Number(maxPrice);
  } else if (price !== undefined && !isNaN(price)) {
    filter.price = { $lte: Number(price) };
  }

  if (categoryId) {
    filter.category = new mongoose.Types.ObjectId(categoryId);
  }

  // Sizes: accept array or comma-separated string
  if (sizes) {
    let sizesArr = sizes;
    if (typeof sizes === 'string') {
      sizesArr = sizes.split(',').map(s => s.trim()).filter(Boolean);
    }
    if (Array.isArray(sizesArr) && sizesArr.length) {
      filter.sizes = { $in: sizesArr };
    }
  }

  // Colors: accept array or comma-separated string
  if (colors) {
    let colorsArr = colors;
    if (typeof colors === 'string') {
      colorsArr = colors.split(',').map(c => c.trim()).filter(Boolean);
    }
    if (Array.isArray(colorsArr) && colorsArr.length) {
      filter.colors = { $in: colorsArr };
    }
  }

  // Availability: if truthy -> quantity > 0, if explicitly false -> quantity == 0
  if (availability !== undefined && availability !== null) {
    // allow string values 'true'/'false' from query strings
    const avail = (typeof availability === 'string') ? (availability === 'true') : Boolean(availability);
    if (avail) {
      filter.quantity = { $gt: 0 };
    } else {
      filter.quantity = 0;
    }
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
