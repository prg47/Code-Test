import mongoose from "mongoose";
import {ENV} from "./env.js";

export const connectDB = async ()=>{
    try {
        if(!ENV.DB_URL){
            throw new Error("DB URL is not defined in environment varialbles");
        }
        await mongoose.connect(ENV.DB_URL);
        console.log("connected to database");
    } catch (error) {
        console.error("coudnt connect to db");
    }
};