import Coupon from "../models/coupon.model.js";
import User from "../models/user.model.js";

export const createCoupon = async (req, res) => {
  try {
    console.log("Incoming coupon data:", req.body);
    const { code, discountPercentage, expiresAt, userIds } = req.body;

    if(!code || !discountPercentage || !expiresAt){
      return res.status(400).json({message: "All fields are required"});
    }

    // Check if code already exists
    const existing = await Coupon.findOne({ code });
    if (existing) {
      console.log("Duplicated coupon: ", code);
      return res.status(400).json({ message: "Coupon code already exists" });
    }
    // Remove empty values (fixes "" issue when selecting users)
    const assignedUsers =  Array.isArray(userIds) ? userIds.filter((id)=>id) : [];

    // Create coupon
    const coupon = await Coupon.create({
      code,
      discountPercentage,
      expiresAt,
      users:assignedUsers,
      //users: userIds && userIds.length > 0 ? userIds : [], // assign only if provided
    });
    console.log("Coupon Created", coupon);

    res.status(201).json({ message: "Coupon created successfully", coupon });
  } catch (error) {
    console.error("Error in createCoupon:", error);
    res
      .status(500)
      .json({ message: "Failed to create coupon", error: error.message });
  }
};
export const getMyCoupons = async(req,res)=>{
  try{
    const userId = req.user._id;

    const coupons = await Coupon.find({
      $or: [
        {users:[]},
        {users:userId}
      ],
      expiresAt:{$gte:new Date()}
    });
    res.json(coupons);
  }catch(error){
    console.log("Error fetching coupons:",error);
    res.status(500).json({error:"Server error fetching coupons"});
  }
}

export const validateCoupon = async (req, res) => {
  try {
    const { code, userId } = req.body;
    const coupon = await Coupon.findOne({ code });
    if (!coupon) {
      return res.status(404).json({ error: "Coupon not found" });
    }
    if (new Date() > coupon.expiresAt) {
      return res.status(400).json({ error: "Coupon expired" });
    }
    if (coupon.users.length > 0 && !coupon.users.includes(userId)) {
      return res.status(403).json({ error: "User not eligible" });
    }
    return res.json({
      valid: true,
      discountPercentage: coupon.discountPercentage,
    });
  } catch (error) {
    console.log("Error in validate Coupon: ", error.message);
    res.status(500).json({ error: "server Error" });
  }
};

