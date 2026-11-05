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
export default mongoose.model("Product", productSchema);
