import express from "express";
import * as repository from "../repository/user.repository.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const users = await repository.getAllUsers();
    res.status(201).send(users);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

export default router;
