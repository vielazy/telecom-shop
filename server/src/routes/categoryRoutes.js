import express from "express";
import {
  getAllCategories,
  createCategory,
  deleteCategory,
} from "../controllers/categoryController.js";
import { verifyToken, verifyAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", getAllCategories);
router.post("/", verifyToken, verifyAdmin, createCategory);
router.delete("/:id", verifyToken, verifyAdmin, deleteCategory);

export default router;
