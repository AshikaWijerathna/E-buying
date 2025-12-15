import { useEffect, useState } from "react";
import axios from "../lib/axios";
import Confetti from "react-confetti";
import { Link, useSearchParams } from "react-router-dom";
import { useCartStore } from "../stores/useCartStore";
const PurchaseSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const sessionId = searchParams.get("session_id");

  const clearCart = useCartStore((state)=> state.clearCart);

  useEffect(() => {
    if (!sessionId) {
      setError("Missing session ID. Cannot verify payment.");
      setLoading(false);
      return;
    }

    const confirmPayment = async () => {
      try {
        const res = await axios.post("/payments/checkout-success", {
          sessionId
        });

        if (res.data.success) {
          setSuccess(true);
          clearCart();
        } else {
          setError(res.data.error || "Payment verification failed.");
        }
      } catch (err) {
        setError("Failed to confirm payment.");
      } finally {
        setLoading(false);
      }
    };

    confirmPayment();
  }, [sessionId, clearCart]);

  if (loading) {
    return <p className="text-center text-lg mt-10">Confirming payment...</p>;
  }

  if (error) {
    return (
      <div className="text-center mt-10">
        <h1 className="text-2xl text-red-600">{error}</h1>
        <Link to="/cart" className="text-blue-600 underline mt-4 block">
          Return to Cart
        </Link>
      </div>
    );
  }

  return (
    <div className="text-center mt-10 mb-20">
      <Confetti />
      <h1 className="text-3xl font-bold text-green-600">Payment Successful!</h1>
      <p className="text-gray-700 mt-3">
        Your order has been placed successfully.
      </p>

      <Link
        to="/"
        className="mt-6 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default PurchaseSuccessPage;
