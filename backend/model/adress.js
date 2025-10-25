import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    street: String,
    city: String,
    zip: String,
    country: String,
  },
  { timestamps: true }
);

const Address = mongoose.model("Address", addressSchema);
export default Address;
