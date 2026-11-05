import { Router } from "express";
import { stats } from "../controllers/dashboardController.js";
import { protect } from "../middleware/auth.js";
const router = Router();
router.get("/stats", protect, stats);
export default router;
