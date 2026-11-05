import Product from "../models/Product.js";
import { slugify } from "../utils/slugify.js";

export async function listProducts(req, res) {
  const { search, category, featured, limit = 100 } = req.query;
  const filter = { isActive: true };
  if (category) filter.category = category;
  if (featured === "true") filter.isFeatured = true;
  if (search) filter.$text = { $search: search };
  const products = await Product.find(filter).populate("category", "name slug").sort({ createdAt: -1 }).limit(Math.min(Number(limit) || 100, 200));
  res.json(products);
}
export async function getProduct(req, res) {
  const product = await Product.findById(req.params.id).populate("category", "name slug");
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
}
export async function createProduct(req, res) {
  const data = { ...req.body, slug: slugify(req.body.slug || req.body.name) };
  res.status(201).json(await Product.create(data));
}
export async function updateProduct(req, res) {
  const data = { ...req.body };
  if (data.name || data.slug) data.slug = slugify(data.slug || data.name);
  const product = await Product.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true }).populate("category", "name");
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
}
export async function deleteProduct(req, res) {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json({ message: "Product deleted" });
}
