import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import Category from "./models/Category.js";
import Product from "./models/Product.js";
import { slugify } from "./utils/slugify.js";

const categories = [
  { name: "Organic Spices", description: "Freshly selected everyday spices." },
  { name: "Healthy Grains", description: "Wholesome grains and pantry staples." },
  { name: "Fresh Food", description: "Quality fresh food for your table." },
  { name: "Tea & Drinks", description: "Refreshing tea and natural drinks." },
  { name: "Organic Drinks", description: "Thoughtfully selected organic beverages." },
  { name: "Organic Oils", description: "Everyday cooking oils." }
];
const products = [
  ["Organic Turmeric Powder", "Organic Spices", 180, "250 gm", "https://images.unsplash.com/photo-1615485500704-8e990f9900f2?w=700", "Pure aromatic turmeric powder for everyday cooking.", 35, true],
  ["Premium Quinoa", "Healthy Grains", 275, "250 gm", "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=700", "Wholesome grains for balanced meals.", 25, true],
  ["Natural Country Chicken", "Fresh Food", 240, "500 gm", "https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=700", "Freshly prepared quality chicken.", 18, true],
  ["Organic Green Tea", "Tea & Drinks", 225, "25 bags", "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=700", "A soothing cup for your daily routine.", 40, false],
  ["Organic Apple Cider Vinegar", "Organic Drinks", 900, "500 ml", "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=700", "A pantry essential with a crisp, tangy taste.", 20, true],
  ["Cold Pressed Garlic Oil", "Organic Oils", 1270, "100 ml", "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=700", "Rich garlic-infused oil for your kitchen.", 12, false]
];

async function seed() {
  await connectDB();
  const categoryMap = new Map();
  for (const item of categories) {
    const category = await Category.findOneAndUpdate(
      { slug: slugify(item.name) },
      { ...item, slug: slugify(item.name), isActive: true },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    categoryMap.set(item.name, category._id);
  }
  for (const [name, categoryName, price, unit, image, description, stock, isFeatured] of products) {
    await Product.findOneAndUpdate(
      { slug: slugify(name) },
      { name, slug: slugify(name), category: categoryMap.get(categoryName), price, unit, image, description, stock, isFeatured, isActive: true },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }
  console.log("GreenBasket sample categories and products are ready.");
  await mongoose.disconnect();
}
seed().catch(async error => { console.error(error); await mongoose.disconnect(); process.exit(1); });
