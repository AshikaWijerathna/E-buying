import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

export const useCartStore = create((set, get) => ({
  cart: [],
  coupon: null,
  total: 0,
  subtotal: 0,
  isCouponApplied: false,
  discountPercentage: 0,

  //fetch users coupon
  getMyCoupon: async () => {
    try {
      const response = await axios.get("/coupons");
      //old code
      // set({ coupon: response.data});
      //updated code
      set({coupon: response.data || null})
    } catch (error) {
      //updated code
      set({coupon: null})
      console.error("Error fetching coupon:", error);
    }
  },
  //updated code
  applyCoupon: async (code,userId) =>{
    try{
      const response = await axios.post("/coupons/validate", {code, userId});
      set({coupon:response.data, isCouponApplied:true, discountPercentage: response.data.discountPercentage,});
      get().calculateTotals();
      toast.success(`Coupon ${response.data.discountPercentage}% OFF`);
    }catch(error){
      toast.error(error.response?.data?.message || "Coupon invalid");
      set({coupon: null, isCouponApplied:false, discountPercentage:0});
    }
  },
  removeCoupon: () => {
    set({ coupon: null, isCouponApplied: false , discountPercentage: 0});
    get().calculateTotals();
    toast.success("Coupon removed");
  },
  getCartItems: async () => {
    try {
      const res = await axios.get("/cart");
      set({ cart: res.data });
      get().calculateTotals();
    } catch (error) {
      set({ cart: [] });
      toast.error(error.response.data.message || "An error occurred");
    }
  },
  clearCart: async () => {
    set({ cart: [], coupon: null, total: 0, subtotal: 0, discountPercentage: 0 });
  },
  addToCart: async (product) => {
    try {
      await axios.post("/cart", { productId: product._id });
      toast.success("Product added to cart");
      set((prevState) => {
        const existingItem = prevState.cart.find(
          (item) => item._id === product._id
        );
        const newCart = existingItem
          ? prevState.cart.map((item) =>
              item._id === product._id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          : [...prevState.cart, { ...product, quantity: 1 }];
        return { cart: newCart };
      });
      get().calculateTotals();
    } catch (error) {
      toast.error(error.response.data.message || "An error occured");
    }
  },
  removeFromCart: async (productId) => {
    await axios.delete(`/cart`, { data: { productId } });
    set((prevState) => ({
      cart: prevState.cart.filter((item) => item._id !== productId),
    }));
    get().calculateTotals();
  },
  updateQuantity: async (productId, quantity) => {
    if (quantity === 0) {
      get().removeFromCart(productId);
      return;
    }
    await axios.put(`/cart/${productId}`, { quantity });
    set((prevState) => ({
      cart: prevState.cart.map((item) =>
        (item._id === productId ? { ...item, quantity } : item
      )),
    }));
    get().calculateTotals();
  },
  calculateTotals: () => {
    const { cart, discountPercentage } = get();
    const subtotal = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    let total = subtotal;
    if (discountPercentage > 0) {
      const discount = subtotal * (discountPercentage / 100);
      total = subtotal - discount;
    }
    set({ subtotal, total });
  },
}));
