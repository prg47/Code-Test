import express from "express";
import { ENV } from "./lib/env.js";

const app = express();

app.listen(3000,()=>{
    console.log("server running on port : ",ENV.PORT);
})