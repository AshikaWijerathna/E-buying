import User from "../models/user.model.js";
import { redis } from "../lib/redis.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Order from "../models/order.model.js";
import Coupon from "../models/coupon.model.js";

//token section
const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
  return { accessToken, refreshToken };
};
const storeRefreshToken = async (userId, refreshToken) => {
  await redis.set(
    `refresh_token:${userId}`,
    refreshToken,
    "EX",
    7 * 24 * 60 * 60
  ); //7 days
};
// cookies section
const setCookies = (res, accessToken, refreshToken) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true, //prevent XSS attacks, cross-site scripting attack
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict", //prevents CSRF attacks, cross-site request forgery attack
    maxAge: 15 * 60 * 1000, //15 minutes
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true, //prevent XSS attacks, cross-site scripting attack
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict", //prevents CSRF attck, cross-site request forgery attack
    maxAge: 7 * 24 * 60 * 60 * 1000, //7 days
  });
};
//signup section
export const signup = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }
    const user = await User.create({ name, email, password });
    //authenticate
    const { accessToken, refreshToken } = generateTokens(user._id);
    await storeRefreshToken(user._id, refreshToken);

    setCookies(res, accessToken, refreshToken);
    res.status(201).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      message: "User created successfully",
    });
  } catch (error) {
    console.error("Error in signup controlller", error.message);
    res.status(500).json({ message: error.message });
  }
};
//login section
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.comparePassword(password))) {
      const { accessToken, refreshToken } = generateTokens(user._id);

      await storeRefreshToken(user._id, refreshToken);
      setCookies(res, accessToken, refreshToken);

      res.status(201).json({
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        message: "User login successfully",
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: error.message });
  }
};
//logout section
export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
      await redis.del(`refresh_token:${decoded.userId}`);
    }
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const orders = await Order.find({ user: req.user.id })
      .populate("products.product")
      .sort({ createdAt: -1 });

    const coupons = await Coupon.find({
      isActive: true,
      expiresAt: { $gte: new Date() },
    }).sort({ createdAt: -1 });

    return res.json({ user, orders, coupons });
  } catch (error) {
    console.error("Error fetching profile: ", error);
    return res.status(500).json({
      error: "Failed to load profile",
      details: error.message,
    });
  }
};
//update profile
export const updateProfile = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "User not authenticated" });

    const { name, email, password, address, city, state, postalCode, country } = req.body;

    // Update basic info
    if (name) req.user.name = name;

    if (email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!re.test(email)) return res.status(400).json({ message: "Invalid email format" });
      req.user.email = email;
    }

    if (password) {
      if (password.length < 6) return res.status(400).json({ message: "Password must be at least 6 characters" });
      const salt = await bcrypt.genSalt(10);
      req.user.password = await bcrypt.hash(password, salt);
    }

    // Update address fields
    req.user.address.address = address ?? req.user.address.address ?? "";
    req.user.address.city = city ?? req.user.address.city ?? "";
    req.user.address.state = state ?? req.user.address.state ?? "";
    req.user.address.postalCode = postalCode ?? req.user.address.postalCode ?? "";
    req.user.address.country = country ?? req.user.address.country ?? "";

    await req.user.save();

    const { password: _, ...userData } = req.user.toObject();
    res.json({ message: "Profile Updated successfully", user: userData });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Server error while updating profile" });
  }
};

//delete profile
export const deleteProfile = async (req, res) => {
  try {
    if (!req.user) {
      console.log("Delete failed: req.user is undefined");
      return res.status(401).json({ message: "User not authenticated" });
    }
    console.log("Deleting user, req.user._id");

    await User.findByIdAndDelete(req.user._id);
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.json({ message: "Profile deleted successully" });
  } catch (error) {
    res.status(500).json({ error: "Server error while deleting profile" });
  }
};

//refresh token section
export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token provided" });
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const storedToken = await redis.get(`refresh_token:${decoded.userId}`);

    if (storedToken !== refreshToken) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const accessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });
    res.json({ message: "Token refreshed successfully" });
  } catch (error) {
    console.log("Error in refreshToken Controller");
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
