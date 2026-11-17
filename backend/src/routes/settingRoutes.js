import express from "express";
import { getSettings, updateSettings } from "../controllers/settingController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getSettings);
router.post("/", protect, updateSettings);
router.patch("/", protect, updateSettings);

export default router;
