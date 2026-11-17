import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  description: { type: String, default: "" },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  image: { type: String, required: true },
  gallery: [{ type: String }],
  price: { type: Number, required: true, min: 0 },
  compareAtPrice: { type: Number, default: 0, min: 0 },
  unit: { type: String, default: "piece" },
  stock: { type: Number, default: 0, min: 0 },
  sku: { type: String, default: "" },
  isFeatured: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  tags: [{ type: String }]
}, { timestamps: true });

productSchema.index({ name: "text", description: "text", tags: "text" });
productSchema.index({ isActive: 1, createdAt: -1 });
productSchema.index({ category: 1, isActive: 1 });
export default mongoose.model("Product", productSchema);
