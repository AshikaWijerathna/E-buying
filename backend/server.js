import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";


//routes
import authRoutes from "./routes/auth.route.js";
import productRoutes from "./routes/product.route.js";
import cartRoutes from "./routes/cart.route.js";
import couponRoutes from "./routes/coupon.route.js";
import paymentRoutes from "./routes/payment.route.js";
import analyticsRoutes from "./routes/analytics.route.js";
import contactRoutes from "./routes/contact.route.js";
import userRoutes from "./routes/user.route.js";
import orderRoutes from "./routes/order.routes.js";

import { connectDB } from "./lib/db.js";
dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

const __dirname = path.resolve();

app.use(cors({
    //origin: "http://localhost:5173",
    origin:"*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE","PATCH"],
}))

//middleware
app.use(express.json({ limit: '80mb' }));
app.use(cookieParser());

console.log(process.env.PORT);
//routes
app.use("/api/auth", authRoutes);
app.use("/api/products",productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders",orderRoutes);

if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname,"/frontend/dist")))
}

app.get("*",(req,res)=>{
    res.sendFile(path.resolve(__dirname,"frontend", "dist", "index.html"))
})

//server
app.listen(PORT, ()=>{
    console.log("server is running on http://localhost:" + PORT);
    connectDB();
})