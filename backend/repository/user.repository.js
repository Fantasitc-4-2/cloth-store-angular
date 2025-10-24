import UserModel from "../model/user.js";
import mongoose from "mongoose";

/// Get user(s)
export const getAllUsers = async () => await UserModel.find();
export const getUserByEmail = async (email) => await UserModel.findOne({ email });
export const getUserById = async (userId) => await UserModel.findById(userId);

// Create user
export const createUser = async (user) => {
  const existingUser = await getUserByEmail(user.email);
  if (existingUser) {
    throw new Error("Email already in use");
  }

  const newUser = new UserModel({
    username: user.username,
    email: user.email,
    password: user.password,
    otp: user.otp,
    otpExpires: user.otpExpires,
    phoneNumber: user.phoneNumber,
  });

  return await newUser.save();
};

// Update user by ID
export const updateUserById = async (userId, updateData) => {
  // We don’t want to accidentally overwrite sensitive fields directly
  const allowedFields = ["username", "phoneNumber", "password"];
  const update = {};

  for (const field of allowedFields) {
    if (updateData[field] !== undefined) {
      update[field] = updateData[field];
    }
  }

  // Handle password hashing if user wants to update it
  if (update.password) {
    const bcrypt = await import("bcrypt");
    update.password = await bcrypt.default.hash(update.password, 10);
  }

  const updatedUser = await UserModel.findByIdAndUpdate(
    userId,
    { $set: update },
    { new: true, runValidators: true }
  ).select("-password -otp -otpExpires");

  return updatedUser;
};
