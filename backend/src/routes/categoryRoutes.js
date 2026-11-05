import { Router } from "express";
import { listCategories, createCategory, updateCategory, deleteCategory } from "../controllers/categoryController.js";
import { protect } from "../middleware/auth.js";
const router = Router();
router.get("/", listCategories);
router.post("/", protect, createCategory);
router.patch("/:id", protect, updateCategory);
router.delete("/:id", protect, deleteCategory);
export default router;
