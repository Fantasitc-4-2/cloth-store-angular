import express from "express";
import * as controller from "../controllers/auth.controller.js";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    console.log(req.body);
    const { email, password, username, phoneNumber } = req.body;
    if (!email || !password || !username || !phoneNumber) {
      return res.status(400).json({ error: "All fields are required!" });
    }

    const user = await controller.register(req.body);
    res.status(201).json(user);
  } catch (err) {
    if (err.message.includes("exists")) {
      res.status(409).json({ error: err.message });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
});

router.post("/login", controller.login);
router.post("/logout", controller.logout);
router.get("/me", auth, controller.me);
router.post("/verify-otp", controller.verifyOtp);
router.put("/update", auth, controller.updateUser);


export default router;
