import express from "express";
import { payOrder } from "../controllers/paymentController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.patch("/:id/pay", verifyToken, payOrder);

export default router;
