import { requireAuth } from "@clerk/express";
import User from "../models/User.model.js";

export const protectRoute = [
    requireAuth(),
    async (req, res, next)=>{
        try {
            const clerkId = req.auth().userId;
            if(!clerkId) return res.status(401).json({msg : "Unauthorized -- invalid token"});

            // find user in db
            const user  = await User.findOne({clerkId});
            if(!user) return res.status(404).json({msg : "User not found"});

            req.user = user; // attach user to req
            next();

        } catch (error) {
            console.error("Error in Protect route middleware");
            res.status(500).json({msg : "Internal server error"});
        }
    }
]