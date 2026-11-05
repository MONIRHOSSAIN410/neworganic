import Product from "../models/Product.js";
import Category from "../models/Category.js";
import Order from "../models/Order.js";

export async function stats(req, res) {
  const [products, categories, orders, revenue, recentOrders, pendingOrders] = await Promise.all([
    Product.countDocuments(), Category.countDocuments(), Order.countDocuments(),
    Order.aggregate([{ $match: { status: { $ne: "cancelled" } } }, { $group: { _id: null, total: { $sum: "$total" } } }]),
    Order.find().sort({ createdAt: -1 }).limit(6),
    Order.countDocuments({ status: "pending" })
  ]);
  res.json({ products, categories, orders, revenue: revenue[0]?.total || 0, pendingOrders, recentOrders });
}
