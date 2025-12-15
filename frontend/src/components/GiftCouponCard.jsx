import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useCartStore } from "../stores/useCartStore";

const GiftCouponCard = () => {
  const [userInputCode, setUserInputCode] = useState("");
  const {
    coupon,
    isCouponApplied,
    applyCoupon,
    getMyCoupon,
    removeCoupon,
    discountPercentage,
  } = useCartStore();
  //old code
  // useEffect(() => {
  //   getMyCoupon();
  // }, [getMyCoupon]);
  //updated Code
  useEffect(() => {
    getMyCoupon();
  }, []);
  useEffect(() => {
    if (coupon) setUserInputCode(coupon.code);
  }, [coupon]);
  const handleApplyCoupon = () => {
    //updated code
    if (!userInputCode.trim()) return;
    applyCoupon(userInputCode.trim());
  };
  const handleRemoveCoupon = async () => {
    await removeCoupon();
    setUserInputCode("");
  };

  return (
    <motion.div
      className="space-y-4 rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-sm sm:p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {/* Coupon code here */}
      <div className="space-y-4">
        <label htmlFor="">Have a coupan?</label>
        <input
          id={coupon}
          type="text"
          placeholder="Enter coupan"
          value={userInputCode}
          className="block w-full rounded-lg border border-gray-600 bg-gray-700 p-2.5 text-sm text-white placeholder-gray-400 focus:border-[#2e79ae] focus:ring-[#2e79ae]"
          onChange={(e) => setUserInputCode(e.target.value)}
          required
        />
        {!isCouponApplied ? (
          <motion.button
            type="button"
            className="flex w-full items-center justify-center rounded-lg bg-[#307aaf] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#1c5075] focus:outline-none focus:ring-4 focus:ring-[#67b1e6]"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleApplyCoupon}
          >
            Apply
          </motion.button>
        ) : (
          <motion.button
            type="button"
            className="flex w-full items-center justify-center rounded-lg bg-[#307aaf] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#1c5075] focus:outline-none focus:ring-4 focus:ring-[#67b1e6]"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRemoveCoupon}
          >
            Remove
          </motion.button>
        )}
      </div>

      {coupon && !isCouponApplied && (
        <div className="mt-4">
          <h3 className="text-lg font-medium text-gray-300">
            Your Available Coupon:
          </h3>
          <p className="mt-2 text-sm text-gray-400">
            {coupon.code} - {coupon.discountPercentage}%off
          </p>
        </div>
      )}
    </motion.div>
  );
};
export default GiftCouponCard;
