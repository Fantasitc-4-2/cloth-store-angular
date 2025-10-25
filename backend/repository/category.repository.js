// repository/category.repository.js
import Category from "../model/category.js";

// Create
export const createCategory = async (data) => {
  return await Category.create(data);
};

// Read
export const getAllCategories = async () => {
  return await Category.find();
};

export const getCategoryById = async (id) => {
  return await Category.findById(id);
};

// Update
export const updateCategory = async (id, data) => {
  return await Category.findByIdAndUpdate(id, data, { new: true });
};

// Delete
export const deleteCategory = async (id) => {
  return await Category.findByIdAndDelete(id);
};

export const getCategoryIdByName = async (name) => {
  return await Category.findOne(
    {
      name: name
    },
    {
      _id: 1
    }
  )
}