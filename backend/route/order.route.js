import express from "express";
import * as orderController from "../controllers/order.controller.js";
import auth from "../middleware/authMiddleware.js";
import authorizeUser from "../middleware/roleAuthMiddleware.js";

const orderRouter = express.Router();

orderRouter
  .route("/getAllOrders")
  .get(auth, authorizeUser("admin"), orderController.getAllOrders);

orderRouter
  .route("/")
  .get(auth, authorizeUser("admin"), orderController.getUserOrders);

orderRouter
  .route("/:id")
  .post(auth, orderController.createCashOrder)
  .get(auth, orderController.getOneOrder);
orderRouter
  .route("/checkout/:id")
  .post(auth, orderController.createCheckoutSession)

export default orderRouter;
