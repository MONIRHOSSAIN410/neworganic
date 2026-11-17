import express from "express";
import {
  listBanners,
  listAllBanners,
  createBanner,
  updateBanner,
  deleteBanner,
} from "../controllers/bannerController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", listBanners);
router.get("/all", protect, listAllBanners);
router.post("/", protect, createBanner);
router.patch("/:id", protect, updateBanner);
router.delete("/:id", protect, deleteBanner);

export default router;
