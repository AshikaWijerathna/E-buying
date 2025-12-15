import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

const TrackOrderPage = () => {
  const { orderId } = useParams();
  const [status, setStatus] = useState("");
  const [order, setOrder] = useState(null);
  const [loadingOrder, setLoadingOrder] = useState(true);
  const [loadingStatus,setLoadingStatus]= useState(true);
  const [error, setError] = useState(null);

  //fetch full order
  const fetchOrderDetails = async () => {
   try{
    const res = await axios.get(`/orders/${orderId}`);
    setOrder(res.data.order);
    setStatus(res.data.order.status);
   }catch(error){
    console.error("Error loading order:", error);
    setError("Failed to load order details");
    toast.error("Failed to load order details");
   }finally{
    setLoadingOrder(false);
   }
  };
  //fetch status only (auto-refresh)
  const fetchStatus = async () => {
    if (!orderId) return;
    try {
      const res = await axios.get(`/orders/status/${orderId}`);
      setStatus(res.data.status);
    } catch (error) {
      console.error("Error loading order status:", error);
    } finally{
      setLoadingStatus(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
      const interval = setInterval(fetchStatus, 5000); // auto-refresh every 5s
      return () => clearInterval(interval);
    }
  }, [orderId]);

  const getStatusColor = () => {
    switch (status.toLocaleLowerCase()) {
      case "paid":
        return "text-green-500";
      case "shipped":
        return "text-blue-500";
      case "processing":
        return "text-yellow-400";
      case "delivered":
        return "text-green-600";
      case "cancelled":
      case "refunded":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  if (loadingOrder) return <div className="p-6">Loading order details...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <h2 className="text-2xl font-bold mb-4">Track Order #{orderId}</h2>

      {/* Status */}
      <p className="text-lg mb-4">
        Current Status:{" "}
        <strong className={getStatusColor()}>{status?.toUpperCase()}</strong>
      </p>

      {/* Timeline */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Order Timeline</h3>
        <ul className="space-y-2">
          <li>
            🟢 Order Placed — {new Date(order?.createdAt).toLocaleString()}
          </li>
          {["processing", "shipped", "delivered"].includes(
            status?.toLowerCase()
          ) && <li>🟡 Processing Order</li>}

        {["shipped", "delivered"].includes(status?.toLowerCase()) && <li>🔵 Shipped</li>}

           {status?.toLowerCase() === "delivered" && <li>🟢 Delivered</li>}

           {status?.toLowerCase() === "refunded" && (
            <li>🔴 Refunded — {order?.refundedAt ? new Date(order.refundedAt).toLocaleString() : ""}</li>
          )}
        </ul>
      </div>

      {/* Ordered Items */}
      <div className="shadow rounded p-4 mb-6">
        <h3 className="text-xl font-semibold mb-3">Ordered Items</h3>
        {order?.products?.length > 0 ? (
          order.products.map((item) => (
            <div key={item.product?._id} className="flex items-center gap-4 border-b py-3">
              <img
                //src={item.product?.images?.[0]}
                src={item.product?.image}
                alt={item.product?.name}
                className="w-20 h-20 object-cover rounded"
              />
              <div>
                <p className="font-semibold">{item.product?.name}</p>
                <p>Qty: {item.quantity}</p>
                <p>Price: USD {item.product?.price}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No items found in this order.</p>
        )}     
      </div>

      {/* Shipping Address */}
      <div className="shadow rounded p-4 mb-6">
        <h3 className="text-xl font-semibold mb-3">Shipping Address</h3>
        <p>{order?.address?.address || "N/A"}</p>
        <p>{order?.address?.city || "N/A"}</p>
        <p>{order?.address?.postalCode || "N/A"}</p>
        <p>{order?.address?.country || "N/A"}</p>
      </div>

      {/* Payment Summary */}
      <div className="shadow rounded p-4">
        <h3 className="text-xl font-semibold mb-3">Payment Summary</h3>

        <p>
          Total: USD <strong>{order?.totalAmount || 0}</strong>
        </p>

        {order?.refundId && (
          <p className="text-red-600 font-bold mt-2">
            Refunded Amount: USD {order?.refundAmount / 100}
          </p>
        )}
      </div>
    </div>
  );
};

export default TrackOrderPage;
