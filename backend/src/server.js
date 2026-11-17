import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import bcrypt from "bcryptjs";
import { connectDB } from "./config/db.js";
import Admin from "./models/Admin.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import bannerRoutes from "./routes/bannerRoutes.js";
import settingRoutes from "./routes/settingRoutes.js";
import { notFound, errorHandler } from "./middleware/errors.js";

const app = express();

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb", extended: true }));
app.use(morgan("dev"));
app.use("/api", rateLimit({ windowMs: 15 * 60 * 1000, limit: 500, standardHeaders: "draft-7", legacyHeaders: false }));
app.get("/api/health", (req, res) => res.json({ status: "ok", service: "GreenBasket API" }));
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/banners", bannerRoutes);
app.use("/api/settings", settingRoutes);
app.use(notFound);
app.use(errorHandler);

async function bootstrap() {
  await connectDB();
  if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
    const exists = await Admin.findOne({ email: process.env.ADMIN_EMAIL.toLowerCase() });
    if (!exists) {
      const password = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);
      await Admin.create({ name: process.env.ADMIN_NAME || "Store Admin", email: process.env.ADMIN_EMAIL, password });
      console.log(`Initial admin created: ${process.env.ADMIN_EMAIL}`);
    }
  }
  const port = process.env.PORT || 5000;
  app.listen(port, () => console.log(`GreenBasket API listening on ${port}`));
}
bootstrap().catch(err => { console.error("Startup failed:", err); process.exit(1); });
