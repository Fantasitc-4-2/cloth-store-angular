import * as productRepository from "../repository/product.repository.js";
import * as categoryRepository from "../repository/category.repository.js";
import * as reviewRepository from "../repository/review.repository.js";
export const getAllProducts = async (
  limit,
  page,
  searchVal,
  price,
  category
) => {
  return await productRepository.getAllProducts(
    limit,
    page,
    searchVal,
    price,
    category
  );
};

export const getProductById = async (id) => {
  const product = await productRepository.getProductById(id);
  if (!product) return null;

  const reviews = await reviewRepository.getReviewsForProduct(id);

  return {
    ...product.toObject(),
    reviewCount: reviews.count,
    averageRating: reviews.averageRating,
    reviews: reviews.reviews,
  };
};

export const createProduct = async (product) => {
  if (product.discountRate && product.discountRate < 100) {
    product.discountPrice = (
      product.price -
      ((product.price * product.discountRate) / 100)
    ).toFixed(2);
    
  }
  return await productRepository.saveProduct(product);
};

export const deleteProductById = async (id) => {
  const res = await productRepository.deleteProductById(id);
  if (!res) {
    throw new Error("Product can not be found");
  }
  return res;
};

export const updateProductById = async (id, updateData) => {
  const updatedProduct = await productRepository.updateProductById(
    id,
    updateData
  );

  if (!updatedProduct) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  return updatedProduct;
};

export const getProductsByCategory = async (categoryId) => {
  const products = await productRepository.getProductsByCategory(categoryId);

  if (!products || products.length === 0) {
    return { message: "No products found for this category", products: [] };
  }

  return products;
};