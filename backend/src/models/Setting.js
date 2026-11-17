import mongoose from "mongoose";

const settingSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, default: "site_settings" },
    shopName: { type: String, default: "Savory Nest" },
    shopLogo: { type: String, default: "/image/savory.jpg" },
    heroImage: { type: String, default: "" },
    showHeroText: { type: Boolean, default: false },
    heroTitle: { type: String, default: "Nature's best," },
    heroAccent: { type: String, default: "delivered fresh." },
    heroSubtitle: { type: String, default: "GOOD FOOD, GOOD MOOD" },
    heroCopy: { type: String, default: "Shop honest ingredients, organic pantry essentials and everyday goodness for your family." },
    heroLink: { type: String, default: "#products" },
    hotline: { type: String, default: "01758749698" },
    email: { type: String, default: "savorynestbd@proton.me" },
    address: { type: String, default: "Khilkhet, Dhaka 1229" },
    facebookLink: { type: String, default: "https://www.facebook.com/savorynestbd" },
    deliveryInsideDhaka: { type: Number, default: 80 },
    deliveryOutsideDhaka: { type: Number, default: 140 },
  },
  { timestamps: true }
);

export default mongoose.model("Setting", settingSchema);
