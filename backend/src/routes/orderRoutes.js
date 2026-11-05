import { Router } from "express";
import { createOrder, listOrders, getOrder, updateOrderStatus } from "../controllers/orderController.js";
import { protect } from "../middleware/auth.js";
const router = Router();
router.post("/", createOrder);
router.get("/", protect, listOrders);
router.get("/:id", protect, getOrder);
router.patch("/:id/status", protect, updateOrderStatus);
export default router;
