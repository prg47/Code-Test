import mongoose from "mongoose";
import {ENV} from "./env.js";

export const connectDB = async ()=>{
    try {
        await mongoose.connect(ENV.DB_URL);
        console.log("connected to database");
    } catch (error) {
        console.error("coudnt connect to db");
    }
};