import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, trim: true },
    // trim for save the input without spacing in the beginning or the end
    //" Mohammed " will be "Mohammed"
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    phoneNumber: { type: String, trim: true },

    roles: {
      type: [String],
      enum: ["customer", "admin"],
      default: ["customer"],
    },

    isVerified: { type: Boolean, default: false },
    otp: String,
    otpExpires: Date,
    resetPasswordToken: String,
    resetPasswordExpires: Date,

    lastLogin: Date,
  },
  { timestamps: true }
);

// Index for faster lookup by email
userSchema.index({ email: 1 });

const User = mongoose.model("User", userSchema);

export default User;
