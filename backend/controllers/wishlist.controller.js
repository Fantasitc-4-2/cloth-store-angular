import wishlistRepository from "../repository/wishlist.repository.js";

export const getWishlist = async (req, res) => {
  try {
    const wishlist = await wishlistRepository.getByUserId(req.user.id);
    res.status(200).json(wishlist || { products: [] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const addToWishlist = async (req, res) => {
  try {
    const wishlist = await wishlistRepository.addProduct(req.user.id, req.body.productId);
    res.status(200).json(wishlist);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const wishlist = await wishlistRepository.removeProduct(req.user.id, req.params.productId);
    res.status(200).json(wishlist);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const clearWishlist = async (req, res) => {
  try {
    const wishlist = await wishlistRepository.clearWishlist(req.user.id);
    res.status(200).json(wishlist);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
