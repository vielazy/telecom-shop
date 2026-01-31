import express from "express";
import {
  addToCart,
  getMyCart,
  removeFromCart,
  clearCart,
  updateQuantity,
} from "../controllers/cartController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/add", verifyToken, addToCart);
router.get("/", verifyToken, getMyCart);
router.delete("/remove/:productId", verifyToken, removeFromCart);
router.delete("/clear", verifyToken, clearCart);
router.put("/update", verifyToken, updateQuantity);


export default router;
