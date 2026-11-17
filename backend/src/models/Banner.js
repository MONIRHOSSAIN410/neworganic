import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, default: "" },
    accent: { type: String, default: "" },
    copy: { type: String, default: "" },
    image: { type: String, default: "" },
    link: { type: String, default: "#products" },
    bgGradient: { type: String, default: "from-[#f1f7e9] to-[#e4efd5]" },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Banner", bannerSchema);
