import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  name: { type: String, required: true },
  image: { type: String, default: "" },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  unit: { type: String, default: "piece" }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, unique: true },
  customer: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true }
  },
  items: { type: [orderItemSchema], required: true },
  subtotal: { type: Number, required: true },
  deliveryFee: { type: Number, default: 0 },
  total: { type: Number, required: true },
  note: { type: String, default: "" },
  paymentMethod: { type: String, enum: ["cash_on_delivery"], default: "cash_on_delivery" },
  paymentStatus: { type: String, enum: ["unpaid", "paid"], default: "unpaid" },
  status: { type: String, enum: ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"], default: "pending" }
}, { timestamps: true });

orderSchema.pre("save", function(next) {
  if (!this.orderNumber) this.orderNumber = `GB-${Date.now().toString().slice(-8)}`;
  next();
});

export default mongoose.model("Order", orderSchema);
