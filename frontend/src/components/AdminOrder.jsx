import { useEffect, useState } from "react";
import axios from "../lib/axios";

const AdminOrder = () => {
  const [orders, setOrders] = useState([]);
  const [statusUpdates, setStatusUpdates] = useState({});

  const fetchOrders = async () => {
    try {
      const res = await axios.get("/orders/admin/all");
      setOrders(res.data.orders);

      const initial = {};
      res.data.orders.forEach((order) => {
        initial[order._id] = order.status;
      });

      setStatusUpdates(initial);
    } catch (error) {
      console.error("Failed to load orders:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId) => {
    try {
      const newStatus = statusUpdates[orderId];

      await axios.put(`/orders/status/${orderId}`, {
        status: newStatus,
      });

      alert(`Order status updated to "${newStatus}"`);
      fetchOrders();
    } catch (error) {
      console.error(
        "Failed to update order status:",
        error.response?.data || error
      );
      alert(
        "Failed to update status." +
          (error.response?.data?.message || "Unknown Error")
      );
    }
  };
  const deleteOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order")) return;
    try {
      await axios.delete(`/orders/${orderId}`);
      fetchOrders();
    } catch (error) {
      alert(error.respons?.data.message || "Delete failed");
    }
  };

  return (
    <div className="space-y-4">
      {orders.map((order) => {
        const isBlocked = ["shipped", "delivered"].includes(order.status);

        return (
          <div
            key={order._id}
            className="p-4 bg-gray-800 rounded-lg border border-gray-600"
          >
            <p className="text-white font-semibold">Order #{order._id}</p>
            <p className="text-gray-300">Total: ${order.totalAmount}</p>
            <p className="text-gray-400">Status: {order.status}</p>

            <div className="mt-2 flex gap-2">
              <select
                value={statusUpdates[order._id]}
                onChange={(e) =>
                  setStatusUpdates({
                    ...statusUpdates,
                    [order._id]: e.target.value,
                  })
                }
                className="bg-gray-700 text-white px-2 py-1 rounded"
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
                <option value="refunded">Refunded</option>
              </select>

              <button
                onClick={() => updateStatus(order._id)}
                className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-white"
              >
                Update
              </button>

              <button
                onClick={() => deleteOrder(order._id)}
                disabled={isBlocked}
                className={`px-3 py-1 rounded text-white ${
                  isBlocked
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                Delete
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AdminOrder;
