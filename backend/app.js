import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";

import { PORT, DB_URI} from "./config/config.js";
import authRouter from "./route/auth.route.js";
import userRouter from "./route/route.js";
import reviewRouter from "./route/review.router.js";
import productRouter from "./route/product.route.js";
import cartRouter from "./route/cart.route.js";
import addressRoutes from "./route/address.route.js";
import categoryRoutes from "./route/category.route.js";
import logger from "./middleware/logger.js";
import orderRouter from "./route/order.route.js";
import wishlistRoutes from "./route/wishlist.routes.js";
import { createOnlineSession } from "./controllers/order.controller.js";

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  createOnlineSession
);

app.use(express.json());
app.use(cookieParser());
app.use(logger);


app.get("/", (req, res) => res.send("Hello World!"));

// ✅ Routes
app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/reviews", reviewRouter);
app.use("/products", productRouter);
app.use("/carts", cartRouter);
app.use("/addresses", addressRoutes);
app.use("/categories", categoryRoutes);
app.use("/orders", orderRouter);
app.use("/wishlist", wishlistRoutes);

// Error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({ error: err.message, statusCode });
});

// ✅ Database Connection
mongoose
  .connect(DB_URI)
  .then(() => console.log(`  ${DB_URI}  DB Connected`))
  .catch((err) => console.error("❌ DB Connection Failed:", err));


app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// ✅ CRITICAL: Export the app for Vercel
export default app;
