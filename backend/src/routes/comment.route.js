import express from "express"
import { createComment, getComments } from "../controller/comment.controller.js";
import {protectedRoute}  from "../middleware/auth.middleware.js"


const commentRouter = express.Router();

commentRouter.get("/post/:postId", getComments);

commentRouter.post("/post/:postId", protectedRoute , createComment);
commentRouter.put("/:commentId", protectedRoute , createComment);



export default commentRouter;