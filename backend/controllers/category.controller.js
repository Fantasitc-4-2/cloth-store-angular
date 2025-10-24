import * as repository from "../repository/category.repository.js";

export const createCategory = async (req, res) => {
  try {
    const { name, description, image, icon } = req.body;
    if (!name) return res.status(400).json({ error: "Name is required" });

    const existing = await repository.getAllCategories();
    if (existing.some((c) => c.name.toLowerCase() === name.toLowerCase())) {
      return res.status(409).json({ error: "Category already exists" });
    }

    const category = await repository.createCategory({ name, description, image, icon });
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const categories = await repository.getAllCategories();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const category = await repository.getCategoryById(req.params.id);
    if (!category) return res.status(404).json({ error: "Category not found" });
    res.json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const updated = await repository.updateCategory(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: "Category not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const deleted = await repository.deleteCategory(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Category not found" });
    res.json({ message: "Category deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
