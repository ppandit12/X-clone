import express from "express";
import { connectDB } from "./config/connect.config.js";
import env from "./config/env.config.js";
import { clerkMiddleware } from '@clerk/express';
import cors from "cors";
import userRouter from "./routes/user.route.js";
import PostRouter from "./routes/post.route.js";


const app = express();
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

app.use("/api/users",userRouter);
app.use("/api/posts",PostRouter);

app.use((err,req,res,next)=>{
    console.log("error handling",err);
    res.status(500).json({error: err.message || "Internal server error"});
});


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