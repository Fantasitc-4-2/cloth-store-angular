import express from "express";
import * as controller from "../controllers/address.controller.js";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", auth, controller.createAddress);
router.get("/", auth, controller.getAddresses);
router.put("/:addressId", auth, controller.updateAddress);
router.delete("/:addressId", auth, controller.deleteAddress);

export default router;
