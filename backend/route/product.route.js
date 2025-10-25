import express from "express";
import * as productService from "../services/productService.js";
import mongoose from "mongoose";
import roleAuthMiddleware from "../middleware/roleAuthMiddleware.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { validateProduct } from "../middleware/validateProduct.js";
import upload from "../config/multipartConfig.js";
import cloudinary from "../config/cloudinaryConfig.js";
const router = express.Router();

// Get all items with pagination
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const searchVal = req.query.search || "";
    const category = req.query.category
    const price = req.query.price;

    const products = await productService.getAllProducts(limit, page, searchVal, price,category);
    res.status(200).send(products);
  } catch (e) {
    console.error(e.message);
    res.status(500).send({ error: "Internal error" });
  }
});

// Get product by ID
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid product ID" });
  }

  const product = await productService.getProductById(id);
  product
    ? res.status(200).send(product)
    : res.status(404).send({ error: "product can not be found" });
});

// Create product (admin only)
// multipart/form-data body is used not raw json request for this endpoint
router.post(
  "/",
  // authMiddleware,
  // roleAuthMiddleware("admin"),
  upload.single("image"),
  validateProduct,
  async (req, res) => {
    try {
      const product = req.body;
      if(req.file) {
        await cloudinary.uploader.upload(req.file.path, {folder: "products"}, (error, result) => {
          if (error) {
            console.log("Cloudinary failed uploading the image: ", error);
          }
          else {
            console.log("cloudinary uploaded the image: " + result.secure_url);
            product.image = result.secure_url;
          }
        })
      }
      const createdProduct = await productService.createProduct(product);
      res.status(201).send(createdProduct);
    } catch (e) {
      console.log(e.message);
      res.status(500).send({ error: "internal server error" });
    }
  }
);

// Delete product using id by admin
router.delete("/:id" ,authMiddleware, roleAuthMiddleware("admin"), async (req, res) => {
  const id = req.params.id;
  try {
    const resBody = await productService.deleteProductById(id);
    res.status(200).send({"product deleted" : resBody.title});
  } catch(e) {
    console.log(e.message);
    res.status(404).send({"error" : "product not found"});
  }
})

// partial update using id by admin 
router.patch("/:id", authMiddleware, roleAuthMiddleware("admin"), async (req, res) => {
  const id = req.params.id;
  const updateData = req.body;
  try {
    const productUpdated = productService.updateProductById(id, updateData);
    res.status(200).send(
      {
        "message" : "Product updated sucessfully",
        productUpdated
      } 
    )
  } catch(e) {
    console.log(e.message);
    if (e.statusCode === 404) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(500).send({"error" : "internal server error"});
  }
})


// 🧩 Get all products by category ID
router.get("/category/:categoryId", async (req, res) => {
  try {
    const { categoryId } = req.params;

    // Fetch products by category
    const products = await productService.getProductsByCategory(categoryId);

    // If no products found
    if (!products || products.length === 0) {
      return res.status(404).json({ message: "No products found for this category" });
    }

    // Return success
    res.status(200).json(products);

  } catch (error) {
    console.error("Error fetching products by category:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
