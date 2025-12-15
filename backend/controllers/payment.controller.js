import Coupon from "../models/coupon.model.js";
import Order from "../models/order.model.js";
import { stripe } from "../lib/stripe.js";
import User from "../models/user.model.js";
import { sendInvoiceEmails } from "../utils/sendInvoiceEmail.js";

export const createCheckoutSession = async (req, res) => {
  try {
    const { products, couponCode } = req.body;
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: "Invalid or empty products array" });
    }
    let totalAmount = 0;

    const lineItems = products.map((product) => {
      const amount = Math.round(product.price * 100); // convert to cents
      totalAmount += amount * product.quantity;

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            images: [product.image],
          },
          unit_amount: amount,
        },
        quantity: product.quantity || 1,
      };
    });

    let coupon = null;
    if (couponCode) {
      coupon = await Coupon.findOne({
        code: couponCode,
        userId: req.user._id,
        isActive: true,
      });

      if (coupon) {
        totalAmount -= Math.round(
          (totalAmount * coupon.discountPercentage) / 100
        );
      }
    }

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
      discounts: coupon
        ? [
            {
              coupon: await createStripeCoupon(coupon.discountPercentage),
            },
          ]
        : [],
      metadata: {
        userId: req.user._id.toString(),
        couponCode: couponCode || "",
        products: JSON.stringify(
          products.map((p) => ({
            product: p._id,
            quantity: p.quantity,
            price: p.price,
          }))
        ),
      },
    });

    // Optional: create a new coupon if totalAmount >= 20000
    if (totalAmount >= 20000) {
      await createNewCoupon(req.user._id);
    }

    // Return only the URL for frontend redirect (new Stripe.js flow)
    res.status(200).json({
      url: session.url,
      totalAmount: totalAmount / 100, // optional
    });
  } catch (error) {
    console.error("Error processing checkout: ", error);
    res.status(500).json({
      message: "Error processing checkout",
      error: error.message,
    });
  }
};
export const checkoutSuccess = async (req, res) => {
  try {
    const { sessionId } = req.body;
    if (!sessionId) {
      return res.json({ success: false, error: "Missing session ID" });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return res.json({ success: false, error: "Payment not completed" });
    }

    const userId = session.metadata?.userId;
    const products = JSON.parse(session.metadata?.products || "[]");

    if (!userId || products.length === 0) {
      return res.json({ success: false, error: "Invalid payment metadata" });
    }

    const user = await User.findById(userId);
    if (!user || !user.address) {
      return res.json({ success: false, error: "User address missing" });
    }

    // ✅ ATOMIC + SAFE (NO DUPLICATES EVER)
    const order = await Order.findOneAndUpdate(
      { stripeSessionId: session.id },
      {
        $setOnInsert: {
          user: userId,
          products,
          totalAmount: session.amount_total / 100,
          stripeSessionId: session.id,
          paymentIntentId: session.payment_intent,
          status: "paid",
          address: user.address,
        },
      },
      {
        new: true,
        upsert: true, // 🔥 key fix
      }
    );

    // clear cart
    await User.findByIdAndUpdate(userId, { cartItems: [] });

    return res.json({
      success: true,
      message: "Payment verified successfully",
      order,
    });
  } catch (error) {
    console.error("checkoutSuccess error:", error);
    return res.json({
      success: false,
      error: "Server error verifying payment",
    });
  }
};

async function createNewCoupon(userId) {
  if(!userId) return null //new code prevent null insertion
  await Coupon.findOneAndDelete({ userId });

  const newCoupon = new Coupon({
    code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
    discountPercentage: 10,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), //30 days from now
    //userId: userId,
    userId,
    isActive:true
  });

  await newCoupon.save();
  return newCoupon;
}
