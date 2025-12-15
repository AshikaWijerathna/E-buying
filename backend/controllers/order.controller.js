import Order from "../models/order.model.js";
import User from "../models/user.model.js";
import { stripe } from "../lib/stripe.js";
import { v4 as uuidv4 } from "uuid";

export const createOrder = async(req,res)=>{
  try{
    const user = await User.findById(req.user.id);
    if(!user){
      return res.status(404).json({error:"User not found"});
    }
    const {address, city, state, postalCode, country} = user.address || {};
    if(!address || !city || !state ||!postalCode || !country){
     return res.status(400).json({
       error:"Please complete your shipping address befoore ordering",
     });
    }

    const order = await Order.create({
      user:user._id,
      products: req.body.products,
      totalAmount:req.body.totalAmount,
      stripeSessionId: req.body.sessionId,
      status:"pending",

      //copy address correctly
      address:{
        address,
        city,
        state,
        postalCode,
        country,
      },
    });
    res.status(201).json(order);
  }catch(error){
    console.error("Create order error:", error);
    res.status(500).json({error:"Failed to create order"});
  }
}

//Get All orders for logged user
export const getUserOrders = async (req, res) => {
  try {
    const orders = (
      await Order.find({ user: req.user.id }).populate(
        "products.product",
        "name price images"
      )
    ).toSorted({ created: -1 });
    return res.json({ orders });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
// Get all orders (Admin)
export const getAllOrders = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Not authorized" });
    }
    const orders = await Order.find()
      .populate("user", "name email address")
      .populate("products.product", "name price image")
      .sort({ createdAt: -1 });
    return res.json({ orders });
  } catch (error) {
    console.error("Get all orders error:", error);
    return res.status(500).json({ error: error.message });
  }
};
//get single order (user or admin)
export const getSingleOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.orderId,
      user: req.user._id,
    })
      .populate("products.product", "name price image")
      .populate("user", "name email address");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    return res.json({
      order,
    });
  } catch (error) {
    console.error("Order fetch erro:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
//update status admin
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
      "refunded",
    ];

    if (!allowedStatuses.includes(status.toLowerCase())) {
      return res.status(400).json({ message: "Invalid status" });
    }

    if (req.user.role !== "admin") return res.status(403).json("Access denied");

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status.toLowerCase();
    await order.save();

    return res.json({
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error("Error updating order status", error);
    return res.status(500).json({ message: "Server error" });
  }
};
//get order status only
export const getOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Ensure user owns the order (non-admin)
    if (
      req.user.role !== "admin" &&
      order.user.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    return res.json({ status: order.status });
  } catch (error) {
    console.error("Order status error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

//cancel /refund order
export const cancelOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const orderId = req.params.id;
    //Find Order
    const order = await Order.findById(orderId);

    if (!order) return res.status(404).json({ error: "Order not found" });
    //ownership check
    if (order.user.toString() !== userId.toString()) {
      return res.status(403).json({ error: "Not authorized" });
    }
    //If already refunded/cancelled
    if (["cancelled", "refunded"].includes(order.status) || order.refundId) {
      return res
        .status(400)
        .json({ error: "Order already cancelled/refunded" });
    }
    //retrieve stripe paymentIntent ID if missing
    let paymentIntentId = order.paymentIntentId;

    if (!paymentIntentId) {
      const session = await stripe.checkout.sessions.retrieve(
        order.stripeSessionId
      );
      paymentIntentId = session.payment_intent;

      //save for future refund history
      order.paymentIntentId = paymentIntentId;
      await order.save();
    }
    if (!paymentIntentId)
      return res.json({ error: "Payment Intent ID missing.Cannot refund" });
    let refund;
    try {
      //create refund on stripe
      refund = await stripe.refunds.create(
        {
          payment_intent: paymentIntentId,
          amount: Math.round(order.totalAmount * 100), //refund
        },
        { idempotencyKey: `refund-${order._id}-${uuidv4()}` }
      );
    } catch (stripeError) {
      if (stripeError.code === "charge_already_refunded") {
        order.status = "refunded";
        await order.save();
        return res.json({
          message: "Order was  already refunded",
          order,
        });
      }
      throw stripeError;
    }

    //update order
    order.status = "refunded";
    order.refundId = refund.id;
    order.refundAmount = refund.amount;
    order.refundedAt = new Date();
    await order.save();

    return res.json({
      message: "Order cancelled and refunded",
      order,
    });
  } catch (error) {
    console.error("Cancel order error:", error);
    return res.status(500).json({ error: error.message });
  }
};
export const deleteOrder = async(req,res)=>{
  try{
    const {orderId} =req.params;
    const order= await Order.findById(orderId);
    if(!order){
      return res.status(404).json({message:"Order not found"});
    }
    if(['shipped','delivered'].includes(order.status)){
      return res.status(400).json({message:`Cannot delete an order that is ${order.status}`});
    }
      await Order.findByIdAndDelete(orderId);
  }catch(error){
    console.error("Delete order error", error);
    res.status(500).json({message:"Failed to delete order"});
  }
};
