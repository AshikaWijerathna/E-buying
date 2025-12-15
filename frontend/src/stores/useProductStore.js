import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "../lib/axios";

export const useProductStore = create((set) => ({
  products: [],
  //new
  featuredProducts: [],
  loading: false,
  error: null,

  setProducts: (products) => set({ products }),
  //new
  fetchFeaturedProducts: (featuredProducts) => set({ featuredProducts }),

  createProduct: async (productData) => {
    set({ loading: true });
    try {
      const res = await axios.post("/products", productData);
      set((prevState) => ({
        products: [...prevState.products, res.data.product],
        loading: false,
      }));
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to create product");
      set({ loading: false });
    }
  },
  fetchAllProducts: async () => {
    set({ loading: true });
    try {
      const response = await axios.get("/products");
      set({ products: response.data.products, loading: false });
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to fetch products");
      set({ loading: false });
    }
  },
  fetchProductsByCategory: async (category) => {
    set({ loading: true });
    try {
      const response = await axios.get(`/products/category/${category}`);
      set({ products: response.data.products, loading: false });
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to fetch products");
      set({ loading: false });
    }
  },
  deleteProduct: async (productId) => {
    set({ loading: true });
    try {
      const response = await axios.delete(`/products/${productId}`);
      const deletedProduct = response.data.product;
      set((prevProducts) => ({
        products: prevProducts.products.filter(
          (product) => product._id !== productId
        ),
        loading: false,
      }));
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response.data.error || "Failed to delete product");
      set({ loading: false });
    }
  },
  fetchFeaturedProducts: async () => {
    set({ loading: true });
    try {
      const response = await axios.get("/products/featured");
      set({ featuredProducts: response.data.products, loading: false });
    } catch (error) {
      toast.error("Error fetching featured products");
      set({ loading: false });
    }
  },
  toggleFeaturedProduct: async(productId)=>{
    set ({loading:true});
    try{
      const response = await axios.patch(`/products/${productId}`);
      const updatedProduct = response.data.product;

      set((state)=>({
        products:state.products.map((p)=>p._id === productId ? updatedProduct:p),
        featuredProducts:updatedProduct.isFeatured?[...state.featuredProducts.filter(p=>p._id !== productId),updatedProduct]:state.featuredProducts.filter(p=>p._id !== productId),
        loading:false,
      }));
    }catch(error){
      toast.error(error.response?.data?.messsage || "Failed to toggle featured");
      set({loading:false});
    }
  },
  // toggleFeaturedProduct: async (productId) => {
  //   set({ loading: true });
  //   try {
  //     const response = await axios.patch(`/products/${productId}`);
  //     set((state) => ({
  //       products: state.products.map((product) =>
  //         product._id === productId
  //           ? { ...product, isFeatured: response.data.isFeatured }
  //           : product
  //       ),
  //       loading: false,
  //     }));
  //   } catch (error) {
  //     toast.error(error.response?.data?.message || "Failed to feature product");
  //     set({ loading: false });
  //   }
  // },

}));
