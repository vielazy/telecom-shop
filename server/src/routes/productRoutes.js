import express from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProductByAdmin,
  updateStockByAdmin,
  deleteProduct,
} from "../controllers/productController.js";
import { verifyToken, verifyAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public
router.get("/", getAllProducts);
router.get("/:id", getProductById);

// Admin
router.post("/", verifyToken, verifyAdmin, createProduct);
router.put("/:id", verifyToken, verifyAdmin, updateProductByAdmin);
router.patch("/:id/stock", verifyToken, verifyAdmin, updateStockByAdmin);
router.delete("/:id", verifyToken, verifyAdmin, deleteProduct);

export default router;
