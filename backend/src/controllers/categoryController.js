import Category from "../models/Category.js";
import Product from "../models/Product.js";
import { slugify } from "../utils/slugify.js";

export async function listCategories(req, res) {
  res.json(await Category.find(req.query.all === "true" ? {} : { isActive: true }).sort({ name: 1 }));
}
export async function createCategory(req, res) {
  res.status(201).json(await Category.create({ ...req.body, slug: slugify(req.body.slug || req.body.name) }));
}
export async function updateCategory(req, res) {
  const data = { ...req.body };
  if (data.name || data.slug) data.slug = slugify(data.slug || data.name);
  const category = await Category.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
  if (!category) return res.status(404).json({ message: "Category not found" });
  res.json(category);
}
export async function deleteCategory(req, res) {
  const used = await Product.exists({ category: req.params.id });
  if (used) return res.status(409).json({ message: "Move or delete products in this category first" });
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) return res.status(404).json({ message: "Category not found" });
  res.json({ message: "Category deleted" });
}
