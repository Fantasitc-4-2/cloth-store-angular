import express from "express";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
} from "../controllers/wishlist.controller.js";
import auth  from "../middleware/authMiddleware.js"; // if you have authentication

const router = express.Router();
router.get("/", auth, getWishlist);
router.post("/", auth, addToWishlist);
router.delete("/:productId", auth, removeFromWishlist);
router.delete("/", auth, clearWishlist);

export default router;
