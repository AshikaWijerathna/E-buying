import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";
//import { cancelOrder } from "../../../backend/controllers/order.controller";


export const useUserStore = create((set, get) => ({
  user: null,
  orders: [],
  coupons: [],
  loading: false,
  checkingAuth: true,

  signup: async ({ name, email, password, confirmPassword }) => {
    set({ loading: true });

    if (password !== confirmPassword) {
      set({ loading: false });
      return toast.error("Passwords do not match");
    }
    try {
      const res = await axios.post(
        "/auth/signup",
        { name, email, password },
        { withCredentials: true }
      );
      const { user } = res.data;
      set({ user, loading: false });
      toast.success("Signup successful");
    } catch (error) {
      set({ loading: false });
      const message =
        error?.response?.data?.message || error?.message || "An error occured";
      toast.error(message);
      console.error("Signup error", error);
      //toast.error(error.response.data.message || "An error occured");
    }
  },
  login: async (email, password) => {
    set({ loading: true });

    try {
      const res = await axios.post(
        "/auth/login",
        { email, password },
        { withCredentials: true }
      );
      const { user } = res.data;
      console.log("Login response:", res.data);
      set({ user, loading: false });
    } catch (error) {
      set({ loading: false });
      const message =
        error?.response?.data?.message || error?.message || "An error occurred";

      toast.error(message);
      console.error("Login error:", error);
    }
  },
getProfile: async () =>{
  set({loading:true});
  try{
    const res = await axios.get("/auth/profile", {withCredentials:true});

    set({
      user:res.data.user,
      orders: res.data.orders || [],
      coupons: res.data.coupons || [],
      loading:false,
    });
  } catch(error){
    console.log("Fetch profile error:", error.response?.data || error.message);
    toast.error("Failed to load profile");
    set({loading:false});
  }
},
  updateProfile: async (data) => {
    try {
      set({ loading: true });
      const res = await axios.put("/auth/profile", data, {
        withCredentials: true,
      });
      set({ user: res.data.user, loading: false });
      toast.success("Profile updated successfully");
      return true;
    } catch (error) {
      set({ loading: false });
      const message =
        error?.response?.data?.message || error.message || "Update Failed";
      console.error("Update profile error:", error);
      toast.error(message);
      return false;
    }
  },
  deleteProfile: async () => {
    try {
      const response = await axios.delete("/auth/profile", {
        withCredentials: true,
      });
      toast.success("Profile deleted sucessfully");
      window.location.href = "/login";
    } catch (error) {
      console.error("Delete profile error:", error);

      if (error.response) {
        console.error("Response Data", error.response.data);
        console.error("Status: ", error.response.status);
      }
      toast.error(error.response?.data?.message || "Failed to delete profile");
    }
  },
  cancelOrder: async(orderId)=>{
    try{
      const res = await axios.patch(`/orders/${orderId}/cancel`);
      toast.success("Order refunded successfully!");
      get().getProfile();//refresh orders
    }catch(error){
      console.error(error);
      toast.error(error.response?.data?.error || "Failed to cancel order");
    }
  },
  logout: async () => {
    try {
      await axios.post("/auth/logout", {}, { withCredentials: true });
      set({ user: null });
      toast.success("Logged out sucessfully");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An error occured during logout"
      );
      console.error("Logout error:", error);
    }
  },
  checkAuth: async () => {
    set({ checkingAuth: true });
    try {
      const response = await axios.get("/auth/profile", {
        withCredentials: true,
      });
      console.log("Profile response: ", response.data);
      //set({ user: response.data, checkingAuth: false });
      set({
        user:response.data.user,
        orders: response.data.orders || [],
        coupons: response.data.coupons || [],
        checkingAuth:false,
      })
    } catch (error) {
      console.log(error.message);
      set({ user: null, checkingAuth: false });
    }
  },
  refreshToken: async () => {
    if (get().checkingAuth) return;
    set({ checkAuth: true });
    try {
      const response = await axios.post("/api/auth/refresh-token");
      set({ checkingAuth: false });
      return response.data;
    } catch (error) {
      set({ user: null, checkingAuth: false });
      throw error;
    }
  },
}));

//Todo Implement the axios interceptors for refreshing access token 15m
let refreshPromise = null;

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        if (refreshPromise) {
          await refreshPromise;
          return axios(originalRequest);
        }
        refreshPromise = useUserStore.getState().refreshToken();
        await refreshPromise;
        refreshPromise = null;

        return axios(originalRequest);
      } catch (error) {
        useUserStore.getState().logout();
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);
