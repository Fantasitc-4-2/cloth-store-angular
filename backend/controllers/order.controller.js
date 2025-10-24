import { catchAsyncError } from "../middleware/catchAsyncError.js";
import { cartModel } from "../model/cart.js";
import Order from "../model/order.js";
import Product from "../model/Product.js";
import User from "../model/user.js";
import { ApiFeatures } from "../utils/ApiFeatures.js";
import { AppError } from "../utils/AppError.js";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCashOrder = catchAsyncError(async (req, res, next) => {
  let cart = await cartModel.findById(req.params.id);
  if (!cart) return next(new AppError(`cart not found`, 404));

  for (let item of cart.items) {
    const product = await Product.findById(item.productId);

    if (!product) {
      return next(
        new AppError(`Product with ID ${item.productId} not found`, 404)
      );
    }

    if (product.quantity < item.quantity) {
      return next(
        new AppError(
          `Not enough stock for product ${product.name}. Available: ${product.quantity}, Requested: ${item.quantity}`,
          400
        )
      );
    }
  }

  const totalOrderPrice = cart.totalPrice;

  let order = new Order({
    userId: req.user.id,
    totalOrderPrice,
    shipping: req.body.shipping,
    items: cart.items,
  });

  await order.save();

  if (order) {
    let options = cart.items.map((item) => ({
      updateOne: {
        filter: { _id: item.productId },
        update: { $inc: { quantity: -item.quantity, sold: item.quantity } },
      },
    }));

    await Product.bulkWrite(options);
    await cartModel.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "success", order });
  } else {
    return next(new AppError(`item not found`, 404));
  }
});
export const getUserOrders = catchAsyncError(async (req, res, next) => {
  const order = await Order.find({ userId: req.user.id }).populate(
    "items.productId"
  );
  !order && next(new AppError(`order not found`, 404));
  order && res.status(200).json({ message: "success", order });
});
export const getOneOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate("items.productId");

  if (!order) {
    return next(new AppError(`order not found`, 404));
  }

  if (
    req.user.roles.includes("admin") ||
    req.user.id.toString() === order.userId.toString()
  ) {
    return res.status(200).json({ message: "success", order });
  }

  return next(new AppError(`You are not authorized to access this order`, 403));
});
export const getAllOrders = catchAsyncError(async (req, res, next) => {
  let apifeatures = new ApiFeatures(
    Order.find({}).populate("items.productId"),
    req.query
  ).paginate()
    .sort()
    .fields()
    .filter()
    .search();
  // const order = await Order.find({}).populate("items.productId");
  let result = await apifeatures.mongooseQuery;

  !result && next(new AppError(`order not found`, 404));
  res.status(200).json({ message: "success", page: apifeatures.page, result });
});

export const createCheckoutSession = catchAsyncError(async (req, res, next) => {
  let cart = await cartModel.findById(req.params.id);
  if (!cart) return next(new AppError(`cart not found`, 404));

  const totalOrderPrice = cart.totalPrice;

  let session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "egp",
          unit_amount: totalOrderPrice * 100,
          product_data: {
            name: req.user.username,
          },
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: "http://localhost:5173/success_url",
    cancel_url: "http://localhost:5173/cancel_url",
    customer_email: req.user.email,
    client_reference_id: req.params.id,
    metadata: req.body.shipping,
  });
  res.status(200).json({ message: "success", session });
});
export const createOnlineSession = async (request, response) => {
  console.log("🔵 ==> WEBHOOK RECEIVED <==");

  // Check if env vars are loaded
  console.log("🔑 WEBHOOK_SECRET exists:", !!process.env.WEBHOOK_SECRET);
  console.log("🔑 STRIPE_SECRET_KEY exists:", !!process.env.STRIPE_SECRET_KEY);
  console.log("🔑 Body is Buffer:", Buffer.isBuffer(request.body));

  let event;

  if (process.env.WEBHOOK_SECRET) {
    const signature = request.headers["stripe-signature"];
    console.log("🔐 Signature exists:", !!signature);

    try {
      event = stripe.webhooks.constructEvent(
        request.body,
        signature,
        process.env.WEBHOOK_SECRET
      );
      console.log("✅ Webhook signature verified successfully");
    } catch (err) {
      console.log("❌ Webhook signature verification FAILED:", err.message);
      return response.status(400).send(`Webhook Error: ${err.message}`);
    }
  } else {
    console.log(
      "⚠️ WARNING: WEBHOOK_SECRET not found - parsing without verification"
    );
    // Parse the Buffer as JSON
    try {
      const bodyString = request.body.toString("utf8");
      event = JSON.parse(bodyString);
      console.log("📦 Body parsed as JSON (no verification)");
    } catch (parseError) {
      console.log("❌ Failed to parse body:", parseError.message);
      return response.status(400).send("Invalid request body");
    }
  }

  // Debug: Log what we got
  console.log("📩 Event type:", event.type);
  console.log("📩 Event ID:", event.id);
  console.log("📦 Has data.object:", !!event.data?.object);

  if (event.type === "checkout.session.completed") {
    try {
      console.log("💳 Processing checkout.session.completed...");
      console.log("🛒 Session ID:", event.data.object.id);
      console.log("📧 Customer email:", event.data.object.customer_email);
      console.log(
        "🆔 Cart reference ID:",
        event.data.object.client_reference_id
      );

      await card(event.data.object);

      console.log("✅ Order created successfully!");
      return response.status(200).json({ received: true, success: true });
    } catch (error) {
      console.error("❌ ERROR in webhook handler:");
      console.error("Message:", error.message);
      console.error("Stack:", error.stack);
      return response.status(200).json({
        received: true,
        success: false,
        error: error.message,
      });
    }
  } else {
    console.log("ℹ️ Unhandled event type:", event.type);
    return response.status(200).json({ received: true });
  }
};
async function card(session) {
  console.log("🔄 Processing session:", session.id);

  // Find the cart
  let cart = await cartModel.findById(session.client_reference_id);
  if (!cart) {
    throw new Error(`Cart not found: ${session.client_reference_id}`);
  }
  console.log("✅ Cart found:", cart._id);

  // Verify stock availability
  for (let item of cart.items) {
    const product = await Product.findById(item.productId);

    if (!product) {
      throw new Error(`Product with ID ${item.productId} not found`);
    }

    if (product.quantity < item.quantity) {
      throw new Error(
        `Not enough stock for product ${product.name}. Available: ${product.quantity}, Requested: ${item.quantity}`
      );
    }
  }
  console.log("✅ Stock verified");

  // Find the user
  let user = await User.findOne({ email: session.customer_email });
  if (!user) {
    throw new Error(`User not found with email: ${session.customer_email}`);
  }
  console.log("✅ User found:", user._id);

  // Create the order
  let order = new Order({
    userId: user._id,
    totalOrderPrice: session.amount_total / 100,
    shipping: session.metadata,
    items: cart.items,
    payment: {
      method: "card",
      status: "paid",
    },
    paidAt: Date.now(),
  });

  await order.save();
  console.log("✅ Order saved:", order._id);

  // Update product quantities
  let options = cart.items.map((item) => ({
    updateOne: {
      filter: { _id: item.productId },
      update: { $inc: { quantity: -item.quantity, sold: item.quantity } },
    },
  }));

  await Product.bulkWrite(options);
  console.log("✅ Product quantities updated");

  // Delete the cart
  await cartModel.findByIdAndDelete(session.client_reference_id);
  console.log("✅ Cart deleted");

  return order;
}
