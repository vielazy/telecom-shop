import express from "express";
import {
  getMe,
  updateMe,
  getAllUsers,
  deleteUser,
} from "../controllers/userController.js";
import { verifyToken, verifyAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/me", verifyToken, getMe);
router.put("/me", verifyToken, updateMe);
router.get("/", verifyToken, verifyAdmin, getAllUsers);
router.delete("/:id", verifyToken, verifyAdmin, deleteUser);

export default router;
