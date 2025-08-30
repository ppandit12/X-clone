import express from "express";
import { connectDB } from "./config/connect.config.js";
import env from "./config/env.config.js";


const app = express();


const connect = async ()=>{
    try {
        connectDB();
        app.listen(env.port, () => {
            console.log(`Server is running on port ${env.port}`);
        });
    } catch (error) {
        console.error("error while connecting to database:", error);
    }
}

connect();