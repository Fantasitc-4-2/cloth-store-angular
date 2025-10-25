import Wishlist from "../model/wishlist.js";

class WishlistRepository {
  async getByUserId(userId) {
    return await Wishlist.findOne({ user: userId }).populate("products");
  }

  async addProduct(userId, productId) {
    let wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      wishlist = new Wishlist({ user: userId, products: [productId] });
    } else if (!wishlist.products.includes(productId)) {
      wishlist.products.push(productId);
    }
    return await wishlist.save();
  }

  async removeProduct(userId, productId) {
    const wishlist = await Wishlist.findOneAndUpdate(
      { user: userId },
      { $pull: { products: productId } },
      { new: true }
    ).populate("products");
    return wishlist;
  }

  async clearWishlist(userId) {
    const wishlist = await Wishlist.findOneAndUpdate(
      { user: userId },
      { $set: { products: [] } },
      { new: true }
    );
    return wishlist;
  }
}

export default new WishlistRepository();
