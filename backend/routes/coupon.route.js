import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { createCoupon, getMyCoupons, validateCoupon } from "../controllers/coupon.controller.js";


const router = express.Router();

router.get("/", protectRoute, getMyCoupons);
router.post("/create", protectRoute,createCoupon);
router.post("/validate", protectRoute,validateCoupon);

export default router;