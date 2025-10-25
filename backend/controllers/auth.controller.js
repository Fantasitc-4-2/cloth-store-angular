import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as repository from "../repository/user.repository.js";
import { generateOtp, sendOtpEmail } from "../services/mailService.js";

export const register = async (userData) => {
  const requiredFields = ["email", "password", "username", "phoneNumber"];
  for (const field of requiredFields) {
    if (!userData[field]) {
      throw new Error(`${field} is required`);
    }
  }

  const existingUser = await repository.getUserByEmail(userData.email);
  if (existingUser) {
    throw new Error("Email already exists");
  }

  const hashedPassword = await bcrypt.hash(userData.password, 10);

  const otp = generateOtp();
  const otpExpires = Date.now() + 100 * 60 * 1000;

  const newUser = await repository.createUser({
    ...userData,
    password: hashedPassword,
    otp: otp,
    otpExpires: otpExpires,
    isVerified: false,
  });

  await sendOtpEmail(newUser.email, otp);

  return {
    id: newUser._id,
    username: newUser.username,
    email: newUser.email,
    message: "User registered. Please check your email for the OTP.",
  };
};

const createToken = (user) => {
  const payload = {
    id: user._id.toString(),
    username: user.username,
    roles: user.roles,
    email:user.email
  };
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  });
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "Email and password required" });

    const user = await repository.getUserByEmail(email);
    if (!user)
      return res.status(401).json({ error: "Invalid email or password" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(401).json({ error: "Invalid email or password" });

    if (!user.isVerified) {
      return res
        .status(403)
        .json({ error: "Please verify your email before logging in" });
    }

    const token = createToken(user);

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({
      message: "Login successful",
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const me = async (req, res) => {
  try {
    const user = await repository.getUserById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({
      id: user._id,
      username: user.username,
      email: user.email,
      roles: user.roles,
    });
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token", { httpOnly: true, sameSite: "strict" });
  res.json({ message: "Logged out" });
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: "Email and OTP are required" });
    }

    const user = await repository.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    if (user.otpExpires < Date.now()) {
      return res.status(400).json({ error: "OTP expired" });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.json({ message: "Email verified successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const userId = req.user.id; // from authMiddleware
    const updatedUser = await repository.updateUserById(userId, req.body);

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ error: "Server error" });
  }
};

