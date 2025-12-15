import { useEffect, useState } from "react";
import { useUserStore } from "../stores/useUserStore";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  Save,
  Trash,
  Image as ImageIcon,
  Ticket,
  Receipt,
  Loader,
  X,
} from "lucide-react";
//import {MapContainer, TileLayer,Marker,Popup} from react-leaflet;
import "leaflet/dist/leaflet.css";
const UserProfilePage = () => {
  const {
    user,
    orders = [],
    coupons = [],
    getProfile,
    updateProfile,
    deleteProfile,
    loading,
  } = useUserStore();

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    password: "",
    image: user?.image || "",
    address:user?.address?.address ||"",
    city:user?.address?.city || "",
    state:user?.address?.state || "",
    postalCode:user?.address?.postalCode || "",
    country:user?.address?.country || "",
  });
  useEffect(() => {
    getProfile();
  }, []);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        password: "",
        image: user.image || "",
        address:user?.address?.address || "",
        city:user?.address?.city || "",
        state:user?.address?.state || "",
        postalCode:user?.address?.postalCode || "",
        country:user?.address?.country || "",
      });
    }
  }, [user]);

  //Handle image upload preview
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm({ ...form, image: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile(form);
  };

  const totalSpent = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const lastPurchaseDate =
    orders.length > 0
      ? new Date(Math.max(...orders.map((o) => new Date(o.createdAt))))
      : null;

  return (
    <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <motion.div
        className="sm:mx-auto sm:w-full sm:max-w-md"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="mt-6 text-center text-3xl font-extrabold text-[#0096FF]">
          User Profile
        </h2>
      </motion.div>
      <motion.div
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="bg-gray-900 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Image */}
            <div>
              <div className="mt-1 relative rounded-md shadow-sm">
                <label htmlFor="img" className="cursor-pointer">
                  <img
                    src={form.image || "https://via.placeholder.com/120"}
                    className="w-28 h-28 rounded-full object-cover border-4 mb-4 border-gray-500"
                  />
                </label>
                <div className="absolute inset-y-0 left-0 pl-8 justify-center flex items-center pointer-events-none">
                  {/* <ImageIcon
                    className="h-5 w-5 mb-11 text-gray-400"
                    aria-hidden="true"
                  /> */}
                </div>
                <input
                  id="img"
                  type="file"
                  accept="image/*"
                  placeholder="Enter your image"
                  onChange={handleImageUpload}
                  className="block w-full px-3 py-2 pl-10 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#0096FF] focus:border-[#0096FF] sm:text-sm"
                />
              </div>
            </div>

            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-300"
              >
                Name
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="name"
                  type="text"
                  placeholder="Enter your new name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="block w-full px-3 py-2 pl-10 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#0096FF] focus:border-[#0096FF] sm:text-sm"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300"
              >
                Email
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your new email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="block w-full px-3 py-2 pl-10 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#0096FF] focus:border-[#0096FF] sm:text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300"
              >
                New Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your New password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  className="block w-full px-3 py-2 pl-10 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#0096FF] focus:border-[#0096FF] sm:text-sm"
                />
              </div>
            </div>
             {/* Address Fields */}
            <div className="space-y-2 mt-4">
              {["address","city","state","postalCode","country"].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-300">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                  <input
                    type="text"
                    placeholder={`Enter ${field}`}
                    value={form[field]}
                    onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                    className="block w-full px-3 py-2 mt-1 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#0096FF] focus:border-[#0096FF] sm:text-sm"
                  />
                </div>
              ))}
            </div>
            {/* Update Profile Button */}
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0096FF] hover:bg-[#0096FF] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0096FF] transition duration-150 ease-in-out disabled:opacity-50"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader
                    className="mr-2 h-5 w-5 animate-spin"
                    aria-hidden="true"
                  />
                  Loading...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-5 w-5" aria-hidden="true" />
                  Update Profile
                </>
              )}
            </button>
          </form>
          {/* Coupon Section */}
          <div className="mt-3">
            <div className="flex items-center gap-2 mb-2 text-gray-300 font-medium">
              <Ticket className="h-5 w-5" />
              <span>Available Coupons</span>
            </div>
            {coupons.length === 0 ? (
              <p className="text-gray-400 text-sm">No Coupons available</p>
            ) : (
              <div className="space-y-2">
                {coupons.map((c) => (
                  <div
                    key={c._id}
                    className="p-3 bg-gray-700 rounded-lg border border-gray-600"
                  >
                    <p className="text-white font-semibold">{c.code}</p>
                    <p className="text-[#0096FF]">
                      {c.discountPercentage} % OFF
                    </p>
                    <p className="text-gray-400 text-xs">
                      Expires: {new Date(c.expiresAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Delete Profile Button */}
          <button
            type="button"
            onClick={deleteProfile}
            className="w-full flex justify-center mt-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0096FF] hover:bg-[#0096FF] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0096FF] transition duration-150 ease-in-out disabled:opacity-50"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader
                  className="mr-2 h-5 w-5 animate-spin"
                  aria-hidden="true"
                />
                Loading...
              </>
            ) : (
              <>
                <Trash className="mr-2 h-5 w-5" aria-hidden="true" />
                Delete Profile
              </>
            )}
          </button>

          {/* Purchase History with summary*/}
          <div className="mt-3">
            <div className="flex items-center gap-2 mb-2 text-gray-300 font-medium">
              <Receipt className="h-5 w-5" />
              <span>Purchase History</span>
            </div>

            {orders.length === 0 ? (
              <p className="text-gray-400 text-sm">No purchases yet</p>
            ) : (
              // Purchased Summary
              <>
                <div className="p-3 bg-gray-700 rounded-lg border border-gray-600 mb-3">
                  <p className="text-white font-semibold">
                    Total Orders: {orders.length}
                  </p>
                  <p className="text-[#0096FF] font-semibold">
                    Total Spent: {totalSpent} USD
                  </p>
                  {lastPurchaseDate && (
                    <p className="text-gray-400 text-xs">
                      Last Purchase:{lastPurchaseDate.toLocaleDateString()}
                    </p>
                  )}
                </div>
                {/* Individual Orders */}
                <div className="space-y-2">
                  {orders.map((order) => (
                    <div
                      key={order._id}
                      className="p-3 border rounded-lg bg-gray-800 mb-2 text-white"
                    >
                      <p className="font-semibold">Order #{order._id}</p>
                      <p className="text-gray-300">
                        Total: {order.totalAmount} USD
                      </p>
                      <p className="text-gray-400 text-sm">
                        Purchased on:{" "}
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-sm mt-1">
                        Status:{" "}
                        <span
                          className={
                            order.status === "paid"
                              ? "text-green-400"
                              : order.status === "refunded"
                              ? "text-red-400"
                              : order.status === "cancelled"
                              ? "text-yellow"
                              : "text-gray-400"
                          }
                        >
                          {order.status}
                        </span>
                      </p>
                      {/* Cancel Button */}
                      {order.status === "paid" && (
                        <button
                          onClick={() => {
                            const confirmCancel = window.confirm(
                              "Do you want to cancel this order? Refund will be issued automatically."
                            );
                            if (confirmCancel) {
                              useUserStore.getState().cancelOrder(order._id);
                            }
                          }}
                          className="mt-3 flex items-center gap-2 bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-white text-sm"
                        >
                          <X className="w-4 h-4" /> Cancel Order
                        </button>
                      )}
                      {/* Track order button */}
                      <button onClick={()=>(window.location.href =`/track-order/${order._id}`)}
                        className="mt-2 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-white text-sm">
                        {/* <Package className="mr-2 h-5 w-5" aria-hidden="true"/> */}
                        🚚 Track Order
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default UserProfilePage;
