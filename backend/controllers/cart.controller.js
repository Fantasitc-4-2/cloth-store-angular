import { catchAsyncError } from "../middleware/catchAsyncError.js";
import { cartModel } from "../model/cart.js";
import Product from "../model/Product.js";
import { AppError } from "../utils/AppError.js";

function calcPrice(cart) {
  let allPrice = 0;

  cart.items.forEach((element) => {
    allPrice += element.quantity * element.price;
  });

  cart.totalPrice = allPrice;
}

export const addToCart = catchAsyncError(async (req, res, next) => {
  const quantity = req.body.quantity ? parseInt(req.body.quantity) : 1;
  
  if (quantity < 1) {
    return next(new AppError('Quantity must be at least 1', 400));
  }
  
  let product = await Product.findById(req.body.productId);
  if (!product) {
    return next(new AppError(`Product not found`, 404));
  }

  let isCartExist = await cartModel.findOne({ userId: req.user.id });
  
  let requestedQuantity = quantity;
  
  if (isCartExist) {
    let existingItem = isCartExist.items.find(
      (e) => e.productId.toString() === req.body.productId.toString()
    );
    
    if (existingItem) {
      requestedQuantity = existingItem.quantity + quantity;
    }
  }
  
  if (product.quantity < requestedQuantity) {
    return next(new AppError(`Not enough quantity available. Only ${product.quantity} left in stock`, 400));
  }

  if (!isCartExist) {
    let result = new cartModel({
      userId: req.user.id,
      items: [
        {
          productId: req.body.productId,
          quantity: quantity,
          price: product.price
        },
      ],
    });
    calcPrice(result);
    await result.save();
    await result.populate("items.productId");
    
    return res.status(200).json({ message: "success", result });
  }
  
  let item = isCartExist.items.find(
    (e) => e.productId.toString() === req.body.productId.toString()
  );
  
  if (item) {
    item.quantity += quantity;
  } else {
    isCartExist.items.push({
      productId: req.body.productId,
      quantity: quantity,
      price: product.price
    });
  }
  
  calcPrice(isCartExist);
  await isCartExist.save();
  await isCartExist.populate("items.productId");
  
  res.status(200).json({ message: "success", cart: isCartExist });
});

export const removeFromCart = catchAsyncError(async (req, res, next) => {
  let result = await cartModel.findOneAndUpdate(
    { userId: req.user.id },
    { $pull: { items: { _id: req.params.id } } },
    { new: true }
  );

  if (!result) {
    return next(new AppError(`Item not found`, 404));
  }
  
  calcPrice(result);
  await result.save();
  await result.populate("items.productId");
  
  res.status(200).json({ message: "success", result });
});

export const updateQuantity = catchAsyncError(async (req, res, next) => {
  const quantity = parseInt(req.body.quantity);
  
  if (!quantity || quantity < 1) {
    return next(new AppError('Quantity must be at least 1', 400));
  }
  
  let product = await Product.findById(req.params.id);
  if (!product) {
    return next(new AppError(`Product not found`, 404));
  }

  if (product.quantity < quantity) {
    return next(new AppError(`Not enough quantity available. Only ${product.quantity} left in stock`, 400));
  }

  let isCartExist = await cartModel.findOne({ userId: req.user.id });
  
  if (!isCartExist) {
    return next(new AppError(`Cart not found`, 404));
  }

  let item = isCartExist.items.find(
    (e) => e.productId.toString() === req.params.id.toString()
  );

  if (!item) {
    return next(new AppError(`Item not found in cart`, 404));
  }

  item.quantity = quantity;

  calcPrice(isCartExist);
  await isCartExist.save();
  await isCartExist.populate("items.productId");
  
  res.status(200).json({ message: "success", cart: isCartExist });
});

export const getLoggedUsercart = catchAsyncError(async (req, res, next) => {
  let cartUser = await cartModel
    .findOne({ userId: req.user.id })
    .populate("items.productId");

  res.json({ message: "success", cartUser });
});