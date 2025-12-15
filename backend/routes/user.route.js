import express from "express";
import User from "../models/user.model.js";

const router = express.Router();

router.get("/",async(req,res)=>{
    try{
        const users = await User.find({role: {$ne:"admin"}}).select("name email");
        res.json({users});
    }catch(error){
        res.status(500).json({message: "Failed to fetch users"});
    }
});

export default router;