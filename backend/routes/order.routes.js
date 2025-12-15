import express from "express";
import { protectRoute, adminRoute } from "../middleware/auth.middleware.js";
import {
  createOrder,
  cancelOrder,
  getAllOrders,
  getSingleOrder,
  updateOrderStatus,
  getOrderStatus,
  getUserOrders,
  deleteOrder
} from "../controllers/order.controller.js";

const router = express.Router();

// Create order
router.post("/", protectRoute, createOrder);

// Get all orders of logged-in user
router.get("/user/orders", protectRoute, getUserOrders);

// User: Get single Order
router.get("/:orderId", protectRoute, getSingleOrder);

// Cancel Order (User)
router.patch("/:id/cancel", protectRoute, cancelOrder);

// Admin: Update Order Status
router.put("/status/:orderId", protectRoute, adminRoute, updateOrderStatus);

//Admin Routes
// Admin: Get all Orders
router.get("/admin/all", protectRoute, adminRoute, getAllOrders);

// Get order status only
router.get("/status/:orderId", protectRoute, getOrderStatus);

router.delete("/:orderId", protectRoute,adminRoute,deleteOrder);


export default router;

