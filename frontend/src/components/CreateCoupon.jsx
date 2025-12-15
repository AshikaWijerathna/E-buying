import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

const CreateCoupon = () => {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    code: "",
    discountPercentage: "",
    expiresAt: "",
    userIds: [],
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
     const res= await axios.get("/users");
      setUsers(res.data.users);
    } catch (error) {
      console.error("Load users error:", error);
      toast.error("Failed to load users");
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/coupons/create", form);
      toast.success("Coupon created Sucessfully!");
      setForm({ code: "", discountPercentage: "", expiresAt: "", userIds: [] });
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <motion.div
      className="bg-gray-800 shadow-lg rounded-lg p-8 mb-8 max-w-xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h2 className="text-2xl font-semibold mb-6 text-[#67b1e6]">
        Create Discount Coupon
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="code"
            className="block text-sm font-medium text-gray-300"
          >
            Coupon Code
          </label>
          <input
            type="text"
            id="code"
            name="code"
            value={form.code}
            placeholder="Coupon Code"
            onChange={(e) => setForm({ ...form, code: e.target.value })}
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-[#2e79ae] focus:border-[#2e79ae]"
            required
          />
        </div>
        <div>
          <label
            htmlFor="discountpercentage"
            className="block text-sm font-medium text-gray-300"
          >
            Discount Percentage
          </label>
          <input
            type="number"
            id="discountpercentage"
            name="discountpercentage"
            placeholder="Discount %"
            value={form.discountPercentage}
            onChange={(e) =>
              setForm({ ...form, discountPercentage: e.target.value })
            }
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-[#2e79ae] focus:border-[#2e79ae]"
            required
          />
        </div>
        <div>
          <label
            htmlFor="expiresAt"
            className="block text-sm font-medium text-gray-300"
          >
            Expiry Date
          </label>
          <input
            type="date"
            id="expiresAt"
            name="expiresAt"
            value={form.expiresAt}
            placeholder="mm/dd/yy"
            onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-[#2e79ae] focus:border-[#2e79ae]"
            required
          />
        </div>
        {/* User Selector */}
        <div>
          <label htmlFor="" className="block text-sm font-medium text-gray-300">
            Assign to Users (optional)
          </label>
          <select
            multiple
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-[#2e79ae] focus:border-[#2e79ae]"
            value={form.userIds}
            onChange={(e) =>
              setForm({
                ...form,
                userIds: [...e.target.selectedOptions].map((o) => o.value),
              })
            }
          >
            <option value="">---Global Coupon (leave empty)---</option>
            {users.map((u) => (
              <option key={u._id} value={u._id}>
                {u.name} - {u.email}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#307aaf] hover:bg-[#1c5075] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2e79ae] disabled:opacity-50"
        >
          Create
        </button>
      </form>
    </motion.div>
  );
};

export default CreateCoupon;
