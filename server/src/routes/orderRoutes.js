import express from "express";
import {
  createOrder,
  getOrdersByUser,
  getAllOrders,
  cancelOrderByUser,
  updateOrderStatus,
  getOrderById,
  confirmCOD,
} from "../controllers/orderController.js";

import { payOrder } from "../controllers/paymentController.js";
import { verifyToken, verifyAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, createOrder);
router.get("/my-orders", verifyToken, getOrdersByUser);
router.get("/:id", verifyToken, getOrderById);
router.patch("/:id/cancel", verifyToken, cancelOrderByUser);
router.patch("/:id/pay", verifyToken, payOrder);
router.get("/", verifyToken, verifyAdmin, getAllOrders);
router.patch("/:id/status", verifyToken, verifyAdmin, updateOrderStatus);
router.patch("/:id/confirm-cod", verifyToken, verifyAdmin, confirmCOD);

export default router;
