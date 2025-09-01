import express from "express";
import cors from "cors";
import { clerkMiddleware } from '@clerk/express';
import { connectDB } from "./config/connect.config.js";
import env from "./config/env.config.js";
import userRouter from "./routes/user.route.js";
import PostRouter from "./routes/post.route.js";
import commentRouter from "./routes/comment.route.js";
import notificationRouter from "./routes/notification.route.js";
import { arcjetMiddleware } from "./middleware/arcjet.middleware.js";


const app = express();
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());
app.use(arcjetMiddleware);

app.use("/api/users",userRouter);
app.use("/api/posts",PostRouter);
app.use("/api/comments",commentRouter);
app.use("/api/notifications",notificationRouter);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  const status = err.statusCode || err.status || 500;
  const message =
    env.nodeEnv === "production"
      ? "Internal server error"
      : (err.message || "Internal server error");
  console.error("Unhandled error", {
    method: req.method,
    path: req.path,
    userId: req.auth?.userId,
    status,
    err,
  });
  res.status(status).json({ error: message });
});

const connect = async ()=>{
    try {
        connectDB();
        if(env.nodeEnv !== "production"){
           app.listen(env.port, () => {
            console.log(`Server is running on port ${env.port}`);
        });
        }
    } catch (error) {
        console.error("error while connecting to database:", error);
    }
}

connect();



export default app;