import Order from "../models/Order.js";
import Product from "../models/Product.js";

const allowed = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];

export async function createOrder(req, res) {
  const { customer, items, note = "" } = req.body;
  if (!customer?.name || !customer?.phone || !customer?.address || !Array.isArray(items) || !items.length)
    return res.status(400).json({ message: "Complete delivery information and add at least one item" });

  const normalized = [];
  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product || !product.isActive) return res.status(400).json({ message: "One of the products is unavailable" });
    const quantity = Math.max(1, Number(item.quantity) || 1);
    if (product.stock < quantity) return res.status(400).json({ message: `${product.name} does not have enough stock` });
    normalized.push({ product: product._id, name: product.name, image: product.image, price: product.price, quantity, unit: product.unit });
  }
  const subtotal = normalized.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = subtotal >= 1500 ? 0 : 60;
  const order = await Order.create({ customer, items: normalized, subtotal, deliveryFee, total: subtotal + deliveryFee, note });
  for (const item of normalized) await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
  res.status(201).json(order);
}
export async function listOrders(req, res) {
  const { status, search } = req.query;
  const filter = {};
  if (status && allowed.includes(status)) filter.status = status;
  if (search) filter.$or = [
    { orderNumber: { $regex: search, $options: "i" } },
    { "customer.name": { $regex: search, $options: "i" } },
    { "customer.phone": { $regex: search, $options: "i" } }
  ];
  res.json(await Order.find(filter).sort({ createdAt: -1 }).limit(300));
}
export async function getOrder(req, res) {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });
  res.json(order);
}
export async function updateOrderStatus(req, res) {
  if (!allowed.includes(req.body.status)) return res.status(400).json({ message: "Invalid order status" });
  const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  if (!order) return res.status(404).json({ message: "Order not found" });
  res.json(order);
}
