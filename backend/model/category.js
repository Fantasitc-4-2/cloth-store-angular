import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A category must have a name"],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    image: {
      type: String, // e.g. URL or filename
    },
    icon: {
    type: String, // store icon name as a string
    required: false,
    },
  },
  { timestamps: true } // adds createdAt & updatedAt
);

const Category = mongoose.model("Category", categorySchema);
export default Category;
